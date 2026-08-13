import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeStudentAccess } from "@/lib/auth/student-access";

const VALID_ARTIFACT_TYPES = [
  "DOCUMENT",
  "IMAGE",
  "VIDEO",
  "PRESENTATION",
  "CERTIFICATE",
  "LINK",
  "OTHER",
] as const;

type ArtifactType = (typeof VALID_ARTIFACT_TYPES)[number];

function isArtifactType(value: unknown): value is ArtifactType {
  return (
    typeof value === "string" &&
    VALID_ARTIFACT_TYPES.includes(value as ArtifactType)
  );
}

function cleanString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export async function GET(request: NextRequest) {
  try {
    const studentId =
      request.nextUrl.searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        {
          error: "Student ID is required.",
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
          error:
            access.reason ?? "Access denied.",
        },
        {
          status:
            access.reason ===
            "Authentication required."
              ? 401
              : 403,
        }
      );
    }

    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      select: {
        id: true,
        careerSummary: true,
        readinessScore: true,
        profileComplete: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            displayName: true,
          },
        },
        portfolio: {
          include: {
            artifacts: {
              orderBy: {
                createdAt: "desc",
              },
              include: {
                lesson: {
                  select: {
                    id: true,
                    title: true,
                    weekNumber: true,
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
        {
          error: "Student not found.",
        },
        {
          status: 404,
        }
      );
    }

    const name =
      student.user.displayName ||
      `${student.user.firstName} ${student.user.lastName}`.trim();

    return NextResponse.json({
      student: {
        id: student.id,
        name,
        careerSummary:
          student.careerSummary ?? "",
        readinessScore: Number(
          student.readinessScore
        ),
        profileComplete:
          student.profileComplete,
      },

      portfolio: student.portfolio
        ? {
            id: student.portfolio.id,
            headline:
              student.portfolio.headline ?? "",
            summary:
              student.portfolio.summary ?? "",
            isPublic:
              student.portfolio.isPublic,
            publicSlug:
              student.portfolio.publicSlug,
            updatedAt:
              student.portfolio.updatedAt,
          }
        : {
            id: null,
            headline: "",
            summary: "",
            isPublic: false,
            publicSlug: null,
            updatedAt: null,
          },

      artifacts:
        student.portfolio?.artifacts.map(
          (artifact) => ({
            id: artifact.id,
            lessonId: artifact.lessonId,
            title: artifact.title,
            description:
              artifact.description ?? "",
            type: artifact.type,
            fileUrl: artifact.fileUrl,
            externalUrl:
              artifact.externalUrl,
            approval: artifact.approval,
            approvedById:
              artifact.approvedById,
            approvedAt:
              artifact.approvedAt,
            createdAt:
              artifact.createdAt,
            updatedAt:
              artifact.updatedAt,
            lesson: artifact.lesson,
          })
        ) ?? [],
    });
  } catch (error) {
    console.error(
      "GET /api/student/portfolio failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load portfolio.",
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
      typeof body.studentId === "string"
        ? body.studentId
        : "";

    if (!studentId) {
      return NextResponse.json(
        {
          error: "Student ID is required.",
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
          error:
            access.reason ?? "Access denied.",
        },
        {
          status:
            access.reason ===
            "Authentication required."
              ? 401
              : 403,
        }
      );
    }

    const headline =
      cleanString(body.headline);

    const summary =
      cleanString(body.summary);

    const careerSummary =
      cleanString(body.careerSummary);

    const result = await prisma.$transaction(
      async (tx) => {
        const portfolio =
          await tx.portfolio.upsert({
            where: {
              studentId,
            },
            update: {
              headline,
              summary,
            },
            create: {
              studentId,
              headline,
              summary,
            },
          });

        await tx.student.update({
          where: {
            id: studentId,
          },
          data: {
            careerSummary,
          },
        });

        return portfolio;
      }
    );

    return NextResponse.json({
      success: true,
      portfolio: {
        id: result.id,
        headline:
          result.headline ?? "",
        summary:
          result.summary ?? "",
        isPublic: result.isPublic,
        publicSlug: result.publicSlug,
        updatedAt: result.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "POST /api/student/portfolio failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to save portfolio.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const studentId =
      typeof body.studentId === "string"
        ? body.studentId
        : "";

    const title =
      cleanString(body.title);

    if (!studentId) {
      return NextResponse.json(
        {
          error: "Student ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!title) {
      return NextResponse.json(
        {
          error:
            "Artifact title is required.",
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
          error:
            access.reason ?? "Access denied.",
        },
        {
          status:
            access.reason ===
            "Authentication required."
              ? 401
              : 403,
        }
      );
    }

    const type = isArtifactType(body.type)
      ? body.type
      : "OTHER";

    const description =
      cleanString(body.description);

    const fileUrl =
      cleanString(body.fileUrl);

    const externalUrl =
      cleanString(body.externalUrl);

    const lessonId =
      cleanString(body.lessonId);

    const portfolio =
      await prisma.portfolio.upsert({
        where: {
          studentId,
        },
        update: {},
        create: {
          studentId,
        },
      });

    if (lessonId) {
      const lesson =
        await prisma.lesson.findUnique({
          where: {
            id: lessonId,
          },
          select: {
            id: true,
          },
        });

      if (!lesson) {
        return NextResponse.json(
          {
            error: "Lesson not found.",
          },
          {
            status: 404,
          }
        );
      }
    }

    const artifact =
      await prisma.portfolioArtifact.create({
        data: {
          portfolioId: portfolio.id,
          lessonId,
          title,
          description,
          type,
          fileUrl,
          externalUrl,
          approval: "PENDING",
        },
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              weekNumber: true,
            },
          },
        },
      });

    return NextResponse.json({
      success: true,
      artifact,
    });
  } catch (error) {
    console.error(
      "PUT /api/student/portfolio failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to save portfolio artifact.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const studentId =
      typeof body.studentId === "string"
        ? body.studentId
        : "";

    const artifactId =
      typeof body.artifactId === "string"
        ? body.artifactId
        : "";

    if (!studentId || !artifactId) {
      return NextResponse.json(
        {
          error:
            "Student ID and artifact ID are required.",
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
          error:
            access.reason ?? "Access denied.",
        },
        {
          status:
            access.reason ===
            "Authentication required."
              ? 401
              : 403,
        }
      );
    }

    const portfolio =
      await prisma.portfolio.findUnique({
        where: {
          studentId,
        },
        select: {
          id: true,
        },
      });

    if (!portfolio) {
      return NextResponse.json(
        {
          error: "Portfolio not found.",
        },
        {
          status: 404,
        }
      );
    }

    const existing =
      await prisma.portfolioArtifact.findFirst({
        where: {
          id: artifactId,
          portfolioId: portfolio.id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Artifact not found.",
        },
        {
          status: 404,
        }
      );
    }

    const data: {
      title?: string;
      description?: string | null;
      type?: ArtifactType;
      fileUrl?: string | null;
      externalUrl?: string | null;
    } = {};

    if (typeof body.title === "string") {
      const title = cleanString(body.title);

      if (!title) {
        return NextResponse.json(
          {
            error:
              "Artifact title cannot be empty.",
          },
          {
            status: 400,
          }
        );
      }

      data.title = title;
    }

    if ("description" in body) {
      data.description =
        cleanString(body.description);
    }

    if ("fileUrl" in body) {
      data.fileUrl =
        cleanString(body.fileUrl);
    }

    if ("externalUrl" in body) {
      data.externalUrl =
        cleanString(body.externalUrl);
    }

    if ("type" in body) {
      if (!isArtifactType(body.type)) {
        return NextResponse.json(
          {
            error:
              "Invalid artifact type.",
          },
          {
            status: 400,
          }
        );
      }

      data.type = body.type;
    }

    const artifact =
      await prisma.portfolioArtifact.update({
        where: {
          id: artifactId,
        },
        data,
      });

    return NextResponse.json({
      success: true,
      artifact,
    });
  } catch (error) {
    console.error(
      "PATCH /api/student/portfolio failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to update portfolio artifact.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const studentId =
      typeof body.studentId === "string"
        ? body.studentId
        : "";

    const artifactId =
      typeof body.artifactId === "string"
        ? body.artifactId
        : "";

    if (!studentId || !artifactId) {
      return NextResponse.json(
        {
          error:
            "Student ID and artifact ID are required.",
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
          error:
            access.reason ?? "Access denied.",
        },
        {
          status:
            access.reason ===
            "Authentication required."
              ? 401
              : 403,
        }
      );
    }

    const portfolio =
      await prisma.portfolio.findUnique({
        where: {
          studentId,
        },
        select: {
          id: true,
        },
      });

    if (!portfolio) {
      return NextResponse.json(
        {
          error: "Portfolio not found.",
        },
        {
          status: 404,
        }
      );
    }

    const artifact =
      await prisma.portfolioArtifact.findFirst({
        where: {
          id: artifactId,
          portfolioId: portfolio.id,
        },
        select: {
          id: true,
        },
      });

    if (!artifact) {
      return NextResponse.json(
        {
          error: "Artifact not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.portfolioArtifact.delete({
      where: {
        id: artifact.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/student/portfolio failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to delete portfolio artifact.",
      },
      {
        status: 500,
      }
    );
  }
}
