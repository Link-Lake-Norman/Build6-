import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { authorizeStudentAccess } from "@/lib/auth/student-access";

const DAY_TWO_PROMPT =
  "DAY 2 · WHERE I'M STARTING · Right now, what do you know about yourself, what are you still figuring out, and what is one thing you want BUILD6™ to help you accomplish?";

function validStudentId(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required." },
        { status: 400 },
      );
    }

    const access = await authorizeStudentAccess(studentId);

    if (!access.allowed) {
      return NextResponse.json(
        { error: access.reason },
        { status: access.status },
      );
    }

    const reflection = await prisma.reflection.findFirst({
      where: {
        studentId,
        lessonId: null,
        prompt: DAY_TWO_PROMPT,
      },
      select: {
        id: true,
        response: true,
        status: true,
        submittedAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({
      reflection,
    });
  } catch (error) {
    console.error("GET /api/ambassador/day-two failed:", error);

    return NextResponse.json(
      { error: "Unable to load your Day 2 reflection." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const studentId = body.studentId;
    const response =
      typeof body.response === "string" ? body.response.trim() : "";

    if (!validStudentId(studentId)) {
      return NextResponse.json(
        { error: "Valid studentId is required." },
        { status: 400 },
      );
    }

    if (!response) {
      return NextResponse.json(
        { error: "Complete your reflection before saving." },
        { status: 400 },
      );
    }

    const access = await authorizeStudentAccess(studentId);

    if (!access.allowed) {
      return NextResponse.json(
        { error: access.reason },
        { status: access.status },
      );
    }

    const existing = await prisma.reflection.findFirst({
      where: {
        studentId,
        lessonId: null,
        prompt: DAY_TWO_PROMPT,
      },
      select: {
        id: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const reflection = existing
      ? await prisma.reflection.update({
          where: {
            id: existing.id,
          },
          data: {
            response,
            status: "SUBMITTED",
            submittedAt: new Date(),
          },
          select: {
            id: true,
            response: true,
            status: true,
            submittedAt: true,
          },
        })
      : await prisma.reflection.create({
          data: {
            studentId,
            lessonId: null,
            prompt: DAY_TWO_PROMPT,
            response,
            status: "SUBMITTED",
            submittedAt: new Date(),
          },
          select: {
            id: true,
            response: true,
            status: true,
            submittedAt: true,
          },
        });

    return NextResponse.json({
      success: true,
      reflection,
    });
  } catch (error) {
    console.error("POST /api/ambassador/day-two failed:", error);

    return NextResponse.json(
      { error: "Unable to save your Day 2 reflection." },
      { status: 500 },
    );
  }
}
