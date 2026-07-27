import Link from "next/link";
import { lessons } from "@/content/lessons";

export default function AcademyPage() {
  const phases = [
    {
      name: "DISCOVER™",
      description:
        "Discover your identity, strengths, values, interests, and purpose.",
    },
    {
      name: "EXPLORE™",
      description:
        "Explore careers, industries, opportunities, and the future of work.",
    },
    {
      name: "BUILD™",
      description:
        "Build the skills, confidence, and professional habits needed for success.",
    },
    {
      name: "LAUNCH™",
      description:
        "Launch your career journey with preparation, branding, and opportunity.",
    },
    {
      name: "FUTURE™",
      description:
        "Create your vision, showcase your growth, and prepare for your next chapter.",
    },
  ];

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">

        <header>
          <h1 className="text-4xl font-bold">
            Future Ready™ Academy
          </h1>

          <p className="mt-3 text-lg">
            Discover Purpose. Build Skills. Launch Your Future.
          </p>
        </header>


        {phases.map((phase) => (
          <section
            key={phase.name}
            className="mt-10"
          >

            <div className="mb-4">
              <h2 className="text-2xl font-bold">
                {phase.name}
              </h2>

              <p>
                {phase.description}
              </p>
            </div>


            <div className="grid gap-4 md:grid-cols-3">

              {lessons
                .filter(
                  (lesson) =>
                    lesson.phase === phase.name
                )
                .map((lesson) => (

                  <Link
                    key={lesson.week}
                    href={`/lesson?phase=${encodeURIComponent(
                      lesson.phase
                    )}&lesson=${lesson.week}`}
                    className="rounded-xl border p-5 transition hover:shadow-lg"
                  >

                    <p className="font-bold">
                      Week {lesson.week}
                    </p>

                    <h3 className="mt-2 text-lg font-semibold">
                      {lesson.title}
                    </h3>

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