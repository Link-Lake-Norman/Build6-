import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";


async function authorizeCohort(
  userId: string,
  role: string,
  cohortCode: string,
) {
  if (role === "SUPER_ADMIN") {
    return prisma.cohort.findFirst({
      where: {
        code: cohortCode,
        status: "ACTIVE",
        deletedAt: null,
      },
      select: {
        id: true,
        code: true,
        name: true,
        programId: true,
      },
    });
  }

  if (role !== "FACILITATOR") {
    return null;
  }

  return prisma.cohort.findFirst({
    where: {
      code: cohortCode,
      status: "ACTIVE",
      deletedAt: null,
      facilitators: {
        some: {
          facilitator: {
            userId,
            deletedAt: null,
          },
        },
      },
    },
    select: {
      id: true,
      code: true,
      name: true,
      programId: true,
    },
  });
}


async function getLesson(
  programId: string,
  week: number,
) {
  return prisma.lesson.findFirst({
    where: {
      weekNumber: week,
      module: {
        programId,
      },
    },
    select: {
      id: true,
    },
  });
}


function optionalString(value: unknown) {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : null;
}


function optionalDate(value: unknown) {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return null;
  }

  const parsed = new Date(
    `${value.trim()}T12:00:00`,
  );

  return Number.isNaN(parsed.getTime())
    ? null
    : parsed;
}


export async function GET(
  request: NextRequest,
) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    if (
      session.role !== "SUPER_ADMIN" &&
      session.role !== "FACILITATOR"
    ) {
      return NextResponse.json(
        {
          error: "Planning access denied.",
        },
        {
          status: 403,
        },
      );
    }

    const cohortCode =
      request.nextUrl.searchParams
        .get("cohortCode")
        ?.trim()
        .toUpperCase() ?? "";

    const week = Number(
      request.nextUrl.searchParams.get("week") ??
        "1",
    );

    if (
      !cohortCode ||
      !Number.isInteger(week) ||
      week < 1 ||
      week > 16
    ) {
      return NextResponse.json(
        {
          error:
            "Valid cohort and week are required.",
        },
        {
          status: 400,
        },
      );
    }

    const cohort = await authorizeCohort(
      session.id,
      session.role,
      cohortCode,
    );

    if (!cohort) {
      return NextResponse.json(
        {
          error: "Cohort access denied.",
        },
        {
          status: 403,
        },
      );
    }

    const experiences =
      await prisma.cohortExperience.findMany({
        where: {
          cohortId: cohort.id,
          weekNumber: week,
        },
        orderBy: [
          {
            dayNumber: "asc",
          },
          {
            eventDate: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
      });

    return NextResponse.json({
      success: true,
      experiences,
    });
  } catch (error) {
    console.error(
      "Experiences GET failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to load experiences.",
      },
      {
        status: 500,
      },
    );
  }
}


export async function POST(
  request: NextRequest,
) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    if (
      session.role !== "SUPER_ADMIN" &&
      session.role !== "FACILITATOR"
    ) {
      return NextResponse.json(
        {
          error: "Planning access denied.",
        },
        {
          status: 403,
        },
      );
    }

    const body = await request.json();

    const cohortCode =
      typeof body.cohortCode === "string"
        ? body.cohortCode
            .trim()
            .toUpperCase()
        : "";

    const weekNumber = Number(
      body.weekNumber,
    );

    const dayNumber = Number(
      body.dayNumber,
    );

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    if (
      !cohortCode ||
      !title ||
      !Number.isInteger(weekNumber) ||
      weekNumber < 1 ||
      weekNumber > 16 ||
      !Number.isInteger(dayNumber) ||
      dayNumber < 1 ||
      dayNumber > 5
    ) {
      return NextResponse.json(
        {
          error:
            "Cohort, title, week, and class day are required.",
        },
        {
          status: 400,
        },
      );
    }

    const cohort = await authorizeCohort(
      session.id,
      session.role,
      cohortCode,
    );

    if (!cohort) {
      return NextResponse.json(
        {
          error: "Cohort access denied.",
        },
        {
          status: 403,
        },
      );
    }

    const lesson = await getLesson(
      cohort.programId,
      weekNumber,
    );

    const rawCapacity =
      body.capacity === null ||
      body.capacity === undefined ||
      body.capacity === ""
        ? null
        : Number(body.capacity);

    const capacity =
      rawCapacity !== null &&
      Number.isInteger(rawCapacity) &&
      rawCapacity > 0
        ? rawCapacity
        : null;

    const experience =
      await prisma.cohortExperience.create({
        data: {
          cohortId: cohort.id,
          lessonId: lesson?.id ?? null,
          weekNumber,
          dayNumber,

          experienceType:
            optionalString(
              body.experienceType,
            ) ?? "FIELD_TRIP",

          title,

          description:
            optionalString(body.description),

          eventDate:
            optionalDate(body.eventDate),

          startTime:
            optionalString(body.startTime),

          endTime:
            optionalString(body.endTime),

          departureTime:
            optionalString(
              body.departureTime,
            ),

          returnTime:
            optionalString(body.returnTime),

          siteName:
            optionalString(body.siteName),

          address1:
            optionalString(body.address1),

          address2:
            optionalString(body.address2),

          city:
            optionalString(body.city),

          state:
            optionalString(body.state),

          postalCode:
            optionalString(body.postalCode),

          contactName:
            optionalString(body.contactName),

          contactTitle:
            optionalString(
              body.contactTitle,
            ),

          contactEmail:
            optionalString(
              body.contactEmail,
            ),

          contactPhone:
            optionalString(
              body.contactPhone,
            ),

          transportationNotes:
            optionalString(
              body.transportationNotes,
            ),

          parkingNotes:
            optionalString(
              body.parkingNotes,
            ),

          requiredAttire:
            optionalString(
              body.requiredAttire,
            ),

          accommodations:
            optionalString(
              body.accommodations,
            ),

          foodNotes:
            optionalString(body.foodNotes),

          waiverRequired:
            body.waiverRequired === true,

          waiverNotes:
            optionalString(
              body.waiverNotes,
            ),

          capacity,

          chaperoneNotes:
            optionalString(
              body.chaperoneNotes,
            ),

          learningObjective:
            optionalString(
              body.learningObjective,
            ),

          careerConnection:
            optionalString(
              body.careerConnection,
            ),

          preTripPreparation:
            optionalString(
              body.preTripPreparation,
            ),

          studentQuestions:
            optionalString(
              body.studentQuestions,
            ),

          postTripReflection:
            optionalString(
              body.postTripReflection,
            ),

          studentVisibleNotes:
            optionalString(
              body.studentVisibleNotes,
            ),

          facilitatorNotes:
            optionalString(
              body.facilitatorNotes,
            ),

          visibleToStudent:
            body.visibleToStudent !== false,

          status: "PLANNED",

          createdById: session.id,
        },
      });

    return NextResponse.json({
      success: true,
      experience,
    });
  } catch (error) {
    console.error(
      "Experiences POST failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to save experience.",
      },
      {
        status: 500,
      },
    );
  }
}


export async function DELETE(
  request: NextRequest,
) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    if (
      session.role !== "SUPER_ADMIN" &&
      session.role !== "FACILITATOR"
    ) {
      return NextResponse.json(
        {
          error: "Planning access denied.",
        },
        {
          status: 403,
        },
      );
    }

    const body = await request.json();

    const cohortCode =
      typeof body.cohortCode === "string"
        ? body.cohortCode
            .trim()
            .toUpperCase()
        : "";

    const experienceId =
      typeof body.experienceId === "string"
        ? body.experienceId.trim()
        : "";

    if (
      !cohortCode ||
      !experienceId
    ) {
      return NextResponse.json(
        {
          error:
            "Cohort and experience ID are required.",
        },
        {
          status: 400,
        },
      );
    }

    const cohort = await authorizeCohort(
      session.id,
      session.role,
      cohortCode,
    );

    if (!cohort) {
      return NextResponse.json(
        {
          error: "Cohort access denied.",
        },
        {
          status: 403,
        },
      );
    }

    const existing =
      await prisma.cohortExperience.findFirst({
        where: {
          id: experienceId,
          cohortId: cohort.id,
        },
        select: {
          id: true,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Experience not found.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.cohortExperience.delete({
      where: {
        id: experienceId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Experiences DELETE failed:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to remove experience.",
      },
      {
        status: 500,
      },
    );
  }
}
