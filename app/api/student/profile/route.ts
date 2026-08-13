import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeStudentAccess } from "@/lib/auth/student-access";

function cleanText(value: unknown) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

export async function GET(request: NextRequest) {
  try {
    const studentId =
      request.nextUrl.searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required." },
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

    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      select: {
        id: true,
        gradeLevel: true,
        profileComplete: true,
        school: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            displayName: true,
          },
        },
        profile: {
          select: {
            id: true,
            aboutMe: true,
            strengths: true,
            values: true,
            careerInterests: true,
            futureGoals: true,
            skillsToBuild: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        enrollments: {
          where: {
            status: "ACTIVE",
          },
          select: {
            cohort: {
              select: {
                name: true,
                program: {
                  select: {
                    totalWeeks: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 }
      );
    }

    const name =
      student.user.displayName ??
      `${student.user.firstName} ${student.user.lastName}`.trim();

    return NextResponse.json({
      student: {
        id: student.id,
        name,
        grade:
          student.gradeLevel ?? "",
        school:
          student.school?.name ?? "",
        cohort:
          student.enrollments[0]
            ?.cohort.name ?? "",
        totalWeeks:
          student.enrollments[0]
            ?.cohort.program.totalWeeks ?? 0,
        profileComplete:
          student.profileComplete,
      },
      profile: student.profile ?? {
        aboutMe: "",
        strengths: "",
        values: "",
        careerInterests: "",
        futureGoals: "",
        skillsToBuild: "",
        updatedAt: null,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/student/profile failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load student profile.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const studentId =
      cleanText(body.studentId);

    if (!studentId) {
      return NextResponse.json(
        {
          error:
            "studentId is required.",
        },
        {
          status: 400,
        }
      );
    }

    const access =
      await authorizeStudentAccess(studentId);

    if (!access.allowed) {
      return NextResponse.json(
        {
          error: access.reason,
        },
        {
          status: access.status,
        }
      );
    }

    if (
      access.session.role !== "STUDENT" &&
      access.session.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        {
          error:
            "Only the student may edit this profile.",
        },
        {
          status: 403,
        }
      );
    }

    const data = {
      aboutMe:
        cleanText(body.aboutMe),
      strengths:
        cleanText(body.strengths),
      values:
        cleanText(body.values),
      careerInterests:
        cleanText(body.careerInterests),
      futureGoals:
        cleanText(body.futureGoals),
      skillsToBuild:
        cleanText(body.skillsToBuild),
    };

    const complete = Object.values(
      data
    ).every(
      (value) =>
        value.length > 0
    );

    const profile =
      await prisma.studentProfile.upsert({
        where: {
          studentId,
        },
        create: {
          studentId,
          ...data,
        },
        update: {
          ...data,
        },
        select: {
          id: true,
          studentId: true,
          aboutMe: true,
          strengths: true,
          values: true,
          careerInterests: true,
          futureGoals: true,
          skillsToBuild: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    await prisma.student.update({
      where: {
        id: studentId,
      },
      data: {
        profileComplete:
          complete,
      },
    });

    return NextResponse.json({
      saved: true,
      complete,
      profile,
    });
  } catch (error) {
    console.error(
      "POST /api/student/profile failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to save student profile.",
      },
      {
        status: 500,
      }
    );
  }
}
