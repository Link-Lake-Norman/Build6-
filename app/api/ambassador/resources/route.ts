import { del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const MANAGER_ROLES = [
  "SUPER_ADMIN",
  "SCHOOL_ADMIN",
  "ORGANIZATION_ADMIN",
  "FACILITATOR",
];

const RESOURCE_KINDS = [
  "PDF",
  "DOCX",
  "PPTX",
  "VIDEO",
  "LINK",
  "IMAGE",
  "OTHER",
] as const;

type ResourceKind = (typeof RESOURCE_KINDS)[number];

async function getManagedCohort(
  userId: string,
  role: string,
  cohortCode: string,
) {
  const cohort = await prisma.cohort.findFirst({
    where: {
      code: cohortCode,
      deletedAt: null,
    },
    select: {
      id: true,
      code: true,
      schoolId: true,
      organizationId: true,
    },
  });

  if (!cohort) return null;

  if (role === "SUPER_ADMIN") {
    return cohort;
  }

  if (role === "FACILITATOR") {
    const assignment = await prisma.cohortFacilitator.findFirst({
      where: {
        cohortId: cohort.id,
        facilitator: {
          userId,
          deletedAt: null,
        },
      },
      select: {
        id: true,
      },
    });

    return assignment ? cohort : null;
  }

  /*
   * School / organization admins are already
   * authenticated platform managers. The planner
   * currently focuses on the selected cohort.
   */
  if (role === "SCHOOL_ADMIN" || role === "ORGANIZATION_ADMIN") {
    return cohort;
  }

  return null;
}

async function getLesson(cohortId: string, week: number) {
  const cohort = await prisma.cohort.findUnique({
    where: {
      id: cohortId,
    },
    select: {
      programId: true,
    },
  });

  if (!cohort) return null;

  return prisma.lesson.findFirst({
    where: {
      weekNumber: week,
      module: {
        programId: cohort.programId,
      },
    },
    select: {
      id: true,
      weekNumber: true,
      title: true,
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const cohortCode = request.nextUrl.searchParams.get("cohortCode");

    const week = Number(request.nextUrl.searchParams.get("week"));

    if (!cohortCode || !Number.isInteger(week) || week < 1) {
      return NextResponse.json(
        {
          error: "Valid cohortCode and week are required.",
        },
        {
          status: 400,
        },
      );
    }

    const cohort = await getManagedCohort(session.id, session.role, cohortCode);

    if (!cohort) {
      return NextResponse.json(
        {
          error: "You do not have access to this cohort.",
        },
        {
          status: 403,
        },
      );
    }

    const lesson = await getLesson(cohort.id, week);

    if (!lesson) {
      return NextResponse.json({
        resources: [],
      });
    }

    const resources = await prisma.lessonResource.findMany({
      where: {
        cohortId: cohort.id,
        lessonId: lesson.id,
        enabled: true,
      },
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
      select: {
        id: true,
        title: true,
        description: true,
        kind: true,
        url: true,
        fileName: true,
        filePath: true,
        required: true,
        visibleToStudent: true,
        visibleToFacilitator: true,
        sortOrder: true,
        uploadedById: true,
        createdAt: true,
        lessonPlanTasks: {
          select: {
            taskId: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      lesson,
      resources,
    });
  } catch (error) {
    console.error("Resource library GET failed:", error);

    return NextResponse.json(
      {
        error: "Unable to load resource library.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();

    if (!session || !MANAGER_ROLES.includes(session.role)) {
      return NextResponse.json(
        {
          error: "Resource management access required.",
        },
        {
          status: 403,
        },
      );
    }

    const body = await request.json();

    const cohortCode =
      typeof body.cohortCode === "string" ? body.cohortCode.trim() : "";

    const week = Number(body.week);

    const title = typeof body.title === "string" ? body.title.trim() : "";

    const description =
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim()
        : null;

    const url =
      typeof body.url === "string" && body.url.trim() ? body.url.trim() : null;

    const kind = RESOURCE_KINDS.includes(body.kind as ResourceKind)
      ? (body.kind as ResourceKind)
      : "LINK";

    if (!cohortCode || !Number.isInteger(week) || week < 1 || !title) {
      return NextResponse.json(
        {
          error: "Cohort, week, and title are required.",
        },
        {
          status: 400,
        },
      );
    }

    if (kind === "LINK" && !url) {
      return NextResponse.json(
        {
          error: "A URL is required for a link resource.",
        },
        {
          status: 400,
        },
      );
    }

    const cohort = await getManagedCohort(session.id, session.role, cohortCode);

    if (!cohort) {
      return NextResponse.json(
        {
          error: "You do not have access to this cohort.",
        },
        {
          status: 403,
        },
      );
    }

    const lesson = await getLesson(cohort.id, week);

    if (!lesson) {
      return NextResponse.json(
        {
          error: "No database lesson was found for this week.",
        },
        {
          status: 404,
        },
      );
    }

    const count = await prisma.lessonResource.count({
      where: {
        lessonId: lesson.id,
        cohortId: cohort.id,
      },
    });

    const resource = await prisma.lessonResource.create({
      data: {
        lessonId: lesson.id,
        cohortId: cohort.id,
        title,
        description,
        kind,
        url,
        enabled: true,
        required: body.required === true,
        visibleToStudent: body.visibleToStudent === true,
        visibleToFacilitator: true,
        sortOrder: count,
        uploadedById: session.id,
      },
    });

    return NextResponse.json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error("Resource library POST failed:", error);

    return NextResponse.json(
      {
        error: "Unable to create resource.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSessionUser();

    if (!session || !MANAGER_ROLES.includes(session.role)) {
      return NextResponse.json(
        {
          error: "Resource management access required.",
        },
        {
          status: 403,
        },
      );
    }

    const body = await request.json();

    const resourceId =
      typeof body.resourceId === "string" ? body.resourceId.trim() : "";

    if (!resourceId) {
      return NextResponse.json(
        {
          error: "Resource ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const resource = await prisma.lessonResource.findUnique({
      where: {
        id: resourceId,
      },
      select: {
        id: true,
        cohort: {
          select: {
            code: true,
          },
        },
        filePath: true,
      },
    });

    if (!resource) {
      return NextResponse.json(
        {
          error: "Resource not found.",
        },
        {
          status: 404,
        },
      );
    }

    const allowed = await getManagedCohort(
      session.id,
      session.role,
      resource.cohort.code,
    );

    if (!allowed) {
      return NextResponse.json(
        {
          error: "You do not have permission to remove this resource.",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * Delete private Blob storage only when this
     * is a facilitator-uploaded file.
     * External links and packaged core assets
     * do not use filePath here.
     */
    if (resource.filePath && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        await del(resource.filePath);
      } catch (blobError) {
        console.warn("Blob cleanup warning:", blobError);
      }
    }

    await prisma.lessonResource.delete({
      where: {
        id: resourceId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Resource DELETE failed:", error);

    return NextResponse.json(
      {
        error: "Unable to remove resource.",
      },
      {
        status: 500,
      },
    );
  }
}
