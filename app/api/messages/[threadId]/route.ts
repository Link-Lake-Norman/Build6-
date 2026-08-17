import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

function userName(user: {
  firstName: string;
  lastName: string;
  displayName: string | null;
}) {
  return (
    user.displayName?.trim() || `${user.firstName} ${user.lastName}`.trim()
  );
}

async function requireParticipant(threadId: string, userId: string) {
  return prisma.messageParticipant.findUnique({
    where: {
      threadId_userId: {
        threadId,
        userId,
      },
    },
  });
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ threadId: string }> },
) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId } = await context.params;

    const participant = await requireParticipant(threadId, session.id);

    if (!participant) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const thread = await prisma.messageThread.findUnique({
      where: { id: threadId },
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
            createdAt: "asc",
          },
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

    if (!thread) {
      return NextResponse.json(
        { error: "Conversation not found." },
        { status: 404 },
      );
    }

    await prisma.messageParticipant.update({
      where: {
        threadId_userId: {
          threadId,
          userId: session.id,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return NextResponse.json({
      thread: {
        id: thread.id,
        subject: thread.subject,
        threadType: thread.threadType,
        createdAt: thread.createdAt,
        updatedAt: thread.updatedAt,
        participants: thread.participants.map((participant) => ({
          id: participant.user.id,
          name: userName(participant.user),
          role: participant.user.role,
        })),
        messages: thread.messages.map((message) => ({
          id: message.id,
          body: message.body,
          createdAt: message.createdAt,
          editedAt: message.editedAt,
          sender: {
            id: message.sender.id,
            name: userName(message.sender),
            role: message.sender.role,
          },
        })),
      },
      currentUserId: session.id,
    });
  } catch (error) {
    console.error("Open conversation error:", error);

    return NextResponse.json(
      { error: "Unable to open conversation." },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ threadId: string }> },
) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId } = await context.params;

    const participant = await requireParticipant(threadId, session.id);

    if (!participant) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payload = await request.json();

    const body =
      typeof payload.message === "string" ? payload.message.trim() : "";

    if (!body) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    if (body.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long." },
        { status: 400 },
      );
    }

    const message = await prisma.$transaction(async (tx) => {
      const created = await tx.platformMessage.create({
        data: {
          threadId,
          senderId: session.id,
          body,
        },
      });

      await tx.messageParticipant.update({
        where: {
          threadId_userId: {
            threadId,
            userId: session.id,
          },
        },
        data: {
          lastReadAt: new Date(),
        },
      });

      await tx.messageThread.update({
        where: { id: threadId },
        data: {
          updatedAt: new Date(),
        },
      });

      return created;
    });

    return NextResponse.json(
      {
        success: true,
        messageId: message.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Reply error:", error);

    return NextResponse.json(
      { error: "Unable to send reply." },
      { status: 500 },
    );
  }
}
