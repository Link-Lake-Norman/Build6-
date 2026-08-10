import Link from "next/link";
import { notFound } from "next/navigation";
import StatCard from "@/components/StatCard";
import {
  curriculum,
  students,
} from "@/content/platform";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const competencies = [
  {
    name: "Communication",
    score: 82,
  },
  {
    name: "Teamwork",
    score: 78,
  },
  {
    name: "Professionalism",
    score: 80,
  },
  {
    name: "Leadership",
    score: 72,
  },
  {
    name: "Problem Solving",
    score: 76,
  },
  {
    name: "Adaptability",
    score: 74,
  },
];

export default async function StudentPassportPage({
  params,
}: PageProps) {
  const { id } = await params;

  const student = students.find(
    (item) => item.id === id
  );

  if (!student) {
    notFound();
  }

  const currentLesson = curriculum.find(
    (item) => item.week === student.currentWeek
  );

  const initials = student.name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[32px] bg-[#0D1B3D] text-white shadow-xl">
        <div className="grid gap-8 p-8 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:p-10">
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-[#F2B705] text-4xl font-black text-[#0D1B3D]">
            {initials}
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F2B705]">
              Future Ready™ Student Passport
            </p>

            <h1 className="mt-3 text-4xl font-black">
              {student.name}
            </h1>

            <p className="mt-3 text-lg text-slate-200">
              Ambassador Christian School
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <PassportTag label={student.grade} />
              <PassportTag label={student.cohort} />
              <PassportTag
                label={`Week ${student.currentWeek}`}
              />
              <PassportTag label={student.status} />
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-7 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-300">
              Readiness Score
            </p>

            <p className="mt-3 text-6xl font-black text-[#F2B705]">
              {student.readinessScore}%
            </p>

            <p className="mt-2 text-sm text-slate-300">
              Future Ready™ Index
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/5 px-8 py-5">
          <p className="text-sm font-semibold text-slate-200">
            Discover Purpose. Build Skills. Launch Your Future.
          </p>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current Week"
          value={student.currentWeek}
          detail="36-week student journey"
        />

        <StatCard
          label="Attendance"
          value={`${student.attendanceRate}%`}
          detail="Participation and reliability"
        />

        <StatCard
          label="Skills"
          value={student.skills.length}
          detail="Documented competencies"
        />

        <StatCard
          label="Badges"
          value={student.badges.length}
          detail="Future Ready™ milestones"
        />
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
            Continue Your Journey
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
            Week {student.currentWeek}:{" "}
            {currentLesson?.title}
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            {currentLesson?.objective}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/ambassador/curriculum/${student.currentWeek}`}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#0D1B3D] px-6 py-3 font-black text-white transition hover:bg-[#172B55]"
            >
              Continue Learning
            </Link>

            <Link
              href={`/ambassador/student-passport/${student.id}/reflections`}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#F2B705] px-6 py-3 font-black text-[#0D1B3D] transition hover:bg-[#DDA600]"
            >
              Reflection Journal
            </Link>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4B2265]">
            Passport Tools
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            My Future Ready™ Record
          </h2>

          <div className="mt-6 space-y-3">
            <ToolLink
              href={`/ambassador/student-passport/${student.id}/profile`}
              label="My Profile"
            />

            <ToolLink
              href={`/ambassador/student-passport/${student.id}/portfolio`}
              label="Digital Portfolio"
            />

            <ToolLink
              href={`/ambassador/student-passport/${student.id}/reflections`}
              label="Reflection Journal"
            />

            <ToolLink
              href={`/ambassador/student-portal/${student.id}`}
              label="Complete Student Record"
            />
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
              Future Ready™ Journey
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
              36-Week Progress Path
            </h2>

            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
              Each week builds new skills, reflections,
              portfolio evidence, and readiness milestones.
            </p>
          </div>

          <p className="font-black text-[#0D1B3D]">
            Week {student.currentWeek} of 36
          </p>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-9">
          {curriculum.map((week) => {
            const complete =
              week.week < student.currentWeek;

            const current =
              week.week === student.currentWeek;

            return (
              <Link
                key={week.week}
                href={`/ambassador/curriculum/${week.week}`}
                className={`flex min-h-16 items-center justify-center rounded-xl border-2 font-black transition ${
                  complete
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : current
                      ? "border-[#F2B705] bg-[#FFF3C4] text-[#0D1B3D]"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-400"
                }`}
                title={`${week.phase}: ${week.title}`}
              >
                {complete
                  ? `✓ ${week.week}`
                  : current
                    ? `▶ ${week.week}`
                    : week.week}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
            Skills Dashboard
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
            Competency Growth
          </h2>

          <div className="mt-8 space-y-6">
            {competencies.map((competency) => (
              <SkillProgress
                key={competency.name}
                name={competency.name}
                score={competency.score}
              />
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4B2265]">
            Recognition
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
            Badges Earned
          </h2>

          <div className="mt-8 space-y-4">
            {student.badges.map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-4 rounded-2xl border border-[#F2B705] bg-[#FFF9E6] p-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2B705] text-xl font-black text-[#0D1B3D]">
                  ✓
                </div>

                <div>
                  <p className="font-black text-[#0D1B3D]">
                    {badge}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Future Ready™ milestone completed.
                  </p>
                </div>
              </div>
            ))}

            <LockedBadge label="Self-Awareness Builder" />
            <LockedBadge label="Career Explorer" />
            <LockedBadge label="Professional Communicator" />
            <LockedBadge label="Workplace Ready" />
            <LockedBadge label="Launch Ready" />
          </div>
        </article>
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
            Career Direction
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
            Career Interests
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {student.careerInterests.map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-purple-50 px-4 py-2 font-bold text-purple-800"
              >
                {interest}
              </span>
            ))}
          </div>

          <Link
            href={`/ambassador/student-passport/${student.id}/profile`}
            className="mt-8 inline-flex rounded-xl border-2 border-[#0D1B3D] px-6 py-3 font-black text-[#0D1B3D]"
          >
            Update Profile
          </Link>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4B2265]">
            Employer Readiness
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
            Career Launch Progress
          </h2>

          <div className="mt-6 space-y-4">
            <ReadinessItem
              label="Future Ready Profile"
              complete
            />

            <ReadinessItem
              label="Career Interests"
              complete
            />

            <ReadinessItem
              label="Professional Resume"
              complete={student.readinessScore >= 80}
            />

            <ReadinessItem
              label="Mock Interview"
              complete={student.readinessScore >= 85}
            />

            <ReadinessItem
              label="Employer Introduction"
              complete={student.readinessScore >= 90}
            />
          </div>
        </article>
      </section>
    </div>
  );
}

function PassportTag({
  label,
}: {
  label: string;
}) {
  return (
    <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
      {label}
    </span>
  );
}

function ToolLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border border-slate-200 px-5 py-4 font-bold text-slate-800 transition hover:border-[#F2B705] hover:bg-[#FFF9E6]"
    >
      {label}
      <span>→</span>
    </Link>
  );
}

function SkillProgress({
  name,
  score,
}: {
  name: string;
  score: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-black text-slate-800">
          {name}
        </p>

        <p className="font-black text-[#0D1B3D]">
          {score}%
        </p>
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-[#F2B705]"
          style={{
            width: `${score}%`,
          }}
        />
      </div>
    </div>
  );
}

function LockedBadge({
  label,
}: {
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 opacity-70">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-xl font-black text-slate-500">
        ○
      </div>

      <div>
        <p className="font-black text-slate-700">
          {label}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Continue your Future Ready™ journey to unlock.
        </p>
      </div>
    </div>
  );
}

function ReadinessItem({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full font-black ${
          complete
            ? "bg-emerald-600 text-white"
            : "bg-slate-200 text-slate-500"
        }`}
      >
        {complete ? "✓" : "○"}
      </div>

      <p className="font-black text-slate-800">
        {label}
      </p>
    </div>
  );
}
