import { prisma } from "@/lib/prisma";

const COMPLETE_STATUSES = new Set(["SUBMITTED", "APPROVED"]);

export type StudentAccountabilityAssignment = {
  id: string;
  lessonId: string;
  weekNumber: number;
  weekTitle: string;
  dayNumber: number | null;
  title: string;
  dueAt: string | null;
  status: string | null;
  submittedAt: string | null;
  complete: boolean;
};

export type StudentAccountabilityDay = {
  dayNumber: number | null;
  label: string;
  hasRequiredWork: boolean;
  complete: boolean;
  assignments: StudentAccountabilityAssignment[];
};

export type StudentAccountabilityWeek = {
  lessonId: string;
  weekNumber: number;
  title: string;
  hasRequiredWork: boolean;
  complete: boolean;
  days: StudentAccountabilityDay[];
};

function metadataPointsDelta(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return 0;
  }

  const value = (metadata as { pointsDelta?: unknown }).pointsDelta;
  return typeof value === "number" ? value : 0;
}

export function isSubmissionComplete(status: string | null | undefined) {
  return Boolean(status && COMPLETE_STATUSES.has(status));
}

export async function getStudentAccountability(
  studentId: string,
  cohortId: string,
) {
  const cohort = await prisma.cohort.findUnique({
    where: {
      id: cohortId,
    },
    select: {
      programId: true,
    },
  });

  if (!cohort) {
    return {
      assignments: [] as StudentAccountabilityAssignment[],
      pendingAssignments: [] as StudentAccountabilityAssignment[],
      weeks: [] as StudentAccountabilityWeek[],
      participationPointsLost: 0,
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

  const lessonIds = lessons.map((lesson) => lesson.id);

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
              {
                cohortId,
              },
              {
                cohortId: null,
              },
            ],
          },
          orderBy: [
            {
              dayNumber: "asc",
            },
            {
              createdAt: "asc",
            },
          ],
          select: {
            id: true,
            lessonId: true,
            title: true,
            dayNumber: true,
            dueAt: true,
            submissions: {
              where: {
                studentId,
              },
              take: 1,
              select: {
                status: true,
                submittedAt: true,
              },
            },
          },
        });

  const lessonById = new Map(
    lessons.map((lesson) => [lesson.id, lesson] as const),
  );

  const assignments =
    assignmentRecords.flatMap<StudentAccountabilityAssignment>((assignment) => {
      const lesson = lessonById.get(assignment.lessonId);

      if (!lesson) {
        return [];
      }

      const submission = assignment.submissions[0] ?? null;
      const status = submission?.status ?? null;

      return [
        {
          id: assignment.id,
          lessonId: assignment.lessonId,
          weekNumber: lesson.weekNumber,
          weekTitle: lesson.title,
          dayNumber: assignment.dayNumber,
          title: assignment.title,
          dueAt: assignment.dueAt?.toISOString() ?? null,
          status,
          submittedAt: submission?.submittedAt?.toISOString() ?? null,
          complete: isSubmissionComplete(status),
        },
      ];
    });

  const assignmentsByLesson = new Map<
    string,
    StudentAccountabilityAssignment[]
  >();

  for (const assignment of assignments) {
    const current = assignmentsByLesson.get(assignment.lessonId) ?? [];
    current.push(assignment);
    assignmentsByLesson.set(assignment.lessonId, current);
  }

  const weeks: StudentAccountabilityWeek[] = lessons.map((lesson) => {
    const weekAssignments = assignmentsByLesson.get(lesson.id) ?? [];
    const byDay = new Map<number | null, StudentAccountabilityAssignment[]>();

    for (const assignment of weekAssignments) {
      const dayNumber = assignment.dayNumber ?? null;
      const current = byDay.get(dayNumber) ?? [];
      current.push(assignment);
      byDay.set(dayNumber, current);
    }

    const numberedDays: StudentAccountabilityDay[] = [1, 2, 3, 4, 5].map(
      (dayNumber) => {
        const dayAssignments = byDay.get(dayNumber) ?? [];

        return {
          dayNumber,
          label: `Day ${dayNumber}`,
          hasRequiredWork: dayAssignments.length > 0,
          complete:
            dayAssignments.length === 0 ||
            dayAssignments.every((assignment) => assignment.complete),
          assignments: dayAssignments,
        };
      },
    );

    const weekAssignmentsWithoutDay = byDay.get(null) ?? [];
    const weekWork: StudentAccountabilityDay[] =
      weekAssignmentsWithoutDay.length > 0
        ? [
            {
              dayNumber: null,
              label: "Week Work",
              hasRequiredWork: true,
              complete: weekAssignmentsWithoutDay.every(
                (assignment) => assignment.complete,
              ),
              assignments: weekAssignmentsWithoutDay,
            },
          ]
        : [];

    const days = [...numberedDays, ...weekWork];

    return {
      lessonId: lesson.id,
      weekNumber: lesson.weekNumber,
      title: lesson.title,
      hasRequiredWork: weekAssignments.length > 0,
      complete:
        weekAssignments.length === 0 ||
        weekAssignments.every((assignment) => assignment.complete),
      days,
    };
  });

  const pointAdjustments = await prisma.auditLog.findMany({
    where: {
      entityType: "Student",
      entityId: studentId,
      action: {
        startsWith: "PARTICIPATION_POINTS_DEDUCTED:",
      },
    },
    select: {
      metadata: true,
    },
  });

  const participationPointsLost = Math.abs(
    pointAdjustments.reduce(
      (total, item) => total + Math.min(0, metadataPointsDelta(item.metadata)),
      0,
    ),
  );

  return {
    assignments,
    pendingAssignments: assignments.filter(
      (assignment) => !assignment.complete,
    ),
    weeks,
    participationPointsLost,
  };
}
