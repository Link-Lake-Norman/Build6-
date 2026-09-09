import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { getPackagedResourceByPath } from "@/lib/ambassador/packaged-resources";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
) {
  const session = await getSessionUser();

  if (!session) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const params = await context.params;
  const requestedPath = params.path.join("/");

  const resource = getPackagedResourceByPath(requestedPath);

  if (!resource) {
    return NextResponse.json(
      { error: "Packaged resource not found." },
      { status: 404 },
    );
  }

  const protectedRoot = path.resolve(
    process.cwd(),
    "protected-resources",
  );

  const absolutePath = path.resolve(
    protectedRoot,
    resource.relativePath,
  );

  if (!absolutePath.startsWith(`${protectedRoot}${path.sep}`)) {
    return NextResponse.json(
      { error: "Invalid resource path." },
      { status: 400 },
    );
  }

  try {
    const file = await readFile(absolutePath);

    const download =
      request.nextUrl.searchParams.get("download") === "1";

    const fileName =
      resource.shortTitle.replace(/[^a-zA-Z0-9_-]+/g, "-") +
      ".md";

    return new NextResponse(file, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `${
          download ? "attachment" : "inline"
        }; filename="${fileName}"`,
        "Cache-Control": "private, no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(
      "Protected packaged resource read failed:",
      error,
    );

    return NextResponse.json(
      { error: "Unable to open packaged resource." },
      { status: 500 },
    );
  }
}
