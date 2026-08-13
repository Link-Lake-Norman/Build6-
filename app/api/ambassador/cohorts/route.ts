import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

const ALLOWED_ROLES = [
  "FACILITATOR",
  "SCHOOL_ADMIN",
  "ORGANIZATION_ADMIN",
  "SUPER_ADMIN",
];

async function authorize() {
  const session = await getSessionUser();

  if (!session) {
    return {
      allowed: false as const,
      response: NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      ),
    };
  }

  if (!ALLOWED_ROLES.includes(session.role)) {
    return {
      allowed: false as const,
      response: NextResponse.json(
        { error: "You do not have permission to manage cohorts." },
        { status: 403 }
      ),
    };
  }

  return {
    allowed: true as const,
    session,
  };
}

export async function GET() {
  const authorization = await authorize();

  if (!authorization.allowed) {
    return authorization.response;
  }

  const { session } = authorization;

  let where: Record<string, unknown> = {
    deletedAt: null,
  };

  if (
    session.role === "ORGANIZATION_ADMIN" &&
    session.organizationId
  ) {
    where = {
      ...where,
      organizationId: session.organizationId,
    };
  }

  if (
    session.role === "SCHOOL_ADMIN" &&
    session.schoolId
  ) {
    where = {
      ...where,
      schoolId: session.schoolId,
    };
  }

  if (session.role === "FACILITATOR") {
    const facilitator =
      await prisma.facilitator.findUnique({
        where: {
          userId: session.id,
        },
        select: {
          cohorts: {
            select: {
              cohortId: true,
            },
          },
        },
      });

    const cohortIds =
      facilitator?.cohorts.map(
        (item) => item.cohortId
      ) ?? [];

    where = {
      ...where,
      id: {
        in: cohortIds,
      },
    };
  }

  const cohorts = await prisma.cohort.findMany({
    where,
    orderBy: [
      {
        status: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    select: {
      id: true,
      name: true,
      code: true,
      status: true,
      startDate: true,
      endDate: true,
      capacity: true,

      organization: {
        select: {
          id: true,
          name: true,
        },
      },

      school: {
        select: {
          id: true,
          name: true,
        },
      },

      program: {
        select: {
          id: true,
          name: true,
          totalWeeks: true,
        },
      },

      _count: {
        select: {
          enrollments: true,
          facilitators: true,
        },
      },
    },
  });

  return NextResponse.json({
    cohorts,
  });
}

export async function POST(
  request: NextRequest
) {
  const authorization = await authorize();

  if (!authorization.allowed) {
    return authorization.response;
  }

  const { session } = authorization;

  if (session.role === "FACILITATOR") {
    return NextResponse.json(
      {
        error:
          "Facilitators may view assigned cohorts but cannot create cohorts.",
      },
      {
        status: 403,
      }
    );
  }

  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const code =
      typeof body.code === "string"
        ? body.code.trim().toUpperCase()
        : "";

    const programId =
      typeof body.programId === "string"
        ? body.programId
        : "";

    const requestedOrganizationId =
      typeof body.organizationId === "string"
        ? body.organizationId
        : "";

    const requestedSchoolId =
      typeof body.schoolId === "string" &&
      body.schoolId
        ? body.schoolId
        : null;

    if (!name || !code || !programId) {
      return NextResponse.json(
        {
          error:
            "Cohort name, class code, and program are required.",
        },
        {
          status: 400,
        }
      );
    }

    let organizationId =
      requestedOrganizationId;

    if (
      session.role === "ORGANIZATION_ADMIN"
    ) {
      organizationId =
        session.organizationId ?? "";
    }

    if (
      session.role === "SCHOOL_ADMIN"
    ) {
      if (!session.schoolId) {
        return NextResponse.json(
          {
            error:
              "School administrator account is missing a school.",
          },
          {
            status: 400,
          }
        );
      }

      const school =
        await prisma.school.findUnique({
          where: {
            id: session.schoolId,
          },
          select: {
            organizationId: true,
          },
        });

      if (!school) {
        return NextResponse.json(
          {
            error: "School not found.",
          },
          {
            status: 404,
          }
        );
      }

      organizationId =
        school.organizationId;
    }

    if (!organizationId) {
      return NextResponse.json(
        {
          error:
            "Organization is required.",
        },
        {
          status: 400,
        }
      );
    }

    const schoolId =
      session.role === "SCHOOL_ADMIN"
        ? session.schoolId ?? null
        : requestedSchoolId;

    const program =
      await prisma.program.findFirst({
        where: {
          id: programId,
          organizationId,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });

    if (!program) {
      return NextResponse.json(
        {
          error:
            "Program does not belong to this organization.",
        },
        {
          status: 400,
        }
      );
    }

    const duplicate =
      await prisma.cohort.findFirst({
        where: {
          organizationId,
          code,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });

    if (duplicate) {
      return NextResponse.json(
        {
          error:
            "That class code already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const cohort =
      await prisma.cohort.create({
        data: {
          organizationId,
          schoolId,
          programId,
          name,
          code,
          status: "ACTIVE",
          capacity:
            Number.isInteger(body.capacity) &&
            body.capacity > 0
              ? body.capacity
              : null,
          startDate:
            typeof body.startDate === "string" &&
            body.startDate
              ? new Date(body.startDate)
              : null,
          endDate:
            typeof body.endDate === "string" &&
            body.endDate
              ? new Date(body.endDate)
              : null,
        },
      });

    return NextResponse.json(
      {
        success: true,
        cohort,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Create cohort failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create cohort.",
      },
      {
        status: 500,
      }
    );
  }
}
