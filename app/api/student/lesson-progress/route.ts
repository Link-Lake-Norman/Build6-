import {
  NextRequest,
  NextResponse,
} from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

async function getStudentLesson(
  studentId: string,
  week: number
) {
  const enrollment =
    await prisma.enrollment.findFirst({
      where: {
        studentId,
        status: "ACTIVE",
      },
      select: {
        cohortId: true,
        cohort: {
          select: {
            id: true,
            program: {
              select: {
                id: true,
                name: true,
                totalWeeks: true,
              },
            },
          },
        },
      },
      orderBy: {
        enrolledAt: "desc",
      },
    });

  if (!enrollment) {
    return null;
  }

  const lesson =
    await prisma.lesson.findFirst({
      where: {
        weekNumber: week,
        status: "ACTIVE",
        module: {
          programId:
            enrollment.cohort.program.id,
        },
      },
      select: {
        id: true,
        title: true,
        weekNumber: true,
        module: {
          select: {
            programId: true,
          },
        },
        deliverySettings: {
          where: {
            cohortId: enrollment.cohortId,
          },
          select: {
            releasedToStudents: true,
          },
        },
      },
    });

  if (!lesson) {
    return null;
  }

  return {
    lesson,
    cohortId: enrollment.cohortId,
    program: enrollment.cohort.program,
  };
}

async function getProgramProgress(
  studentId: string,
  programId: string,
  totalWeeks: number
) {
  const records =
    await prisma.lessonProgress.findMany({
      where: {
        studentId,
        lesson: {
          module: {
            programId,
          },
        },
      },
      select: {
        completedAt: true,
        percent: true,
      },
    });

  const completed =
    records.filter(
      (record) =>
        Boolean(record.completedAt) ||
        record.percent >= 100
    ).length;

  const progress =
    totalWeeks > 0
      ? Math.min(
          100,
          Math.round(
            (completed / totalWeeks) *
              100
          )
        )
      : 0;

  return {
    completed,
    progress,
  };
}

export async function GET(
  request: NextRequest
) {
  try {
    const session =
      await getSessionUser();

    if (
      !session ||
      session.role !== "STUDENT" ||
      !session.studentId
    ) {
      return NextResponse.json(
        {
          error:
            "Student authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    const week = Number(
      request.nextUrl.searchParams.get(
        "week"
      )
    );

    if (
      !Number.isInteger(week) ||
      week < 1
    ) {
      return NextResponse.json(
        {
          error:
            "A valid week is required.",
        },
        {
          status: 400,
        }
      );
    }

    const context =
      await getStudentLesson(
        session.studentId,
        week
      );

    if (!context) {
      return NextResponse.json(
        {
          error:
            "Lesson not found in the student's active program.",
        },
        {
          status: 404,
        }
      );
    }

    const released =
      context.lesson.deliverySettings
        .some(
          (setting) =>
            setting.releasedToStudents
        );

    if (!released) {
      return NextResponse.json(
        {
          error:
            "This lesson has not been released to students.",
        },
        {
          status: 403,
        }
      );
    }

    const lessonProgress =
      await prisma.lessonProgress.findUnique({
        where: {
          lessonId_studentId: {
            lessonId:
              context.lesson.id,
            studentId:
              session.studentId,
          },
        },
        select: {
          id: true,
          percent: true,
          startedAt: true,
          completedAt: true,
          updatedAt: true,
        },
      });

    const programProgress =
      await getProgramProgress(
        session.studentId,
        context.program.id,
        context.program.totalWeeks
      );

    return NextResponse.json({
      studentId: session.studentId,

      program: {
        id: context.program.id,
        name: context.program.name,
        totalWeeks:
          context.program.totalWeeks,
      },

      lesson: {
        id: context.lesson.id,
        title: context.lesson.title,
        week:
          context.lesson.weekNumber,
      },

      progress: {
        isComplete:
          Boolean(
            lessonProgress?.completedAt
          ) ||
          (lessonProgress?.percent ??
            0) >= 100,

        percent:
          lessonProgress?.percent ??
          0,

        completedAt:
          lessonProgress?.completedAt ??
          null,

        updatedAt:
          lessonProgress?.updatedAt ??
          null,
      },

      programProgress,
    });
  } catch (error) {
    console.error(
      "GET /api/student/lesson-progress failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load lesson progress.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const session =
      await getSessionUser();

    if (
      !session ||
      session.role !== "STUDENT" ||
      !session.studentId
    ) {
      return NextResponse.json(
        {
          error:
            "Student authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const week =
      Number(body.week);

    const complete =
      body.complete === true;

    if (
      !Number.isInteger(week) ||
      week < 1
    ) {
      return NextResponse.json(
        {
          error:
            "A valid week is required.",
        },
        {
          status: 400,
        }
      );
    }

    const context =
      await getStudentLesson(
        session.studentId,
        week
      );

    if (!context) {
      return NextResponse.json(
        {
          error:
            "Lesson not found in the student's active program.",
        },
        {
          status: 404,
        }
      );
    }

    const released =
      context.lesson.deliverySettings
        .some(
          (setting) =>
            setting.releasedToStudents
        );

    if (!released) {
      return NextResponse.json(
        {
          error:
            "This lesson has not been released to students.",
        },
        {
          status: 403,
        }
      );
    }

    const now =
      new Date();

    const existing =
      await prisma.lessonProgress.findUnique({
        where: {
          lessonId_studentId: {
            lessonId:
              context.lesson.id,
            studentId:
              session.studentId,
          },
        },
        select: {
          startedAt: true,
        },
      });

    const progressRecord =
      await prisma.lessonProgress.upsert({
        where: {
          lessonId_studentId: {
            lessonId:
              context.lesson.id,
            studentId:
              session.studentId,
          },
        },

        create: {
          lessonId:
            context.lesson.id,
          studentId:
            session.studentId,

          startedAt: now,

          completedAt:
            complete
              ? now
              : null,

          percent:
            complete
              ? 100
              : 0,
        },

        update: {
          startedAt:
            existing?.startedAt ??
            now,

          completedAt:
            complete
              ? now
              : null,

          percent:
            complete
              ? 100
              : 0,
        },

        select: {
          id: true,
          percent: true,
          startedAt: true,
          completedAt: true,
          updatedAt: true,
        },
      });

    const programProgress =
      await getProgramProgress(
        session.studentId,
        context.program.id,
        context.program.totalWeeks
      );

    return NextResponse.json({
      saved: true,

      studentId:
        session.studentId,

      lesson: {
        id: context.lesson.id,
        week:
          context.lesson.weekNumber,
        title:
          context.lesson.title,
      },

      progress: {
        isComplete:
          Boolean(
            progressRecord.completedAt
          ),

        percent:
          progressRecord.percent,

        completedAt:
          progressRecord.completedAt,

        updatedAt:
          progressRecord.updatedAt,
      },

      program: {
        id: context.program.id,
        name: context.program.name,
        totalWeeks:
          context.program.totalWeeks,
      },

      programProgress,
    });
  } catch (error) {
    console.error(
      "POST /api/student/lesson-progress failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to save lesson progress.",
      },
      {
        status: 500,
      }
    );
  }
}
