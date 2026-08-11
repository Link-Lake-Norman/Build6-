import Link from "next/link";
import { notFound } from "next/navigation";
import { curriculum } from "@/content/curriculum";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AmbassadorCurriculumLessonPage({
  params,
}: PageProps) {
  const { id } = await params;
  const weekNumber = Number(id);

  const lesson = curriculum.find(
    (item) => item.week === weekNumber
  );

  if (!lesson) {
    notFound();
  }

  const previousLesson = curriculum.find(
    (item) => item.week === lesson.week - 1
  );

  const nextLesson = curriculum.find(
    (item) => item.week === lesson.week + 1
  );

  return (
    <main className="space-y-10">
      <header className="rounded-3xl bg-[#0D1B3D] px-8 py-10 text-white shadow-lg">
        <Link
          href="/ambassador/curriculum"
          className="inline-flex font-bold text-[#F2B705] hover:underline"
        >
          ← Back to Curriculum
        </Link>

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-[#F2B705]">
          Week {lesson.week}
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          {lesson.title}
        </h1>

        <p className="mt-3 text-lg leading-8 text-slate-200">
          {lesson.phase}
        </p>
      </header>

      <section className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-8">
          <ContentSection
            title="Objective"
            content={lesson.objective}
          />

          <ContentSection
            title="Facilitator Guide"
            content={lesson.facilitatorGuide}
          />

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-[#0D1B3D]">
              Discussion Questions
            </h2>

            <ol className="mt-6 space-y-4">
              {lesson.discussionQuestions.map(
                (question, index) => (
                  <li
                    key={`${index}-${question}`}
                    className="rounded-2xl bg-slate-50 p-5 text-lg leading-8 text-slate-700"
                  >
                    <span className="mr-2 font-black text-[#F2B705]">
                      {index + 1}.
                    </span>
                    {question}
                  </li>
                )
              )}
            </ol>
          </section>

          <ContentSection
            title="Student Activity"
            content={lesson.studentActivity}
          />

          <ContentSection
            title="Workplace Connection"
            content={lesson.workplaceConnection}
          />
        </div>

        <div className="space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
              Skills Earned
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {lesson.skillsEarned.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-[#FFF3C4] px-4 py-2 font-bold text-[#0D1B3D]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <ContentSection
            title="Portfolio Evidence"
            content={lesson.portfolioEvidence}
          />

          <ContentSection
            title="Badge Earned"
            content={lesson.badgeEarned}
          />

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4B2265]">
              Lesson Actions
            </p>

            <div className="mt-5 space-y-3">
              <Link
                href={`/ambassador/facilitator/lesson/${lesson.week}/activity`}
                className="flex min-h-14 items-center justify-center rounded-xl bg-[#F2B705] px-5 py-4 text-center font-bold text-[#0D1B3D]"
              >
                Open Student Activity
              </Link>

              <Link
                href={`/ambassador/facilitator/lesson/${lesson.week}/reflection`}
                className="flex min-h-14 items-center justify-center rounded-xl bg-[#0D1B3D] px-5 py-4 text-center font-bold text-white"
              >
                Open Student Reflection
              </Link>

              <Link
                href={`/ambassador/facilitator/lesson/${lesson.week}`}
                className="flex min-h-14 items-center justify-center rounded-xl border-2 border-[#0D1B3D] px-5 py-4 text-center font-bold text-[#0D1B3D]"
              >
                Open Facilitator Lesson
              </Link>
            </div>
          </section>
        </div>
      </section>

      <nav className="flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
        {previousLesson ? (
          <Link
            href={`/ambassador/curriculum/${previousLesson.week}`}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
          >
            ← Week {previousLesson.week}
          </Link>
        ) : (
          <span />
        )}

        {nextLesson ? (
          <Link
            href={`/ambassador/curriculum/${nextLesson.week}`}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#0D1B3D] px-5 py-3 font-bold text-white hover:bg-[#172B55]"
          >
            Week {nextLesson.week} →
          </Link>
        ) : (
          <Link
            href="/ambassador/curriculum"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#0D1B3D] px-5 py-3 font-bold text-white"
          >
            Return to Curriculum
          </Link>
        )}
      </nav>
    </main>
  );
}

function ContentSection({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-3xl font-bold text-[#0D1B3D]">
        {title}
      </h2>

      <p className="mt-5 text-lg leading-8 text-slate-700">
        {content}
      </p>
    </section>
  );
}