import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { sendMissingWorkEmail } from "@/lib/ambassador/accountability-email";
import {
  getStudentAccountability,
  isSubmissionComplete,
} from "@/lib/ambassador/student-accountability";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LocalMode = "friday" | "monday" | "none";

function easternClock(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );

  return {
    weekday: parts.weekday ?? "",
    hour: Number(parts.hour ?? "0"),
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
  };
}

function priorFriday(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - 3);
  return date.toISOString().slice(0, 10);
}

function parseAssignmentIds(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return [] as string[];
  }

  const value = (metadata as { assignmentIds?: unknown }).assignmentIds;

  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function deterministicAuditId(
  kind: "friday-reminder" | "monday-deduction",
  studentId: string,
  dateKey: string,
) {
  const digest = createHash("sha256")
    .update(`${kind}:${studentId}:${dateKey}`)
    .digest("hex")
    .slice(0, 32);

  return `acct_${kind === "friday-reminder" ? "fri" : "mon"}_${digest}`;
}

function isUniqueViolation(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: unknown }).code === "P2002",
  );
}

function getMode(request: NextRequest): {
  mode: LocalMode;
  dateKey: string;
  forced: boolean;
} {
  const force = request.nextUrl.searchParams.get("mode");
  const clock = easternClock();

  if (
    process.env.NODE_ENV !== "production" &&
    (force === "friday" || force === "monday")
  ) {
    return {
      mode: force,
      dateKey: clock.dateKey,
      forced: true,
    };
  }

  if (clock.hour !== 8) {
    return {
      mode: "none",
      dateKey: clock.dateKey,
      forced: false,
    };
  }

  if (clock.weekday === "Friday") {
    return {
      mode: "friday",
      dateKey: clock.dateKey,
      forced: false,
    };
  }

  if (clock.weekday === "Monday") {
    return {
      mode: "monday",
      dateKey: clock.dateKey,
      forced: false,
    };
  }

  return {
    mode: "none",
    dateKey: clock.dateKey,
    forced: false,
  };
}

function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();

  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function accountabilityCohortCodes() {
  return (process.env.ACCOUNTABILITY_COHORT_CODES ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

async function loadStudents() {
  const cohortCodes = accountabilityCohortCodes();

  if (cohortCodes.length === 0) {
    return [];
  }

  return prisma.student.findMany({
    where: {
      deletedAt: null,
      user: {
        status: "ACTIVE",
        deletedAt: null,
      },
      enrollments: {
        some: {
          status: "ACTIVE",
          cohort: {
            status: "ACTIVE",
            deletedAt: null,
            code: {
              in: cohortCodes,
            },
          },
        },
      },
    },
    select: {
      id: true,
      userId: true,
      user: {
        select: {
          email: true,
          firstName: true,
        },
      },
      enrollments: {
        where: {
          status: "ACTIVE",
          cohort: {
            status: "ACTIVE",
            deletedAt: null,
            code: {
              in: cohortCodes,
            },
          },
        },
        select: {
          cohortId: true,
        },
      },
    },
  });
}

async function fridayRun(dateKey: string) {
  const students = await loadStudents();
  let reminders = 0;
  let emailsSent = 0;
  let emailFailures = 0;

  for (const student of students) {
    const allPending = [];

    for (const enrollment of student.enrollments) {
      const accountability = await getStudentAccountability(
        student.id,
        enrollment.cohortId,
      );

      const now = Date.now();
      const dueOrUndated = accountability.pendingAssignments.filter((item) => {
        if (!item.dueAt) {
          return true;
        }

        return new Date(item.dueAt).getTime() <= now;
      });

      allPending.push(...dueOrUndated);
    }

    const uniquePending = Array.from(
      new Map(allPending.map((item) => [item.id, item])).values(),
    );

    if (uniquePending.length === 0) {
      continue;
    }

    const action = `STUDENT_MISSING_WORK_FRIDAY_REMINDER:${dateKey}`;
    const claimId = deterministicAuditId(
      "friday-reminder",
      student.id,
      dateKey,
    );

    try {
      await prisma.auditLog.create({
        data: {
          id: claimId,
          action: `STUDENT_MISSING_WORK_FRIDAY_CLAIM:${dateKey}`,
          entityType: "Student",
          entityId: student.id,
          metadata: {
            dateKey,
            assignmentIds: uniquePending.map((item) => item.id),
            emailSent: false,
            pointsAtRisk: 0,
            state: "CLAIMED",
          },
        },
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        continue;
      }

      throw error;
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "")
      .trim()
      .replace(/\/$/, "");
    const actionUrl = appUrl
      ? `${appUrl}/ambassador/student-portal/${student.id}/assignments`
      : `/ambassador/student-portal/${student.id}/assignments`;

    const email = await sendMissingWorkEmail({
      to: student.user.email,
      firstName: student.user.firstName || "Student",
      items: uniquePending.map((item) => ({
        title: item.title,
        weekNumber: item.weekNumber,
        dayNumber: item.dayNumber,
      })),
      actionUrl,
    });

    await prisma.notification.create({
      data: {
        userId: student.userId,
        type: "ACCOUNTABILITY",
        title: "Required work is still incomplete",
        message: `${uniquePending.length} required ${
          uniquePending.length === 1 ? "assignment is" : "assignments are"
        } incomplete. Complete and submit the work before Monday to avoid a 30 participation-point deduction.`,
        actionUrl: `/ambassador/student-portal/${student.id}/assignments`,
      },
    });

    if (email.sent) {
      await prisma.auditLog.update({
        where: {
          id: claimId,
        },
        data: {
          action,
          metadata: {
            dateKey,
            assignmentIds: uniquePending.map((item) => item.id),
            items: uniquePending.map((item) => ({
              assignmentId: item.id,
              weekNumber: item.weekNumber,
              dayNumber: item.dayNumber,
              title: item.title,
            })),
            pointsAtRisk: 30,
            emailSent: true,
            state: "SENT",
          },
        },
      });

      reminders += 1;
      emailsSent += 1;
    } else {
      await prisma.auditLog.update({
        where: {
          id: claimId,
        },
        data: {
          action: `STUDENT_MISSING_WORK_FRIDAY_EMAIL_FAILED:${dateKey}`,
          metadata: {
            dateKey,
            assignmentIds: uniquePending.map((item) => item.id),
            emailSent: false,
            emailError: email.error,
            pointsAtRisk: 0,
            state: "FAILED",
            note:
              "Friday email did not send, so this run does not create the penalty-eligible Friday reminder snapshot.",
          },
        },
      });

      emailFailures += 1;
    }
  }

  return {
    reminders,
    emailsSent,
    emailFailures,
  };
}

async function mondayRun(dateKey: string) {
  const fridayKey = priorFriday(dateKey);
  const students = await loadStudents();
  let deductions = 0;

  for (const student of students) {
    const fridayAction = `STUDENT_MISSING_WORK_FRIDAY_REMINDER:${fridayKey}`;
    const reminder = await prisma.auditLog.findFirst({
      where: {
        action: fridayAction,
        entityType: "Student",
        entityId: student.id,
      },
      select: {
        metadata: true,
      },
    });

    if (!reminder) {
      continue;
    }

    const assignmentIds = parseAssignmentIds(reminder.metadata);

    if (assignmentIds.length === 0) {
      continue;
    }

    const cohortIds = student.enrollments.map((enrollment) => enrollment.cohortId);

    if (cohortIds.length === 0) {
      continue;
    }

    const releasedLessons = await prisma.lesson.findMany({
      where: {
        status: "ACTIVE",
        weekNumber: {
          not: 15,
        },
        deliverySettings: {
          some: {
            cohortId: {
              in: cohortIds,
            },
            releasedToStudents: true,
          },
        },
      },
      select: {
        id: true,
      },
    });

    const releasedLessonIds = releasedLessons.map((lesson) => lesson.id);

    if (releasedLessonIds.length === 0) {
      continue;
    }

    const activeAssignments = await prisma.assignment.findMany({
      where: {
        id: {
          in: assignmentIds,
        },
        lessonId: {
          in: releasedLessonIds,
        },
        status: "ACTIVE",
        requirement: "REQUIRED",
        OR: [
          {
            cohortId: {
              in: cohortIds,
            },
          },
          {
            cohortId: null,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    const activeIds = new Set(activeAssignments.map((item) => item.id));

    const submissions = await prisma.assignmentSubmission.findMany({
      where: {
        studentId: student.id,
        assignmentId: {
          in: assignmentIds,
        },
      },
      select: {
        assignmentId: true,
        status: true,
      },
    });

    const statusByAssignment = new Map(
      submissions.map((submission) => [
        submission.assignmentId,
        submission.status,
      ]),
    );

    const stillIncomplete = assignmentIds.filter(
      (assignmentId) =>
        activeIds.has(assignmentId) &&
        !isSubmissionComplete(statusByAssignment.get(assignmentId)),
    );

    if (stillIncomplete.length === 0) {
      continue;
    }

    const deductionAction = `PARTICIPATION_POINTS_DEDUCTED:${dateKey}`;
    const existingDeduction = await prisma.auditLog.findFirst({
      where: {
        action: deductionAction,
        entityType: "Student",
        entityId: student.id,
      },
      select: {
        id: true,
      },
    });

    if (existingDeduction) {
      continue;
    }

    const deductionId = deterministicAuditId(
      "monday-deduction",
      student.id,
      dateKey,
    );

    try {
      await prisma.$transaction(async (tx) => {
        await tx.auditLog.create({
          data: {
            id: deductionId,
            action: deductionAction,
            entityType: "Student",
            entityId: student.id,
            metadata: {
              dateKey,
              fridayReminderDate: fridayKey,
              pointsDelta: -30,
              reason: "Required work remained incomplete after Friday reminder.",
              incompleteAssignmentIds: stillIncomplete,
            },
          },
        });

        await tx.notification.create({
          data: {
            userId: student.userId,
            type: "ACCOUNTABILITY",
            title: "30 participation points deducted",
            message:
              "Required work from your Friday reminder was still incomplete Monday. 30 participation points were deducted. Complete the missing work now so your academic record is current.",
            actionUrl: `/ambassador/student-portal/${student.id}/assignments`,
          },
        });
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        continue;
      }

      throw error;
    }

    deductions += 1;
  }

  return {
    fridayReminderDate: fridayKey,
    deductions,
  };
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json(
      {
        error: "Unauthorized accountability run.",
      },
      {
        status: 401,
      },
    );
  }

  const run = getMode(request);

  if (run.mode === "none") {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason:
        "Accountability processing only runs at 8:00 AM America/New_York on Friday or Monday.",
      dateKey: run.dateKey,
    });
  }

  const cohortCodes = accountabilityCohortCodes();

  if (cohortCodes.length === 0) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      configured: false,
      reason:
        "ACCOUNTABILITY_COHORT_CODES is not configured, so no student emails or point deductions were processed.",
      dateKey: run.dateKey,
    });
  }

  if (run.mode === "friday") {
    const result = await fridayRun(run.dateKey);

    return NextResponse.json({
      ok: true,
      mode: "friday",
      forced: run.forced,
      dateKey: run.dateKey,
      ...result,
    });
  }

  const result = await mondayRun(run.dateKey);

  return NextResponse.json({
    ok: true,
    mode: "monday",
    forced: run.forced,
    dateKey: run.dateKey,
    ...result,
  });
}
