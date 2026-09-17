import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { authorizeStudentAccess } from "@/lib/auth/student-access";
import { prisma } from "@/lib/prisma";

const EVIDENCE_PREFIX = "BUILD6 Companion Evidence · ";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      artifactId: string;
    }>;
  },
) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const { artifactId } = await params;

    const artifact = await prisma.portfolioArtifact.findUnique({
      where: {
        id: artifactId,
      },
      select: {
        title: true,
        description: true,
        fileUrl: true,
        portfolio: {
          select: {
            studentId: true,
          },
        },
      },
    });

    if (
      !artifact ||
      !artifact.fileUrl ||
      !artifact.description?.startsWith(EVIDENCE_PREFIX)
    ) {
      return NextResponse.json(
        {
          error: "Evidence not found.",
        },
        {
          status: 404,
        },
      );
    }

    const access = await authorizeStudentAccess(
      artifact.portfolio.studentId,
    );

    if (!access.allowed) {
      return NextResponse.json(
        {
          error: "Evidence access required.",
        },
        {
          status: access.status,
        },
      );
    }

    const result = await get(artifact.fileUrl, {
      access: "private",
    });

    if (!result) {
      return NextResponse.json(
        {
          error: "Evidence file not found.",
        },
        {
          status: 404,
        },
      );
    }

    const { stream, blob } = result;

    return new Response(stream, {
      headers: {
        "Content-Type":
          blob.contentType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${artifact.title.replace(
          /["\\]/g,
          "",
        )}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Companion evidence retrieval failed:", error);

    return NextResponse.json(
      {
        error: "Unable to load Companion evidence.",
      },
      {
        status: 500,
      },
    );
  }
}
