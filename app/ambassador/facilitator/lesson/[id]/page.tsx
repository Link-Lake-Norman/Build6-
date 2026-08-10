import Link from "next/link";
import { curriculum } from "@/content/curriculum";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FacilitatorLessonPage({ params }: Props) {
  const { id } = await params;
  const weekNumber = Number(id);

  const lesson = curriculum.find(
    (item) => item.week === weekNumber
  );

  if (!lesson) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-bold">Lesson Not Found</h1>

        <Link
          href="/ambassador/facilitator"
          className="mt-6 inline-flex rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white"
        >
          Back to Facilitator Portal
        </Link>
      </main>
    );
  }

  const nextLesson = curriculum.find(
    (item) => item.week === lesson.week + 1
  );

  return (
    <main className="relative z-10 mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10 space-y-4">
        <Link
          href="/ambassador/facilitator"
          className="inline-flex items-center font-semibold text-blue-700 hover:underline"
        >
          ← Back to Facilitator Curriculum
        </Link>

        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Week {lesson.week}
        </p>

        <h1 className="text-4xl font-bold leading-tight text-slate-900">
          {lesson.title}
        </h1>

        <p className="text-xl leading-relaxed text-slate-600">
          {lesson.phase}
        </p>
      </header>

      <div className="space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Objective
          </h2>

          <p className="text-lg leading-8 text-slate-700">
            {lesson.objective}
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Facilitator Guide
          </h2>

          <p className="text-lg leading-8 text-slate-700">
            {lesson.facilitatorGuide}
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">
            Discussion Questions
          </h2>

          <ol className="space-y-4">
            {lesson.discussionQuestions.map((question, index) => (
              <li
                key={`${index}-${question}`}
                className="rounded-xl bg-slate-50 p-5 text-lg leading-7 text-slate-700"
              >
                <span className="mr-2 font-bold text-blue-700">
                  {index + 1}.
                </span>
                {question}
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Workplace Connection
          </h2>

          <p className="text-lg leading-8 text-slate-700">
            {lesson.workplaceConnection}
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">
            Skills Earned
          </h2>

          <div className="flex flex-wrap gap-3">
            {lesson.skillsEarned.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-50 px-4 py-2 font-semibold text-blue-800"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Portfolio Evidence
          </h2>

          <p className="text-lg leading-8 text-slate-700">
            {lesson.portfolioEvidence}
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Badge Earned
          </h2>

          <p className="text-lg font-semibold leading-8 text-slate-700">
            {lesson.badgeEarned}
          </p>
        </section>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Link
          href={`/ambassador/facilitator/lesson/${lesson.week}/activity`}
          className="flex min-h-24 items-center justify-center rounded-xl bg-blue-700 px-6 py-5 text-center text-lg font-bold text-white shadow-md transition hover:bg-blue-800"
        >
          Open Student Activity
        </Link>

        <Link
          href={`/ambassador/facilitator/lesson/${lesson.week}/reflection`}
          className="flex min-h-24 items-center justify-center rounded-xl bg-emerald-700 px-6 py-5 text-center text-lg font-bold text-white shadow-md transition hover:bg-emerald-800"
        >
          Open Student Reflection
        </Link>

        {nextLesson ? (
          <Link
            href={`/ambassador/facilitator/lesson/${nextLesson.week}`}
            className="flex min-h-24 items-center justify-center rounded-xl bg-slate-900 px-6 py-5 text-center text-lg font-bold text-white shadow-md transition hover:bg-slate-700"
          >
            Continue to Week {nextLesson.week}
          </Link>
        ) : (
          <Link
            href="/ambassador/facilitator"
            className="flex min-h-24 items-center justify-center rounded-xl bg-slate-900 px-6 py-5 text-center text-lg font-bold text-white shadow-md transition hover:bg-slate-700"
          >
            Return to Curriculum
          </Link>
        )}
      </div>
    </main>
  );
}
