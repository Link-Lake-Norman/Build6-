import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
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

    const resourceId = request.nextUrl.searchParams.get("id");

    const download = request.nextUrl.searchParams.get("download") === "1";

    if (!resourceId) {
      return NextResponse.json(
        {
          error: "Resource ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const resource = await prisma.lessonResource.findUnique({
      where: {
        id: resourceId,
      },
      select: {
        id: true,
        title: true,
        fileName: true,
        filePath: true,
        visibleToStudent: true,
        visibleToFacilitator: true,
        cohortId: true,
      },
    });

    if (!resource || !resource.filePath) {
      return NextResponse.json(
        {
          error: "File resource not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (session.role === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: {
          userId: session.id,
        },
        select: {
          enrollments: {
            where: {
              cohortId: resource.cohortId,
              status: "ACTIVE",
            },
            select: {
              id: true,
            },
          },
        },
      });

      if (
        !resource.visibleToStudent ||
        !student ||
        student.enrollments.length === 0
      ) {
        return NextResponse.json(
          {
            error: "Resource access denied.",
          },
          {
            status: 403,
          },
        );
      }
    }

    if (session.role === "FACILITATOR") {
      const assignment = await prisma.cohortFacilitator.findFirst({
        where: {
          cohortId: resource.cohortId,
          facilitator: {
            userId: session.id,
            deletedAt: null,
          },
        },
        select: {
          id: true,
        },
      });

      if (!assignment) {
        return NextResponse.json(
          {
            error: "Resource access denied.",
          },
          {
            status: 403,
          },
        );
      }
    }

    const result = await get(resource.filePath, {
      access: "private",
      ifNoneMatch: request.headers.get("if-none-match") ?? undefined,
    });

    if (!result) {
      return new NextResponse("Not found", {
        status: 404,
      });
    }

    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: result.blob.etag,
          "Cache-Control": "private, no-cache",
        },
      });
    }

    const fileName = resource.fileName || resource.title;

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType || "application/octet-stream",

        "Content-Disposition": `${
          download ? "attachment" : "inline"
        }; filename="${fileName.replace(/"/g, "")}"`,

        "X-Content-Type-Options": "nosniff",

        ETag: result.blob.etag,

        "Cache-Control": "private, no-cache",
      },
    });
  } catch (error) {
    console.error("Resource file GET failed:", error);

    return NextResponse.json(
      {
        error: "Unable to open resource.",
      },
      {
        status: 500,
      },
    );
  }
}
