import Link from "next/link";
import { curriculum } from "@/content/curriculum";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ActivityPage({ params }: Props) {
  const { id } = await params;
  const weekNumber = Number(id);

  const lesson = curriculum.find(
    (item) => item.week === weekNumber
  );

  if (!lesson) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-bold">Activity Not Found</h1>
      </main>
    );
  }

  return (
    <main className="relative z-10 mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10 space-y-4">
        <Link
          href={`/ambassador/facilitator/lesson/${lesson.week}`}
          className="inline-flex font-semibold text-blue-700 hover:underline"
        >
          ← Back to Week {lesson.week}
        </Link>

        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Week {lesson.week}
        </p>

        <h1 className="text-4xl font-bold leading-tight text-slate-900">
          Student Activity
        </h1>

        <p className="text-xl leading-relaxed text-slate-600">
          {lesson.title}
        </p>
      </header>

      <div className="space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">
            Activity Instructions
          </h2>

          <p className="text-lg leading-8 text-slate-700">
            {lesson.studentActivity}
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">
            Portfolio Evidence
          </h2>

          <p className="text-lg leading-8 text-slate-700">
            {lesson.portfolioEvidence}
          </p>
        </section>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href={`/ambassador/facilitator/lesson/${lesson.week}`}
          className="inline-flex min-h-14 items-center justify-center rounded-xl bg-slate-900 px-6 py-4 text-lg font-bold text-white shadow-md hover:bg-slate-700"
        >
          Back to Lesson
        </Link>

        <Link
          href={`/ambassador/facilitator/lesson/${lesson.week}/reflection`}
          className="inline-flex min-h-14 items-center justify-center rounded-xl bg-emerald-700 px-6 py-4 text-lg font-bold text-white shadow-md hover:bg-emerald-800"
        >
          Continue to Reflection
        </Link>
      </div>
    </main>
  );
}