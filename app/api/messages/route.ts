import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { getAccessibleUserIds, isMessagingRole } from "@/lib/messaging/access";

function userName(user: {
  firstName: string;
  lastName: string;
  displayName: string | null;
}) {
  return (
    user.displayName?.trim() || `${user.firstName} ${user.lastName}`.trim()
  );
}

export async function GET() {
  try {
    const session = await getSessionUser();

    if (!session || !isMessagingRole(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const threads = await prisma.messageThread.findMany({
      where: {
        participants: {
          some: {
            userId: session.id,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                displayName: true,
                role: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                displayName: true,
                role: true,
              },
            },
          },
        },
      },
    });

    const threadIds = threads.map((thread) => thread.id);

    const currentParticipantRows =
      threadIds.length > 0
        ? await prisma.messageParticipant.findMany({
            where: {
              userId: session.id,
              threadId: {
                in: threadIds,
              },
            },
            select: {
              threadId: true,
              lastReadAt: true,
            },
          })
        : [];

    const readMap = new Map(
      currentParticipantRows.map((row) => [row.threadId, row.lastReadAt]),
    );

    const inbox = threads.map((thread) => {
      const latest = thread.messages[0] ?? null;

      const lastReadAt = readMap.get(thread.id) ?? null;

      const unread =
        !!latest &&
        latest.senderId !== session.id &&
        (!lastReadAt || latest.createdAt > lastReadAt);

      return {
        id: thread.id,
        subject: thread.subject,
        threadType: thread.threadType,
        updatedAt: thread.updatedAt,
        unread,

        participants: thread.participants.map((participant) => ({
          id: participant.user.id,
          name: userName(participant.user),
          role: participant.user.role,
        })),

        latestMessage: latest
          ? {
              id: latest.id,
              body: latest.body,
              createdAt: latest.createdAt,
              sender: {
                id: latest.sender.id,
                name: userName(latest.sender),
                role: latest.sender.role,
              },
            }
          : null,
      };
    });

    return NextResponse.json({
      threads: inbox,
      unreadCount: inbox.filter((thread) => thread.unread).length,
    });
  } catch (error) {
    console.error("Inbox error:", error);

    return NextResponse.json(
      {
        error: "Unable to load messages.",
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

    if (!session || !isMessagingRole(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        {
          error: "Invalid message request.",
        },
        {
          status: 400,
        },
      );
    }

    const payload = body as Record<string, unknown>;

    const rawRecipientIds = Array.isArray(payload.recipientIds)
      ? payload.recipientIds
      : [];

    const recipientIds: string[] = rawRecipientIds.filter(
      (id): id is string => typeof id === "string" && id.trim().length > 0,
    );

    const message =
      typeof payload.message === "string" ? payload.message.trim() : "";

    const subject =
      typeof payload.subject === "string"
        ? payload.subject.trim().slice(0, 150)
        : "";

    if (!message) {
      return NextResponse.json(
        {
          error: "Message is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          error: "Message is too long.",
        },
        {
          status: 400,
        },
      );
    }

    const uniqueRecipientIds: string[] = [
      ...new Set<string>(recipientIds),
    ].filter((id) => id !== session.id);

    if (uniqueRecipientIds.length === 0) {
      return NextResponse.json(
        {
          error: "Choose at least one recipient.",
        },
        {
          status: 400,
        },
      );
    }

    const accessibleIds = await getAccessibleUserIds(session.id, session.role);

    const invalidRecipient = uniqueRecipientIds.find(
      (id: string) => !accessibleIds.has(id),
    );

    if (invalidRecipient) {
      return NextResponse.json(
        {
          error: "You cannot message one or more selected recipients.",
        },
        {
          status: 403,
        },
      );
    }

    const thread = await prisma.$transaction(async (tx) => {
      const created = await tx.messageThread.create({
        data: {
          subject: subject || null,

          threadType: uniqueRecipientIds.length > 1 ? "GROUP" : "DIRECT",

          createdById: session.id,

          participants: {
            create: [
              {
                userId: session.id,
                lastReadAt: new Date(),
              },

              ...uniqueRecipientIds.map((userId: string) => ({
                userId,
              })),
            ],
          },

          messages: {
            create: {
              senderId: session.id,
              body: message,
            },
          },
        },
      });

      return created;
    });

    return NextResponse.json(
      {
        success: true,
        threadId: thread.id,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Create message error:", error);

    return NextResponse.json(
      {
        error: "Unable to send message.",
      },
      {
        status: 500,
      },
    );
  }
}
