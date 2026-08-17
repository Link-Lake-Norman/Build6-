import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const MANAGER_ROLES = [
  "SUPER_ADMIN",
  "SCHOOL_ADMIN",
  "ORGANIZATION_ADMIN",
  "FACILITATOR",
];

async function canManageCohort(
  userId: string,
  role: string,
  cohortId: string
) {
  if (
    role === "SUPER_ADMIN" ||
    role === "SCHOOL_ADMIN" ||
    role === "ORGANIZATION_ADMIN"
  ) {
    return true;
  }

  if (role !== "FACILITATOR") {
    return false;
  }

  const assignment = await prisma.cohortFacilitator.findFirst({
    where: {
      cohortId,
      facilitator: {
        userId,
        deletedAt: null,
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(assignment);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();

    if (!session || !MANAGER_ROLES.includes(session.role)) {
      return NextResponse.json(
        {
          error: "Assignment management access required.",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const resourceId =
      typeof body.resourceId === "string"
        ? body.resourceId.trim()
        : "";

    const mode =
      body.mode === "ONLINE" ||
      body.mode === "PRINT" ||
      body.mode === "BOTH"
        ? body.mode
        : "BOTH";

    const dayNumber =
      Number.isInteger(body.dayNumber) &&
      body.dayNumber >= 1 &&
      body.dayNumber <= 5
        ? body.dayNumber
        : null;

    const portfolioEligible = body.portfolioEligible === true;

    if (!resourceId) {
      return NextResponse.json(
        {
          error: "Resource ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const resource = await prisma.lessonResource.findUnique({
      where: {
        id: resourceId,
      },
      select: {
        id: true,
        lessonId: true,
        cohortId: true,
        title: true,
        description: true,
        kind: true,
        url: true,
        fileName: true,
        filePath: true,
        visibleToStudent: true,
      },
    });

    if (!resource) {
      return NextResponse.json(
        {
          error: "Resource not found.",
        },
        {
          status: 404,
        }
      );
    }

    const allowed = await canManageCohort(
      session.id,
      session.role,
      resource.cohortId
    );

    if (!allowed) {
      return NextResponse.json(
        {
          error: "You do not have permission to assign this resource.",
        },
        {
          status: 403,
        }
      );
    }

    const allowOnline = mode === "ONLINE" || mode === "BOTH";
    const allowPrint = mode === "PRINT" || mode === "BOTH";

    const resourceUrl = resource.filePath
      ? `/api/ambassador/resources/file?id=${encodeURIComponent(
          resource.id
        )}`
      : resource.url;

    const instructions =
      body.instructions?.trim() ||
      `Complete the attached Future Ready™ resource: ${resource.title}.`;

    const assignment = await prisma.assignment.create({
      data: {
        lessonId: resource.lessonId,
        cohortId: resource.cohortId,
        title: resource.title,
        instructions,
        estimatedMinutes:
          Number.isInteger(body.estimatedMinutes) &&
          body.estimatedMinutes > 0
            ? body.estimatedMinutes
            : 20,
        requirement: "REQUIRED",
        allowOnline,
        allowPrint,
        allowUpload: true,
        printableResourceId: resource.id,
        portfolioEligible,
        dayNumber,
        status: "ACTIVE",
        createdById: session.id,
        onlineContent: {
          type: "RESOURCE_ASSIGNMENT",
          resourceId: resource.id,
          resourceTitle: resource.title,
          resourceKind: resource.kind,
          resourceUrl,
          deliveryMode: mode,
        },
      },
    });

    if (!resource.visibleToStudent) {
      await prisma.lessonResource.update({
        where: {
          id: resource.id,
        },
        data: {
          visibleToStudent: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      assignment,
    });
  } catch (error) {
    console.error("Resource assignment creation failed:", error);

    return NextResponse.json(
      {
        error: "Unable to assign this resource.",
      },
      {
        status: 500,
      }
    );
  }
}
