import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

function ambassadorToday() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year =
    parts.find((part) => part.type === "year")?.value ?? "";
  const month =
    parts.find((part) => part.type === "month")?.value ?? "";
  const day =
    parts.find((part) => part.type === "day")?.value ?? "";

  return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    if (
      session.role !== "FACILITATOR" &&
      session.role !== "SCHOOL_ADMIN" &&
      session.role !== "ORGANIZATION_ADMIN" &&
      session.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { error: "You do not have permission to record attendance." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const studentId =
      typeof body.studentId === "string"
        ? body.studentId
        : "";

    const cohortId =
      typeof body.cohortId === "string"
        ? body.cohortId
        : "";

    const status =
      typeof body.status === "string"
        ? body.status
        : "";

    if (
      !studentId ||
      !cohortId ||
      !["PRESENT", "ABSENT", "LATE", "EXCUSED"].includes(status)
    ) {
      return NextResponse.json(
        { error: "Invalid attendance request." },
        { status: 400 }
      );
    }

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        studentId,
        cohortId,
        status: "ACTIVE",
      },
      select: {
        id: true,
        cohort: {
          select: {
            id: true,
            schoolId: true,
            organizationId: true,
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Student is not enrolled in this cohort." },
        { status: 404 }
      );
    }

    if (session.role === "FACILITATOR") {
      const facilitator = await prisma.facilitator.findUnique({
        where: {
          userId: session.id,
        },
        select: {
          cohorts: {
            where: {
              cohortId,
            },
            select: {
              cohortId: true,
            },
          },
        },
      });

      if (!facilitator || facilitator.cohorts.length === 0) {
        return NextResponse.json(
          { error: "You do not have access to this cohort." },
          { status: 403 }
        );
      }
    }

    if (
      session.role === "SCHOOL_ADMIN" &&
      session.schoolId &&
      enrollment.cohort.schoolId !== session.schoolId
    ) {
      return NextResponse.json(
        { error: "You do not have access to this school." },
        { status: 403 }
      );
    }

    if (
      session.role === "ORGANIZATION_ADMIN" &&
      session.organizationId &&
      enrollment.cohort.organizationId !== session.organizationId
    ) {
      return NextResponse.json(
        { error: "You do not have access to this organization." },
        { status: 403 }
      );
    }

    const date = ambassadorToday();

    const attendance = await prisma.attendanceRecord.upsert({
      where: {
        cohortId_studentId_date: {
          cohortId,
          studentId,
          date,
        },
      },
      update: {
        status: status as
          | "PRESENT"
          | "ABSENT"
          | "LATE"
          | "EXCUSED",
      },
      create: {
        cohortId,
        studentId,
        date,
        status: status as
          | "PRESENT"
          | "ABSENT"
          | "LATE"
          | "EXCUSED",
      },
      select: {
        id: true,
        cohortId: true,
        studentId: true,
        date: true,
        status: true,
      },
    });

    return NextResponse.json({
      success: true,
      attendance,
    });
  } catch (error) {
    console.error("Attendance save failed:", error);

    return NextResponse.json(
      { error: "Unable to save attendance." },
      { status: 500 }
    );
  }
}
