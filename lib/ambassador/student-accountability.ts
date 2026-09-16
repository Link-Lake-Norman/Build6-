import {
  effectiveDueDate,
  getStudentAccessibilitySupport,
} from "@/lib/ambassador/student-accessibility";
import { prisma } from "@/lib/prisma";

const COMPLETE_STATUSES = new Set([
  "SUBMITTED",
  "APPROVED",
]);

export type StudentAccountabilityState =
  | "COMPLETE"
  | "MISSING"
  | "NOT_DUE"
  | "NO_WORK";

export type StudentAccountabilityAssignment = {
  id: string;
  lessonId: string;
  weekNumber: number;
  weekTitle: string;
  dayNumber: number | null;
  title: string;
  originalDueAt: string | null;
  dueAt: string | null;
  status: string | null;
  submittedAt: string | null;
  complete: boolean;
  notDueYet: boolean;
  state: Exclude<
    StudentAccountabilityState,
    "NO_WORK"
  >;
};

export type StudentAccountabilityDay = {
  dayNumber: number | null;
  label: string;
  hasRequiredWork: boolean;
  complete: boolean;
  notDueYet: boolean;
  state: StudentAccountabilityState;
  assignments: StudentAccountabilityAssignment[];
};

export type StudentAccountabilityWeek = {
  lessonId: string;
  weekNumber: number;
  title: string;
  hasRequiredWork: boolean;
  complete: boolean;
  notDueYet: boolean;
  state: StudentAccountabilityState;
  days: StudentAccountabilityDay[];
};

function metadataPointsDelta(metadata: unknown) {
  if (
    !metadata ||
    typeof metadata !== "object" ||
    Array.isArray(metadata)
  ) {
    return 0;
  }

  const value = (
    metadata as {
      pointsDelta?: unknown;
    }
  ).pointsDelta;

  return typeof value === "number" ? value : 0;
}

export function isSubmissionComplete(
  status: string | null | undefined,
) {
  return Boolean(
    status &&
      COMPLETE_STATUSES.has(status),
  );
}

function rollupState(
  assignments: StudentAccountabilityAssignment[],
): StudentAccountabilityState {
  if (assignments.length === 0) {
    return "NO_WORK";
  }

  if (
    assignments.every(
      (assignment) => assignment.complete,
    )
  ) {
    return "COMPLETE";
  }

  if (
    assignments.some(
      (assignment) =>
        assignment.state === "MISSING",
    )
  ) {
    return "MISSING";
  }

  return "NOT_DUE";
}

export async function getStudentAccountability(
  studentId: string,
  cohortId: string,
) {
  const [cohort, support] =
    await Promise.all([
      prisma.cohort.findUnique({
        where: { id: cohortId },
        select: { programId: true },
      }),
      getStudentAccessibilitySupport(studentId),
    ]);

  if (!cohort) {
    return {
      assignments:
        [] as StudentAccountabilityAssignment[],
      pendingAssignments:
        [] as StudentAccountabilityAssignment[],
      weeks: [] as StudentAccountabilityWeek[],
      participationPointsLost: 0,
      support,
    };
  }

  const lessons = await prisma.lesson.findMany({
    where: {
      module: {
        programId: cohort.programId,
      },
      status: "ACTIVE",
      weekNumber: {
        not: 15,
      },
      deliverySettings: {
        some: {
          cohortId,
          releasedToStudents: true,
        },
      },
    },
    orderBy: {
      weekNumber: "asc",
    },
    select: {
      id: true,
      title: true,
      weekNumber: true,
    },
  });

  const lessonIds =
    lessons.map((lesson) => lesson.id);

  const assignmentRecords =
    lessonIds.length === 0
      ? []
      : await prisma.assignment.findMany({
          where: {
            lessonId: {
              in: lessonIds,
            },
            status: "ACTIVE",
            requirement: "REQUIRED",
            OR: [
              { cohortId },
              { cohortId: null },
            ],
          },
          orderBy: [
            { dayNumber: "asc" },
            { createdAt: "asc" },
          ],
          select: {
            id: true,
            lessonId: true,
            title: true,
            dayNumber: true,
            dueAt: true,
            submissions: {
              where: { studentId },
              take: 1,
              select: {
                status: true,
                submittedAt: true,
              },
            },
          },
        });

  const lessonById = new Map(
    lessons.map(
      (lesson) =>
        [lesson.id, lesson] as const,
    ),
  );

  const now = new Date();

  const assignments: StudentAccountabilityAssignment[] = [];

  for (const assignment of assignmentRecords) {
    const lesson = lessonById.get(assignment.lessonId);

    if (!lesson) {
      continue;
    }

    const submission =
      assignment.submissions.length > 0
        ? assignment.submissions[0]
        : undefined;

    const status = submission?.status ?? null;
    const complete = isSubmissionComplete(status);
    const adjustedDueAt = effectiveDueDate(
      assignment.dueAt,
      support,
    );

    const notDueYet = Boolean(
      !complete &&
        adjustedDueAt &&
        adjustedDueAt.getTime() > now.getTime(),
    );

    assignments.push({
      id: assignment.id,
      lessonId: assignment.lessonId,
      weekNumber: lesson.weekNumber,
      weekTitle: lesson.title,
      dayNumber: assignment.dayNumber,
      title: assignment.title,
      originalDueAt:
        assignment.dueAt?.toISOString() ?? null,
      dueAt:
        adjustedDueAt?.toISOString() ?? null,
      status,
      submittedAt:
        submission?.submittedAt?.toISOString() ?? null,
      complete,
      notDueYet,
      state: complete
        ? "COMPLETE"
        : notDueYet
          ? "NOT_DUE"
          : "MISSING",
    });
  }

  const assignmentsByLesson = new Map<
    string,
    StudentAccountabilityAssignment[]
  >();

  for (const assignment of assignments) {
    const current =
      assignmentsByLesson.get(
        assignment.lessonId,
      ) ?? [];

    current.push(assignment);

    assignmentsByLesson.set(
      assignment.lessonId,
      current,
    );
  }

  const weeks:
    StudentAccountabilityWeek[] =
    lessons.map((lesson) => {
      const weekAssignments =
        assignmentsByLesson.get(
          lesson.id,
        ) ?? [];

      const byDay = new Map<
        number | null,
        StudentAccountabilityAssignment[]
      >();

      for (
        const assignment of weekAssignments
      ) {
        const dayNumber =
          assignment.dayNumber ?? null;

        const current =
          byDay.get(dayNumber) ?? [];

        current.push(assignment);

        byDay.set(
          dayNumber,
          current,
        );
      }

      const numberedDays:
        StudentAccountabilityDay[] =
        [1, 2, 3, 4, 5].map(
          (dayNumber) => {
            const dayAssignments =
              byDay.get(dayNumber) ?? [];

            const state =
              rollupState(dayAssignments);

            return {
              dayNumber,
              label: `Day ${dayNumber}`,
              hasRequiredWork:
                dayAssignments.length > 0,
              complete:
                state === "COMPLETE" ||
                state === "NO_WORK",
              notDueYet:
                state === "NOT_DUE",
              state,
              assignments: dayAssignments,
            };
          },
        );

      const noDay =
        byDay.get(null) ?? [];

      const weekWork:
        StudentAccountabilityDay[] =
        noDay.length > 0
          ? [
              {
                dayNumber: null,
                label: "Week Work",
                hasRequiredWork: true,
                complete:
                  rollupState(noDay) ===
                  "COMPLETE",
                notDueYet:
                  rollupState(noDay) ===
                  "NOT_DUE",
                state: rollupState(noDay),
                assignments: noDay,
              },
            ]
          : [];

      const state =
        rollupState(weekAssignments);

      return {
        lessonId: lesson.id,
        weekNumber: lesson.weekNumber,
        title: lesson.title,
        hasRequiredWork:
          weekAssignments.length > 0,
        complete:
          state === "COMPLETE" ||
          state === "NO_WORK",
        notDueYet:
          state === "NOT_DUE",
        state,
        days: [
          ...numberedDays,
          ...weekWork,
        ],
      };
    });

  const pointAdjustments =
    await prisma.auditLog.findMany({
      where: {
        entityType: "Student",
        entityId: studentId,
        action: {
          startsWith:
            "PARTICIPATION_POINTS_DEDUCTED:",
        },
      },
      select: {
        metadata: true,
      },
    });

  const participationPointsLost =
    Math.abs(
      pointAdjustments.reduce(
        (total, item) =>
          total +
          Math.min(
            0,
            metadataPointsDelta(
              item.metadata,
            ),
          ),
        0,
      ),
    );

  return {
    assignments,
    pendingAssignments:
      assignments.filter(
        (assignment) =>
          assignment.state ===
          "MISSING",
      ),
    weeks,
    participationPointsLost,
    support,
  };
}
