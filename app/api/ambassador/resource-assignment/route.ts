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

    const packagedAsset =
      body.packagedAsset &&
      typeof body.packagedAsset === "object"
        ? body.packagedAsset
        : null;

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

    if (!resourceId && !packagedAsset) {
      return NextResponse.json(
        {
          error: "Resource or packaged asset is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (packagedAsset) {
      const lessonId =
        typeof packagedAsset.lessonId === "string"
          ? packagedAsset.lessonId.trim()
          : "";

      const cohortId =
        typeof packagedAsset.cohortId === "string"
          ? packagedAsset.cohortId.trim()
          : "";

      const title =
        typeof packagedAsset.title === "string"
          ? packagedAsset.title.trim()
          : "";

      const resourceUrl =
        typeof packagedAsset.resourceUrl === "string"
          ? packagedAsset.resourceUrl.trim()
          : "";

      const resourceKind =
        typeof packagedAsset.resourceKind === "string"
          ? packagedAsset.resourceKind.trim()
          : "OTHER";

      if (!lessonId || !cohortId || !title || !resourceUrl) {
        return NextResponse.json(
          {
            error: "Packaged asset information is incomplete.",
          },
          {
            status: 400,
          }
        );
      }

      const allowed = await canManageCohort(
        session.id,
        session.role,
        cohortId
      );

      if (!allowed) {
        return NextResponse.json(
          {
            error: "You do not have permission to assign this asset.",
          },
          {
            status: 403,
          }
        );
      }

      const allowOnline =
        mode === "ONLINE" || mode === "BOTH";

      const allowPrint =
        mode === "PRINT" || mode === "BOTH";

      const instructions =
        typeof body.instructions === "string" &&
        body.instructions.trim()
          ? body.instructions.trim()
          : `Complete the BUILD6™ resource: ${title}.`;

      const assignment = await prisma.assignment.create({
        data: {
          lessonId,
          cohortId,
          title,
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
          portfolioEligible:
            body.portfolioEligible === true,
          dayNumber,
          status: "ACTIVE",
          createdById: session.id,
          onlineContent: {
            type: "PACKAGED_RESOURCE_ASSIGNMENT",
            resourceTitle: title,
            resourceKind,
            resourceUrl,
            deliveryMode: mode,
          },
        },
      });

      return NextResponse.json({
        success: true,
        assignment,
      });
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
      `Complete the attached BUILD6™ resource: ${resource.title}.`;

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
