"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type {
  SessionUser,
  UserRole,
} from "@/lib/auth/session";

type NavigationLink = {
  href: string;
  label: string;
};

function getNavigationLinks(
  role: UserRole | null,
  studentId?: string
): NavigationLink[] {
  if (!role) {
    return [
      {
        href: "/ambassador",
        label: "Home",
      },
      {
        href: "/ambassador/login",
        label: "Login",
      },
    ];
  }

  if (role === "STUDENT") {
    if (!studentId) {
      return [
        {
          href: "/ambassador",
          label: "Home",
        },
      ];
    }

    return [
      {
        href: `/ambassador/student-portal/${studentId}`,
        label: "Home",
      },
      {
        href: `/ambassador/student-portal/${studentId}/lesson/1`,
        label: "My Week",
      },
      {
        href: `/ambassador/student-portal/${studentId}/career-pathways`,
        label: "Career",
      },
      {
        href: `/ambassador/student-passport/${studentId}`,
        label: "Passport",
      },
      {
        href: "/ambassador/messages",
        label: "Messages",
      },
    ];
  }

  if (role === "FACILITATOR") {
    return [
      {
        href: "/ambassador",
        label: "Home",
      },
      {
        href: "/ambassador/curriculum",
        label: "Teaching Hub",
      },
      {
        href: "/ambassador/planner",
        label: "Plan + Build",
      },
      {
        href: "/ambassador/facilitator/students",
        label: "Students",
      },
      {
        href: "/ambassador/messages",
        label: "Messages",
      },
    ];
  }

  if (
    role === "SCHOOL_ADMIN" ||
    role === "ORGANIZATION_ADMIN"
  ) {
    return [
      {
        href: "/ambassador/admin",
        label: "Admin",
      },
      {
        href: "/ambassador/admin/command-center",
        label: "Command Center",
      },
      {
        href: "/ambassador/curriculum",
        label: "Curriculum",
      },
      {
        href: "/ambassador/facilitator/students",
        label: "Students",
      },
      {
        href: "/ambassador/facilitator/attendance",
        label: "Attendance",
      },
      {
        href: "/ambassador/employers",
        label: "Employers",
      },
    ];
  }

  if (role === "SUPER_ADMIN") {
    return [
      {
        href: "/ambassador",
        label: "Home",
      },
      {
        href: "/ambassador/admin",
        label: "Admin",
      },
      {
        href: "/ambassador/admin/command-center",
        label: "Command Center",
      },
      {
        href: "/ambassador/admin/permissions",
        label: "Permissions",
      },
      {
        href: "/ambassador/curriculum",
        label: "Curriculum",
      },
      {
        href: "/ambassador/lesson-builder",
        label: "Lesson Builder",
      },
      {
        href: "/ambassador/facilitator",
        label: "Facilitator",
      },
      {
        href: "/ambassador/facilitator/attendance",
        label: "Attendance",
      },
      {
        href: "/ambassador/facilitator/students",
        label: "Students",
      },
      {
        href: "/ambassador/employers",
        label: "Employers",
      },
      {
        href: "/ambassador/partner",
        label: "Partner",
      },
    ];
  }

  if (role === "EMPLOYER") {
    return [
      {
        href: "/ambassador/employer",
        label: "Employer Dashboard",
      },
    ];
  }

  if (role === "MENTOR") {
    return [
      {
        href: "/ambassador",
        label: "Home",
      },
    ];
  }

  return [
    {
      href: "/ambassador",
      label: "Home",
    },
  ];
}

function getHomeHref(
  session: SessionUser | null
) {
  if (
    session?.role === "STUDENT" &&
    session.studentId
  ) {
    return `/ambassador/student-portal/${session.studentId}`;
  }

  if (session?.role === "FACILITATOR") {
    return "/ambassador";
  }

  if (
    session?.role === "SCHOOL_ADMIN" ||
    session?.role === "ORGANIZATION_ADMIN" ||
    session?.role === "SUPER_ADMIN"
  ) {
    return "/ambassador/admin";
  }

  if (session?.role === "EMPLOYER") {
    return "/ambassador/employer";
  }

  return "/ambassador";
}

export default function PlatformHeader({
  session,
}: {
  session: SessionUser | null;
}) {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  let links = getNavigationLinks(
    session?.role ?? null,
    session?.studentId
  );

  // Workspace context controls navigation presentation.
  // Permissions still come from the signed-in role.
  const isFacilitatorWorkspace =
    pathname === "/ambassador/facilitator" ||
    pathname.startsWith("/ambassador/facilitator/") ||
    pathname === "/ambassador/curriculum" ||
    pathname.startsWith("/ambassador/curriculum/") ||
    pathname === "/ambassador/planner" ||
    pathname.startsWith("/ambassador/planner/") ||
    pathname === "/ambassador/lesson-builder" ||
    pathname.startsWith("/ambassador/lesson-builder/") ||
    pathname === "/ambassador/messages" ||
    pathname.startsWith("/ambassador/messages/");

  const canAccessAdmin =
    session?.role === "SCHOOL_ADMIN" ||
    session?.role === "ORGANIZATION_ADMIN" ||
    session?.role === "SUPER_ADMIN";

  const isFacilitatorRole =
    session?.role === "FACILITATOR" ||
    canAccessAdmin;

  if (isFacilitatorWorkspace && isFacilitatorRole) {
    links = [
      {
        href: "/ambassador/facilitator",
        label: "Dashboard",
      },
      {
        href: "/ambassador/curriculum",
        label: "Teach",
      },
      {
        href: "/ambassador/facilitator/students",
        label: "Students",
      },
      {
        href: "/ambassador/messages",
        label: "Messages",
      },
      ...(canAccessAdmin
        ? [
            {
              href: "/ambassador/admin",
              label: "Admin",
            },
          ]
        : []),
    ];
  }

  const homeHref =
    isFacilitatorWorkspace && isFacilitatorRole
      ? "/ambassador/facilitator"
      : getHomeHref(session);

  async function logout() {
    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      window.location.href =
        "/ambassador/login";
    }
  }

  return (
    <>
      <header className="border-b-4 border-[#F2B705] bg-[#0D1B3D] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <Link
            href={homeHref}
            className="block"
          >
            <p className="text-2xl font-black">
              Future Ready™
            </p>

            <p className="mt-1 text-sm text-slate-300">
              Discover Purpose. Build Skills. Launch Your Future.
            </p>
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F2B705]">
                Ambassador Christian School
              </p>

              <p className="mt-1 font-semibold">
                Future Ready™ Pilot Program
              </p>
            </div>

            {session && (
              <div className="rounded-xl border border-white/20 bg-white/5 px-5 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-300">
                  Signed In
                </p>

                <p className="mt-1 font-black">
                  {session.name}
                </p>

                <p className="mt-1 text-xs font-semibold text-[#F2B705]">
                  {formatRole(session.role)}
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-6 py-3">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (
                link.href !== "/ambassador" &&
                pathname.startsWith(
                  `${link.href}/`
                )
              );

            return (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "border-[#F2B705] bg-[#FFF3BF] text-[#0D1B3D]"
                    : "border-slate-200 text-slate-700 hover:border-[#F2B705] hover:bg-[#FFF9E6]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {session && (
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="ml-auto rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
            >
              {loggingOut
                ? "Signing Out..."
                : "Sign Out"}
            </button>
          )}
        </div>
      </nav>
    </>
  );
}

function formatRole(
  role: UserRole
) {
  return role
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(" ");
}
