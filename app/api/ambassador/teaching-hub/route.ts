import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

const AMBASSADOR_PROGRAM_ID = "cms7m13y300024ur4rb49uzlw";
const AMBASSADOR_COHORT_ID = "cmsqx1f8i0000s9r49ecnj27s";
const AMBASSADOR_ORGANIZATION_ID = "cms7m12ga00004ur4spre0hex";

async function authorizeTeachingHub() {
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

  if (session.role === "SUPER_ADMIN") {
    return {
      allowed: true as const,
      session,
    };
  }

  if (
    session.role === "ORGANIZATION_ADMIN" &&
    session.organizationId === AMBASSADOR_ORGANIZATION_ID
  ) {
    return {
      allowed: true as const,
      session,
    };
  }

  if (session.role === "SCHOOL_ADMIN") {
    const schoolAccess = await prisma.userSchool.findFirst({
      where: {
        userId: session.id,
        role: "SCHOOL_ADMIN",
        school: {
          cohorts: {
            some: {
              id: AMBASSADOR_COHORT_ID,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (schoolAccess) {
      return {
        allowed: true as const,
        session,
      };
    }
  }

  if (session.role === "FACILITATOR") {
    const facilitatorAccess =
      await prisma.cohortFacilitator.findFirst({
        where: {
          cohortId: AMBASSADOR_COHORT_ID,
          facilitator: {
            userId: session.id,
          },
        },
        select: {
          id: true,
        },
      });

    if (facilitatorAccess) {
      return {
        allowed: true as const,
        session,
      };
    }
  }

  return {
    allowed: false as const,
    response: NextResponse.json(
      {
        error:
          "You do not have permission to access the Ambassador Teaching Hub.",
      },
      {
        status: 403,
      }
    ),
  };
}

const REQUIREMENT_FIELDS = [
  "attendance",
  "slides",
  "workbook",
  "activity",
  "assessment",
  "reflection",
  "portfolioEvidence",
  "homework",
  "guestSpeakerTask",
] as const;

const VALID_REQUIREMENTS = [
  "HIDDEN",
  "OPTIONAL",
  "REQUIRED",
] as const;

type RequirementField =
  (typeof REQUIREMENT_FIELDS)[number];

type RequirementValue =
  (typeof VALID_REQUIREMENTS)[number];

function isRequirementField(
  value: unknown
): value is RequirementField {
  return (
    typeof value === "string" &&
    REQUIREMENT_FIELDS.includes(
      value as RequirementField
    )
  );
}

function isRequirementValue(
  value: unknown
): value is RequirementValue {
  return (
    typeof value === "string" &&
    VALID_REQUIREMENTS.includes(
      value as RequirementValue
    )
  );
}

async function getAmbassadorLesson(week: number) {
  return prisma.lesson.findFirst({
    where: {
      weekNumber: week,
      module: {
        programId: AMBASSADOR_PROGRAM_ID,
      },
    },
    include: {
      module: {
        select: {
          id: true,
          title: true,
          phase: true,
          programId: true,
        },
      },

      deliverySettings: {
        where: {
          cohortId: AMBASSADOR_COHORT_ID,
        },
      },

      customResources: {
        where: {
          cohortId: AMBASSADOR_COHORT_ID,
          enabled: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },

      planTasks: {
        where: {
          cohortId: AMBASSADOR_COHORT_ID,
        },
        include: {
          resources: {
            include: {
              resource: true,
            },
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
        orderBy: [
          {
            dayNumber: "asc",
          },
          {
            sortOrder: "asc",
          },
        ],
      },
    },
  });
}

export async function GET(request: NextRequest) {
  const authorization = await authorizeTeachingHub();

  if (!authorization.allowed) {
    return authorization.response;
  }

  try {
    const weekParam =
      request.nextUrl.searchParams.get("week");

    const week = Number(weekParam ?? "1");

    if (
      !Number.isInteger(week) ||
      week < 1 ||
      week > 16
    ) {
      return NextResponse.json(
        {
          error:
            "Week must be an integer between 1 and 16.",
        },
        {
          status: 400,
        }
      );
    }

    const lesson = await getAmbassadorLesson(week);

    if (!lesson) {
      return NextResponse.json(
        {
          error:
            "Ambassador lesson was not found.",
        },
        {
          status: 404,
        }
      );
    }

    const delivery =
      lesson.deliverySettings[0] ?? null;

    const assignments =
      await prisma.assignment.findMany({
        where: {
          lessonId: lesson.id,
          cohortId: AMBASSADOR_COHORT_ID,
        },
        orderBy: [
          {
            dueAt: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
      });

    const dailyNotes =
      await prisma.facilitatorDailyNote.findMany({
        where: {
          lessonId: lesson.id,
          cohortId: AMBASSADOR_COHORT_ID,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 100,
      });

    return NextResponse.json({
      program: {
        id: AMBASSADOR_PROGRAM_ID,
        totalWeeks: 16,
      },

      cohort: {
        id: AMBASSADOR_COHORT_ID,
        name: "Ambassador 2026",
      },

      lesson: {
        id: lesson.id,
        weekNumber: lesson.weekNumber,
        position: lesson.position,
        title: lesson.title,
        slug: lesson.slug,
        summary: lesson.summary,
        status: lesson.status,
        estimatedMinutes:
          lesson.estimatedMinutes,
        content: lesson.content,
        module: lesson.module,
      },

      delivery,

      resources: lesson.customResources,
      planTasks: lesson.planTasks,
      assignments,
      dailyNotes,
    });
  } catch (error) {
    console.error(
      "Teaching Hub GET failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load Teaching Hub data.",
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
  const authorization = await authorizeTeachingHub();

  if (!authorization.allowed) {
    return authorization.response;
  }

  try {
    const body = await request.json();

    const lessonId =
      typeof body.lessonId === "string"
        ? body.lessonId
        : "";

    if (!lessonId) {
      return NextResponse.json(
        {
          error: "lessonId is required.",
        },
        {
          status: 400,
        }
      );
    }

    const lesson =
      await prisma.lesson.findFirst({
        where: {
          id: lessonId,
          module: {
            programId:
              AMBASSADOR_PROGRAM_ID,
          },
        },
        select: {
          id: true,
        },
      });

    if (!lesson) {
      return NextResponse.json(
        {
          error:
            "Lesson does not belong to the Ambassador program.",
        },
        {
          status: 404,
        }
      );
    }

    const existing =
      await prisma.lessonDeliverySetting.findUnique({
        where: {
          lessonId_cohortId: {
            lessonId,
            cohortId:
              AMBASSADOR_COHORT_ID,
          },
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Lesson delivery setting does not exist.",
        },
        {
          status: 404,
        }
      );
    }

    const updateData: Record<
      string,
      unknown
    > = {};

    if (
      typeof body.releasedToStudents ===
      "boolean"
    ) {
      updateData.releasedToStudents =
        body.releasedToStudents;
    }

    if (
      typeof body.badgeEnabled ===
      "boolean"
    ) {
      updateData.badgeEnabled =
        body.badgeEnabled;
    }

    if (
      typeof body.facilitatorNotes ===
      "string"
    ) {
      updateData.facilitatorNotes =
        body.facilitatorNotes;
    }

    if (
      body.requirementField !== undefined ||
      body.requirementValue !== undefined
    ) {
      if (
        !isRequirementField(
          body.requirementField
        ) ||
        !isRequirementValue(
          body.requirementValue
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid lesson requirement update.",
          },
          {
            status: 400,
          }
        );
      }

      updateData[
        body.requirementField
      ] = body.requirementValue;
    }

    if (
      Object.keys(updateData).length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "No supported update was supplied.",
        },
        {
          status: 400,
        }
      );
    }

    const updated =
      await prisma.lessonDeliverySetting.update({
        where: {
          lessonId_cohortId: {
            lessonId,
            cohortId:
              AMBASSADOR_COHORT_ID,
          },
        },
        data: updateData,
      });

    return NextResponse.json({
      success: true,
      delivery: updated,
    });
  } catch (error) {
    console.error(
      "Teaching Hub PATCH failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to update Teaching Hub settings.",
      },
      {
        status: 500,
      }
    );
  }
}

const VALID_RESOURCE_KINDS = [
  "PDF",
  "DOCX",
  "PPTX",
  "VIDEO",
  "LINK",
  "IMAGE",
  "OTHER",
] as const;

type ResourceKind =
  (typeof VALID_RESOURCE_KINDS)[number];

function isResourceKind(
  value: unknown
): value is ResourceKind {
  return (
    typeof value === "string" &&
    VALID_RESOURCE_KINDS.includes(
      value as ResourceKind
    )
  );
}

async function verifyAmbassadorLesson(
  lessonId: string
) {
  return prisma.lesson.findFirst({
    where: {
      id: lessonId,
      module: {
        programId: AMBASSADOR_PROGRAM_ID,
      },
    },
    select: {
      id: true,
      weekNumber: true,
      title: true,
    },
  });
}

export async function POST(
  request: NextRequest
) {
  const authorization = await authorizeTeachingHub();

  if (!authorization.allowed) {
    return authorization.response;
  }

  try {
    const body = await request.json();

    const action =
      typeof body.action === "string"
        ? body.action
        : "";

    const lessonId =
      typeof body.lessonId === "string"
        ? body.lessonId
        : "";

    if (!lessonId) {
      return NextResponse.json(
        {
          error: "lessonId is required.",
        },
        {
          status: 400,
        }
      );
    }

    const lesson =
      await verifyAmbassadorLesson(lessonId);

    if (!lesson) {
      return NextResponse.json(
        {
          error:
            "Lesson does not belong to the Ambassador program.",
        },
        {
          status: 404,
        }
      );
    }

    if (action === "saveDailyNote") {
      const dayNumber =
        Number.isInteger(body.dayNumber) &&
        body.dayNumber >= 1 &&
        body.dayNumber <= 5
          ? body.dayNumber
          : null;

      const content =
        typeof body.content === "string"
          ? body.content.trim()
          : "";

      if (!dayNumber || !content) {
        return NextResponse.json(
          {
            error: "Day and note are required.",
          },
          {
            status: 400,
          },
        );
      }

      const note =
        await prisma.facilitatorDailyNote.create({
          data: {
            lessonId,
            cohortId: AMBASSADOR_COHORT_ID,
            dayNumber,
            content,
            createdById: authorization.session.id,
          },
        });

      return NextResponse.json(
        {
          success: true,
          note,
        },
        {
          status: 201,
        },
      );
    }

    if (action === "upsertDailyDirections") {
      const dayNumber =
        Number.isInteger(body.dayNumber) &&
        body.dayNumber >= 1 &&
        body.dayNumber <= 5
          ? body.dayNumber
          : null;

      const instructions =
        typeof body.instructions === "string"
          ? body.instructions.trim()
          : "";

      if (!dayNumber) {
        return NextResponse.json(
          {
            error: "A valid class day is required.",
          },
          {
            status: 400,
          },
        );
      }

      const existing =
        await prisma.lessonPlanTask.findFirst({
          where: {
            lessonId,
            cohortId: AMBASSADOR_COHORT_ID,
            dayNumber,
            taskType: "DAILY_DIRECTIONS",
          },
        });

      if (existing) {
        const task =
          await prisma.lessonPlanTask.update({
            where: {
              id: existing.id,
            },
            data: {
              title: `Day ${dayNumber} Assignment Directions`,
              instructions:
                instructions ||
                "Complete the work assigned for today's class.",
              requirement: "REQUIRED",
              visibleToStudent: true,
              visibleToFacilitator: true,
            },
          });

        return NextResponse.json({
          success: true,
          task,
        });
      }

      const taskCount =
        await prisma.lessonPlanTask.count({
          where: {
            lessonId,
            cohortId: AMBASSADOR_COHORT_ID,
            dayNumber,
          },
        });

      const task =
        await prisma.lessonPlanTask.create({
          data: {
            lessonId,
            cohortId: AMBASSADOR_COHORT_ID,
            taskType: "DAILY_DIRECTIONS",
            title: `Day ${dayNumber} Assignment Directions`,
            instructions:
              instructions ||
              "Complete the work assigned for today's class.",
            dayNumber,
            durationMinutes: 0,
            requirement: "REQUIRED",
            visibleToStudent: true,
            visibleToFacilitator: true,
            sortOrder: taskCount,
            createdById: authorization.session.id,
          },
        });

      return NextResponse.json(
        {
          success: true,
          task,
        },
        {
          status: 201,
        },
      );
    }

    if (action === "createAssignment") {
      const title =
        typeof body.title === "string"
          ? body.title.trim()
          : "";

      const instructions =
        typeof body.instructions === "string"
          ? body.instructions.trim()
          : "";

      if (!title || !instructions) {
        return NextResponse.json(
          {
            error:
              "Assignment title and instructions are required.",
          },
          {
            status: 400,
          }
        );
      }

      const requirement =
        isRequirementValue(body.requirement)
          ? body.requirement
          : "REQUIRED";

      const estimatedMinutes =
        Number.isInteger(body.estimatedMinutes) &&
        body.estimatedMinutes > 0
          ? body.estimatedMinutes
          : 20;

      let dueAt: Date | null = null;

      if (
        typeof body.dueAt === "string" &&
        body.dueAt.trim()
      ) {
        const parsedDate = new Date(body.dueAt);

        if (
          Number.isNaN(parsedDate.getTime())
        ) {
          return NextResponse.json(
            {
              error:
                "Assignment due date is invalid.",
            },
            {
              status: 400,
            }
          );
        }

        dueAt = parsedDate;
      }

      const dayNumber =
        Number.isInteger(body.dayNumber) &&
        body.dayNumber >= 1 &&
        body.dayNumber <= 5
          ? body.dayNumber
          : null;

      const assignment =
        await prisma.assignment.create({
          data: {
            lessonId,
            cohortId:
              AMBASSADOR_COHORT_ID,
            title,
            instructions,
            estimatedMinutes,
            requirement,
            allowOnline:
              typeof body.allowOnline ===
              "boolean"
                ? body.allowOnline
                : true,
            allowPrint:
              typeof body.allowPrint ===
              "boolean"
                ? body.allowPrint
                : true,
            allowUpload:
              typeof body.allowUpload ===
              "boolean"
                ? body.allowUpload
                : true,
            portfolioEligible:
              typeof body.portfolioEligible ===
              "boolean"
                ? body.portfolioEligible
                : true,
            badgeName:
              typeof body.badgeName === "string" &&
              body.badgeName.trim()
                ? body.badgeName.trim()
                : null,
            dueAt,
            dayNumber,
            status: "ACTIVE",
          },
        });

      return NextResponse.json(
        {
          success: true,
          assignment,
        },
        {
          status: 201,
        }
      );
    }

    if (action === "attachResourceToLesson") {
      const dayNumber =
        Number.isInteger(body.dayNumber) &&
        body.dayNumber >= 1 &&
        body.dayNumber <= 5
          ? body.dayNumber
          : 1;

      const requestedResourceId =
        typeof body.resourceId === "string"
          ? body.resourceId.trim()
          : "";

      const packagedAsset =
        body.packagedAsset &&
        typeof body.packagedAsset === "object"
          ? body.packagedAsset
          : null;

      let resourceId = requestedResourceId;

      // Protected packaged assets are NOT copied.
      // We create/reuse only a LessonResource reference to the
      // already-existing protected Future Ready™ file.
      if (!resourceId && packagedAsset) {
        const assetTitle =
          typeof packagedAsset.title === "string"
            ? packagedAsset.title.trim()
            : "";

        const assetUrl =
          typeof packagedAsset.url === "string"
            ? packagedAsset.url.trim()
            : "";

        const assetFileName =
          typeof packagedAsset.fileName === "string"
            ? packagedAsset.fileName.trim()
            : null;

        if (!assetTitle || !assetUrl) {
          return NextResponse.json(
            {
              error: "Packaged asset title and URL are required.",
            },
            {
              status: 400,
            }
          );
        }

        const existingResource =
          await prisma.lessonResource.findFirst({
            where: {
              lessonId,
              cohortId: AMBASSADOR_COHORT_ID,
              url: assetUrl,
            },
            select: {
              id: true,
            },
          });

        if (existingResource) {
          resourceId = existingResource.id;
        } else {
          const resourceCount =
            await prisma.lessonResource.count({
              where: {
                lessonId,
                cohortId: AMBASSADOR_COHORT_ID,
              },
            });

          const createdReference =
            await prisma.lessonResource.create({
              data: {
                lessonId,
                cohortId: AMBASSADOR_COHORT_ID,
                title: assetTitle,
                description:
                  "Protected Future Ready™ curriculum asset.",
                kind: "LINK",
                url: assetUrl,
                fileName: assetFileName,
                filePath: null,
                enabled: true,
                required: false,
                visibleToStudent: false,
                visibleToFacilitator: true,
                dayNumber,
                sortOrder: resourceCount,
                uploadedById: authorization.session.id,
              },
              select: {
                id: true,
              },
            });

          resourceId = createdReference.id;
        }
      }

      if (!resourceId) {
        return NextResponse.json(
          {
            error: "Resource is required.",
          },
          {
            status: 400,
          }
        );
      }

      const resource =
        await prisma.lessonResource.findFirst({
          where: {
            id: resourceId,
            lessonId,
            cohortId: AMBASSADOR_COHORT_ID,
            enabled: true,
          },
          select: {
            id: true,
          },
        });

      if (!resource) {
        return NextResponse.json(
          {
            error: "Resource was not found for this lesson.",
          },
          {
            status: 404,
          }
        );
      }

      // Use the first existing agenda/task for this day.
      // If the day has no database task yet, make one lightweight
      // Lesson Resources task so the asset still appears in the
      // actual Daily Map rather than disappearing into the Hub.
      let task =
        await prisma.lessonPlanTask.findFirst({
          where: {
            lessonId,
            cohortId: AMBASSADOR_COHORT_ID,
            dayNumber,
          },
          orderBy: {
            sortOrder: "asc",
          },
          select: {
            id: true,
          },
        });

      if (!task) {
        const taskCount =
          await prisma.lessonPlanTask.count({
            where: {
              lessonId,
              cohortId: AMBASSADOR_COHORT_ID,
              dayNumber,
            },
          });

        task =
          await prisma.lessonPlanTask.create({
            data: {
              lessonId,
              cohortId: AMBASSADOR_COHORT_ID,
              taskType: "Lesson Resources",
              title: "Lesson Resources",
              instructions:
                "Resources selected for today's Future Ready™ lesson.",
              dayNumber,
              durationMinutes: 0,
              requirement: "OPTIONAL",
              visibleToStudent: false,
              visibleToFacilitator: true,
              sortOrder: taskCount,
              createdById: authorization.session.id,
            },
            select: {
              id: true,
            },
          });
      }

      const existingLink =
        await prisma.lessonPlanTaskResource.findUnique({
          where: {
            taskId_resourceId: {
              taskId: task.id,
              resourceId,
            },
          },
          select: {
            id: true,
          },
        });

      if (!existingLink) {
        const attachedCount =
          await prisma.lessonPlanTaskResource.count({
            where: {
              taskId: task.id,
            },
          });

        await prisma.lessonPlanTaskResource.create({
          data: {
            taskId: task.id,
            resourceId,
            sortOrder: attachedCount,
          },
        });
      }

      return NextResponse.json({
        success: true,
        taskId: task.id,
        resourceId,
        alreadyAttached: Boolean(existingLink),
      });
    }

    if (action === "createResource") {
      const title =
        typeof body.title === "string"
          ? body.title.trim()
          : "";

      if (!title) {
        return NextResponse.json(
          {
            error:
              "Resource title is required.",
          },
          {
            status: 400,
          }
        );
      }

      const kind = isResourceKind(body.kind)
        ? body.kind
        : "OTHER";

      const dayNumber =
        Number.isInteger(body.dayNumber) &&
        body.dayNumber >= 1 &&
        body.dayNumber <= 5
          ? body.dayNumber
          : null;

      const resource =
        await prisma.lessonResource.create({
          data: {
            lessonId,
            cohortId:
              AMBASSADOR_COHORT_ID,
            title,
            description:
              typeof body.description ===
                "string" &&
              body.description.trim()
                ? body.description.trim()
                : null,
            kind,
            url:
              typeof body.url === "string" &&
              body.url.trim()
                ? body.url.trim()
                : null,
            fileName:
              typeof body.fileName ===
                "string" &&
              body.fileName.trim()
                ? body.fileName.trim()
                : null,
            filePath:
              typeof body.filePath ===
                "string" &&
              body.filePath.trim()
                ? body.filePath.trim()
                : null,
            enabled: true,
            required:
              typeof body.required ===
              "boolean"
                ? body.required
                : false,
            visibleToStudent:
              typeof body.visibleToStudent ===
              "boolean"
                ? body.visibleToStudent
                : true,
            visibleToFacilitator: true,
            dayNumber,
            sortOrder:
              Number.isInteger(body.sortOrder)
                ? body.sortOrder
                : 0,
          },
        });

      return NextResponse.json(
        {
          success: true,
          resource,
        },
        {
          status: 201,
        }
      );
    }

    if (action === "createTask") {
      const title =
        typeof body.title === "string"
          ? body.title.trim()
          : "";

      const instructions =
        typeof body.instructions === "string"
          ? body.instructions.trim()
          : "";

      if (!title || !instructions) {
        return NextResponse.json(
          {
            error:
              "Task title and instructions are required.",
          },
          {
            status: 400,
          }
        );
      }

      const dayNumber =
        Number.isInteger(body.dayNumber) &&
        body.dayNumber >= 1 &&
        body.dayNumber <= 7
          ? body.dayNumber
          : 1;

      const durationMinutes =
        Number.isInteger(body.durationMinutes) &&
        body.durationMinutes > 0
          ? body.durationMinutes
          : 10;

      const requirement =
        isRequirementValue(body.requirement)
          ? body.requirement
          : "OPTIONAL";

      const task =
        await prisma.lessonPlanTask.create({
          data: {
            lessonId,
            cohortId:
              AMBASSADOR_COHORT_ID,
            taskType:
              typeof body.taskType ===
                "string" &&
              body.taskType.trim()
                ? body.taskType.trim()
                : "Class Task",
            title,
            instructions,
            dayNumber,
            durationMinutes,
            requirement,
            visibleToStudent:
              typeof body.visibleToStudent ===
              "boolean"
                ? body.visibleToStudent
                : true,
            visibleToFacilitator: true,
            sortOrder:
              Number.isInteger(body.sortOrder)
                ? body.sortOrder
                : 0,
          },
        });

      return NextResponse.json(
        {
          success: true,
          task,
        },
        {
          status: 201,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Unsupported Teaching Hub action.",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error(
      "Teaching Hub POST failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create Teaching Hub item.",
      },
      {
        status: 500,
      }
    );
  }
}
