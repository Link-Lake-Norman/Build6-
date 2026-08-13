import { prisma } from "@/lib/prisma";
import {
  getSessionUser,
  type SessionUser,
} from "@/lib/auth/session";

export type StudentAccessResult =
  | {
      allowed: true;
      session: SessionUser;
      studentId: string;
      cohortIds: string[];
    }
  | {
      allowed: false;
      status: 401 | 403 | 404;
      reason: string;
    };

export async function authorizeStudentAccess(
  requestedStudentId: string
): Promise<StudentAccessResult> {
  const session = await getSessionUser();

  if (!session) {
    return {
      allowed: false,
      status: 401,
      reason: "Authentication required.",
    };
  }

  const student = await prisma.student.findUnique({
    where: {
      id: requestedStudentId,
    },
    select: {
      id: true,
      userId: true,
      schoolId: true,
      enrollments: {
        where: {
          status: "ACTIVE",
        },
        select: {
          cohortId: true,
          cohort: {
            select: {
              organizationId: true,
              schoolId: true,
            },
          },
        },
      },
    },
  });

  if (!student) {
    return {
      allowed: false,
      status: 404,
      reason: "Student not found.",
    };
  }

  const cohortIds = student.enrollments.map(
    (enrollment) => enrollment.cohortId
  );

  if (session.role === "SUPER_ADMIN") {
    return {
      allowed: true,
      session,
      studentId: student.id,
      cohortIds,
    };
  }

  if (session.role === "STUDENT") {
    if (
      session.studentId === student.id &&
      session.id === student.userId
    ) {
      return {
        allowed: true,
        session,
        studentId: student.id,
        cohortIds,
      };
    }

    return {
      allowed: false,
      status: 403,
      reason:
        "Students may only access their own Future Ready™ record.",
    };
  }

  if (session.role === "FACILITATOR") {
    const facilitator = await prisma.facilitator.findUnique({
      where: {
        userId: session.id,
      },
      select: {
        cohorts: {
          where: {
            cohortId: {
              in: cohortIds,
            },
          },
          select: {
            cohortId: true,
          },
        },
      },
    });

    if (
      facilitator &&
      facilitator.cohorts.length > 0
    ) {
      return {
        allowed: true,
        session,
        studentId: student.id,
        cohortIds,
      };
    }

    return {
      allowed: false,
      status: 403,
      reason:
        "Facilitator is not assigned to this student's cohort.",
    };
  }

  if (session.role === "SCHOOL_ADMIN") {
    if (
      session.schoolId &&
      session.schoolId === student.schoolId
    ) {
      return {
        allowed: true,
        session,
        studentId: student.id,
        cohortIds,
      };
    }

    return {
      allowed: false,
      status: 403,
      reason:
        "School administrator does not have access to this student.",
    };
  }

  if (
    session.role === "ORGANIZATION_ADMIN"
  ) {
    const hasOrganizationAccess =
      student.enrollments.some(
        (enrollment) =>
          enrollment.cohort.organizationId ===
          session.organizationId
      );

    if (hasOrganizationAccess) {
      return {
        allowed: true,
        session,
        studentId: student.id,
        cohortIds,
      };
    }

    return {
      allowed: false,
      status: 403,
      reason:
        "Organization administrator does not have access to this student.",
    };
  }

  return {
    allowed: false,
    status: 403,
    reason:
      "This account type cannot access student records.",
  };
}
