import Link from "next/link";
import { notFound } from "next/navigation";
import { ambassadorStudents } from "@/content/ambassador-students";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type Competency = {
  name: string;
  score: number;
  description: string;
};

type Badge = {
  name: string;
  description: string;
  earned: boolean;
};

type Milestone = {
  title: string;
  description: string;
  complete: boolean;
};

export default async function StudentProfilePage({
  params,
}: PageProps) {
  const { id } = await params;

  const student = ambassadorStudents.find(
    (item) => item.id === id
  );

  if (!student) {
    notFound();
  }

  const currentWeek = student.currentWeek ?? 1;
  const readinessScore = student.readinessScore ?? 0;

  const lessonsCompleted = Math.max(currentWeek - 1, 0);
  const activitiesCompleted = Math.max(currentWeek - 1, 0);
  const reflectionsCompleted = Math.max(currentWeek - 1, 0);
  const attendanceRate = 100;
  const portfolioCompletion = Math.min(
    Math.round(readinessScore * 0.8),
    100
  );

  const competencies: Competency[] = [
    {
      name: "Communication",
      score: Math.min(readinessScore + 2, 100),
      description:
        "Expresses ideas clearly, listens actively, and communicates professionally.",
    },
    {
      name: "Teamwork",
      score: Math.min(readinessScore - 3, 100),
      description:
        "Collaborates with peers, supports team goals, and contributes reliably.",
    },
    {
      name: "Professionalism",
      score: Math.min(readinessScore + 1, 100),
      description:
        "Demonstrates responsibility, preparation, and workplace expectations.",
    },
    {
      name: "Problem Solving",
      score: Math.min(readinessScore - 5, 100),
      description:
        "Analyzes challenges, considers options, and takes effective action.",
    },
    {
      name: "Leadership",
      score: Math.min(readinessScore - 7, 100),
      description:
        "Shows initiative, supports others, and positively influences outcomes.",
    },
    {
      name: "Adaptability",
      score: Math.min(readinessScore + 3, 100),
      description:
        "Responds constructively to change, feedback, and new situations.",
    },
  ];

  const badges: Badge[] = [
    {
      name: "Future Ready Explorer",
      description:
        "Began the Future Ready™ journey and completed the opening experience.",
      earned: currentWeek >= 1,
    },
    {
      name: "Self-Awareness Builder",
      description:
        "Identified personal strengths, interests, and areas for growth.",
      earned: currentWeek >= 2,
    },
    {
      name: "Career Explorer",
      description:
        "Completed career pathway exploration and research.",
      earned: currentWeek >= 4,
    },
    {
      name: "Professional Communicator",
      description:
        "Demonstrated effective written and verbal communication.",
      earned: currentWeek >= 8,
    },
    {
      name: "Workplace Ready",
      description:
        "Completed core professional skills and workplace preparation.",
      earned: currentWeek >= 18,
    },
    {
      name: "Launch Ready",
      description:
        "Completed the full internship and career readiness pathway.",
      earned: currentWeek >= 36,
    },
  ];

  const employerMilestones: Milestone[] = [
    {
      title: "Future Ready Profile",
      description:
        "Personal information, strengths, goals, and career interests completed.",
      complete: true,
    },
    {
      title: "Professional Email",
      description:
        "Uses an appropriate email address and professional communication.",
      complete: readinessScore >= 40,
    },
    {
      title: "Resume",
      description:
        "Resume has been drafted, reviewed, and approved.",
      complete: readinessScore >= 55,
    },
    {
      title: "Mock Interview",
      description:
        "Completed interview preparation and a practice interview.",
      complete: readinessScore >= 70,
    },
    {
      title: "Workplace Skills",
      description:
        "Demonstrated communication, teamwork, reliability, and professionalism.",
      complete: readinessScore >= 75,
    },
    {
      title: "Employer Introduction Ready",
      description:
        "Approved to participate in employer and internship introductions.",
      complete: readinessScore >= 85,
    },
  ];

  const earnedBadges = badges.filter(
    (badge) => badge.earned
  ).length;

  const completedMilestones = employerMilestones.filter(
    (milestone) => milestone.complete
  ).length;

  const studentInitials = student.name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-[#0D1B3D] text-white shadow-lg">
        <div className="grid gap-8 px-8 py-10 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-[#F2B705] text-4xl font-black text-[#0D1B3D] shadow-lg">
            {studentInitials}
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F2B705]">
              Future Ready™ Student Record
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              {student.name}
            </h1>

            <p className="mt-3 text-lg text-slate-200">
              Ambassador Christian School
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <ProfileTag label={student.grade} />

              <ProfileTag label="Ambassador 2026" />

              <ProfileTag
                label={`Current Week ${currentWeek}`}
              />

              <ProfileTag
                label={
                  student.internshipReady
                    ? "Internship Ready"
                    : "Building Readiness"
                }
              />
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-7 text-center backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-300">
              Readiness Score
            </p>

            <p className="mt-3 text-6xl font-black text-[#F2B705]">
              {readinessScore}%
            </p>

            <p className="mt-2 text-sm text-slate-300">
              Future Ready™ Index
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current Week"
          value={String(currentWeek)}
          detail="36-week journey"
        />

        <StatCard
          label="Lessons Complete"
          value={String(lessonsCompleted)}
          detail="Facilitator-led lessons"
        />

        <StatCard
          label="Attendance"
          value={`${attendanceRate}%`}
          detail="Current participation"
        />

        <StatCard
          label="Badges Earned"
          value={String(earnedBadges)}
          detail={`${badges.length} available`}
        />
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
                Current Learning
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
                Week {currentWeek}
              </h2>

              <p className="mt-3 text-lg leading-8 text-slate-600">
                Continue the current Future Ready™ lesson,
                complete the activity, and submit the weekly
                reflection.
              </p>
            </div>

            <span className="inline-flex rounded-full bg-[#FFF3C4] px-4 py-2 text-sm font-bold text-[#7A5900]">
              In Progress
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Link
              href={`/ambassador/curriculum/${currentWeek}`}
              className="flex min-h-20 items-center justify-center rounded-2xl bg-[#0D1B3D] px-5 py-4 text-center font-bold text-white transition hover:bg-[#172B55]"
            >
              Open Lesson
            </Link>

            <Link
              href={`/ambassador/facilitator/lesson/${currentWeek}/activity`}
              className="flex min-h-20 items-center justify-center rounded-2xl bg-[#F2B705] px-5 py-4 text-center font-bold text-[#0D1B3D] transition hover:bg-[#DDA600]"
            >
              View Activity
            </Link>

            <Link
              href={`/ambassador/facilitator/lesson/${currentWeek}/reflection`}
              className="flex min-h-20 items-center justify-center rounded-2xl border-2 border-[#0D1B3D] px-5 py-4 text-center font-bold text-[#0D1B3D] transition hover:bg-slate-50"
            >
              View Reflection
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4B2265]">
            Student Actions
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#0D1B3D]">
            Profile Tools
          </h2>

          <div className="mt-6 space-y-3">
            <Link
              href={`/ambassador/student-portal/${student.id}/portfolio`}
              className="flex items-center justify-between rounded-xl border border-slate-200 px-5 py-4 font-bold text-slate-800 transition hover:border-[#F2B705] hover:bg-[#FFF9E6]"
            >
              Digital Portfolio
              <span>→</span>
            </Link>

            <Link
              href={`/ambassador/student-portal/${student.id}/attendance`}
              className="flex items-center justify-between rounded-xl border border-slate-200 px-5 py-4 font-bold text-slate-800 transition hover:border-[#F2B705] hover:bg-[#FFF9E6]"
            >
              Attendance Record
              <span>→</span>
            </Link>

            <Link
              href={`/ambassador/student-passport/${student.id}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 px-5 py-4 font-bold text-slate-800 transition hover:border-[#F2B705] hover:bg-[#FFF9E6]"
            >
              Student Passport
              <span>→</span>
            </Link>

            <Link
              href="/ambassador/facilitator/students"
              className="flex items-center justify-between rounded-xl border border-slate-200 px-5 py-4 font-bold text-slate-800 transition hover:border-[#F2B705] hover:bg-[#FFF9E6]"
            >
              Back to Roster
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
          Growth Timeline
        </p>

        <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
          Future Ready™ Journey
        </h2>

        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
          Each completed week adds new skills, reflections,
          badges, and portfolio evidence to the student record.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
          {Array.from({ length: 36 }, (_, index) => {
            const week = index + 1;
            const completed = week < currentWeek;
            const active = week === currentWeek;

            return (
              <Link
                key={week}
                href={`/ambassador/curriculum/${week}`}
                className={`flex min-h-16 items-center justify-center rounded-xl border-2 text-center font-bold transition ${
                  completed
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : active
                      ? "border-[#F2B705] bg-[#FFF3C4] text-[#0D1B3D]"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-400"
                }`}
              >
                {completed
                  ? `✓ ${week}`
                  : active
                    ? `▶ ${week}`
                    : week}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
            Skills Growth
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
            Future Ready Competencies
          </h2>

          <div className="mt-8 space-y-6">
            {competencies.map((competency) => (
              <CompetencyBar
                key={competency.name}
                competency={competency}
              />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4B2265]">
            Recognition
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
            Badges and Milestones
          </h2>

          <div className="mt-8 grid gap-4">
            {badges.map((badge) => (
              <BadgeCard
                key={badge.name}
                badge={badge}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
              Employer Readiness
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
              Internship Preparation
            </h2>

            <p className="mt-3 text-lg leading-8 text-slate-600">
              {completedMilestones} of{" "}
              {employerMilestones.length} readiness milestones
              completed.
            </p>
          </div>

          <div className="rounded-2xl bg-[#0D1B3D] px-7 py-5 text-center text-white">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-300">
              Readiness
            </p>

            <p className="mt-2 text-4xl font-black text-[#F2B705]">
              {readinessScore}%
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {employerMilestones.map((milestone) => (
            <MilestoneCard
              key={milestone.title}
              milestone={milestone}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
            Portfolio Progress
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
            Digital Portfolio
          </h2>

          <div className="mt-7">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">
                Portfolio Completion
              </span>

              <span className="font-black text-[#0D1B3D]">
                {portfolioCompletion}%
              </span>
            </div>

            <div className="mt-3 h-4 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[#F2B705]"
                style={{
                  width: `${portfolioCompletion}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <PortfolioPreview
              title="About Me"
              status="Complete"
            />

            <PortfolioPreview
              title="Career Vision"
              status={
                currentWeek >= 2
                  ? "Complete"
                  : "Not Started"
              }
            />

            <PortfolioPreview
              title="Resume"
              status={
                readinessScore >= 55
                  ? "Complete"
                  : "In Progress"
              }
            />

            <PortfolioPreview
              title="Projects"
              status={`${activitiesCompleted} artifacts`}
            />

            <PortfolioPreview
              title="Reflections"
              status={`${reflectionsCompleted} submitted`}
            />

            <PortfolioPreview
              title="Internship Experience"
              status="Not Started"
            />
          </div>

          <Link
            href={`/ambassador/student-portal/${student.id}/portfolio`}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#0D1B3D] px-6 py-3 font-bold text-white transition hover:bg-[#172B55]"
          >
            Open Full Portfolio
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4B2265]">
            Facilitator Support
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
            Coach Notes
          </h2>

          <textarea
            className="mt-6 min-h-52 w-full rounded-2xl border border-slate-300 p-5 text-base leading-7 outline-none transition focus:border-[#F2B705] focus:ring-4 focus:ring-[#F2B705]/20"
            placeholder="Add strengths, progress observations, follow-up items, goals, or intervention notes..."
          />

          <button
            type="button"
            className="mt-4 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#0D1B3D] px-6 py-3 font-bold text-white transition hover:bg-[#172B55]"
          >
            Save Facilitator Note
          </button>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Notes will be connected to the database after
            persistent storage is activated.
          </p>
        </div>
      </section>
    </main>
  );
}

function ProfileTag({
  label,
}: {
  label: string;
}) {
  return (
    <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
      {label}
    </span>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-4xl font-black text-[#0D1B3D]">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {detail}
      </p>
    </article>
  );
}

function CompetencyBar({
  competency,
}: {
  competency: Competency;
}) {
  const safeScore = Math.min(
    Math.max(competency.score, 0),
    100
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-bold text-slate-900">
            {competency.name}
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {competency.description}
          </p>
        </div>

        <span className="shrink-0 text-xl font-black text-[#0D1B3D]">
          {safeScore}%
        </span>
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-[#F2B705]"
          style={{
            width: `${safeScore}%`,
          }}
        />
      </div>
    </div>
  );
}

function BadgeCard({
  badge,
}: {
  badge: Badge;
}) {
  return (
    <article
      className={`rounded-2xl border p-5 ${
        badge.earned
          ? "border-[#F2B705] bg-[#FFF9E6]"
          : "border-slate-200 bg-slate-50 opacity-70"
      }`}
    >
      <div className="flex gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-black ${
            badge.earned
              ? "bg-[#F2B705] text-[#0D1B3D]"
              : "bg-slate-200 text-slate-500"
          }`}
        >
          {badge.earned ? "✓" : "○"}
        </div>

        <div>
          <p className="font-bold text-slate-900">
            {badge.name}
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {badge.description}
          </p>

          <p
            className={`mt-3 text-xs font-bold uppercase tracking-wide ${
              badge.earned
                ? "text-[#7A5900]"
                : "text-slate-500"
            }`}
          >
            {badge.earned ? "Earned" : "Locked"}
          </p>
        </div>
      </div>
    </article>
  );
}

function MilestoneCard({
  milestone,
}: {
  milestone: Milestone;
}) {
  return (
    <article
      className={`rounded-2xl border p-5 ${
        milestone.complete
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-black ${
            milestone.complete
              ? "bg-emerald-600 text-white"
              : "bg-slate-200 text-slate-500"
          }`}
        >
          {milestone.complete ? "✓" : "○"}
        </div>

        <div>
          <p className="font-bold text-slate-900">
            {milestone.title}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {milestone.description}
          </p>
        </div>
      </div>
    </article>
  );
}

function PortfolioPreview({
  title,
  status,
}: {
  title: string;
  status: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 p-5">
      <p className="font-bold text-slate-900">
        {title}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-500">
        {status}
      </p>
    </article>
  );
}