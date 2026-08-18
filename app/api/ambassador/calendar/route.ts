import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const STAFF_ROLES = new Set([
  "FACILITATOR",
  "SCHOOL_ADMIN",
  "ORGANIZATION_ADMIN",
  "SUPER_ADMIN",
]);

async function getCohortForSession(
  session: Awaited<ReturnType<typeof getSessionUser>>,
  cohortCode: string
) {
  if (!session) return null;

  if (session.role === "SUPER_ADMIN") {
    return prisma.cohort.findFirst({
      where: {
        code: cohortCode,
        status: "ACTIVE",
        deletedAt: null,
      },
    });
  }

  if (session.role === "FACILITATOR") {
    return prisma.cohort.findFirst({
      where: {
        code: cohortCode,
        status: "ACTIVE",
        deletedAt: null,
        facilitators: {
          some: {
            facilitator: {
              userId: session.id,
              deletedAt: null,
            },
          },
        },
      },
    });
  }

  if (session.role === "SCHOOL_ADMIN") {
    return prisma.cohort.findFirst({
      where: {
        code: cohortCode,
        status: "ACTIVE",
        deletedAt: null,
        ...(session.schoolId
          ? {
              schoolId: session.schoolId,
            }
          : {}),
      },
    });
  }

  if (session.role === "ORGANIZATION_ADMIN") {
    return prisma.cohort.findFirst({
      where: {
        code: cohortCode,
        status: "ACTIVE",
        deletedAt: null,
        ...(session.organizationId
          ? {
              organizationId: session.organizationId,
            }
          : {}),
      },
    });
  }

  if (session.role === "STUDENT" && session.studentId) {
    return prisma.cohort.findFirst({
      where: {
        code: cohortCode,
        status: "ACTIVE",
        deletedAt: null,
        enrollments: {
          some: {
            studentId: session.studentId,
            status: "ACTIVE",
          },
        },
      },
    });
  }

  return null;
}

function eventDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;

  const parsed = new Date(`${value.trim()}T12:00:00.000Z`);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function GET(request: NextRequest) {
  const session = await getSessionUser();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const cohortCode =
    request.nextUrl.searchParams.get("cohortCode")?.trim().toUpperCase() ??
    "PILOT-2026-2027";

  const month = request.nextUrl.searchParams.get("month") ?? "";

  const cohort = await getCohortForSession(session, cohortCode);

  if (!cohort) {
    return NextResponse.json(
      { error: "Calendar access denied." },
      { status: 403 }
    );
  }

  const [yearText, monthText] = month.split("-");
  const year = Number(yearText);
  const monthNumber = Number(monthText);

  const validMonth =
    Number.isInteger(year) &&
    Number.isInteger(monthNumber) &&
    monthNumber >= 1 &&
    monthNumber <= 12;

  const start = validMonth
    ? new Date(Date.UTC(year, monthNumber - 1, 1))
    : undefined;

  const end = validMonth
    ? new Date(Date.UTC(year, monthNumber, 1))
    : undefined;

  const items = await prisma.cohortExperience.findMany({
    where: {
      cohortId: cohort.id,
      status: {
        not: "CANCELLED",
      },
      ...(session.role === "STUDENT"
        ? {
            visibleToStudent: true,
          }
        : {}),
      ...(start && end
        ? {
            eventDate: {
              gte: start,
              lt: end,
            },
          }
        : {}),
    },
    orderBy: [
      {
        eventDate: "asc",
      },
      {
        weekNumber: "asc",
      },
      {
        dayNumber: "asc",
      },
    ],
    select: {
      id: true,
      weekNumber: true,
      dayNumber: true,
      experienceType: true,
      title: true,
      description: true,
      eventDate: true,
      startTime: true,
      endTime: true,
      siteName: true,
      preTripPreparation: true,
      studentVisibleNotes: true,
      visibleToStudent: true,
      status: true,
    },
  });

  return NextResponse.json({
    items: items.map((item) => ({
      ...item,
      eventDate: item.eventDate?.toISOString() ?? null,
    })),
  });
}

export async function POST(request: NextRequest) {
  const session = await getSessionUser();

  if (!session || !STAFF_ROLES.has(session.role)) {
    return NextResponse.json(
      { error: "Calendar editing access required." },
      { status: 403 }
    );
  }

  const body = await request.json();

  const cohortCode =
    typeof body.cohortCode === "string"
      ? body.cohortCode.trim().toUpperCase()
      : "PILOT-2026-2027";

  const cohort = await getCohortForSession(session, cohortCode);

  if (!cohort) {
    return NextResponse.json(
      { error: "You do not have access to this cohort." },
      { status: 403 }
    );
  }

  const title =
    typeof body.title === "string" ? body.title.trim() : "";

  const date = eventDate(body.eventDate);

  if (!title || !date) {
    return NextResponse.json(
      { error: "Title and date are required." },
      { status: 400 }
    );
  }

  const item = await prisma.cohortExperience.create({
    data: {
      cohortId: cohort.id,
      weekNumber:
        Number.isInteger(body.weekNumber) && body.weekNumber >= 1
          ? Math.min(body.weekNumber, 16)
          : 1,
      dayNumber:
        Number.isInteger(body.dayNumber) && body.dayNumber >= 1
          ? Math.min(body.dayNumber, 5)
          : 1,
      experienceType:
        typeof body.experienceType === "string"
          ? body.experienceType
          : "CLASS_EVENT",
      title,
      description:
        typeof body.description === "string" && body.description.trim()
          ? body.description.trim()
          : null,
      eventDate: date,
      startTime:
        typeof body.startTime === "string" && body.startTime
          ? body.startTime
          : null,
      endTime:
        typeof body.endTime === "string" && body.endTime
          ? body.endTime
          : null,
      siteName:
        typeof body.siteName === "string" && body.siteName.trim()
          ? body.siteName.trim()
          : null,
      preTripPreparation:
        typeof body.preTripPreparation === "string" &&
        body.preTripPreparation.trim()
          ? body.preTripPreparation.trim()
          : null,
      studentVisibleNotes:
        typeof body.studentVisibleNotes === "string" &&
        body.studentVisibleNotes.trim()
          ? body.studentVisibleNotes.trim()
          : null,
      visibleToStudent: body.visibleToStudent !== false,
      status: "PLANNED",
      createdById: session.id,
    },
  });

  return NextResponse.json({ item });
}

export async function PATCH(request: NextRequest) {
  const session = await getSessionUser();

  if (!session || !STAFF_ROLES.has(session.role)) {
    return NextResponse.json(
      { error: "Calendar editing access required." },
      { status: 403 }
    );
  }

  const body = await request.json();

  const id = typeof body.id === "string" ? body.id.trim() : "";

  if (!id) {
    return NextResponse.json(
      { error: "Calendar item id is required." },
      { status: 400 }
    );
  }

  const existing = await prisma.cohortExperience.findUnique({
    where: {
      id,
    },
    include: {
      cohort: true,
    },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Calendar item not found." },
      { status: 404 }
    );
  }

  const cohort = await getCohortForSession(
    session,
    existing.cohort.code
  );

  if (!cohort || cohort.id !== existing.cohortId) {
    return NextResponse.json(
      { error: "You do not have permission to edit this item." },
      { status: 403 }
    );
  }

  const date = eventDate(body.eventDate);

  const item = await prisma.cohortExperience.update({
    where: {
      id,
    },
    data: {
      title:
        typeof body.title === "string" && body.title.trim()
          ? body.title.trim()
          : existing.title,
      eventDate: date ?? existing.eventDate,
      weekNumber:
        Number.isInteger(body.weekNumber) && body.weekNumber >= 1
          ? Math.min(body.weekNumber, 16)
          : existing.weekNumber,
      dayNumber:
        Number.isInteger(body.dayNumber) && body.dayNumber >= 1
          ? Math.min(body.dayNumber, 5)
          : existing.dayNumber,
      experienceType:
        typeof body.experienceType === "string"
          ? body.experienceType
          : existing.experienceType,
      description:
        typeof body.description === "string"
          ? body.description.trim() || null
          : existing.description,
      startTime:
        typeof body.startTime === "string"
          ? body.startTime || null
          : existing.startTime,
      endTime:
        typeof body.endTime === "string"
          ? body.endTime || null
          : existing.endTime,
      siteName:
        typeof body.siteName === "string"
          ? body.siteName.trim() || null
          : existing.siteName,
      preTripPreparation:
        typeof body.preTripPreparation === "string"
          ? body.preTripPreparation.trim() || null
          : existing.preTripPreparation,
      studentVisibleNotes:
        typeof body.studentVisibleNotes === "string"
          ? body.studentVisibleNotes.trim() || null
          : existing.studentVisibleNotes,
      visibleToStudent:
        typeof body.visibleToStudent === "boolean"
          ? body.visibleToStudent
          : existing.visibleToStudent,
    },
  });

  return NextResponse.json({ item });
}
