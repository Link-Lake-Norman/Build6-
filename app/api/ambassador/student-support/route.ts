import { NextRequest, NextResponse } from "next/server";

import { authorizeStudentAccess } from "@/lib/auth/student-access";
import {
  ACCESSIBILITY_DEFAULTS,
  getStudentAccessibilitySupport,
} from "@/lib/ambassador/student-accessibility";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STAFF_ROLES = new Set([
  "FACILITATOR",
  "SCHOOL_ADMIN",
  "ORGANIZATION_ADMIN",
  "SUPER_ADMIN",
]);

const PLAN_TYPES = new Set([
  "NONE",
  "SECTION_504",
  "IEP",
  "SERVICES_PLAN",
  "SCHOOL_ACCOMMODATION",
  "OTHER",
]);

const PREFERENCE_KEYS = [
  "readingMode",
  "focusMode",
  "largeText",
  "increasedSpacing",
  "highContrast",
  "reducedMotion",
  "highlightInstructions",
  "chunkInstructions",
] as const;

function preferenceData(
  body: Record<string, unknown>,
  current: Awaited<ReturnType<typeof getStudentAccessibilitySupport>>,
) {
  return {
    readingMode:
      typeof body.readingMode === "boolean"
        ? body.readingMode
        : current.readingMode,
    focusMode:
      typeof body.focusMode === "boolean"
        ? body.focusMode
        : current.focusMode,
    largeText:
      typeof body.largeText === "boolean"
        ? body.largeText
        : current.largeText,
    increasedSpacing:
      typeof body.increasedSpacing === "boolean"
        ? body.increasedSpacing
        : current.increasedSpacing,
    highContrast:
      typeof body.highContrast === "boolean"
        ? body.highContrast
        : current.highContrast,
    reducedMotion:
      typeof body.reducedMotion === "boolean"
        ? body.reducedMotion
        : current.reducedMotion,
    highlightInstructions:
      typeof body.highlightInstructions === "boolean"
        ? body.highlightInstructions
        : current.highlightInstructions,
    chunkInstructions:
      typeof body.chunkInstructions === "boolean"
        ? body.chunkInstructions
        : current.chunkInstructions,
  };
}

export async function GET(request: NextRequest) {
  const studentId =
    request.nextUrl.searchParams.get("studentId")?.trim() ?? "";

  if (!studentId) {
    return NextResponse.json(
      { error: "Student is required." },
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

  const support =
    await getStudentAccessibilitySupport(studentId);

  const preferences = {
    readingMode: support.readingMode,
    focusMode: support.focusMode,
    largeText: support.largeText,
    increasedSpacing: support.increasedSpacing,
    highContrast: support.highContrast,
    reducedMotion: support.reducedMotion,
    highlightInstructions: support.highlightInstructions,
    chunkInstructions: support.chunkInstructions,
  };

  if (access.session.role === "STUDENT") {
    return NextResponse.json({
      preferences,
      approvedSupports: {
        active: support.planActive,
        extendedDeadlineDays: support.planActive
          ? support.extendedDeadlineDays
          : 0,
        timeMultiplier: support.planActive
          ? support.timeMultiplier
          : 1,
        breaksAllowed:
          support.planActive && support.breaksAllowed,
        noTimedActivities:
          support.planActive && support.noTimedActivities,
        speechToText:
          support.planActive && support.speechToText,
        alternativeResponse:
          support.planActive && support.alternativeResponse,
      },
    });
  }

  const full =
    await prisma.studentAccessibilityProfile.findUnique({
      where: { studentId },
      select: {
        staffNotes: true,
        reviewedAt: true,
        reviewedById: true,
      },
    });

  return NextResponse.json({
    preferences,
    supportPlan: {
      planType: support.planType,
      planActive: support.planActive,
      extendedDeadlineDays: support.extendedDeadlineDays,
      timeMultiplier: support.timeMultiplier,
      breaksAllowed: support.breaksAllowed,
      noTimedActivities: support.noTimedActivities,
      speechToText: support.speechToText,
      alternativeResponse: support.alternativeResponse,
      staffNotes: full?.staffNotes ?? "",
      reviewedAt: full?.reviewedAt?.toISOString() ?? null,
      reviewedById: full?.reviewedById ?? null,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as Record<string, unknown>;

  const studentId =
    typeof body.studentId === "string"
      ? body.studentId.trim()
      : "";

  if (!studentId) {
    return NextResponse.json(
      { error: "Student is required." },
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

  const current =
    await getStudentAccessibilitySupport(studentId);
  const preferences = preferenceData(body, current);

  if (access.session.role === "STUDENT") {
    await prisma.studentAccessibilityProfile.upsert({
      where: { studentId },
      update: preferences,
      create: {
        studentId,
        ...ACCESSIBILITY_DEFAULTS,
        ...preferences,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: access.session.id,
        organizationId:
          access.session.organizationId ?? null,
        action:
          "STUDENT_ACCESSIBILITY_PREFERENCES_UPDATED",
        entityType: "Student",
        entityId: studentId,
        metadata: {
          changedFields: [...PREFERENCE_KEYS],
        },
      },
    });

    return NextResponse.json({ saved: true });
  }

  if (!STAFF_ROLES.has(access.session.role)) {
    return NextResponse.json(
      { error: "This account cannot manage learning supports." },
      { status: 403 },
    );
  }

  const existing =
    await prisma.studentAccessibilityProfile.findUnique({
      where: { studentId },
      select: { staffNotes: true },
    });

  const requestedPlanType =
    typeof body.planType === "string" &&
    PLAN_TYPES.has(body.planType)
      ? body.planType
      : current.planType;

  const extendedDeadlineDays =
    typeof body.extendedDeadlineDays === "number" &&
    Number.isFinite(body.extendedDeadlineDays)
      ? Math.max(
          0,
          Math.min(
            30,
            Math.round(body.extendedDeadlineDays),
          ),
        )
      : current.extendedDeadlineDays;

  const timeMultiplier =
    typeof body.timeMultiplier === "number" &&
    Number.isFinite(body.timeMultiplier)
      ? Math.max(
          1,
          Math.min(3, body.timeMultiplier),
        )
      : current.timeMultiplier;

  const data = {
    ...preferences,
    planType: requestedPlanType as
      | "NONE"
      | "SECTION_504"
      | "IEP"
      | "SERVICES_PLAN"
      | "SCHOOL_ACCOMMODATION"
      | "OTHER",
    planActive:
      typeof body.planActive === "boolean"
        ? body.planActive
        : current.planActive,
    extendedDeadlineDays,
    timeMultiplier,
    breaksAllowed:
      typeof body.breaksAllowed === "boolean"
        ? body.breaksAllowed
        : current.breaksAllowed,
    noTimedActivities:
      typeof body.noTimedActivities === "boolean"
        ? body.noTimedActivities
        : current.noTimedActivities,
    speechToText:
      typeof body.speechToText === "boolean"
        ? body.speechToText
        : current.speechToText,
    alternativeResponse:
      typeof body.alternativeResponse === "boolean"
        ? body.alternativeResponse
        : current.alternativeResponse,
    staffNotes:
      typeof body.staffNotes === "string"
        ? body.staffNotes.slice(0, 4000)
        : existing?.staffNotes ?? null,
    reviewedAt: new Date(),
    reviewedById: access.session.id,
  };

  await prisma.studentAccessibilityProfile.upsert({
    where: { studentId },
    update: data,
    create: {
      studentId,
      ...ACCESSIBILITY_DEFAULTS,
      ...data,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: access.session.id,
      organizationId:
        access.session.organizationId ?? null,
      action:
        "STUDENT_LEARNING_SUPPORT_PLAN_UPDATED",
      entityType: "Student",
      entityId: studentId,
      metadata: {
        changedFields: [
          "planType",
          "planActive",
          "extendedDeadlineDays",
          "timeMultiplier",
          "breaksAllowed",
          "noTimedActivities",
          "speechToText",
          "alternativeResponse",
          "staffNotes",
        ],
        note:
          "Audit stores field names only. Private accommodation notes are not copied into the audit log.",
      },
    },
  });

  return NextResponse.json({ saved: true });
}
