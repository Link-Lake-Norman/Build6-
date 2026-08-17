import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { authorizeStudentAccess } from "@/lib/auth/student-access";

const CAPSTONE_TITLE =
  "Capstone Brainstorm — My Story Brain Map";

async function getAssignment(studentId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId,
      status: "ACTIVE",
    },
    select: {
      cohortId: true,
    },
  });

  const cohortIds = enrollments.map(
    (enrollment) => enrollment.cohortId
  );

  if (cohortIds.length === 0) {
    return null;
  }

  return prisma.assignment.findFirst({
    where: {
      title: CAPSTONE_TITLE,
      status: "ACTIVE",
      cohortId: {
        in: cohortIds,
      },
    },
    select: {
      id: true,
      title: true,
      cohortId: true,
      submissions: {
        where: {
          studentId,
        },
        select: {
          id: true,
          status: true,
          onlineResponse: true,
          createdAt: true,
          updatedAt: true,
          submittedAt: true,
        },
        take: 1,
      },
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const studentId =
      request.nextUrl.searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required." },
        { status: 400 }
      );
    }

    const access =
      await authorizeStudentAccess(studentId);

    if (!access.allowed) {
      return NextResponse.json(
        { error: access.reason },
        { status: access.status }
      );
    }

    const assignment =
      await getAssignment(studentId);

    if (!assignment) {
      return NextResponse.json({
        assignment: null,
        submission: null,
      });
    }

    return NextResponse.json({
      assignment: {
        id: assignment.id,
        title: assignment.title,
      },
      submission:
        assignment.submissions[0] ?? null,
    });
  } catch (error) {
    console.error(
      "Capstone brainstorm GET failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load Capstone brainstorm.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const studentId =
      typeof body.studentId === "string"
        ? body.studentId
        : "";

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required." },
        { status: 400 }
      );
    }

    const access =
      await authorizeStudentAccess(studentId);

    if (!access.allowed) {
      return NextResponse.json(
        { error: access.reason },
        { status: access.status }
      );
    }

    if (
      access.session.role !== "STUDENT" ||
      access.session.studentId !== studentId
    ) {
      return NextResponse.json(
        {
          error:
            "Only the student may edit this Capstone brainstorm.",
        },
        { status: 403 }
      );
    }

    const assignment =
      await getAssignment(studentId);

    if (!assignment) {
      return NextResponse.json(
        {
          error:
            "Capstone brainstorm assignment not found.",
        },
        { status: 404 }
      );
    }

    const feel =
      typeof body.feel === "string"
        ? body.feel.trim()
        : "";

    const words =
      typeof body.words === "string"
        ? body.words.trim()
        : "";

    const style =
      typeof body.style === "string"
        ? body.style.trim()
        : "";

    if (!feel && !words && !style) {
      return NextResponse.json(
        {
          error:
            "Add at least one brainstorm idea before saving.",
        },
        { status: 400 }
      );
    }

    const submission =
      await prisma.assignmentSubmission.upsert({
        where: {
          assignmentId_studentId: {
            assignmentId: assignment.id,
            studentId,
          },
        },
        update: {
          method: "ONLINE",
          status: "DRAFT",
          onlineResponse: {
            feel,
            words,
            style,
          },
        },
        create: {
          assignmentId: assignment.id,
          studentId,
          method: "ONLINE",
          status: "DRAFT",
          onlineResponse: {
            feel,
            words,
            style,
          },
          addToPortfolio: true,
        },
        select: {
          id: true,
          status: true,
          onlineResponse: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return NextResponse.json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error(
      "Capstone brainstorm POST failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to save Capstone brainstorm.",
      },
      { status: 500 }
    );
  }
}
