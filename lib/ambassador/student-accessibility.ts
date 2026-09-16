import { prisma } from "@/lib/prisma";

export const ACCESSIBILITY_DEFAULTS = {
  readingMode: false,
  focusMode: false,
  largeText: false,
  increasedSpacing: false,
  highContrast: false,
  reducedMotion: false,
  highlightInstructions: false,
  chunkInstructions: false,
  planType: "NONE" as const,
  planActive: false,
  extendedDeadlineDays: 0,
  timeMultiplier: 1,
  breaksAllowed: false,
  noTimedActivities: false,
  speechToText: false,
  alternativeResponse: false,
};

export type StudentAccessibilitySupport = {
  readingMode: boolean;
  focusMode: boolean;
  largeText: boolean;
  increasedSpacing: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  highlightInstructions: boolean;
  chunkInstructions: boolean;
  planType:
    | "NONE"
    | "SECTION_504"
    | "IEP"
    | "SERVICES_PLAN"
    | "SCHOOL_ACCOMMODATION"
    | "OTHER";
  planActive: boolean;
  extendedDeadlineDays: number;
  timeMultiplier: number;
  breaksAllowed: boolean;
  noTimedActivities: boolean;
  speechToText: boolean;
  alternativeResponse: boolean;
};

export async function getStudentAccessibilitySupport(
  studentId: string,
): Promise<StudentAccessibilitySupport> {
  const profile = await prisma.studentAccessibilityProfile.findUnique({
    where: { studentId },
  });

  if (!profile) {
    return { ...ACCESSIBILITY_DEFAULTS };
  }

  return {
    readingMode: profile.readingMode,
    focusMode: profile.focusMode,
    largeText: profile.largeText,
    increasedSpacing: profile.increasedSpacing,
    highContrast: profile.highContrast,
    reducedMotion: profile.reducedMotion,
    highlightInstructions: profile.highlightInstructions,
    chunkInstructions: profile.chunkInstructions,
    planType: profile.planType,
    planActive: profile.planActive,
    extendedDeadlineDays: Math.max(0, profile.extendedDeadlineDays),
    timeMultiplier: Math.max(1, Number(profile.timeMultiplier)),
    breaksAllowed: profile.breaksAllowed,
    noTimedActivities: profile.noTimedActivities,
    speechToText: profile.speechToText,
    alternativeResponse: profile.alternativeResponse,
  };
}

export function effectiveDueDate(
  dueAt: Date | null | undefined,
  support: Pick<
    StudentAccessibilitySupport,
    "planActive" | "extendedDeadlineDays"
  >,
) {
  if (!dueAt) {
    return null;
  }

  const adjusted = new Date(dueAt);

  if (support.planActive && support.extendedDeadlineDays > 0) {
    adjusted.setUTCDate(
      adjusted.getUTCDate() + support.extendedDeadlineDays,
    );
  }

  return adjusted;
}

export function effectiveEstimatedMinutes(
  baseMinutes: number,
  support: Pick<
    StudentAccessibilitySupport,
    "planActive" | "timeMultiplier" | "noTimedActivities"
  >,
) {
  if (!support.planActive) {
    return baseMinutes;
  }

  if (support.noTimedActivities) {
    return null;
  }

  return Math.ceil(
    baseMinutes * Math.max(1, support.timeMultiplier),
  );
}
