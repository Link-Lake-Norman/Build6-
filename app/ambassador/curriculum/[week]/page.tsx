import Link from "next/link";
import { notFound } from "next/navigation";
import { curriculum } from "@/content/platform";
import LessonCompletion from "./LessonCompletion";
import LessonCustomizationView from "./LessonCustomizationView";

type PageProps = {
  params: Promise<{
    week: string;
  }>;
};

export default async function CurriculumPage({
  params,
}: PageProps) {
  const { week } = await params;
  const weekNumber = Number(week);

  const lesson = curriculum.find(
    (item) => item.week === weekNumber,
  );

  if (!lesson) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <header className="rounded-3xl bg-[#0D1B3D] px-8 py-10 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
          {lesson.phase} · Week {lesson.week}
        </p>

        <h1 className="mt-3 text-4xl font-black">
          {lesson.title}
        </h1>

        <p className="mt-4 text-lg leading-8 text-slate-200">
          {lesson.objective}
        </p>
      </header>

      <LessonCustomizationView week={lesson.week} />

      <LessonCompletion
        week={lesson.week}
        title={lesson.title}
        badgeEarned={lesson.badgeEarned}
        portfolioEvidence={lesson.portfolioEvidence}
      />

      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <Section
            title="Facilitator Guide"
            content={lesson.facilitatorGuide}
          />

          {lesson.dailyLessons?.length ? (
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-black text-[#0D1B3D]">
                Daily Lessons
              </h2>

              <div className="mt-6 space-y-5">
                {lesson.dailyLessons.map((day) => (
                  <div
                    key={`${lesson.week}-${day.day}`}
                    className="rounded-2xl bg-slate-50 p-6"
                  >
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-[#725500]">
                      {day.day}
                    </p>
                    <h3 className="mt-2 text-xl font-black text-[#0D1B3D]">
                      {day.title}
                    </h3>
                    <p className="mt-3 leading-7 text-slate-700">
                      <strong>Objective:</strong> {day.objective}
                    </p>
                    <p className="mt-2 leading-7 text-slate-700">
                      <strong>Activity:</strong> {day.activity}
                    </p>
                    <p className="mt-2 leading-7 text-slate-700">
                      <strong>Reflection:</strong> {day.reflection}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ) : null}

          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-black text-[#0D1B3D]">
              Discussion Questions
            </h2>

            <ol className="mt-6 space-y-4">
              {lesson.discussionQuestions.map(
                (question, index) => (
                  <li
                    key={`${lesson.week}-${index}`}
                    className="rounded-xl bg-slate-50 p-5 leading-7"
                  >
                    <strong className="mr-2 text-[#0D1B3D]">
                      {index + 1}.
                    </strong>
                    {question}
                  </li>
                ),
              )}
            </ol>
          </article>

          <Section
            title="Student Activity"
            content={lesson.studentActivity}
          />

          <Section
            title="Workplace Connection"
            content={lesson.workplaceConnection}
          />

          {lesson.weeklyReflection ? (
            <Section
              title="Weekly Reflection"
              content={lesson.weeklyReflection}
            />
          ) : null}

          {lesson.homework ? (
            <Section
              title="Homework / Family Connection"
              content={lesson.homework}
            />
          ) : null}
        </div>

        <div className="space-y-8">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#0D1B3D]">
              Skills Earned
            </h2>

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
          </article>

          <Section
            title="Portfolio Evidence"
            content={lesson.portfolioEvidence}
          />

          <Section
            title="Badge Earned"
            content={lesson.badgeEarned}
          />

          {lesson.aiCoachPrompt ? (
            <Section
              title="AI Coach Prompt"
              content={lesson.aiCoachPrompt}
            />
          ) : null}

          {lesson.assessmentTitle ? (
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#725500]">
                Assessment
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
                {lesson.assessmentTitle}
              </h2>
              {lesson.assessmentDescription ? (
                <p className="mt-4 text-lg leading-8 text-slate-700">
                  {lesson.assessmentDescription}
                </p>
              ) : null}
            </article>
          ) : null}
        </div>
      </section>

      <nav className="flex justify-between border-t border-slate-200 pt-7">
        {lesson.week > 1 ? (
          <Link
            href={`/ambassador/curriculum/${lesson.week - 1}`}
            className="rounded-xl border border-slate-300 px-5 py-3 font-black text-slate-700"
          >
            ← Week {lesson.week - 1}
          </Link>
        ) : (
          <span />
        )}

        {lesson.week < 36 ? (
          <Link
            href={`/ambassador/curriculum/${lesson.week + 1}`}
            className="rounded-xl bg-[#0D1B3D] px-5 py-3 font-black text-white"
          >
            Week {lesson.week + 1} →
          </Link>
        ) : (
          <Link
            href="/ambassador"
            className="rounded-xl bg-[#0D1B3D] px-5 py-3 font-black text-white"
          >
            Return Home
          </Link>
        )}
      </nav>
    </div>
  );
}

function Section({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-3xl font-black text-[#0D1B3D]">
        {title}
      </h2>

      <p className="mt-5 whitespace-pre-line text-lg leading-8 text-slate-700">
        {content}
      </p>
    </article>
  );
}
