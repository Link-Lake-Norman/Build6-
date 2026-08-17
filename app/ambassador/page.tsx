import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { curriculum } from "@/content/curriculum";
import { organization } from "@/content/platform";

const PILOT_COHORT_CODE = "PILOT-2026-2027";

const DAYS = [
  {
    number: 1,
    label: "Monday",
    purpose: "Teach + Connect",
  },
  {
    number: 2,
    label: "Tuesday",
    purpose: "Practice + Build",
  },
  {
    number: 3,
    label: "Wednesday",
    purpose: "Applied Learning",
  },
  {
    number: 4,
    label: "Thursday",
    purpose: "Experience + Flex",
  },
  {
    number: 5,
    label: "Friday",
    purpose: "Reflect + Evidence",
  },
];

function getTodayNumber() {
  const day = new Date().getDay();

  if (day >= 1 && day <= 5) {
    return day;
  }

  return 1;
}

export default async function AmbassadorDashboardPage() {
  const currentWeek = Math.max(
    1,
    Math.min(16, Number(organization.currentWeek) || 1)
  );

  // The facilitator dashboard follows actual teaching progress,
  // not the computer's weekday.
  //
  // Day 1 completed -> Day 2 becomes Next Class.
  // Day 2 completed -> Day 3 becomes Next Class.
  // This keeps the pilot aligned even when the school schedule changes.
  const calendarDayNumber = getTodayNumber();

  const cohort = await prisma.cohort.findFirst({
    where: {
      code: PILOT_COHORT_CODE,
      status: "ACTIVE",
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,

      _count: {
        select: {
          enrollments: true,
          facilitators: true,
        },
      },

      lessonPlanTasks: {
        where: {
          lesson: {
            weekNumber: currentWeek,
          },
        },
        orderBy: [
          {
            dayNumber: "asc",
          },
          {
            sortOrder: "asc",
          },
        ],
        select: {
          id: true,
          title: true,
          taskType: true,
          instructions: true,
          dayNumber: true,
          durationMinutes: true,
          requirement: true,
        },
      },

      experiences: {
        where: {
          weekNumber: currentWeek,
        },
        orderBy: [
          {
            dayNumber: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
        select: {
          id: true,
          title: true,
          experienceType: true,
          dayNumber: true,
          eventDate: true,
          startTime: true,
        },
      },

      dayCompletions: {
        where: {
          lesson: {
            weekNumber: currentWeek,
          },
        },
        select: {
          id: true,
          dayNumber: true,
          completedAt: true,
        },
      },
    },
  });

  const curriculumWeek =
    curriculum.find((item) => item.week === currentWeek) ??
    null;

  const tasks = cohort?.lessonPlanTasks ?? [];
  const experiences = cohort?.experiences ?? [];
  const completions = cohort?.dayCompletions ?? [];

  const completedDayNumbers = new Set(
    completions.map((item) => item.dayNumber)
  );

  // Find the first unfinished teaching day.
  // This becomes the facilitator's Next Class.
  const nextIncompleteDay =
    DAYS.find((day) => !completedDayNumbers.has(day.number))?.number ?? 5;

  // If every day is complete, remain on Day 5 so the completed
  // week can still be reviewed without jumping into another week.
  const todayNumber = nextIncompleteDay;

  const todayTasks = tasks.filter(
    (task) => task.dayNumber === todayNumber
  );

  const todayExperience = experiences.find(
    (item) => item.dayNumber === todayNumber
  );

  const todayCompleted = completions.some(
    (item) => item.dayNumber === todayNumber
  );

  const todayMinutes = todayTasks.reduce(
    (sum, task) => sum + task.durationMinutes,
    0
  );

  return (
    <main className="space-y-8">
      <header className="rounded-3xl bg-[#0D1B3D] px-7 py-8 text-white shadow-lg md:px-9">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">
          Ambassador Christian School · Future Ready™ Pilot
        </p>

        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black md:text-4xl">
              This Week. Today. Teach.
            </h1>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-200">
              Your weekly teaching command center. Start here,
              teach from the daily plan, and mark the day complete.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-4">
            <p className="text-xs font-black uppercase tracking-wider text-[#F2B705]">
              Current Week
            </p>
            <p className="mt-1 text-3xl font-black">
              Week {currentWeek}
            </p>
          </div>
        </div>
      </header>

      <section className="rounded-3xl border-2 border-[#00A6A6] bg-[#EAFBFB] p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#007C7C]">
              Next Class · Day {todayNumber} · {DAYS[todayNumber - 1]?.label}
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
              {curriculumWeek?.title ??
                `Week ${currentWeek} Future Ready™ Lesson`}
            </h2>

            <p className="mt-3 text-base leading-7 text-slate-700">
              {curriculumWeek?.objective ??
                curriculumWeek?.workplaceConnection ??
                "Open today's lesson and follow the teaching sequence."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#0D1B3D]">
              {todayTasks.length} Plan Item
              {todayTasks.length === 1 ? "" : "s"}
            </span>

            <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#0D1B3D]">
              {todayMinutes || 50} Min
            </span>

            <span
              className={`rounded-full px-4 py-2 text-xs font-black ${
                todayCompleted
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-[#FFF4C2] text-[#725500]"
              }`}
            >
              {todayCompleted
                ? "✓ Completed"
                : "Ready to Teach"}
            </span>
          </div>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_auto]">
          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs font-black uppercase tracking-wider text-[#4B2265]">
              Next Class Plan
            </p>

            {todayTasks.length > 0 ? (
              <div className="mt-4 space-y-3">
                {todayTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-4 rounded-xl border border-slate-200 p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0D1B3D] text-xs font-black text-white">
                      {index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-[#4B2265]">
                            {task.taskType}
                          </p>

                          <p className="mt-1 font-black text-[#0D1B3D]">
                            {task.title}
                          </p>
                        </div>

                        <span className="text-xs font-bold text-slate-500">
                          {task.durationMinutes} min
                        </span>
                      </div>

                      {task.instructions ? (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                          {task.instructions}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <p className="font-black text-[#0D1B3D]">
                  Core lesson is ready.
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Open the week's teaching view to use the lesson,
                  activities, worksheets, playbook, and facilitator tools.
                </p>
              </div>
            )}

            {todayExperience ? (
              <div className="mt-4 rounded-xl border border-[#F2B705] bg-[#FFF9DF] p-4">
                <p className="text-xs font-black uppercase tracking-wider text-[#725500]">
                  Experience
                </p>
                <p className="mt-1 font-black text-[#0D1B3D]">
                  {todayExperience.title}
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex min-w-[220px] flex-col gap-3">
            <Link
              href={`/ambassador/curriculum/${currentWeek}`}
              className="rounded-xl bg-[#0D1B3D] px-6 py-4 text-center font-black text-white shadow-sm"
            >
              Open Day {todayNumber} Lesson →
            </Link>

            <Link
              href="/ambassador/planner"
              className="rounded-xl border-2 border-[#0D1B3D] bg-white px-6 py-4 text-center font-black text-[#0D1B3D]"
            >
              Adjust This Week
            </Link>

            <Link
              href="/ambassador/facilitator/attendance"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center text-sm font-black text-[#0D1B3D]"
            >
              Attendance
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
              Week {currentWeek}
            </p>

            <h2 className="mt-1 text-2xl font-black text-[#0D1B3D]">
              Weekly Plan of Action
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            Open a day to teach. Use Planner only when you need to customize.
          </p>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-5">
          {DAYS.map((day) => {
            const dayTasks = tasks.filter(
              (task) => task.dayNumber === day.number
            );

            const dayMinutes = dayTasks.reduce(
              (sum, task) =>
                sum + task.durationMinutes,
              0
            );

            const complete = completions.some(
              (item) =>
                item.dayNumber === day.number
            );

            const experience = experiences.find(
              (item) =>
                item.dayNumber === day.number
            );

            return (
              <Link
                key={day.number}
                href={`/ambassador/curriculum/${currentWeek}`}
                className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-sm ${
                  day.number === todayNumber
                    ? "border-[#00A6A6] bg-[#EAFBFB]"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-[#4B2265]">
                      Day {day.number}
                    </p>
                    <p className="mt-1 font-black text-[#0D1B3D]">
                      {day.label}
                    </p>
                  </div>

                  {complete ? (
                    <span className="text-lg font-black text-emerald-600">
                      ✓
                    </span>
                  ) : null}
                </div>

                <p className="mt-3 text-xs font-bold text-slate-500">
                  {day.purpose}
                </p>

                <p className="mt-3 text-sm font-semibold text-[#0D1B3D]">
                  {dayTasks.length > 0
                    ? `${dayTasks.length} item${
                        dayTasks.length === 1
                          ? ""
                          : "s"
                      } · ${dayMinutes} min`
                    : "Core lesson"}
                </p>

                {experience ? (
                  <p className="mt-2 text-xs font-bold text-[#725500]">
                    ★ {experience.title}
                  </p>
                ) : null}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SupportLink
          href={`/ambassador/curriculum/${currentWeek}`}
          title="Weekly Playbook"
          description="Lesson plan, worksheets, slides, printables, facilitator materials, and student evidence."
        />

        <SupportLink
          href="/ambassador/planner"
          title="Generate Classroom Activities"
          description="Customize the week or generate a detailed activity when the lesson needs one."
        />

        <SupportLink
          href="/ambassador/facilitator/students"
          title="Students"
          description={`${cohort?._count.enrollments ?? 0} active students · readiness, profiles, reflections, and progress.`}
        />

        <SupportLink
          href="/ambassador/admin"
          title="Administration"
          description={`${cohort?._count.facilitators ?? 0} facilitators · cohorts, permissions, and school administration.`}
        />
      </section>
    </main>
  );
}

function SupportLink({
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
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#00A6A6] hover:shadow-md"
    >
      <h3 className="font-black text-[#0D1B3D]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <p className="mt-4 text-sm font-black text-[#4B2265]">
        Open →
      </p>
    </Link>
  );
}
