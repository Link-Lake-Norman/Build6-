import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Super administrator access required." },
        { status: 403 }
      );
    }

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

    const temporaryPassword =
      typeof body.temporaryPassword === "string"
        ? body.temporaryPassword
        : "";

    const cohortCode =
      typeof body.cohortCode === "string"
        ? body.cohortCode.trim().toUpperCase()
        : "";

    if (
      !firstName ||
      !lastName ||
      !email ||
      !temporaryPassword ||
      !cohortCode
    ) {
      return NextResponse.json(
        {
          error:
            "First name, last name, email, temporary password, and cohort are required.",
        },
        { status: 400 }
      );
    }

    if (temporaryPassword.length < 8) {
      return NextResponse.json(
        {
          error:
            "Temporary password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account already exists with this email." },
        { status: 409 }
      );
    }

    const cohort = await prisma.cohort.findFirst({
      where: {
        code: cohortCode,
        status: "ACTIVE",
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        organizationId: true,
        schoolId: true,
      },
    });

    if (!cohort) {
      return NextResponse.json(
        { error: "Active cohort not found." },
        { status: 404 }
      );
    }

    const passwordHash = await bcrypt.hash(
      temporaryPassword,
      12
    );

    const result = await prisma.$transaction(
      async (tx) => {
        const user = await tx.user.create({
          data: {
            email,
            passwordHash,
            firstName,
            lastName,
            displayName: `${firstName} ${lastName}`,
            role: "FACILITATOR",
            status: "ACTIVE",
          },
        });

        const facilitator = await tx.facilitator.create({
          data: {
            userId: user.id,
            schoolId: cohort.schoolId,
            title: "Future Ready™ Facilitator",
          },
        });

        await tx.userOrganization.create({
          data: {
            userId: user.id,
            organizationId: cohort.organizationId,
            role: "FACILITATOR",
          },
        });

        if (cohort.schoolId) {
          await tx.userSchool.create({
            data: {
              userId: user.id,
              schoolId: cohort.schoolId,
              role: "FACILITATOR",
            },
          });
        }

        // Keep existing facilitators, including the demo account,
        // but make the newly assigned facilitator the lead.
        await tx.cohortFacilitator.updateMany({
          where: {
            cohortId: cohort.id,
          },
          data: {
            isLead: false,
          },
        });

        await tx.cohortFacilitator.create({
          data: {
            cohortId: cohort.id,
            facilitatorId: facilitator.id,
            isLead: true,
          },
        });

        return {
          user,
          facilitator,
        };
      }
    );

    return NextResponse.json({
      success: true,
      facilitator: {
        id: result.facilitator.id,
        name: `${firstName} ${lastName}`,
        email,
        cohort: cohort.name,
      },
    });
  } catch (error) {
    console.error("Create facilitator failed:", error);

    return NextResponse.json(
      {
        error:
          "Unable to create facilitator account.",
      },
      { status: 500 }
    );
  }
}
