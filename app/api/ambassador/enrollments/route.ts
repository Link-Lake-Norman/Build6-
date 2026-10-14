import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

async function canManageEnrollment(
  session: {
    id: string;
    role: string;
    schoolId?: string | null;
    organizationId?: string | null;
  },
  enrollmentId: string
) {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      id: enrollmentId,
    },
    select: {
      id: true,
      cohortId: true,
      cohort: {
        select: {
          schoolId: true,
          organizationId: true,
        },
      },
    },
  });

  if (!enrollment) {
    return null;
  }

  if (session.role === "SUPER_ADMIN") {
    return enrollment;
  }

  if (
    session.role === "SCHOOL_ADMIN" &&
    session.schoolId &&
    enrollment.cohort.schoolId === session.schoolId
  ) {
    return enrollment;
  }

  if (
    session.role === "ORGANIZATION_ADMIN" &&
    session.organizationId &&
    enrollment.cohort.organizationId === session.organizationId
  ) {
    return enrollment;
  }

  if (session.role === "FACILITATOR") {
    const assignment =
      await prisma.cohortFacilitator.findFirst({
        where: {
          cohortId: enrollment.cohortId,
          facilitator: {
            userId: session.id,
            deletedAt: null,
          },
        },
        select: {
          id: true,
        },
      });

    if (assignment) {
      return enrollment;
    }
  }

  return null;
}

export async function DELETE(
  request: NextRequest
) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    if (
      session.role !== "SUPER_ADMIN" &&
      session.role !== "SCHOOL_ADMIN" &&
      session.role !== "ORGANIZATION_ADMIN" &&
      session.role !== "FACILITATOR"
    ) {
      return NextResponse.json(
        {
          error:
            "Student management access required.",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const enrollmentId =
      typeof body.enrollmentId === "string"
        ? body.enrollmentId.trim()
        : "";

    if (!enrollmentId) {
      return NextResponse.json(
        {
          error: "Enrollment ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const allowed =
      await canManageEnrollment(
        session,
        enrollmentId
      );

    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to manage this enrollment.",
        },
        {
          status: 403,
        }
      );
    }

    await prisma.enrollment.delete({
      where: {
        id: enrollmentId,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Student removed from cohort. Their BUILD6™ account and Passport remain intact.",
    });
  } catch (error) {
    console.error(
      "Enrollment DELETE failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to remove student from cohort.",
      },
      {
        status: 500,
      }
    );
  }
}
