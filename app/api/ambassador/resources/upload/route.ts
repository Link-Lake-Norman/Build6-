import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const ALLOWED_ROLES = [
  "SUPER_ADMIN",
  "SCHOOL_ADMIN",
  "ORGANIZATION_ADMIN",
  "FACILITATOR",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024;

function getKind(
  file: File,
): "PDF" | "DOCX" | "PPTX" | "VIDEO" | "IMAGE" | "OTHER" {
  const name = file.name.toLowerCase();

  const type = file.type.toLowerCase();

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    return "PDF";
  }

  if (name.endsWith(".docx") || type.includes("wordprocessingml")) {
    return "DOCX";
  }

  if (name.endsWith(".pptx") || type.includes("presentationml")) {
    return "PPTX";
  }

  if (type.startsWith("video/")) {
    return "VIDEO";
  }

  if (type.startsWith("image/")) {
    return "IMAGE";
  }

  return "OTHER";
}

function safeName(value: string) {
  return value
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function canManageCohort(userId: string, role: string, cohortId: string) {
  if (
    role === "SUPER_ADMIN" ||
    role === "SCHOOL_ADMIN" ||
    role === "ORGANIZATION_ADMIN"
  ) {
    return true;
  }

  if (role !== "FACILITATOR") {
    return false;
  }

  const assignment = await prisma.cohortFacilitator.findFirst({
    where: {
      cohortId,
      facilitator: {
        userId,
        deletedAt: null,
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(assignment);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();

    if (!session || !ALLOWED_ROLES.includes(session.role)) {
      return NextResponse.json(
        {
          error: "Resource upload access required.",
        },
        {
          status: 403,
        },
      );
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error:
            "Private resource storage is not connected yet. Add BLOB_READ_WRITE_TOKEN before uploading files.",
        },
        {
          status: 503,
        },
      );
    }

    const form = await request.formData();

    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Choose a file to upload.",
        },
        {
          status: 400,
        },
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        {
          error: "The selected file is empty.",
        },
        {
          status: 400,
        },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "Files are currently limited to 50 MB.",
        },
        {
          status: 400,
        },
      );
    }

    const cohortCode = String(form.get("cohortCode") ?? "").trim();

    const week = Number(form.get("week"));

    const title = String(form.get("title") ?? file.name).trim();

    const description = String(form.get("description") ?? "").trim() || null;

    const visibleToStudent =
      String(form.get("visibleToStudent") ?? "false") === "true";

    const rawDayNumber = Number(form.get("dayNumber"));

    const dayNumber =
      Number.isInteger(rawDayNumber) &&
      rawDayNumber >= 1 &&
      rawDayNumber <= 5
        ? rawDayNumber
        : null;

    if (!cohortCode || !Number.isInteger(week) || week < 1) {
      return NextResponse.json(
        {
          error: "Valid cohort and week are required.",
        },
        {
          status: 400,
        },
      );
    }

    const cohort = await prisma.cohort.findFirst({
      where: {
        code: cohortCode,
        deletedAt: null,
      },
      select: {
        id: true,
        programId: true,
      },
    });

    if (!cohort) {
      return NextResponse.json(
        {
          error: "Cohort not found.",
        },
        {
          status: 404,
        },
      );
    }

    const allowed = await canManageCohort(session.id, session.role, cohort.id);

    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to upload resources to this cohort.",
        },
        {
          status: 403,
        },
      );
    }

    const lesson = await prisma.lesson.findFirst({
      where: {
        weekNumber: week,
        module: {
          programId: cohort.programId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        {
          error: "No lesson was found for this week.",
        },
        {
          status: 404,
        },
      );
    }

    const kind = getKind(file);

    const pathname = [
      "future-ready",
      "ambassador",
      safeName(cohortCode),
      `week-${String(week).padStart(2, "0")}`,
      `${Date.now()}-${safeName(file.name)}`,
    ].join("/");

    const blob = await put(pathname, file, {
      access: "private",
      addRandomSuffix: true,
      contentType: file.type || "application/octet-stream",
    });

    const count = await prisma.lessonResource.count({
      where: {
        lessonId: lesson.id,
        cohortId: cohort.id,
      },
    });

    const resource = await prisma.lessonResource.create({
      data: {
        lessonId: lesson.id,
        cohortId: cohort.id,
        title: title || file.name,
        description,
        kind,
        fileName: file.name,
        filePath: blob.pathname,
        url: null,
        enabled: true,
        required: false,
        visibleToStudent,
        visibleToFacilitator: true,
        dayNumber,
        sortOrder: count,
        uploadedById: session.id,
      },
    });

    return NextResponse.json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error("Resource upload failed:", error);

    return NextResponse.json(
      {
        error: "Unable to upload resource.",
      },
      {
        status: 500,
      },
    );
  }
}
