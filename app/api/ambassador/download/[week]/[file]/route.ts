import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";

const ALLOWED_ROLES = [
  "SUPER_ADMIN",
  "ORGANIZATION_ADMIN",
  "SCHOOL_ADMIN",
  "FACILITATOR",
  "STUDENT",
] as const;

const FILE_PATTERN =
  /^Future-Ready-Week-(0[1-9]|1[0-6])-(Facilitator-Guide\.(?:pdf|docx)|Student-Workbook\.(?:pdf|docx)|Slides\.pptx|Activity-Kit\.(?:pdf|docx)|Assessment-Rubric\.(?:pdf|docx)|Portfolio-Artifact\.(?:pdf|docx)|Badge\.svg)$/;

const WEEK_PATTERN = /^(0[1-9]|1[0-6])$/;

const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".svg": "image/svg+xml",
};

type RouteContext = {
  params: Promise<{
    week: string;
    file: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const session = await getSessionUser();

  if (
    !session ||
    !ALLOWED_ROLES.includes(session.role as (typeof ALLOWED_ROLES)[number])
  ) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const { week, file } = await context.params;
  const decodedFile = decodeURIComponent(file);

  if (!WEEK_PATTERN.test(week) || !FILE_PATTERN.test(decodedFile)) {
    return NextResponse.json(
      {
        error: "Invalid resource",
      },
      {
        status: 400,
      },
    );
  }

  if (!decodedFile.startsWith(`Future-Ready-Week-${week}-`)) {
    return NextResponse.json(
      {
        error: "Week mismatch",
      },
      {
        status: 400,
      },
    );
  }

  const assetRoot = path.resolve(
    process.cwd(),
    "protected-resources",
    "ambassador",
    `week-${week}`,
  );

  const filePath = path.resolve(assetRoot, decodedFile);

  if (filePath !== assetRoot && !filePath.startsWith(assetRoot + path.sep)) {
    return NextResponse.json(
      {
        error: "Invalid path",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const data = await readFile(filePath);

    const extension = path.extname(decodedFile).toLowerCase();

    return new NextResponse(data, {
      headers: {
        "Content-Type": CONTENT_TYPES[extension] ?? "application/octet-stream",

        "Content-Disposition": `${
          new URL(request.url).searchParams.get("download") === "1"
            ? "attachment"
            : "inline"
        }; filename="${decodedFile}"`,

        "Cache-Control": "private, no-store, max-age=0",

        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Ambassador resource download failed:", error);

    return NextResponse.json(
      {
        error: "Resource not found",
      },
      {
        status: 404,
      },
    );
  }
}
