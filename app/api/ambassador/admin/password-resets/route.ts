import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

const ADMIN_ROLES = ["SUPER_ADMIN", "ORGANIZATION_ADMIN", "SCHOOL_ADMIN"];

function isAdmin(role: string) {
  return ADMIN_ROLES.includes(role);
}

function temporaryPassword() {
  return `Temp-${crypto.randomBytes(4).toString("hex")}-A7`;
}

export async function GET() {
  try {
    const session = await getSessionUser();

    if (!session || !isAdmin(session.role)) {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 403 },
      );
    }

    const requests = await prisma.passwordResetRequest.findMany({
      orderBy: {
        requestedAt: "desc",
      },
      take: 100,
    });

    const userIds = requests
      .map((item) => item.userId)
      .filter((id): id is string => Boolean(id));

    const users = userIds.length
      ? await prisma.user.findMany({
          where: {
            id: {
              in: userIds,
            },
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            email: true,
            role: true,
            status: true,
          },
        })
      : [];

    const usersById = new Map(users.map((user) => [user.id, user]));

    return NextResponse.json({
      requests: requests.map((item) => ({
        ...item,
        user: item.userId ? (usersById.get(item.userId) ?? null) : null,
      })),
    });
  } catch (error) {
    console.error("Password reset request list failed:", error);

    return NextResponse.json(
      { error: "Unable to load reset requests." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();

    if (!session || !isAdmin(session.role)) {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 403 },
      );
    }

    const body = await request.json();

    const requestId =
      typeof body.requestId === "string" ? body.requestId.trim() : "";

    if (!requestId) {
      return NextResponse.json(
        { error: "Reset request is required." },
        { status: 400 },
      );
    }

    const resetRequest = await prisma.passwordResetRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (
      !resetRequest ||
      resetRequest.status !== "PENDING" ||
      !resetRequest.userId
    ) {
      return NextResponse.json(
        {
          error: "This password reset request is no longer available.",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: resetRequest.userId,
      },
      select: {
        id: true,
        email: true,
        status: true,
      },
    });

    if (!user || user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Active user account not found." },
        { status: 404 },
      );
    }

    const tempPassword = temporaryPassword();

    const passwordHash = await bcrypt.hash(tempPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          passwordHash,
        },
      }),

      prisma.passwordResetRequest.update({
        where: {
          id: resetRequest.id,
        },
        data: {
          status: "COMPLETED",
          handledAt: new Date(),
          handledById: session.id,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      email: user.email,
      temporaryPassword: tempPassword,
    });
  } catch (error) {
    console.error("Administrative password reset failed:", error);

    return NextResponse.json(
      { error: "Unable to reset password." },
      { status: 500 },
    );
  }
}
