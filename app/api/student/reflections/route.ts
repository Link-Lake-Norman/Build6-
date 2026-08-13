import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeStudentAccess } from "@/lib/auth/student-access";

const AMBASSADOR_PROGRAM_ID = "cms7m13y300024ur4rb49uzlw";

function validStudentId(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validWeek(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 16
  );
}

async function getAmbassadorLesson(week: number) {
  return prisma.lesson.findFirst({
    where: {
      weekNumber: week,
      status: "ACTIVE",
      module: {
        programId: AMBASSADOR_PROGRAM_ID,
      },
    },
    select: {
      id: true,
      weekNumber: true,
      title: true,
    },
  });
}

/*
 * GET
 * /api/student/reflections?studentId=...&week=1
 *
 * week is optional.
 * Without week: returns all Ambassador reflections.
 * With week: returns the reflection for that week.
 */
export async function GET(request: NextRequest) {
  try {
    const studentId =
      request.nextUrl.searchParams.get("studentId");

    const weekParam =
      request.nextUrl.searchParams.get("week");

    if (!studentId) {
      return NextResponse.json(
        {
          error: "studentId is required.",
        },
        {
          status: 400,
        }
      );
    }

    const access =
      await authorizeStudentAccess(studentId);

    if (!access.allowed) {
      return NextResponse.json(
        {
          error: access.reason,
        },
        {
          status: access.status,
        }
      );
    }

    let week: number | null = null;

    if (weekParam !== null) {
      week = Number(weekParam);

      if (!validWeek(week)) {
        return NextResponse.json(
          {
            error:
              "week must be an integer between 1 and 16.",
          },
          {
            status: 400,
          }
        );
      }
    }

    if (week !== null) {
      const lesson =
        await getAmbassadorLesson(week);

      if (!lesson) {
        return NextResponse.json(
          {
            error:
              "Ambassador lesson not found.",
          },
          {
            status: 404,
          }
        );
      }

      const reflection =
        await prisma.reflection.findFirst({
          where: {
            lessonId: lesson.id,
            studentId,
          },
          select: {
            id: true,
            lessonId: true,
            studentId: true,
            prompt: true,
            response: true,
            status: true,
            submittedAt: true,
            createdAt: true,
            updatedAt: true,
          },
        });

      return NextResponse.json({
        lesson,
        reflection,
      });
    }

    const lessons =
      await prisma.lesson.findMany({
        where: {
          status: "ACTIVE",
          module: {
            programId: AMBASSADOR_PROGRAM_ID,
          },
        },
        select: {
          id: true,
          weekNumber: true,
          title: true,
          reflections: {
            where: {
              studentId,
            },
            select: {
              id: true,
              prompt: true,
              response: true,
              status: true,
              submittedAt: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy: {
          weekNumber: "asc",
        },
      });

    return NextResponse.json({
      reflections: lessons.map((lesson) => ({
        lessonId: lesson.id,
        week: lesson.weekNumber,
        lessonTitle: lesson.title,
        reflection:
          lesson.reflections[0] ?? null,
      })),
    });
  } catch (error) {
    console.error(
      "GET /api/student/reflections failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load reflections.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * POST
 * Hard-save / upsert reflection.
 *
 * Body:
 * {
 *   studentId: string,
 *   week: number,
 *   prompt: string,
 *   response: string,
 *   submit?: boolean
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      studentId,
      week,
      prompt,
      response,
      submit = false,
    } = body;

    if (!validStudentId(studentId)) {
      return NextResponse.json(
        {
          error: "Valid studentId is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!validWeek(week)) {
      return NextResponse.json(
        {
          error:
            "week must be an integer between 1 and 16.",
        },
        {
          status: 400,
        }
      );
    }

    if (typeof prompt !== "string") {
      return NextResponse.json(
        {
          error: "prompt must be a string.",
        },
        {
          status: 400,
        }
      );
    }

    if (typeof response !== "string") {
      return NextResponse.json(
        {
          error: "response must be a string.",
        },
        {
          status: 400,
        }
      );
    }

    const access =
      await authorizeStudentAccess(studentId);

    if (!access.allowed) {
      return NextResponse.json(
        {
          error: access.reason,
        },
        {
          status: access.status,
        }
      );
    }

    /*
     * Students may save their own reflections.
     * Staff with authorized student access may also
     * retrieve them, but we prevent staff from writing
     * student reflection content here.
     */
    if (
      access.session.role !== "STUDENT" &&
      access.session.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        {
          error:
            "Only the student may write this reflection.",
        },
        {
          status: 403,
        }
      );
    }

    const lesson =
      await getAmbassadorLesson(week);

    if (!lesson) {
      return NextResponse.json(
        {
          error:
            "Ambassador lesson not found.",
        },
        {
          status: 404,
        }
      );
    }

    const cleanPrompt = prompt.trim();
    const cleanResponse = response.trim();

    const existingReflection =
      await prisma.reflection.findFirst({
        where: {
          lessonId: lesson.id,
          studentId,
        },
        select: {
          id: true,
        },
      });

    const reflection =
      existingReflection
        ? await prisma.reflection.update({
            where: {
              id: existingReflection.id,
            },
            data: {
              prompt: cleanPrompt,
              response: cleanResponse,
              status: submit
                ? "SUBMITTED"
                : "DRAFT",
              submittedAt: submit
                ? new Date()
                : null,
            },
            select: {
              id: true,
              lessonId: true,
              studentId: true,
              prompt: true,
              response: true,
              status: true,
              submittedAt: true,
              createdAt: true,
              updatedAt: true,
            },
          })
        : await prisma.reflection.create({
            data: {
              lessonId: lesson.id,
              studentId,
              prompt: cleanPrompt,
              response: cleanResponse,
              status: submit
                ? "SUBMITTED"
                : "DRAFT",
              submittedAt: submit
                ? new Date()
                : null,
            },
            select: {
              id: true,
              lessonId: true,
              studentId: true,
              prompt: true,
              response: true,
              status: true,
              submittedAt: true,
              createdAt: true,
              updatedAt: true,
            },
          });

    return NextResponse.json({
      saved: true,
      lesson: {
        id: lesson.id,
        week: lesson.weekNumber,
        title: lesson.title,
      },
      reflection,
    });
  } catch (error) {
    console.error(
      "POST /api/student/reflections failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to save reflection.",
      },
      {
        status: 500,
      }
    );
  }
}
