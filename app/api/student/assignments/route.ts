import { NextRequest, NextResponse } from "next/server";

import { authorizeStudentAccess } from "@/lib/auth/student-access";
import { effectiveDueDate, effectiveEstimatedMinutes, getStudentAccessibilitySupport } from "@/lib/ambassador/student-accessibility";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const studentId = request.nextUrl.searchParams.get("studentId")?.trim() ?? "";

  const lessonId = request.nextUrl.searchParams.get("lessonId")?.trim() ?? "";

  if (!studentId || !lessonId) {
    return NextResponse.json(
      { error: "Student and lesson are required." },
      { status: 400 },
    );
  }

  const access = await authorizeStudentAccess(studentId);

  if (!access.allowed) {
    return NextResponse.json(
      { error: "Student access denied." },
      { status: access.status },
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

  if (!enrollment) {
    return NextResponse.json({
      assignments: [],
    });
  }

  const assignments = await prisma.assignment.findMany({
    where: {
      lessonId,
      status: {
        in: ["ACTIVE", "ARCHIVED"],
      },
      OR: [
        {
          cohortId: enrollment.cohortId,
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
      status: true,
      title: true,
      instructions: true,
      estimatedMinutes: true,
      requirement: true,
      allowOnline: true,
      allowPrint: true,
      allowUpload: true,
      portfolioEligible: true,
      dueAt: true,
      dayNumber: true,
      submissions: {
        where: {
          studentId,
        },
        take: 1,
        select: {
          id: true,
          method: true,
          status: true,
          onlineResponse: true,
          studentNote: true,
          addToPortfolio: true,
          submittedAt: true,
          reviewedAt: true,
          feedback: true,
          updatedAt: true,
          files: {
            select: {
              id: true,
              fileName: true,
              filePath: true,
              mimeType: true,
              fileSize: true,
            },
          },
        },
      },
    },
  });

  const support =
    await getStudentAccessibilitySupport(studentId);

  const now = Date.now();

  /*
   * BUILD6_STUDENT_ASSIGNMENT_VISIBILITY_V1
   *
   * Student portal visibility only.
   *
   * ACTIVE assignments remain visible.
   * ARCHIVED assignments remain visible only when this student already
   * owns a submission record (DRAFT, SUBMITTED, APPROVED, revision, etc.).
   *
   * This hides obsolete/missing-assignment clutter without deleting,
   * modifying, or disconnecting any student work.
   */
  const visibleAssignments = assignments.filter(
    (assignment) =>
      assignment.status === "ACTIVE" || assignment.submissions.length > 0,
  );

  return NextResponse.json({
    assignments: visibleAssignments.map((assignment) => {
      const adjustedDueAt = effectiveDueDate(
        assignment.dueAt,
        support,
      );

      const submission = assignment.submissions[0] ?? null;
      const archivedFromPlanner = assignment.status === "ARCHIVED";
      const submittedAndLocked =
        submission?.status === "SUBMITTED" ||
        submission?.status === "APPROVED";

      return {
        ...assignment,
        archivedFromPlanner,
        stillLiveForStudent: true,
        readOnly: submittedAndLocked,
        preservationLabel: archivedFromPlanner
          ? submission?.status === "DRAFT"
            ? "Draft preserved — keep working and submit when ready."
            : submittedAndLocked
              ? "Submitted work preserved for portfolio/capstone history."
              : "Still available to complete and submit even though it is no longer in the facilitator active plan."
          : null,
        baseEstimatedMinutes:
          assignment.estimatedMinutes,
        effectiveEstimatedMinutes:
          effectiveEstimatedMinutes(
            assignment.estimatedMinutes,
            support,
          ),
        originalDueAt:
          assignment.dueAt?.toISOString() ?? null,
        dueAt:
          adjustedDueAt?.toISOString() ?? null,
        notDueYet: Boolean(
          adjustedDueAt &&
            adjustedDueAt.getTime() > now,
        ),
        submission,
        submissions: undefined,
      };
    }),
    approvedSupports: {
      active: support.planActive,
      extendedDeadlineDays:
        support.planActive
          ? support.extendedDeadlineDays
          : 0,
      timeMultiplier:
        support.planActive
          ? support.timeMultiplier
          : 1,
      noTimedActivities:
        support.planActive &&
        support.noTimedActivities,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const studentId =
    typeof body.studentId === "string" ? body.studentId.trim() : "";

  const assignmentId =
    typeof body.assignmentId === "string" ? body.assignmentId.trim() : "";

  const action = body.action === "SUBMIT" ? "SUBMIT" : "SAVE";

  const responseText =
    typeof body.responseText === "string" ? body.responseText : "";

  const studentNote =
    typeof body.studentNote === "string" ? body.studentNote : "";

  if (!studentId || !assignmentId) {
    return NextResponse.json(
      { error: "Student and assignment are required." },
      { status: 400 },
    );
  }

  const access = await authorizeStudentAccess(studentId);

  if (!access.allowed) {
    return NextResponse.json(
      { error: "Student access denied." },
      { status: access.status },
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

  if (!enrollment) {
    return NextResponse.json(
      { error: "Active enrollment not found." },
      { status: 404 },
    );
  }

  const assignment = await prisma.assignment.findFirst({
    where: {
      id: assignmentId,
      status: {
        in: ["ACTIVE", "ARCHIVED"],
      },
      OR: [
        {
          cohortId: enrollment.cohortId,
        },
        {
          cohortId: null,
        },
      ],
    },
    select: {
      id: true,
      allowOnline: true,
      portfolioEligible: true,
    },
  });

  if (!assignment) {
    return NextResponse.json(
      { error: "Assignment not found." },
      { status: 404 },
    );
  }

  const status = action === "SUBMIT" ? "SUBMITTED" : "DRAFT";

  const submission = await prisma.assignmentSubmission.upsert({
    where: {
      assignmentId_studentId: {
        assignmentId,
        studentId,
      },
    },
    update: {
      method: assignment.allowOnline ? "ONLINE" : undefined,
      status,
      onlineResponse: assignment.allowOnline
        ? {
            response: responseText,
          }
        : undefined,
      studentNote,
      addToPortfolio: assignment.portfolioEligible,
      submittedAt: action === "SUBMIT" ? new Date() : null,
    },
    create: {
      assignmentId,
      studentId,
      method: assignment.allowOnline ? "ONLINE" : undefined,
      status,
      onlineResponse: assignment.allowOnline
        ? {
            response: responseText,
          }
        : undefined,
      studentNote,
      addToPortfolio: assignment.portfolioEligible,
      submittedAt: action === "SUBMIT" ? new Date() : null,
    },
    select: {
      id: true,
      status: true,
      submittedAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    success: true,
    submission,
  });
}
