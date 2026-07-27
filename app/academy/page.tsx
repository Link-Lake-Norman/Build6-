import Link from "next/link";
import { lessons } from "@/content/lessons";

export default function AcademyPage() {
  const phases = [
    "DISCOVER™",
    "EXPLORE™",
    "BUILD™",
    "LAUNCH™",
  ];

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-4xl font-bold">
          Future Ready™ Academy
        </h1>

        <p className="mt-2 text-lg">
          Discover Purpose. Build Skills. Launch Your Future.
        </p>

        {phases.map((phase) => (
          <section key={phase} className="mt-10">

            <h2 className="text-2xl font-semibold">
              {phase}
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-3">

              {lessons
                .filter((lesson) => lesson.phase === phase)
                .map((lesson) => (
                  <Link
                    key={lesson.week}
                    href={`/lesson?phase=${lesson.phase}&lesson=${lesson.week}`}
                    className="rounded-xl border p-5 hover:shadow-lg"
                  >
                    <div className="font-bold">
                      Week {lesson.week}
                    </div>

                    <div className="mt-2">
                      {lesson.title}
                    </div>

                    <p className="mt-3 text-sm">
                      {lesson.objective}
                    </p>
                  </Link>
                ))}

            </div>

          </section>
        ))}

      </div>
    </main>
  );
}