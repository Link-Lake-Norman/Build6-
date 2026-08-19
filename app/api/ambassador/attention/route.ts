import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { isMessagingRole } from "@/lib/messaging/access";

const ADMIN_ROLES = new Set([
  "SUPER_ADMIN",
  "ORGANIZATION_ADMIN",
  "SCHOOL_ADMIN",
]);

export async function GET() {
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

    let unreadMessages = 0;

    if (isMessagingRole(session.role)) {
      const participations = await prisma.messageParticipant.findMany({
        where: {
          userId: session.id,
        },
        select: {
          lastReadAt: true,
          thread: {
            select: {
              messages: {
                orderBy: {
                  createdAt: "desc",
                },
                take: 1,
                select: {
                  senderId: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      });

      unreadMessages = participations.filter((participation) => {
        const latest = participation.thread.messages[0];

        if (!latest) {
          return false;
        }

        if (latest.senderId === session.id) {
          return false;
        }

        return (
          !participation.lastReadAt ||
          latest.createdAt > participation.lastReadAt
        );
      }).length;
    }

    const pendingPasswordResets = ADMIN_ROLES.has(session.role)
      ? await prisma.passwordResetRequest.count({
          where: {
            status: "PENDING",
          },
        })
      : 0;

    return NextResponse.json(
      {
        unreadMessages,
        pendingPasswordResets,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("Attention status failed:", error);

    return NextResponse.json(
      {
        error: "Unable to load attention status.",
      },
      {
        status: 500,
      },
    );
  }
}
