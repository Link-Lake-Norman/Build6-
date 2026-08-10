import Link from "next/link";
import { notFound } from "next/navigation";
import { ambassadorStudents } from "@/content/ambassador-students";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type PortfolioItem = {
  title: string;
  category: string;
  description: string;
  week: number | null;
  status: "Complete" | "In Progress" | "Not Started";
};

export default async function StudentPortfolioPage({
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

  const portfolioItems: PortfolioItem[] = [
    {
      title: "Future Ready Identity Map",
      category: "About Me",
      description:
        "Personal strengths, values, interests, goals, and future possibilities.",
      week: 1,
      status:
        currentWeek >= 1 ? "Complete" : "Not Started",
    },
    {
      title: "Personal Vision Statement",
      category: "Career Vision",
      description:
        "A written vision describing the student’s goals, purpose, and future direction.",
      week: 2,
      status:
        currentWeek >= 2 ? "Complete" : "Not Started",
    },
    {
      title: "Career Exploration Map",
      category: "Career Discovery",
      description:
        "Research and comparison of career pathways connected to interests and strengths.",
      week: 4,
      status:
        currentWeek >= 4 ? "Complete" : "Not Started",
    },
    {
      title: "Professional Resume",
      category: "Career Readiness",
      description:
        "Student resume highlighting education, skills, activities, and experience.",
      week: 12,
      status:
        currentWeek >= 12
          ? "Complete"
          : currentWeek >= 8
            ? "In Progress"
            : "Not Started",
    },
    {
      title: "Mock Interview Reflection",
      category: "Professional Skills",
      description:
        "Student reflection and feedback following interview preparation.",
      week: 18,
      status:
        currentWeek >= 18
          ? "Complete"
          : "Not Started",
    },
    {
      title: "Capstone Project",
      category: "Launch",
      description:
        "Final demonstration of growth, skills, career direction, and readiness.",
      week: 36,
      status:
        currentWeek >= 36
          ? "Complete"
          : "Not Started",
    },
  ];

  const completedItems = portfolioItems.filter(
    (item) => item.status === "Complete"
  ).length;

  const completionPercentage = Math.round(
    (completedItems / portfolioItems.length) * 100
  );

  return (
    <main className="space-y-10">
      <header className="rounded-3xl bg-[#0D1B3D] px-8 py-10 text-white shadow-lg">
        <Link
          href={`/ambassador/student-portal/${student.id}`}
          className="inline-flex font-bold text-[#F2B705] hover:underline"
        >
          ← Back to Student Profile
        </Link>

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-[#F2B705]">
          Future Ready™ Digital Portfolio
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          {student.name}
        </h1>

        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-200">
          A growing collection of work, reflections, skills,
          achievements, and evidence of career readiness.
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Portfolio Completion"
          value={`${completionPercentage}%`}
          detail="Overall progress"
        />

        <StatCard
          label="Artifacts Complete"
          value={String(completedItems)}
          detail={`${portfolioItems.length} total artifacts`}
        />

        <StatCard
          label="Current Week"
          value={String(currentWeek)}
          detail="Future Ready journey"
        />

        <StatCard
          label="Readiness Score"
          value={`${student.readinessScore}%`}
          detail="Career readiness"
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
              Portfolio Progress
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
              Evidence of Growth
            </h2>
          </div>

          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#0D1B3D] px-6 py-3 font-bold text-white transition hover:bg-[#172B55]"
          >
            Add Portfolio Artifact
          </button>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">
              Completion
            </span>

            <span className="font-black text-[#0D1B3D]">
              {completionPercentage}%
            </span>
          </div>

          <div className="mt-3 h-4 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-[#F2B705]"
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {portfolioItems.map((item) => (
          <PortfolioCard
            key={item.title}
            item={item}
          />
        ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
            About Me
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
            Student Story
          </h2>

          <textarea
            className="mt-6 min-h-52 w-full rounded-2xl border border-slate-300 p-5 text-base leading-7 outline-none focus:border-[#F2B705] focus:ring-4 focus:ring-[#F2B705]/20"
            placeholder="Write a student bio, strengths statement, goals, interests, and what makes this student unique..."
          />

          <button
            type="button"
            className="mt-4 rounded-xl bg-[#0D1B3D] px-6 py-3 font-bold text-white hover:bg-[#172B55]"
          >
            Save About Me
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4B2265]">
            Career Direction
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
            Career Interests
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            <InterestTag label="Healthcare" />

            <InterestTag label="Business" />

            <InterestTag label="Technology" />

            <InterestTag label="Leadership" />

            <InterestTag label="Community Impact" />
          </div>

          <button
            type="button"
            className="mt-8 rounded-xl border-2 border-[#0D1B3D] px-6 py-3 font-bold text-[#0D1B3D] hover:bg-slate-50"
          >
            Edit Career Interests
          </button>
        </div>
      </section>
    </main>
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

function PortfolioCard({
  item,
}: {
  item: PortfolioItem;
}) {
  const styles = {
    Complete:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    "In Progress":
      "border-amber-200 bg-amber-50 text-amber-800",
    "Not Started":
      "border-slate-200 bg-slate-50 text-slate-600",
  };

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#4B2265]">
            {item.category}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#0D1B3D]">
            {item.title}
          </h2>
        </div>

        <span
          className={`inline-flex rounded-full border px-3 py-1 text-sm font-bold ${styles[item.status]}`}
        >
          {item.status}
        </span>
      </div>

      <p className="mt-5 text-base leading-7 text-slate-600">
        {item.description}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
        <span className="text-sm font-semibold text-slate-500">
          {item.week
            ? `Week ${item.week}`
            : "Independent Artifact"}
        </span>

        <button
          type="button"
          className="font-bold text-[#0D1B3D] hover:underline"
        >
          Open Artifact →
        </button>
      </div>
    </article>
  );
}

function InterestTag({
  label,
}: {
  label: string;
}) {
  return (
    <span className="rounded-full bg-[#FFF3C4] px-4 py-2 font-bold text-[#0D1B3D]">
      {label}
    </span>
  );
}