import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeStudentAccess } from "@/lib/auth/student-access";

export async function GET(
  request: NextRequest
) {
  try {
    const studentId =
      request.nextUrl.searchParams.get(
        "studentId"
      );

    if (!studentId) {
      return NextResponse.json(
        {
          error: "studentId is required.",
        },
        {
          status: 400,
        }
      );
    }

    const authorization =
      await authorizeStudentAccess(
        studentId
      );

    if (!authorization.allowed) {
      return NextResponse.json(
        {
          error: authorization.reason,
        },
        {
          status: authorization.status,
        }
      );
    }

    const interests =
      await prisma.careerInterest.findMany({
        where: {
          studentId,
        },
        orderBy: [
          {
            interest: "desc",
          },
          {
            updatedAt: "desc",
          },
        ],
      });

    return NextResponse.json({
      interests,
    });
  } catch (error) {
    console.error(
      "Career interests GET failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load career interests.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const studentId =
      typeof body.studentId === "string"
        ? body.studentId
        : "";

    const careerName =
      typeof body.careerName === "string"
        ? body.careerName.trim()
        : "";

    const industry =
      typeof body.industry === "string"
        ? body.industry.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    if (!studentId || !careerName) {
      return NextResponse.json(
        {
          error:
            "studentId and careerName are required.",
        },
        {
          status: 400,
        }
      );
    }

    const authorization =
      await authorizeStudentAccess(
        studentId
      );

    if (!authorization.allowed) {
      return NextResponse.json(
        {
          error: authorization.reason,
        },
        {
          status: authorization.status,
        }
      );
    }

    const existing =
      await prisma.careerInterest.findFirst({
        where: {
          studentId,
          careerName,
        },
      });

    if (existing) {
      const updated =
        await prisma.careerInterest.update({
          where: {
            id: existing.id,
          },
          data: {
            industry:
              industry || existing.industry,
            interest: Math.max(
              existing.interest,
              5
            ),
            notes:
              description ||
              existing.notes,
          },
        });

      return NextResponse.json({
        success: true,
        saved: true,
        interest: updated,
      });
    }

    const created =
      await prisma.careerInterest.create({
        data: {
          studentId,
          careerName,
          industry: industry || null,
          interest: 5,
          notes: description || null,
        },
      });

    return NextResponse.json({
      success: true,
      saved: true,
      interest: created,
    });
  } catch (error) {
    console.error(
      "Career interests POST failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to save career interest.",
      },
      {
        status: 500,
      }
    );
  }
}
