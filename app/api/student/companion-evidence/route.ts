import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { authorizeStudentAccess } from "@/lib/auth/student-access";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const EVIDENCE_PREFIX = "BUILD6 Companion Evidence · ";

const MIME_TO_TYPE: Record<string, "IMAGE" | "DOCUMENT"> = {
  "image/jpeg": "IMAGE",
  "image/png": "IMAGE",
  "image/webp": "IMAGE",
  "application/pdf": "DOCUMENT",
};

function cleanText(value: FormDataEntryValue | null, max: number) {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

function safeFileName(name: string) {
  return (
    name
      .normalize("NFKD")
      .replace(/[^\w.\-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 140) || "evidence-file"
  );
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
      error: "Only the student may upload Companion evidence.",
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
      error: "You may only upload evidence to your own portfolio.",
    };
  }

  return {
    allowed: true as const,
    session,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const studentId = cleanText(formData.get("studentId"), 200);
    const title = cleanText(formData.get("title"), 160);
    const description = cleanText(formData.get("description"), 1200);
    const file = formData.get("file");

    if (!studentId || !title) {
      return NextResponse.json(
        {
          error: "Student ID and evidence title are required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Choose a photo or evidence file.",
        },
        {
          status: 400,
        },
      );
    }

    const artifactType = MIME_TO_TYPE[file.type];

    if (!artifactType) {
      return NextResponse.json(
        {
          error: "Use a JPG, PNG, WEBP or PDF file.",
        },
        {
          status: 400,
        },
      );
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "Evidence files must be 10 MB or smaller.",
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

    const pathname = [
      "build6",
      "student-evidence",
      studentId,
      `${Date.now()}-${safeFileName(file.name)}`,
    ].join("/");

    const blob = await put(pathname, file, {
      access: "private",
    });

    const portfolio = await prisma.portfolio.upsert({
      where: {
        studentId,
      },
      update: {},
      create: {
        studentId,
      },
      select: {
        id: true,
      },
    });

    const artifact = await prisma.portfolioArtifact.create({
      data: {
        portfolioId: portfolio.id,
        title,
        description: `${EVIDENCE_PREFIX}${description}`,
        type: artifactType,
        fileUrl: blob.pathname,
      },
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      artifact,
    });
  } catch (error) {
    console.error("Companion evidence upload failed:", error);

    return NextResponse.json(
      {
        error: "Unable to upload Companion evidence.",
      },
      {
        status: 500,
      },
    );
  }
}
