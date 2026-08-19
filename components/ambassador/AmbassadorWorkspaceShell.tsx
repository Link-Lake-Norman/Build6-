"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

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
  badge?: number;
};

type WorkspaceMode = "ADMIN" | "STAFF" | "STUDENT" | null;

type AttentionCounts = {
  unreadMessages: number;
  pendingPasswordResets: number;
};

const emptyAttention: AttentionCounts = {
  unreadMessages: 0,
  pendingPasswordResets: 0,
};

const staffPrimary: NavItem[] = [
  {
    href: "/ambassador/facilitator",
    label: "Dashboard",
    description: "Today and your cohort",
  },
  {
    href: "/ambassador/curriculum",
    label: "Lesson Plans",
    description: "Teach and prepare",
  },
];

const staffTeaching: NavItem[] = [
  {
    href: "/ambassador/lesson-builder",
    label: "AI Activity Generator",
    description: "Optional classroom activities",
  },
  {
    href: "/ambassador/resources",
    label: "Teaching Resources",
    description: "Preview, edit and download",
  },
  {
    href: "/ambassador/calendar",
    label: "Calendar",
    description: "Topics, speakers and preparation",
  },
  {
    href: "/ambassador/experiences",
    label: "Experiences",
    description: "Speakers, field trips and employers",
  },
];

const staffStudents: NavItem[] = [
  {
    href: "/ambassador/facilitator/students",
    label: "Students",
    description: "Roster and student progress",
  },
  {
    href: "/ambassador/facilitator/assessments",
    label: "Assessments",
    description: "Assessment progress",
  },
  {
    href: "/ambassador/facilitator/attendance",
    label: "Attendance",
    description: "Record attendance",
  },
  {
    href: "/ambassador/messages",
    label: "Messages",
    description: "Program communication",
  },
  {
    href: "/ambassador/facilitator/analytics",
    label: "Analytics",
    description: "Progress and evidence",
  },
];

const adminItems: NavItem[] = [
  {
    href: "/ambassador/admin",
    label: "Admin Dashboard",
    description: "Program overview",
  },
  {
    href: "/ambassador/messages",
    label: "Messages",
    description: "Student and program communication",
  },
  {
    href: "/ambassador/admin/password-resets",
    label: "Password Help",
    description: "Student reset requests",
  },
  {
    href: "/ambassador/admin/command-center",
    label: "Command Center",
    description: "Program operations",
  },
  {
    href: "/ambassador/admin/cohorts",
    label: "Cohorts",
    description: "Manage cohorts",
  },
  {
    href: "/ambassador/admin/facilitators",
    label: "Facilitators",
    description: "Manage staff access",
  },
  {
    href: "/ambassador/admin/permissions",
    label: "Permissions",
    description: "Platform access controls",
  },
  {
    href: "/ambassador/admin/asset-vault",
    label: "Asset Vault",
    description: "Program assets",
  },
];

function isAdminRole(role: SessionUser["role"] | undefined) {
  return (
    role === "SCHOOL_ADMIN" ||
    role === "ORGANIZATION_ADMIN" ||
    role === "SUPER_ADMIN"
  );
}

function studentIdFromPath(pathname: string) {
  const portalMatch = pathname.match(/^\/ambassador\/student-portal\/([^/]+)/);

  if (portalMatch?.[1]) {
    return portalMatch[1];
  }

  const passportMatch = pathname.match(
    /^\/ambassador\/student-passport\/([^/]+)/,
  );

  if (passportMatch?.[1]) {
    return passportMatch[1];
  }

  const studentMatch = pathname.match(/^\/ambassador\/student\/([^/]+)/);

  return studentMatch?.[1] ?? null;
}

function studentItems(pathname: string): NavItem[] {
  const studentId = studentIdFromPath(pathname);

  if (!studentId) {
    return [];
  }

  return [
    {
      href: `/ambassador/student-portal/${studentId}`,
      label: "My Dashboard",
      description: "What matters right now",
    },
    {
      href: `/ambassador/student-portal/${studentId}/assessment`,
      label: "My Assessment",
      description: "Learn more about yourself",
    },
    {
      href: `/ambassador/student-portal/${studentId}/capstone`,
      label: "Build My Story",
      description: "Reflect, grow and build your I Am story",
    },
    {
      href: `/ambassador/student-portal/${studentId}/career-pathways`,
      label: "Explore What Fits Me",
      description: "Careers and opportunities",
    },
    {
      href: `/ambassador/student-passport/${studentId}`,
      label: "My Growth",
      description: "Skills, evidence and progress",
    },
    {
      href: "/ambassador/messages",
      label: "Messages",
      description: "Messages from your program",
    },
    {
      href: "/ambassador/calendar",
      label: "Month Ahead",
      description: "Topics, speakers and experiences",
    },
  ];
}

function workspaceMode(
  pathname: string,
  session: SessionUser | null,
): WorkspaceMode {
  if (!session) {
    return null;
  }

  if (
    pathname === "/ambassador/login" ||
    pathname === "/ambassador/register" ||
    pathname === "/ambassador/forgot-password"
  ) {
    return null;
  }

  /*
   * Messages are shared by multiple roles.
   * Keep each user inside their own workspace
   * rather than forcing everyone into the
   * facilitator navigation.
   */
  if (
    pathname === "/ambassador/messages" ||
    pathname.startsWith("/ambassador/messages/")
  ) {
    if (session.role === "STUDENT") {
      return "STUDENT";
    }

    if (isAdminRole(session.role)) {
      return "ADMIN";
    }

    return "STAFF";
  }

  if (
    pathname === "/ambassador/admin" ||
    pathname.startsWith("/ambassador/admin/")
  ) {
    return "ADMIN";
  }

  if (
    pathname.startsWith("/ambassador/student-portal/") ||
    pathname.startsWith("/ambassador/student-passport/")
  ) {
    return "STUDENT";
  }

  if (
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
    pathname === "/ambassador/calendar" ||
    pathname.startsWith("/ambassador/calendar/") ||
    pathname === "/ambassador/experiences" ||
    pathname.startsWith("/ambassador/experiences/")
  ) {
    return "STAFF";
  }

  return null;
}

function isActive(pathname: string, href: string) {
  if (pathname === href) {
    return true;
  }

  if (href === "/ambassador/admin") {
    return pathname === href;
  }

  if (href === "/ambassador/facilitator") {
    return pathname === href;
  }

  return pathname.startsWith(`${href}/`);
}

function applyAttention(
  items: NavItem[],
  attention: AttentionCounts,
): NavItem[] {
  return items.map((item) => {
    if (item.href === "/ambassador/messages") {
      return {
        ...item,
        badge: attention.unreadMessages,
      };
    }

    if (item.href === "/ambassador/admin/password-resets") {
      return {
        ...item,
        badge: attention.pendingPasswordResets,
      };
    }

    return item;
  });
}

export default function AmbassadorWorkspaceShell({ session, children }: Props) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [attention, setAttention] = useState<AttentionCounts>(emptyAttention);

  const mode = workspaceMode(pathname, session);

  const canAccessAdmin = isAdminRole(session?.role);

  useEffect(() => {
    if (!session) {
      setAttention(emptyAttention);
      return;
    }

    let cancelled = false;

    async function loadAttention() {
      try {
        const response = await fetch("/api/ambassador/attention", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const result = await response.json();

        if (!cancelled) {
          setAttention({
            unreadMessages:
              typeof result.unreadMessages === "number"
                ? result.unreadMessages
                : 0,
            pendingPasswordResets:
              typeof result.pendingPasswordResets === "number"
                ? result.pendingPasswordResets
                : 0,
          });
        }
      } catch {
        /*
         * Attention indicators are helpful,
         * but should never block the platform.
         */
      }
    }

    void loadAttention();

    const interval = window.setInterval(loadAttention, 30000);

    function refreshWhenVisible() {
      if (document.visibilityState === "visible") {
        void loadAttention();
      }
    }

    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      cancelled = true;

      window.clearInterval(interval);

      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [session, pathname]);

  if (!mode) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <PlatformHeader session={session} />

        <PageHistoryControls />

        <div className="mx-auto w-full max-w-7xl px-6 py-8">{children}</div>
      </div>
    );
  }

  const title =
    mode === "ADMIN"
      ? "Administration"
      : mode === "STUDENT"
        ? "Student Workspace"
        : "Facilitator Workspace";

  const attentionTotal =
    attention.unreadMessages +
    (canAccessAdmin ? attention.pendingPasswordResets : 0);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex min-h-[68px] items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((current) => !current)}
              className="relative rounded-xl border border-slate-200 px-3 py-2 text-lg font-black text-[#0D1B3D] lg:hidden"
              aria-label="Open navigation"
            >
              ☰
              {attentionTotal > 0 ? (
                <span
                  aria-label={`${attentionTotal} items need attention`}
                  className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-red-600"
                />
              ) : null}
            </button>

            <div>
              <p className="text-lg font-black text-[#0D1B3D]">
                Ambassador Program
              </p>

              <p className="text-xs font-bold text-slate-500">{title}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-black text-[#0D1B3D]">
                {session?.name}
              </p>

              <p className="text-xs font-bold text-slate-500">
                Ambassador Christian School
              </p>
            </div>

            {attention.unreadMessages > 0 ? (
              <Link
                href="/ambassador/messages"
                className="hidden rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700 md:inline-flex"
              >
                Messages · {attention.unreadMessages}
              </Link>
            ) : null}

            {canAccessAdmin && attention.pendingPasswordResets > 0 ? (
              <Link
                href="/ambassador/admin/password-resets"
                className="hidden rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700 md:inline-flex"
              >
                Password Help · {attention.pendingPasswordResets}
              </Link>
            ) : null}

            {canAccessAdmin && mode !== "ADMIN" ? (
              <Link
                href="/ambassador/admin"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black text-[#0D1B3D]"
              >
                Admin
              </Link>
            ) : null}

            {canAccessAdmin && mode === "ADMIN" ? (
              <Link
                href="/ambassador/facilitator"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black text-[#0D1B3D]"
              >
                Teaching
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
        <aside className="sticky top-[68px] hidden h-[calc(100vh-68px)] w-[250px] shrink-0 overflow-y-auto border-r border-slate-200 bg-white lg:block">
          <WorkspaceSidebar
            pathname={pathname}
            mode={mode}
            canAccessAdmin={canAccessAdmin}
            attention={attention}
          />
        </aside>

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
                <strong className="text-[#0D1B3D]">{title}</strong>

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
                mode={mode}
                canAccessAdmin={canAccessAdmin}
                attention={attention}
                onNavigate={() => setMobileOpen(false)}
              />
            </aside>
          </div>
        ) : null}

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
  mode,
  canAccessAdmin,
  attention,
  onNavigate,
}: {
  pathname: string;
  mode: Exclude<WorkspaceMode, null>;
  canAccessAdmin: boolean;
  attention: AttentionCounts;
  onNavigate?: () => void;
}) {
  if (mode === "STUDENT") {
    return (
      <nav className="p-4">
        <CohortCard />

        <SidebarGroup
          title="MY JOURNEY"
          items={applyAttention(studentItems(pathname), attention)}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      </nav>
    );
  }

  if (mode === "ADMIN") {
    return (
      <nav className="p-4">
        <CohortCard />

        <SidebarGroup
          title="ADMINISTRATION"
          items={applyAttention(adminItems, attention)}
          pathname={pathname}
          onNavigate={onNavigate}
        />

        <SidebarGroup
          title="PROGRAM"
          items={[
            {
              href: "/ambassador/facilitator",
              label: "Teaching Dashboard",
            },
            {
              href: "/ambassador/curriculum",
              label: "Lesson Plans",
            },
            {
              href: "/ambassador/calendar",
              label: "Calendar",
            },
            {
              href: "/ambassador/experiences",
              label: "Experiences",
            },
            {
              href: "/ambassador/resources",
              label: "Resources",
            },
            {
              href: "/ambassador/facilitator/students",
              label: "Students",
            },
          ]}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      </nav>
    );
  }

  return (
    <nav className="p-4">
      <CohortCard />

      <SidebarGroup
        title="TODAY"
        items={staffPrimary}
        pathname={pathname}
        onNavigate={onNavigate}
      />

      <SidebarGroup
        title="TEACHING TOOLS"
        items={staffTeaching}
        pathname={pathname}
        onNavigate={onNavigate}
      />

      <SidebarGroup
        title="STUDENTS + CLASS"
        items={applyAttention(staffStudents, attention)}
        pathname={pathname}
        onNavigate={onNavigate}
      />

      {canAccessAdmin ? (
        <SidebarGroup
          title="ADMIN"
          items={[
            {
              href: "/ambassador/admin",
              label: "Administration",
            },
          ]}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      ) : null}
    </nav>
  );
}

function CohortCard() {
  return (
    <div className="mb-5 rounded-2xl bg-[#0D1B3D] p-4 text-white">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#F2B705]">
        ACTIVE COHORT
      </p>

      <p className="mt-2 text-sm font-black">Ambassador Christian School</p>

      <p className="mt-1 text-xs leading-5 text-slate-300">Pilot 2026–2027</p>
    </div>
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
  if (items.length === 0) {
    return null;
  }

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
              className={`block rounded-xl px-3 py-3 transition ${
                active
                  ? "bg-[#FFF3BF] text-[#0D1B3D]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-[#0D1B3D]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-black">{item.label}</p>

                {item.badge && item.badge > 0 ? (
                  <span className="inline-flex min-w-6 shrink-0 items-center justify-center rounded-full bg-red-600 px-2 py-1 text-[10px] font-black leading-none text-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                ) : null}
              </div>

              {item.description ? (
                <p className="mt-1 text-xs leading-5 text-slate-500">
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
