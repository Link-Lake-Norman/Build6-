import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import {
  setSessionCookie,
  type SessionUser,
} from "@/lib/auth/session";

function destinationForRole(
  role: SessionUser["role"],
  studentId?: string
) {
  switch (role) {
    case "SUPER_ADMIN":
      return "/ambassador/admin";

    case "ORGANIZATION_ADMIN":
      return "/admin";

    case "SCHOOL_ADMIN":
      return "/ambassador/admin";

    case "FACILITATOR":
      return "/ambassador/facilitator";

    case "EMPLOYER":
      return "/employer-hub";

    case "STUDENT":
      return studentId
        ? `/student-portal/${studentId}`
        : "/student-portal";

    case "MENTOR":
      return "/partner-portal";

    default:
      return "/";
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        {
          error:
            "Email and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        organizations: {
          select: {
            organizationId: true,
            role: true,
          },
        },

        schools: {
          select: {
            schoolId: true,
            role: true,
          },
        },

        student: {
          select: {
            id: true,
          },
        },

        facilitator: {
          select: {
            id: true,
            schoolId: true,
          },
        },

        employerUser: {
          select: {
            employerId: true,
          },
        },
      },
    });

    if (
      !user ||
      user.status !== "ACTIVE" ||
      !user.passwordHash
    ) {
      return NextResponse.json(
        {
          error:
            "Incorrect email or password.",
        },
        {
          status: 401,
        }
      );
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!validPassword) {
      return NextResponse.json(
        {
          error:
            "Incorrect email or password.",
        },
        {
          status: 401,
        }
      );
    }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name:
        user.displayName ??
        `${user.firstName} ${user.lastName}`.trim(),
      role: user.role,

      organizationId:
        user.organizations[0]
          ?.organizationId,

      schoolId:
        user.facilitator?.schoolId ??
        user.schools[0]?.schoolId,

      studentId:
        user.student?.id,

      facilitatorId:
        user.facilitator?.id,

      employerId:
        user.employerUser?.employerId,
    };

    await setSessionCookie(sessionUser);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: sessionUser.id,
        name: sessionUser.name,
        role: sessionUser.role,
      },
      destination:
        destinationForRole(
          sessionUser.role,
          sessionUser.studentId
        ),
    });
  } catch (error) {
    console.error(
      "Login failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to complete login.",
      },
      {
        status: 500,
      }
    );
  }
}
