import { NextRequest, NextResponse } from "next/server";

import { authorizeStudentAccess } from "@/lib/auth/student-access";
import { prisma } from "@/lib/prisma";

function promptFor(weekNumber: number, dayNumber: number) {
  return `Capstone Build · Week ${weekNumber} · Day ${dayNumber}`;
}

function parseResponse(response: string) {
  const values = {
    learning: "",
    skillEvidence: "",
    growth: "",
  };

  const sections = response.split("\n\n");

  for (const section of sections) {
    if (section.startsWith("Learning / Idea:\n")) {
      values.learning = section.replace("Learning / Idea:\n", "").trim();
    }

    if (section.startsWith("Skill Evidence:\n")) {
      values.skillEvidence = section.replace("Skill Evidence:\n", "").trim();
    }

    if (section.startsWith("Vision / Goal / Next Step:\n")) {
      values.growth = section
        .replace("Vision / Goal / Next Step:\n", "")
        .trim();
    }
  }

  return values;
}

export async function GET(request: NextRequest) {
  const studentId = request.nextUrl.searchParams.get("studentId")?.trim() ?? "";

  const lessonId = request.nextUrl.searchParams.get("lessonId")?.trim() ?? "";

  const weekNumber = Number(request.nextUrl.searchParams.get("weekNumber"));

  if (!studentId || !lessonId || !Number.isInteger(weekNumber)) {
    return NextResponse.json(
      {
        error: "Student, lesson, and week are required.",
      },
      {
        status: 400,
      },
    );
  }

  const access = await authorizeStudentAccess(studentId);

  if (!access.allowed) {
    return NextResponse.json(
      {
        error: "Student access denied.",
      },
      {
        status: access.status,
      },
    );
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId,
      status: "ACTIVE",
    },
    select: {
      cohortId: true,
    },
  });

  const directions = enrollment
    ? await prisma.lessonPlanTask.findMany({
        where: {
          lessonId,
          cohortId: enrollment.cohortId,
          taskType: "DAILY_DIRECTIONS",
          visibleToStudent: true,
        },
        orderBy: {
          dayNumber: "asc",
        },
        select: {
          dayNumber: true,
          instructions: true,
        },
      })
    : [];

  const reflections = await prisma.reflection.findMany({
    where: {
      studentId,
      lessonId,
      prompt: {
        startsWith: `Capstone Build · Week ${weekNumber} · Day `,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      prompt: true,
      response: true,
      status: true,
      updatedAt: true,
    },
  });

  const entries = reflections
    .map((reflection) => {
      const match = reflection.prompt.match(/Day (\d+)$/);

      if (!match) {
        return null;
      }

      return {
        id: reflection.id,
        dayNumber: Number(match[1]),
        ...parseResponse(reflection.response),
        status: reflection.status,
        updatedAt: reflection.updatedAt.toISOString(),
      };
    })
    .filter(Boolean);

  return NextResponse.json({
    directions,
    entries,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const studentId =
    typeof body.studentId === "string" ? body.studentId.trim() : "";

  const lessonId =
    typeof body.lessonId === "string" ? body.lessonId.trim() : "";

  const weekNumber = Number.isInteger(body.weekNumber) ? body.weekNumber : null;

  const dayNumber =
    Number.isInteger(body.dayNumber) &&
    body.dayNumber >= 1 &&
    body.dayNumber <= 5
      ? body.dayNumber
      : null;

  if (!studentId || !lessonId || !weekNumber || !dayNumber) {
    return NextResponse.json(
      {
        error: "Student, lesson, week, and day are required.",
      },
      {
        status: 400,
      },
    );
  }

  const access = await authorizeStudentAccess(studentId);

  if (!access.allowed) {
    return NextResponse.json(
      {
        error: "Student access denied.",
      },
      {
        status: access.status,
      },
    );
  }

  if (
    access.session.role !== "STUDENT" ||
    access.session.studentId !== studentId
  ) {
    return NextResponse.json(
      {
        error: "Only the student may edit this Capstone reflection.",
      },
      {
        status: 403,
      },
    );
  }

  const learning =
    typeof body.learning === "string" ? body.learning.trim() : "";

  const skillEvidence =
    typeof body.skillEvidence === "string" ? body.skillEvidence.trim() : "";

  const growth = typeof body.growth === "string" ? body.growth.trim() : "";

  if (!learning && !skillEvidence && !growth) {
    return NextResponse.json(
      {
        error: "Add at least one thought before saving.",
      },
      {
        status: 400,
      },
    );
  }

  const complete =
    Boolean(learning) && Boolean(skillEvidence) && Boolean(growth);

  const prompt = promptFor(weekNumber, dayNumber);

  const response = [
    `Learning / Idea:\n${learning}`,
    `Skill Evidence:\n${skillEvidence}`,
    `Vision / Goal / Next Step:\n${growth}`,
  ].join("\n\n");

  const existing = await prisma.reflection.findFirst({
    where: {
      studentId,
      lessonId,
      prompt,
    },
  });

  const reflection = existing
    ? await prisma.reflection.update({
        where: {
          id: existing.id,
        },
        data: {
          response,
          status: complete ? "SUBMITTED" : "DRAFT",
          submittedAt: complete ? new Date() : null,
        },
      })
    : await prisma.reflection.create({
        data: {
          studentId,
          lessonId,
          prompt,
          response,
          status: complete ? "SUBMITTED" : "DRAFT",
          submittedAt: complete ? new Date() : null,
        },
      });

  return NextResponse.json({
    success: true,
    status: reflection.status,
    reflection,
  });
}
