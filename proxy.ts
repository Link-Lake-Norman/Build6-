import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
  type UserRole,
} from "@/lib/auth/session";

type RouteRule = {
  prefix: string;
  roles: UserRole[];
};

const routeRules: RouteRule[] = [
  {
    prefix: "/super-admin",
    roles: ["SUPER_ADMIN"],
  },

  {
    prefix: "/admin",
    roles: [
      "SUPER_ADMIN",
      "ORGANIZATION_ADMIN",
    ],
  },

  {
    prefix: "/ambassador/admin",
    roles: [
      "SUPER_ADMIN",
      "ORGANIZATION_ADMIN",
      "SCHOOL_ADMIN",
    ],
  },

  {
    prefix: "/ambassador/curriculum",
    roles: [
      "SUPER_ADMIN",
      "ORGANIZATION_ADMIN",
      "SCHOOL_ADMIN",
      "FACILITATOR",
    ],
  },

  {
    prefix: "/ambassador/lesson-builder",
    roles: [
      "SUPER_ADMIN",
      "ORGANIZATION_ADMIN",
      "SCHOOL_ADMIN",
      "FACILITATOR",
    ],
  },

  {
    prefix: "/ambassador/facilitator",
    roles: [
      "SUPER_ADMIN",
      "ORGANIZATION_ADMIN",
      "SCHOOL_ADMIN",
      "FACILITATOR",
    ],
  },

  {
    prefix: "/employer-hub",
    roles: [
      "SUPER_ADMIN",
      "ORGANIZATION_ADMIN",
      "EMPLOYER",
    ],
  },

  {
    prefix: "/employer-dashboard",
    roles: [
      "SUPER_ADMIN",
      "ORGANIZATION_ADMIN",
      "EMPLOYER",
    ],
  },

  {
    prefix: "/partner-portal",
    roles: [
      "SUPER_ADMIN",
      "ORGANIZATION_ADMIN",
      "MENTOR",
    ],
  },

  {
    prefix: "/ambassador/student-portal",
    roles: [
      "SUPER_ADMIN",
      "ORGANIZATION_ADMIN",
      "SCHOOL_ADMIN",
      "FACILITATOR",
      "STUDENT",
    ],
  },

  {
    prefix: "/ambassador/student-passport",
    roles: [
      "SUPER_ADMIN",
      "ORGANIZATION_ADMIN",
      "SCHOOL_ADMIN",
      "FACILITATOR",
      "STUDENT",
    ],
  },

  {
    prefix: "/ambassador/student",
    roles: [
      "SUPER_ADMIN",
      "ORGANIZATION_ADMIN",
      "SCHOOL_ADMIN",
      "FACILITATOR",
      "STUDENT",
    ],
  },

  {
    prefix: "/student-portal",
    roles: [
      "SUPER_ADMIN",
      "ORGANIZATION_ADMIN",
      "SCHOOL_ADMIN",
      "FACILITATOR",
      "STUDENT",
    ],
  },

  {
    prefix: "/student-dashboard",
    roles: [
      "SUPER_ADMIN",
      "ORGANIZATION_ADMIN",
      "SCHOOL_ADMIN",
      "FACILITATOR",
      "STUDENT",
    ],
  },
];

function findRule(pathname: string) {
  return routeRules.find(
    (rule) =>
      pathname === rule.prefix ||
      pathname.startsWith(
        `${rule.prefix}/`
      )
  );
}

function loginRedirect(
  request: NextRequest
) {
  const url = new URL(
    "/ambassador/login",
    request.url
  );

  url.searchParams.set(
    "next",
    request.nextUrl.pathname
  );

  return NextResponse.redirect(url);
}

function forbiddenRedirect(
  request: NextRequest,
  role: UserRole
) {
  const destination =
    role === "STUDENT"
      ? "/student-portal"
      : role === "EMPLOYER"
        ? "/employer-hub"
        : role === "FACILITATOR"
          ? "/ambassador/facilitator"
          : role === "SCHOOL_ADMIN"
            ? "/ambassador/admin"
            : role === "ORGANIZATION_ADMIN"
              ? "/admin"
              : role === "SUPER_ADMIN"
                ? "/super-admin"
                : "/ambassador/login";

  return NextResponse.redirect(
    new URL(destination, request.url)
  );
}

export default async function proxy(
  request: NextRequest
) {
  const pathname =
    request.nextUrl.pathname;

  const rule = findRule(pathname);

  if (!rule) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get(
      SESSION_COOKIE_NAME
    )?.value;

  if (!token) {
    return loginRedirect(request);
  }

  const session =
    await verifySessionToken(token);

  if (!session) {
    const response =
      loginRedirect(request);

    response.cookies.delete(
      SESSION_COOKIE_NAME
    );

    return response;
  }

  if (
    !rule.roles.includes(session.role)
  ) {
    return forbiddenRedirect(
      request,
      session.role
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/super-admin/:path*",
    "/admin/:path*",
    "/ambassador/admin/:path*",
    "/ambassador/curriculum/:path*",
    "/ambassador/lesson-builder/:path*",
    "/ambassador/facilitator/:path*",
    "/employer-hub/:path*",
    "/employer-dashboard/:path*",
    "/partner-portal/:path*",
    "/ambassador/student-portal/:path*",
    "/ambassador/student-passport/:path*",
    "/ambassador/student/:path*",
    "/student-portal/:path*",
    "/student-dashboard/:path*",
  ],
};
