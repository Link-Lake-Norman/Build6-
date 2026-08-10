import Link from "next/link";
import { notFound } from "next/navigation";
import StatCard from "@/components/StatCard";
import {
  students,
} from "@/content/platform";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const portfolioItems = [
  {
    title: "Future Ready Identity Map",
    category: "About Me",
    status: "Complete",
    week: 1,
  },
  {
    title: "Strengths and Values Reflection",
    category: "Self-Awareness",
    status: "In Progress",
    week: 2,
  },
  {
    title: "Career Exploration Map",
    category: "Career Discovery",
    status: "Not Started",
    week: 14,
  },
  {
    title: "Professional Resume",
    category: "Career Readiness",
    status: "Not Started",
    week: 32,
  },
  {
    title: "Capstone Portfolio",
    category: "Launch",
    status: "Not Started",
    week: 33,
  },
];

export default async function PortfolioPage({
  params,
}: PageProps) {
  const { id } = await params;

  const student = students.find(
    (item) => item.id === id
  );

  if (!student) {
    notFound();
  }

  const completed = portfolioItems.filter(
    (item) => item.status === "Complete"
  ).length;

  const completion = Math.round(
    (completed / portfolioItems.length) * 100
  );

  return (
    <div className="space-y-10">
      <header className="rounded-3xl bg-[#0D1B3D] px-8 py-10 text-white">
        <Link
          href={`/ambassador/student-passport/${student.id}`}
          className="font-bold text-[#F2B705]"
        >
          ← Back to Student Passport
        </Link>

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-[#F2B705]">
          Future Ready™ Digital Portfolio
        </p>

        <h1 className="mt-3 text-4xl font-black">
          {student.name}
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
          A growing record of activities, reflections,
          projects, skills, badges, and career readiness.
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Portfolio Completion"
          value={`${completion}%`}
        />

        <StatCard
          label="Artifacts Complete"
          value={completed}
        />

        <StatCard
          label="Current Week"
          value={student.currentWeek}
        />

        <StatCard
          label="Readiness"
          value={`${student.readinessScore}%`}
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
              Portfolio Progress
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
              Evidence of Growth
            </h2>
          </div>

          <button
            type="button"
            className="rounded-xl bg-[#0D1B3D] px-6 py-3 font-black text-white"
          >
            Add Artifact
          </button>
        </div>

        <div className="mt-8 h-4 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[#F2B705]"
            style={{
              width: `${completion}%`,
            }}
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {portfolioItems.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#4B2265]">
                  {item.category}
                </p>

                <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
                  {item.title}
                </h2>
              </div>

              <StatusBadge status={item.status} />
            </div>

            <p className="mt-5 text-slate-600">
              Week {item.week} portfolio evidence
            </p>

            <button
              type="button"
              className="mt-6 font-black text-[#0D1B3D]"
            >
              Open Artifact →
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const style =
    status === "Complete"
      ? "bg-emerald-50 text-emerald-700"
      : status === "In Progress"
        ? "bg-amber-50 text-amber-800"
        : "bg-slate-100 text-slate-600";

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-bold ${style}`}
    >
      {status}
    </span>
  );
}
