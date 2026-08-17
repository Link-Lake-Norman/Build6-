import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

async function authorizeCohort(
  userId: string,
  role: string,
  cohortCode: string,
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
  week: number,
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
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    if (
      session.role !== "SUPER_ADMIN" &&
      session.role !== "FACILITATOR"
    ) {
      return NextResponse.json(
        { error: "Planning access denied." },
        { status: 403 },
      );
    }

    const cohortCode =
      request.nextUrl.searchParams
        .get("cohortCode")
        ?.trim()
        .toUpperCase() ?? "";

    const week = Number(
      request.nextUrl.searchParams.get("week") ?? "1",
    );

    if (
      !cohortCode ||
      !Number.isInteger(week) ||
      week < 1 ||
      week > 16
    ) {
      return NextResponse.json(
        {
          error:
            "Valid cohort and week are required.",
        },
        { status: 400 },
      );
    }

    const cohort = await authorizeCohort(
      session.id,
      session.role,
      cohortCode,
    );

    if (!cohort) {
      return NextResponse.json(
        { error: "Cohort access denied." },
        { status: 403 },
      );
    }

    const lesson = await getLesson(
      cohort.programId,
      week,
    );

    if (!lesson) {
      return NextResponse.json({
        success: true,
        completions: [],
      });
    }

    const completions =
      await prisma.lessonDayCompletion.findMany({
        where: {
          cohortId: cohort.id,
          lessonId: lesson.id,
        },
        include: {
          completedBy: {
            select: {
              firstName: true,
              lastName: true,
              displayName: true,
            },
          },
        },
        orderBy: {
          dayNumber: "asc",
        },
      });

    return NextResponse.json({
      success: true,
      completions,
    });
  } catch (error) {
    console.error(
      "Day completion GET failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load day completion status.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    if (
      session.role !== "SUPER_ADMIN" &&
      session.role !== "FACILITATOR"
    ) {
      return NextResponse.json(
        { error: "Planning access denied." },
        { status: 403 },
      );
    }

    const body = await request.json();

    const cohortCode =
      typeof body.cohortCode === "string"
        ? body.cohortCode.trim().toUpperCase()
        : "";

    const week = Number(body.week);
    const dayNumber = Number(body.dayNumber);

    if (
      !cohortCode ||
      !Number.isInteger(week) ||
      week < 1 ||
      week > 16 ||
      !Number.isInteger(dayNumber) ||
      dayNumber < 1 ||
      dayNumber > 5
    ) {
      return NextResponse.json(
        {
          error:
            "Valid cohort, week, and day are required.",
        },
        { status: 400 },
      );
    }

    const cohort = await authorizeCohort(
      session.id,
      session.role,
      cohortCode,
    );

    if (!cohort) {
      return NextResponse.json(
        { error: "Cohort access denied." },
        { status: 403 },
      );
    }

    const lesson = await getLesson(
      cohort.programId,
      week,
    );

    if (!lesson) {
      return NextResponse.json(
        {
          error:
            "No lesson was found for this week.",
        },
        { status: 404 },
      );
    }

    const facilitatorNote =
      typeof body.facilitatorNote === "string" &&
      body.facilitatorNote.trim()
        ? body.facilitatorNote.trim()
        : null;

    const completion =
      await prisma.lessonDayCompletion.upsert({
        where: {
          cohortId_lessonId_dayNumber: {
            cohortId: cohort.id,
            lessonId: lesson.id,
            dayNumber,
          },
        },
        update: {
          completedAt: new Date(),
          completedById: session.id,
          facilitatorNote,
        },
        create: {
          cohortId: cohort.id,
          lessonId: lesson.id,
          dayNumber,
          completedById: session.id,
          facilitatorNote,
        },
        include: {
          completedBy: {
            select: {
              firstName: true,
              lastName: true,
              displayName: true,
            },
          },
        },
      });

    return NextResponse.json({
      success: true,
      completion,
    });
  } catch (error) {
    console.error(
      "Day completion POST failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to mark day complete.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    if (
      session.role !== "SUPER_ADMIN" &&
      session.role !== "FACILITATOR"
    ) {
      return NextResponse.json(
        { error: "Planning access denied." },
        { status: 403 },
      );
    }

    const body = await request.json();

    const cohortCode =
      typeof body.cohortCode === "string"
        ? body.cohortCode.trim().toUpperCase()
        : "";

    const week = Number(body.week);
    const dayNumber = Number(body.dayNumber);

    const cohort = await authorizeCohort(
      session.id,
      session.role,
      cohortCode,
    );

    if (!cohort) {
      return NextResponse.json(
        { error: "Cohort access denied." },
        { status: 403 },
      );
    }

    const lesson = await getLesson(
      cohort.programId,
      week,
    );

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found." },
        { status: 404 },
      );
    }

    await prisma.lessonDayCompletion.deleteMany({
      where: {
        cohortId: cohort.id,
        lessonId: lesson.id,
        dayNumber,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Day completion DELETE failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to reopen day.",
      },
      { status: 500 },
    );
  }
}
