import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { authorizeStudentAccess } from "@/lib/auth/student-access";
import { getVapidPublicKey } from "@/lib/build6/web-push";
import { prisma } from "@/lib/prisma";

type SubscriptionBody = {
  studentId?: unknown;
  subscription?: {
    endpoint?: unknown;
    expirationTime?: unknown;
    keys?: {
      p256dh?: unknown;
      auth?: unknown;
    };
  };
  endpoint?: unknown;
};

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
      error: "Only the student may manage device notifications.",
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
      error: "You may only manage notifications for your own account.",
    };
  }

  return {
    allowed: true as const,
    session,
  };
}

function cleanString(value: unknown, max = 5000) {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

function expirationDate(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(request: NextRequest) {
  const studentId =
    request.nextUrl.searchParams.get("studentId")?.trim() ?? "";

  if (!studentId) {
    return NextResponse.json(
      { error: "Student ID is required." },
      { status: 400 },
    );
  }

  const authorization = await requireStudentOwner(studentId);

  if (!authorization.allowed) {
    return NextResponse.json(
      { error: authorization.error },
      { status: authorization.status },
    );
  }

  const count = await prisma.pushSubscription.count({
    where: {
      userId: authorization.session.id,
      enabled: true,
    },
  });

  const publicKey = getVapidPublicKey();

  return NextResponse.json({
    configured: Boolean(publicKey),
    publicKey,
    subscribed: count > 0,
    subscriptionCount: count,
  });
}

export async function POST(request: NextRequest) {
  let body: SubscriptionBody;

  try {
    body = (await request.json()) as SubscriptionBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid notification subscription." },
      { status: 400 },
    );
  }

  const studentId = cleanString(body.studentId, 200);
  const endpoint = cleanString(body.subscription?.endpoint, 10000);
  const p256dh = cleanString(
    body.subscription?.keys?.p256dh,
    5000,
  );
  const auth = cleanString(
    body.subscription?.keys?.auth,
    5000,
  );

  if (!studentId || !endpoint || !p256dh || !auth) {
    return NextResponse.json(
      { error: "Complete push subscription data is required." },
      { status: 400 },
    );
  }

  if (!getVapidPublicKey()) {
    return NextResponse.json(
      { error: "BUILD6 device notifications are not configured yet." },
      { status: 503 },
    );
  }

  const authorization = await requireStudentOwner(studentId);

  if (!authorization.allowed) {
    return NextResponse.json(
      { error: authorization.error },
      { status: authorization.status },
    );
  }

  const expiresAt = expirationDate(
    body.subscription?.expirationTime,
  );

  const subscription = await prisma.pushSubscription.upsert({
    where: {
      endpoint,
    },
    update: {
      userId: authorization.session.id,
      p256dh,
      auth,
      enabled: true,
      userAgent: request.headers.get("user-agent"),
      expiresAt,
      lastError: null,
    },
    create: {
      userId: authorization.session.id,
      endpoint,
      p256dh,
      auth,
      enabled: true,
      userAgent: request.headers.get("user-agent"),
      expiresAt,
    },
    select: {
      id: true,
    },
  });

  return NextResponse.json({
    ok: true,
    subscriptionId: subscription.id,
  });
}

export async function DELETE(request: NextRequest) {
  let body: SubscriptionBody;

  try {
    body = (await request.json()) as SubscriptionBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid notification subscription." },
      { status: 400 },
    );
  }

  const studentId = cleanString(body.studentId, 200);
  const endpoint = cleanString(body.endpoint, 10000);

  if (!studentId || !endpoint) {
    return NextResponse.json(
      { error: "Student ID and subscription endpoint are required." },
      { status: 400 },
    );
  }

  const authorization = await requireStudentOwner(studentId);

  if (!authorization.allowed) {
    return NextResponse.json(
      { error: authorization.error },
      { status: authorization.status },
    );
  }

  await prisma.pushSubscription.deleteMany({
    where: {
      userId: authorization.session.id,
      endpoint,
    },
  });

  return NextResponse.json({
    ok: true,
  });
}
