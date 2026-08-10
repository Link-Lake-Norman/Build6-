import Link from "next/link";
import { lessons } from "@/content/lessons";

const programs = Array.from(
  new Set(
    lessons.map((lesson) => lesson.program)
  )
);

export default function AcademyPage() {
  return (
    <main className="space-y-10">
      <header className="rounded-3xl bg-[#0D1B3D] px-8 py-10 text-white shadow-lg">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#F2B705]">
          Future Ready™ Academy
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Curriculum Experience
        </h1>

        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-200">
          Explore the complete Future Ready™ learning journey,
          weekly activities, reflections, and skill-building
          experiences.
        </p>
      </header>

      <section className="space-y-10">
        {programs.map((program) => {
          const programLessons = lessons.filter(
            (lesson) => lesson.program === program
          );

          return (
            <section
              key={program}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div className="mb-8">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
                  Program
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
                  {program}
                </h2>

                <p className="mt-3 text-slate-600">
                  {programLessons.length} lesson
                  {programLessons.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {programLessons.map((lesson) => (
                  <Link
                    key={lesson.week}
                    href={`/lesson?week=${lesson.week}`}
                    className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-[#F2B705] hover:shadow-md"
                  >
                    <p className="text-sm font-bold uppercase tracking-wide text-[#F2B705]">
                      Week {lesson.week}
                    </p>

                    <h3 className="mt-3 text-2xl font-bold text-[#0D1B3D]">
                      {lesson.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-600">
                      {lesson.focus}
                    </p>

                    <div className="mt-5 border-t border-slate-200 pt-4">
                      <p className="text-sm font-bold text-slate-700">
                        Activity
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {lesson.activity}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </section>
    </main>
  );
}