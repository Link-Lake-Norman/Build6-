"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import PlatformHeader from "@/components/PlatformHeader";
import PageHistoryControls from "@/components/navigation/PageHistoryControls";
import type { SessionUser } from "@/lib/auth/session";

type Props = {
  session: SessionUser | null;
  children: ReactNode;
};

type NavItem = {
  href: string;
  label: string;
  description?: string;
};

const primaryNavigation: NavItem[] = [
  {
    href: "/ambassador/facilitator",
    label: "Dashboard",
    description: "Your cohort operating center",
  },
  {
    href: "/ambassador/curriculum",
    label: "Lesson Plans",
    description: "Follow the 16-week Future Ready™ plan",
  },
];

const classNavigation: NavItem[] = [
  {
    href: "/ambassador/lesson-builder",
    label: "AI Activity Generator",
    description: "Generate optional classroom activities",
  },
  {
    href: "/ambassador/resources",
    label: "Teaching Resources",
    description: "Preview, download and add lesson assets",
  },
];

const studentNavigation: NavItem[] = [
  {
    href: "/ambassador/facilitator/students",
    label: "Students",
    description: "Roster, Passport, portfolio and Capstone",
  },
  {
    href: "/ambassador/facilitator/attendance",
    label: "Attendance",
    description: "Record class attendance",
  },
  {
    href: "/ambassador/messages",
    label: "Messages",
    description: "Student and program communication",
  },
];

const insightNavigation: NavItem[] = [];

function isWorkspacePath(pathname: string) {
  return (
    pathname === "/ambassador/facilitator" ||
    pathname.startsWith("/ambassador/facilitator/") ||
    pathname === "/ambassador/curriculum" ||
    pathname.startsWith("/ambassador/curriculum/") ||
    pathname === "/ambassador/planner" ||
    pathname.startsWith("/ambassador/planner/") ||
    pathname === "/ambassador/lesson-builder" ||
    pathname.startsWith("/ambassador/lesson-builder/") ||
    pathname === "/ambassador/resources" ||
    pathname.startsWith("/ambassador/resources/") ||
    pathname === "/ambassador/messages" ||
    pathname.startsWith("/ambassador/messages/")
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/ambassador/facilitator") {
    return pathname === href;
  }

  if (href === "/ambassador/curriculum") {
    return (
      pathname === "/ambassador/curriculum" ||
      pathname.startsWith("/ambassador/curriculum/")
    );
  }

  if (href === "/ambassador/planner") {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  if (href === "/ambassador/lesson-builder") {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  if (href === "/ambassador/facilitator/students") {
    return (
      pathname === href ||
      pathname.startsWith("/ambassador/facilitator/students/")
    );
  }

  if (href === "/ambassador/facilitator/attendance") {
    return pathname === href;
  }

  if (href === "/ambassador/resources") {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  if (href === "/ambassador/messages") {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return false;
}

export default function AmbassadorWorkspaceShell({
  session,
  children,
}: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const canUseFacilitatorWorkspace =
    session?.role === "FACILITATOR" ||
    session?.role === "SCHOOL_ADMIN" ||
    session?.role === "ORGANIZATION_ADMIN" ||
    session?.role === "SUPER_ADMIN";

  const facilitatorWorkspace =
    canUseFacilitatorWorkspace &&
    isWorkspacePath(pathname);

  const canAccessAdmin =
    session?.role === "SCHOOL_ADMIN" ||
    session?.role === "ORGANIZATION_ADMIN" ||
    session?.role === "SUPER_ADMIN";

  if (!facilitatorWorkspace) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <PlatformHeader session={session} />
        <PageHistoryControls />

        <div className="mx-auto w-full max-w-7xl px-6 py-8">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* WORKSPACE TOP BAR */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((current) => !current)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-lg font-black text-[#0D1B3D] lg:hidden"
              aria-label="Open facilitator navigation"
            >
              ☰
            </button>

            <Link
              href="/ambassador/facilitator"
              className="text-decoration-none"
            >
              <p className="text-lg font-black text-[#0D1B3D]">
                Future Ready™
              </p>
              <p className="text-xs font-bold text-slate-500">
                Ambassador Facilitator Workspace
              </p>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-black text-[#0D1B3D]">
                {session?.name}
              </p>
              <p className="text-xs font-bold text-[#4B2265]">
                Ambassador Christian School
              </p>
            </div>

            {canAccessAdmin ? (
              <Link
                href="/ambassador/admin"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black text-[#0D1B3D]"
              >
                Admin ↗
              </Link>
            ) : null}

            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-600"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* DESKTOP SIDEBAR */}
        <aside className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-[260px] shrink-0 overflow-y-auto border-r border-slate-200 bg-white lg:block">
          <WorkspaceSidebar
            pathname={pathname}
            canAccessAdmin={canAccessAdmin}
          />
        </aside>

        {/* MOBILE SIDEBAR */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-slate-950/40"
            />

            <aside className="relative h-full w-[290px] overflow-y-auto bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-4">
                <strong className="text-[#0D1B3D]">
                  Facilitator Workspace
                </strong>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 font-black"
                >
                  ×
                </button>
              </div>

              <WorkspaceSidebar
                pathname={pathname}
                canAccessAdmin={canAccessAdmin}
                onNavigate={() => setMobileOpen(false)}
              />
            </aside>
          </div>
        ) : null}

        {/* PAGE CONTENT */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1500px] px-4 py-5 md:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function WorkspaceSidebar({
  pathname,
  canAccessAdmin,
  onNavigate,
}: {
  pathname: string;
  canAccessAdmin: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="p-4">
      <div className="mb-5 rounded-2xl bg-[#0D1B3D] p-4 text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#F2B705]">
          ACTIVE COHORT
        </p>

        <p className="mt-2 text-sm font-black">
          Ambassador Christian School
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-300">
          Pilot 2026–2027
        </p>
      </div>

      <SidebarGroup
        title="TODAY"
        items={primaryNavigation}
        pathname={pathname}
        onNavigate={onNavigate}
      />

      <SidebarGroup
        title="TEACHING TOOLS"
        items={classNavigation}
        pathname={pathname}
        onNavigate={onNavigate}
      />

      <SidebarGroup
        title="STUDENTS + CLASS"
        items={studentNavigation}
        pathname={pathname}
        onNavigate={onNavigate}
      />

      {canAccessAdmin ? (
        <div className="mt-6 border-t border-slate-200 pt-5">
          <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            ADMINISTRATION
          </p>

          <Link
            href="/ambassador/admin"
            onClick={onNavigate}
            className="block rounded-xl px-3 py-3 text-sm font-black text-slate-600 hover:bg-slate-100"
          >
            Admin Center ↗
          </Link>

          <Link
            href="/ambassador/admin/asset-vault"
            onClick={onNavigate}
            className="mt-1 block rounded-xl px-3 py-3 text-sm font-black text-slate-600 hover:bg-slate-100"
          >
            Asset Vault ↗
          </Link>
        </div>
      ) : null}
    </nav>
  );
}

function SidebarGroup({
  title,
  items,
  pathname,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
        {title}
      </p>

      <div className="space-y-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`block rounded-xl border px-3 py-3 transition ${
                active
                  ? "border-[#F2B705] bg-[#FFF7D6]"
                  : "border-transparent hover:bg-slate-100"
              }`}
            >
              <p
                className={`text-sm font-black ${
                  active
                    ? "text-[#0D1B3D]"
                    : "text-slate-700"
                }`}
              >
                {item.label}
              </p>

              {item.description ? (
                <p className="mt-1 text-[11px] leading-4 text-slate-500">
                  {item.description}
                </p>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
