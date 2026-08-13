import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const currentPassword =
      typeof body.currentPassword === "string"
        ? body.currentPassword
        : "";

    const newPassword =
      typeof body.newPassword === "string"
        ? body.newPassword
        : "";

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          error:
            "Current password and new password are required.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          error:
            "New password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user?.passwordHash) {
      return NextResponse.json(
        {
          error:
            "This account does not have a password available to change.",
        },
        { status: 400 }
      );
    }

    const valid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!valid) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(
      newPassword,
      12
    );

    await prisma.user.update({
      where: {
        id: session.id,
      },
      data: {
        passwordHash,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Password change failed:", error);

    return NextResponse.json(
      { error: "Unable to change password." },
      { status: 500 }
    );
  }
}
