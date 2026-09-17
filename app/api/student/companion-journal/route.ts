import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { authorizeStudentAccess } from "@/lib/auth/student-access";
import { prisma } from "@/lib/prisma";

const PROMPT_PREFIX = "BUILD6 Companion Journal · ";

function cleanText(value: unknown, max = 5000) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, max);
}

function validDateKey(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  );
}

function promptFor(dateKey: string) {
  return `${PROMPT_PREFIX}${dateKey}`;
}

function serializeResponse({
  moment,
  selfInsight,
  keepForStory,
}: {
  moment: string;
  selfInsight: string;
  keepForStory: string;
}) {
  return [
    `Moment / Thought:\n${moment}`,
    `What I Noticed About Me:\n${selfInsight}`,
    `Keep for My Story:\n${keepForStory}`,
  ].join("\n\n");
}

function parseResponse(response: string) {
  const values = {
    moment: "",
    selfInsight: "",
    keepForStory: "",
  };

  for (const section of response.split("\n\n")) {
    if (section.startsWith("Moment / Thought:\n")) {
      values.moment = section
        .replace("Moment / Thought:\n", "")
        .trim();
    }

    if (section.startsWith("What I Noticed About Me:\n")) {
      values.selfInsight = section
        .replace("What I Noticed About Me:\n", "")
        .trim();
    }

    if (section.startsWith("Keep for My Story:\n")) {
      values.keepForStory = section
        .replace("Keep for My Story:\n", "")
        .trim();
    }
  }

  return values;
}

async function requireStudentOwner(studentId: string) {
  const session = await getSessionUser();

  if (!session) {
    return {
      allowed: false as const,
      status: 401,
      error: "Authentication required.",
    };
  }

  const access = await authorizeStudentAccess(studentId);

  if (!access.allowed) {
    return {
      allowed: false as const,
      status: access.status,
      error: "Student access required.",
    };
  }

  if (session.role !== "STUDENT") {
    return {
      allowed: false as const,
      status: 403,
      error: "Only the student may access Companion journal entries.",
    };
  }

  const owner = await prisma.student.findUnique({
    where: {
      userId: session.id,
    },
    select: {
      id: true,
    },
  });

  if (!owner || owner.id !== studentId) {
    return {
      allowed: false as const,
      status: 403,
      error: "You may only access your own Companion journal.",
    };
  }

  return {
    allowed: true as const,
    session,
  };
}

export async function GET(request: NextRequest) {
  try {
    const studentId =
      request.nextUrl.searchParams.get("studentId")?.trim() ?? "";

    if (!studentId) {
      return NextResponse.json(
        {
          error: "studentId is required.",
        },
        {
          status: 400,
        },
      );
    }
    const authorization = await requireStudentOwner(studentId);

    if (!authorization.allowed) {
      return NextResponse.json(
        {
          error: authorization.error,
        },
        {
          status: authorization.status,
        },
      );
    }

    const reflections = await prisma.reflection.findMany({
      where: {
        studentId,
        prompt: {
          startsWith: PROMPT_PREFIX,
        },
      },
      select: {
        id: true,
        prompt: true,
        response: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 60,
    });

    const entries = reflections.map((reflection) => ({
      id: reflection.id,
      dateKey: reflection.prompt.replace(PROMPT_PREFIX, ""),
      ...parseResponse(reflection.response),
      savedToStory: reflection.status === "SUBMITTED",
      status: reflection.status,
      createdAt: reflection.createdAt.toISOString(),
      updatedAt: reflection.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      entries,
    });
  } catch (error) {
    console.error("Companion journal GET failed:", error);

    return NextResponse.json(
      {
        error: "Unable to load Companion journal.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const studentId = cleanText(body.studentId, 200);
    const dateKey = body.dateKey;

    const moment = cleanText(body.moment);
    const selfInsight = cleanText(body.selfInsight);
    const keepForStory = cleanText(body.keepForStory);

    const saveToStory = body.saveToStory === true;

    if (!studentId) {
      return NextResponse.json(
        {
          error: "studentId is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!validDateKey(dateKey)) {
      return NextResponse.json(
        {
          error: "A valid journal date is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!moment && !selfInsight && !keepForStory) {
      return NextResponse.json(
        {
          error: "Write at least one thought before saving.",
        },
        {
          status: 400,
        },
      );
    }

    const authorization = await requireStudentOwner(studentId);

    if (!authorization.allowed) {
      return NextResponse.json(
        {
          error: authorization.error,
        },
        {
          status: authorization.status,
        },
      );
    }

    const prompt = promptFor(dateKey);

    const response = serializeResponse({
      moment,
      selfInsight,
      keepForStory,
    });

    const existing = await prisma.reflection.findFirst({
      where: {
        studentId,
        prompt,
      },
      select: {
        id: true,
      },
    });

    const reflection = existing
      ? await prisma.reflection.update({
          where: {
            id: existing.id,
          },
          data: {
            response,
            status: saveToStory ? "SUBMITTED" : "DRAFT",
            submittedAt: saveToStory ? new Date() : null,
          },
          select: {
            id: true,
            prompt: true,
            response: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        })
      : await prisma.reflection.create({
          data: {
            studentId,
            prompt,
            response,
            status: saveToStory ? "SUBMITTED" : "DRAFT",
            submittedAt: saveToStory ? new Date() : null,
          },
          select: {
            id: true,
            prompt: true,
            response: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        });

    return NextResponse.json({
      entry: {
        id: reflection.id,
        dateKey,
        ...parseResponse(reflection.response),
        savedToStory: reflection.status === "SUBMITTED",
        status: reflection.status,
        createdAt: reflection.createdAt.toISOString(),
        updatedAt: reflection.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Companion journal POST failed:", error);

    return NextResponse.json(
      {
        error: "Unable to save Companion journal entry.",
      },
      {
        status: 500,
      },
    );
  }
}
