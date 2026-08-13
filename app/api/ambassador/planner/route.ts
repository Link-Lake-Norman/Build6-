import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

async function authorizeCohort(
  userId: string,
  role: string,
  cohortCode: string
) {
  if (role === "SUPER_ADMIN") {
    return prisma.cohort.findFirst({
      where: {
        code: cohortCode,
        status: "ACTIVE",
        deletedAt: null,
      },
      select: {
        id: true,
        code: true,
        name: true,
        programId: true,
      },
    });
  }

  if (role !== "FACILITATOR") {
    return null;
  }

  return prisma.cohort.findFirst({
    where: {
      code: cohortCode,
      status: "ACTIVE",
      deletedAt: null,
      facilitators: {
        some: {
          facilitator: {
            userId,
            deletedAt: null,
          },
        },
      },
    },
    select: {
      id: true,
      code: true,
      name: true,
      programId: true,
    },
  });
}

async function getLesson(
  programId: string,
  week: number
) {
  return prisma.lesson.findFirst({
    where: {
      weekNumber: week,
      module: {
        programId,
      },
    },
    select: {
      id: true,
      title: true,
      summary: true,
      weekNumber: true,
      estimatedMinutes: true,
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const cohortCode =
      request.nextUrl.searchParams
        .get("cohortCode")
        ?.trim()
        .toUpperCase() ?? "";

    const week = Number(
      request.nextUrl.searchParams.get("week") ?? "1"
    );

    if (!cohortCode || !Number.isInteger(week)) {
      return NextResponse.json(
        { error: "Cohort and week are required." },
        { status: 400 }
      );
    }

    const cohort = await authorizeCohort(
      session.id,
      session.role,
      cohortCode
    );

    if (!cohort) {
      return NextResponse.json(
        { error: "Cohort access denied." },
        { status: 403 }
      );
    }

    const lesson = await getLesson(
      cohort.programId,
      week
    );

    if (!lesson) {
      return NextResponse.json(
        { error: `Week ${week} lesson not found.` },
        { status: 404 }
      );
    }

    const tasks =
      await prisma.lessonPlanTask.findMany({
        where: {
          cohortId: cohort.id,
          lessonId: lesson.id,
          visibleToFacilitator: true,
        },
        orderBy: [
          { dayNumber: "asc" },
          { sortOrder: "asc" },
          { createdAt: "asc" },
        ],
        select: {
          id: true,
          taskType: true,
          title: true,
          instructions: true,
          dayNumber: true,
          durationMinutes: true,
          requirement: true,
          visibleToStudent: true,
          visibleToFacilitator: true,
          sortOrder: true,
          createdById: true,
        },
      });

    return NextResponse.json({
      cohort,
      lesson,
      tasks,
    });
  } catch (error) {
    console.error("Planner GET failed:", error);

    return NextResponse.json(
      { error: "Unable to load weekly planner." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    if (
      session.role !== "SUPER_ADMIN" &&
      session.role !== "FACILITATOR"
    ) {
      return NextResponse.json(
        { error: "Planning access denied." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const cohortCode =
      typeof body.cohortCode === "string"
        ? body.cohortCode.trim().toUpperCase()
        : "";

    const week = Number(body.week);
    const dayNumber = Number(body.dayNumber);
    const durationMinutes = Number(
      body.durationMinutes ?? 10
    );

    const taskType =
      typeof body.taskType === "string"
        ? body.taskType.trim()
        : "CUSTOM";

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const instructions =
      typeof body.instructions === "string"
        ? body.instructions.trim()
        : "";

    if (
      !cohortCode ||
      !Number.isInteger(week) ||
      !Number.isInteger(dayNumber) ||
      dayNumber < 1 ||
      dayNumber > 5 ||
      !title
    ) {
      return NextResponse.json(
        { error: "Planner task information is incomplete." },
        { status: 400 }
      );
    }

    const cohort = await authorizeCohort(
      session.id,
      session.role,
      cohortCode
    );

    if (!cohort) {
      return NextResponse.json(
        { error: "Cohort access denied." },
        { status: 403 }
      );
    }

    const lesson = await getLesson(
      cohort.programId,
      week
    );

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found." },
        { status: 404 }
      );
    }

    const currentCount =
      await prisma.lessonPlanTask.count({
        where: {
          cohortId: cohort.id,
          lessonId: lesson.id,
          dayNumber,
        },
      });

    const task =
      await prisma.lessonPlanTask.create({
        data: {
          cohortId: cohort.id,
          lessonId: lesson.id,
          taskType,
          title,
          instructions,
          dayNumber,
          durationMinutes:
            Number.isFinite(durationMinutes) &&
            durationMinutes > 0
              ? Math.min(durationMinutes, 180)
              : 10,
          requirement:
            body.requirement === "REQUIRED"
              ? "REQUIRED"
              : "OPTIONAL",
          visibleToStudent:
            body.visibleToStudent !== false,
          visibleToFacilitator: true,
          sortOrder: currentCount,
          createdById: session.id,
        },
      });

    return NextResponse.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Planner POST failed:", error);

    return NextResponse.json(
      { error: "Unable to add planner task." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    if (
      session.role !== "SUPER_ADMIN" &&
      session.role !== "FACILITATOR"
    ) {
      return NextResponse.json(
        { error: "Planning access denied." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const cohortCode =
      typeof body.cohortCode === "string"
        ? body.cohortCode.trim().toUpperCase()
        : "";

    const cohort = await authorizeCohort(
      session.id,
      session.role,
      cohortCode
    );

    if (!cohort) {
      return NextResponse.json(
        { error: "Cohort access denied." },
        { status: 403 }
      );
    }

    if (
      body.action === "reorder" &&
      Array.isArray(body.orderedIds)
    ) {
      const ids = body.orderedIds.filter(
        (id: unknown): id is string =>
          typeof id === "string"
      );

      const ownedTasks =
        await prisma.lessonPlanTask.findMany({
          where: {
            id: {
              in: ids,
            },
            cohortId: cohort.id,
          },
          select: {
            id: true,
          },
        });

      if (ownedTasks.length !== ids.length) {
        return NextResponse.json(
          { error: "One or more tasks are invalid." },
          { status: 400 }
        );
      }

      await prisma.$transaction(
        ids.map((id: string, index: number) =>
          prisma.lessonPlanTask.update({
            where: { id },
            data: {
              sortOrder: index,
            },
          })
        )
      );

      return NextResponse.json({
        success: true,
      });
    }

    const taskId =
      typeof body.taskId === "string"
        ? body.taskId
        : "";

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required." },
        { status: 400 }
      );
    }

    const existing =
      await prisma.lessonPlanTask.findFirst({
        where: {
          id: taskId,
          cohortId: cohort.id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        { error: "Task not found." },
        { status: 404 }
      );
    }

    const updateData: {
      title?: string;
      instructions?: string;
      dayNumber?: number;
      durationMinutes?: number;
      visibleToStudent?: boolean;
      requirement?: "REQUIRED" | "OPTIONAL";
    } = {};

    if (typeof body.title === "string") {
      updateData.title = body.title.trim();
    }

    if (typeof body.instructions === "string") {
      updateData.instructions =
        body.instructions.trim();
    }

    if (
      Number.isInteger(Number(body.dayNumber)) &&
      Number(body.dayNumber) >= 1 &&
      Number(body.dayNumber) <= 5
    ) {
      updateData.dayNumber =
        Number(body.dayNumber);
    }

    if (
      Number.isInteger(
        Number(body.durationMinutes)
      ) &&
      Number(body.durationMinutes) > 0
    ) {
      updateData.durationMinutes =
        Math.min(
          Number(body.durationMinutes),
          180
        );
    }

    if (
      typeof body.visibleToStudent ===
      "boolean"
    ) {
      updateData.visibleToStudent =
        body.visibleToStudent;
    }

    if (
      body.requirement === "REQUIRED" ||
      body.requirement === "OPTIONAL"
    ) {
      updateData.requirement =
        body.requirement;
    }

    const task =
      await prisma.lessonPlanTask.update({
        where: {
          id: taskId,
        },
        data: updateData,
      });

    return NextResponse.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Planner PATCH failed:", error);

    return NextResponse.json(
      { error: "Unable to update planner task." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest
) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    if (
      session.role !== "SUPER_ADMIN" &&
      session.role !== "FACILITATOR"
    ) {
      return NextResponse.json(
        { error: "Planning access denied." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const cohortCode =
      typeof body.cohortCode === "string"
        ? body.cohortCode.trim().toUpperCase()
        : "";

    const taskId =
      typeof body.taskId === "string"
        ? body.taskId
        : "";

    const cohort = await authorizeCohort(
      session.id,
      session.role,
      cohortCode
    );

    if (!cohort) {
      return NextResponse.json(
        { error: "Cohort access denied." },
        { status: 403 }
      );
    }

    const existing =
      await prisma.lessonPlanTask.findFirst({
        where: {
          id: taskId,
          cohortId: cohort.id,
        },
        select: {
          id: true,
        },
      });

    if (!existing) {
      return NextResponse.json(
        { error: "Task not found." },
        { status: 404 }
      );
    }

    await prisma.lessonPlanTask.delete({
      where: {
        id: taskId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Planner DELETE failed:", error);

    return NextResponse.json(
      { error: "Unable to remove planner task." },
      { status: 500 }
    );
  }
}
