import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { getAccessibleUserIds, isMessagingRole } from "@/lib/messaging/access";

export async function GET() {
  try {
    const session = await getSessionUser();

    if (!session || !isMessagingRole(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessibleIds = await getAccessibleUserIds(session.id, session.role);

    const ids = Array.from(accessibleIds).filter((id) => id !== session.id);

    if (ids.length === 0) {
      return NextResponse.json({ recipients: [] });
    }

    const users = await prisma.user.findMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        displayName: true,
        role: true,
        student: {
          select: {
            gradeLevel: true,
            enrollments: {
              where: { status: "ACTIVE" },
              select: {
                cohort: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        facilitator: {
          select: {
            title: true,
            cohorts: {
              select: {
                cohort: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const recipients = users.map((user) => ({
      id: user.id,
      name:
        user.displayName?.trim() || `${user.firstName} ${user.lastName}`.trim(),
      role: user.role,
      gradeLevel: user.student?.gradeLevel ?? null,
      title: user.facilitator?.title ?? null,
      cohorts:
        user.student?.enrollments.map((item) => ({
          id: item.cohort.id,
          name: item.cohort.name,
        })) ??
        user.facilitator?.cohorts.map((item) => ({
          id: item.cohort.id,
          name: item.cohort.name,
        })) ??
        [],
    }));

    return NextResponse.json({ recipients });
  } catch (error) {
    console.error("Messaging recipients error:", error);

    return NextResponse.json(
      { error: "Unable to load recipients." },
      { status: 500 },
    );
  }
}
