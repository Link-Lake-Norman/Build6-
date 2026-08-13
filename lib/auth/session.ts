import { cookies } from "next/headers";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const SESSION_COOKIE_NAME = "future-ready-session";

export type UserRole =
  | "SUPER_ADMIN"
  | "ORGANIZATION_ADMIN"
  | "SCHOOL_ADMIN"
  | "FACILITATOR"
  | "EMPLOYER"
  | "MENTOR"
  | "STUDENT";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  schoolId?: string;
  studentId?: string;
  facilitatorId?: string;
  employerId?: string;
};

type SessionPayload = JWTPayload & SessionUser;

const ISSUER = "future-ready";
const AUDIENCE = "future-ready-platform";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function getSessionSecret() {
  const value = process.env.AUTH_SESSION_SECRET;

  if (!value) {
    throw new Error(
      "AUTH_SESSION_SECRET is not configured."
    );
  }

  return new TextEncoder().encode(value);
}

export async function createSessionToken(
  user: SessionUser
) {
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId,
    schoolId: user.schoolId,
    studentId: user.studentId,
    facilitatorId: user.facilitatorId,
    employerId: user.employerId,
  })
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setSubject(user.id)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(
      `${SESSION_DURATION_SECONDS}s`
    )
    .sign(getSessionSecret());
}

export async function verifySessionToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } =
      await jwtVerify<SessionPayload>(
        token,
        getSessionSecret(),
        {
          issuer: ISSUER,
          audience: AUDIENCE,
          algorithms: ["HS256"],
        }
      );

    if (
      typeof payload.id !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role as UserRole,
      organizationId:
        typeof payload.organizationId === "string"
          ? payload.organizationId
          : undefined,
      schoolId:
        typeof payload.schoolId === "string"
          ? payload.schoolId
          : undefined,
      studentId:
        typeof payload.studentId === "string"
          ? payload.studentId
          : undefined,
      facilitatorId:
        typeof payload.facilitatorId === "string"
          ? payload.facilitatorId
          : undefined,
      employerId:
        typeof payload.employerId === "string"
          ? payload.employerId
          : undefined,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(
  user: SessionUser
) {
  const token = await createSessionToken(user);
  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    }
  );
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    "",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    }
  );
}

export async function getSessionUser():
  Promise<SessionUser | null> {
  const cookieStore = await cookies();

  const token =
    cookieStore.get(
      SESSION_COOKIE_NAME
    )?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export function roleAllowed(
  user: SessionUser | null,
  roles: UserRole[]
) {
  return Boolean(
    user && roles.includes(user.role)
  );
}
