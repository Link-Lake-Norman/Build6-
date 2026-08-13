import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import {
  setSessionCookie,
  type SessionUser,
} from "@/lib/auth/session";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const firstName =
      typeof body.firstName === "string"
        ? body.firstName.trim()
        : "";

    const lastName =
      typeof body.lastName === "string"
        ? body.lastName.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const cohortCode =
      typeof body.cohortCode === "string"
        ? body.cohortCode
            .trim()
            .toUpperCase()
        : "";

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !cohortCode
    ) {
      return NextResponse.json(
        {
          error:
            "First name, last name, email, password, and class code are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Your password must be at least 8 characters.",
        },
        {
          status: 400,
        }
      );
    }

    const cohorts =
      await prisma.cohort.findMany({
        where: {
          code: cohortCode,
          status: "ACTIVE",
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          code: true,
          organizationId: true,
          schoolId: true,
          program: {
            select: {
              name: true,
              totalWeeks: true,
            },
          },
        },
      });

    if (cohorts.length === 0) {
      return NextResponse.json(
        {
          error:
            "That class code was not found. Check the code with your facilitator.",
        },
        {
          status: 404,
        }
      );
    }

    if (cohorts.length > 1) {
      console.error(
        "Duplicate active cohort code detected:",
        cohortCode
      );

      return NextResponse.json(
        {
          error:
            "This class code requires administrator assistance.",
        },
        {
          status: 409,
        }
      );
    }

    const cohort = cohorts[0];

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "An account already exists with this email. Please sign in instead.",
        },
        {
          status: 409,
        }
      );
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const result =
      await prisma.$transaction(
        async (tx) => {
          const user =
            await tx.user.create({
              data: {
                email,
                passwordHash,
                firstName,
                lastName,
                displayName:
                  `${firstName} ${lastName}`,
                role: "STUDENT",
                status: "ACTIVE",
              },
            });

          const student =
            await tx.student.create({
              data: {
                userId: user.id,
                schoolId:
                  cohort.schoolId,
              },
            });

          await tx.enrollment.create({
            data: {
              studentId: student.id,
              cohortId: cohort.id,
              status: "ACTIVE",
            },
          });

          /*
           * Give every student a Passport-backed
           * portfolio record from day one.
           */
          await tx.portfolio.create({
            data: {
              studentId: student.id,
            },
          });

          return {
            user,
            student,
          };
        }
      );

    const sessionUser: SessionUser = {
      id: result.user.id,
      email: result.user.email,
      name:
        result.user.displayName ??
        `${result.user.firstName} ${result.user.lastName}`.trim(),
      role: "STUDENT",
      organizationId:
        cohort.organizationId,
      schoolId:
        cohort.schoolId ?? undefined,
      studentId:
        result.student.id,
    };

    await setSessionCookie(
      sessionUser
    );

    await prisma.user.update({
      where: {
        id: result.user.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,

      student: {
        id: result.student.id,
        name: sessionUser.name,
      },

      cohort: {
        id: cohort.id,
        name: cohort.name,
        code: cohort.code,
      },

      program: {
        name: cohort.program.name,
        totalWeeks:
          cohort.program.totalWeeks,
      },

      destination:
        `/ambassador/student-portal/${result.student.id}`,
    });
  } catch (error) {
    console.error(
      "Student registration failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create your account. Please ask your facilitator for help.",
      },
      {
        status: 500,
      }
    );
  }
}
