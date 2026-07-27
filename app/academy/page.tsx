"use client";

import { useEffect, useState } from "react";
import { lessons } from "../../content/lessons";

export default function AcademyPage() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  useEffect(() => {
    const saved =
      localStorage.getItem("future-ready-progress");

    if (saved) {
      setCompletedLessons(JSON.parse(saved));
    }
  }, []);

  const progress = Math.round(
    (completedLessons.length / 36) * 100
  );

  const phases = [
    {
      name: "DISCOVER™",
      range: "Weeks 1–6",
      description:
        "Discover your strengths, interests, values, personality, and purpose.",
    },
    {
      name: "BUILD™",
      range: "Weeks 7–18",
      description:
        "Build skills, confidence, communication, and career readiness.",
    },
    {
      name: "LAUNCH™",
      range: "Weeks 19–36",
      description:
        "Launch your future with experience, goals, and career preparation.",
    },
  ];

  return (
    <main>

      <section className="hero">
        <h1>
          Future Ready™ Academy
        </h1>

        <p>
          Discover Purpose. Build Skills. Launch Your Future.
        </p>

        <div className="journey-card">
          <h2>
            Your Journey Progress
          </h2>

          <h3>
            {progress}%
          </h3>

          <p>
            {completedLessons.length} of 36 lessons completed
          </p>
        </div>
      </section>


      <section>
        <h2>
          Your Future Ready™ Journey
        </h2>

        <div className="journey-grid">

          {phases.map((phase) => (
            <article
              className="journey-card"
              key={phase.name}
            >

              <h3>
                {phase.name}
              </h3>

              <p>
                {phase.range}
              </p>

              <p>
                {phase.description}
              </p>

            </article>
          ))}

        </div>
      </section>


      <section>
        <h2>
          All Lessons
        </h2>

        <div className="journey-grid">

          {lessons.map((lesson) => {

            const completed =
              completedLessons.includes(
                lesson.week
              );

            return (
              <article
                className="journey-card"
                key={lesson.week}
              >

                <h3>
                  {lesson.phase}
                </h3>

                <h4>
                  Week {lesson.week}: {lesson.title}
                </h4>


                <p>
                  {lesson.objective}
                </p>


                <p>
                  {completed
                    ? "✅ Completed"
                    : "⚪ Not Completed"}
                </p>


                <a
                  href={`/lesson?phase=${lesson.week}&lesson=${lesson.week}`}
                >
                  Begin Lesson →
                </a>

              </article>
            );

          })}

        </div>
      </section>

    </main>
  );
}