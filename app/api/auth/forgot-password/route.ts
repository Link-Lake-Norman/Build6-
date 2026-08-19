import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        status: true,
      },
    });

    if (user?.status === "ACTIVE") {
      const existing =
        await prisma.passwordResetRequest.findFirst({
          where: {
            email,
            status: "PENDING",
          },
          select: {
            id: true,
          },
        });

      if (!existing) {
        await prisma.passwordResetRequest.create({
          data: {
            email,
            userId: user.id,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "If this email belongs to an active account, a password reset request has been submitted.",
    });
  } catch (error) {
    console.error("Password reset request failed:", error);

    return NextResponse.json(
      { error: "Unable to submit password reset request." },
      { status: 500 },
    );
  }
}
