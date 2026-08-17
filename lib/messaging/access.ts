import { prisma } from "@/lib/prisma";

export type MessagingRole =
  | "STUDENT"
  | "FACILITATOR"
  | "SCHOOL_ADMIN"
  | "ORGANIZATION_ADMIN"
  | "SUPER_ADMIN";

export function isMessagingRole(role: string): role is MessagingRole {
  return [
    "STUDENT",
    "FACILITATOR",
    "SCHOOL_ADMIN",
    "ORGANIZATION_ADMIN",
    "SUPER_ADMIN",
  ].includes(role);
}

async function getFacilitatorScopedUserIds(
  userId: string,
  facilitatorId: string,
): Promise<Set<string>> {
  const ids = new Set<string>();

  const assignments = await prisma.cohortFacilitator.findMany({
    where: {
      facilitatorId,
      cohort: {
        status: "ACTIVE",
      },
    },
    select: {
      cohortId: true,
      cohort: {
        select: {
          organizationId: true,
        },
      },
    },
  });

  const cohortIds = Array.from(
    new Set(assignments.map((assignment) => assignment.cohortId)),
  );

  const organizationIds = Array.from(
    new Set(
      assignments
        .map((assignment) => assignment.cohort.organizationId)
        .filter(Boolean),
    ),
  );

  if (cohortIds.length === 0) {
    return ids;
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      cohortId: {
        in: cohortIds,
      },
      status: "ACTIVE",
      student: {
        user: {
          status: "ACTIVE",
          deletedAt: null,
        },
      },
    },
    select: {
      student: {
        select: {
          userId: true,
        },
      },
    },
  });

  for (const enrollment of enrollments) {
    ids.add(enrollment.student.userId);
  }

  const facilitators = await prisma.cohortFacilitator.findMany({
    where: {
      cohortId: {
        in: cohortIds,
      },
      facilitator: {
        user: {
          status: "ACTIVE",
          deletedAt: null,
        },
      },
    },
    select: {
      facilitator: {
        select: {
          userId: true,
        },
      },
    },
  });

  for (const assignment of facilitators) {
    ids.add(assignment.facilitator.userId);
  }

  if (organizationIds.length > 0) {
    const admins = await prisma.userOrganization.findMany({
      where: {
        organizationId: {
          in: organizationIds,
        },
        role: {
          in: ["ORGANIZATION_ADMIN", "SCHOOL_ADMIN"],
        },
        user: {
          status: "ACTIVE",
          deletedAt: null,
        },
      },
      select: {
        userId: true,
      },
    });

    for (const admin of admins) {
      ids.add(admin.userId);
    }
  }

  ids.delete(userId);

  return ids;
}

export async function getAccessibleUserIds(
  userId: string,
  role: MessagingRole,
): Promise<Set<string>> {
  const ids = new Set<string>();

  if (role === "SUPER_ADMIN") {
    const facilitator = await prisma.facilitator.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
        cohorts: {
          where: {
            cohort: {
              status: "ACTIVE",
            },
          },
          select: {
            cohortId: true,
          },
        },
      },
    });

    if (facilitator && facilitator.cohorts.length > 0) {
      return getFacilitatorScopedUserIds(userId, facilitator.id);
    }

    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
        status: "ACTIVE",
        role: {
          in: ["STUDENT", "FACILITATOR", "SCHOOL_ADMIN", "ORGANIZATION_ADMIN"],
        },
      },
      select: {
        id: true,
      },
    });

    for (const user of users) {
      if (user.id !== userId) {
        ids.add(user.id);
      }
    }

    return ids;
  }

  if (role === "STUDENT") {
    const student = await prisma.student.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!student) {
      return ids;
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: student.id,
        status: "ACTIVE",
        cohort: {
          status: "ACTIVE",
        },
      },
      select: {
        cohortId: true,
        cohort: {
          select: {
            organizationId: true,
          },
        },
      },
    });

    const cohortIds = Array.from(
      new Set(enrollments.map((enrollment) => enrollment.cohortId)),
    );

    const organizationIds = Array.from(
      new Set(
        enrollments
          .map((enrollment) => enrollment.cohort.organizationId)
          .filter(Boolean),
      ),
    );

    if (cohortIds.length > 0) {
      const facilitators = await prisma.cohortFacilitator.findMany({
        where: {
          cohortId: {
            in: cohortIds,
          },
          facilitator: {
            user: {
              status: "ACTIVE",
              deletedAt: null,
            },
          },
        },
        select: {
          facilitator: {
            select: {
              userId: true,
            },
          },
        },
      });

      for (const facilitator of facilitators) {
        ids.add(facilitator.facilitator.userId);
      }
    }

    if (organizationIds.length > 0) {
      const admins = await prisma.userOrganization.findMany({
        where: {
          organizationId: {
            in: organizationIds,
          },
          role: {
            in: ["ORGANIZATION_ADMIN", "SCHOOL_ADMIN"],
          },
          user: {
            status: "ACTIVE",
            deletedAt: null,
          },
        },
        select: {
          userId: true,
        },
      });

      for (const admin of admins) {
        ids.add(admin.userId);
      }
    }

    ids.delete(userId);

    return ids;
  }

  if (role === "FACILITATOR") {
    const facilitator = await prisma.facilitator.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!facilitator) {
      return ids;
    }

    return getFacilitatorScopedUserIds(userId, facilitator.id);
  }

  if (role === "SCHOOL_ADMIN" || role === "ORGANIZATION_ADMIN") {
    const memberships = await prisma.userOrganization.findMany({
      where: {
        userId,
      },
      select: {
        organizationId: true,
      },
    });

    const organizationIds = Array.from(
      new Set(memberships.map((membership) => membership.organizationId)),
    );

    if (organizationIds.length === 0) {
      return ids;
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        status: "ACTIVE",
        cohort: {
          status: "ACTIVE",
          organizationId: {
            in: organizationIds,
          },
        },
        student: {
          user: {
            status: "ACTIVE",
            deletedAt: null,
          },
        },
      },
      select: {
        student: {
          select: {
            userId: true,
          },
        },
      },
    });

    for (const enrollment of enrollments) {
      ids.add(enrollment.student.userId);
    }

    const facilitatorAssignments = await prisma.cohortFacilitator.findMany({
      where: {
        cohort: {
          status: "ACTIVE",
          organizationId: {
            in: organizationIds,
          },
        },
        facilitator: {
          user: {
            status: "ACTIVE",
            deletedAt: null,
          },
        },
      },
      select: {
        facilitator: {
          select: {
            userId: true,
          },
        },
      },
    });

    for (const assignment of facilitatorAssignments) {
      ids.add(assignment.facilitator.userId);
    }

    const admins = await prisma.userOrganization.findMany({
      where: {
        organizationId: {
          in: organizationIds,
        },
        role: {
          in: ["ORGANIZATION_ADMIN", "SCHOOL_ADMIN"],
        },
        user: {
          status: "ACTIVE",
          deletedAt: null,
        },
      },
      select: {
        userId: true,
      },
    });

    for (const admin of admins) {
      ids.add(admin.userId);
    }

    ids.delete(userId);

    return ids;
  }

  return ids;
}
