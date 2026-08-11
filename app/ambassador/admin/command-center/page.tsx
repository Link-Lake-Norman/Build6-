"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type OperationsWeek = {
  week: number;
  sessionTopic: string;
  speakerName: string;
  sessionDate: string;
  status: string;
};

type Professional = {
  id: string;
  name: string;
  organization: string;
  assignedWeek: number | null;
  status: string;
};

type Project = {
  id: string;
  title: string;
  members: unknown[];
  tasks: Array<{ status: string }>;
};

type Message = {
  id: string;
  read: boolean;
};

const OPERATIONS_KEY = "future-ready:ambassador-operations";
const PROFESSIONALS_KEY = "future-ready:ambassador-professionals";
const PROJECTS_KEY = "future-ready:ambassador-projects";
const MESSAGES_KEY = "future-ready:ambassador-messages";

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const saved = window.localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function AdminCommandCenterPage() {
  const [operations, setOperations] = useState<OperationsWeek[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setOperations(readLocal<OperationsWeek[]>(OPERATIONS_KEY, []));
    setProfessionals(readLocal<Professional[]>(PROFESSIONALS_KEY, []));
    setProjects(readLocal<Project[]>(PROJECTS_KEY, []));
    setMessages(readLocal<Message[]>(MESSAGES_KEY, []));
    setHydrated(true);
  }, []);

  const currentWeek = useMemo(() => {
    if (!operations.length) return null;

    const dated = operations
      .filter((item) => item.sessionDate)
      .sort((a, b) => a.sessionDate.localeCompare(b.sessionDate));

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    return dated.find((item) => item.sessionDate >= todayKey) ?? operations[0];
  }, [operations]);

  const confirmedProfessionals = professionals.filter(
    (item) => item.status === "Confirmed",
  ).length;

  const unreadMessages = messages.filter((message) => !message.read).length;

  const openTasks = projects.reduce(
    (total, project) =>
      total +
      project.tasks.filter((task) => task.status !== "Complete").length,
    0,
  );

  const alerts = [
    currentWeek && !currentWeek.speakerName
      ? `Week ${currentWeek.week} does not have a confirmed professional.`
      : null,
    unreadMessages > 0
      ? `${unreadMessages} unread message${unreadMessages === 1 ? "" : "s"}.`
      : null,
    openTasks > 0
      ? `${openTasks} project task${openTasks === 1 ? "" : "s"} still open.`
      : null,
  ].filter(Boolean) as string[];

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-8">
        <p className="font-black text-slate-600">
          Loading Admin Command Center…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[30px] bg-[#0D1B3D] px-7 py-8 text-white shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F2B705]">
            Ambassador Christian School
          </p>
          <h1 className="mt-2 text-4xl font-black">
            Administrator Command Center
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-200">
            One place to manage the pilot, see what needs attention, and open every operational tool.
          </p>
        </header>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Students"
            value="20"
            detail="Ambassador 2026 cohort"
          />
          <Metric
            label="Confirmed Professionals"
            value={confirmedProfessionals}
            detail={`${professionals.length} total contacts`}
          />
          <Metric
            label="Active Projects"
            value={projects.length}
            detail={`${openTasks} open tasks`}
          />
          <Metric
            label="Unread Messages"
            value={unreadMessages}
            detail="Private platform messages"
          />
        </section>

        <section className="mt-8 grid gap-7 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-7">
            <section className={cardClass}>
              <p className={eyebrowClass}>CURRENT SESSION</p>

              {currentWeek ? (
                <>
                  <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                    Week {currentWeek.week}: {currentWeek.sessionTopic}
                  </h2>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <Info
                      label="Date"
                      value={currentWeek.sessionDate || "Not scheduled"}
                    />
                    <Info
                      label="Professional"
                      value={currentWeek.speakerName || "Not assigned"}
                    />
                    <Info
                      label="Status"
                      value={currentWeek.status || "Planning"}
                    />
                  </div>
                </>
              ) : (
                <p className="mt-3 text-slate-600">
                  Open Operations and add the first session date.
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <Action
                  href="/ambassador/session-planner"
                  label="Open Session Planner"
                  primary
                />
                <Action
                  href="/ambassador/operations"
                  label="Edit Calendar & Speaker"
                />
                <Action
                  href="/ambassador/facilitator/attendance"
                  label="Take Attendance"
                />
              </div>
            </section>

            <section className={cardClass}>
              <p className={eyebrowClass}>QUICK ACCESS</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Tile
                  href="/ambassador/facilitator/students"
                  title="Students"
                  description="Open the cohort directory."
                />
                <Tile
                  href="/ambassador/professionals"
                  title="Professionals"
                  description="Invite, edit, and assign contacts."
                />
                <Tile
                  href="/ambassador/projects"
                  title="Project Studio"
                  description="Review teams, tasks, and assets."
                />
                <Tile
                  href="/ambassador/messages"
                  title="Messages"
                  description="Send private messages or announcements."
                />
                <Tile
                  href="/ambassador/admin/permissions"
                  title="Permissions"
                  description="Turn platform access on or off."
                />
                <Tile
                  href="/ambassador/curriculum/1"
                  title="Curriculum"
                  description="Open weekly sessions."
                />
              </div>
            </section>
          </div>

          <aside className="space-y-7">
            <section className={cardClass}>
              <p className={eyebrowClass}>NEEDS ATTENTION</p>

              <div className="mt-5 space-y-3">
                {alerts.length ? (
                  alerts.map((alert) => (
                    <div
                      key={alert}
                      className="rounded-2xl border border-amber-200 bg-amber-50 p-4 font-bold text-amber-900"
                    >
                      {alert}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 font-bold text-emerald-900">
                    No immediate alerts.
                  </div>
                )}
              </div>
            </section>

            <section className={cardClass}>
              <p className={eyebrowClass}>ADMIN ACTIONS</p>
              <div className="mt-5 space-y-3">
                <Action
                  href="/ambassador/professionals"
                  label="+ Add Professional"
                  primary
                />
                <Action
                  href="/ambassador/projects"
                  label="+ Create Project"
                />
                <Action
                  href="/ambassador/messages"
                  label="Send Announcement"
                />
                <Action
                  href="/ambassador/operations"
                  label="+ Add Event"
                />
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}

const cardClass =
  "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm";

const eyebrowClass =
  "text-sm font-black uppercase tracking-[0.16em] text-[#725500]";

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <article className={cardClass}>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-4xl font-black text-[#0D1B3D]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
    </article>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-black text-[#0D1B3D]">{value}</p>
    </div>
  );
}

function Action({
  href,
  label,
  primary = false,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-block rounded-xl px-5 py-3 text-center font-black ${
        primary
          ? "bg-[#0D1B3D] text-white"
          : "border border-slate-300 bg-white text-slate-700"
      }`}
    >
      {label}
    </Link>
  );
}

function Tile({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 p-5 transition hover:border-[#F2B705] hover:bg-[#FFF9DF]"
    >
      <h3 className="text-xl font-black text-[#0D1B3D]">{title}</h3>
      <p className="mt-2 leading-6 text-slate-600">{description}</p>
    </Link>
  );
}
