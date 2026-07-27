"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { student } from "../../content/student";
import { curriculum } from "../../content/curriculum";
import { portfolio } from "../../content/portfolio";
import { badges } from "../../content/badges";
import { lessons } from "../../content/lessons";

export default function DashboardPage() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(
      "future-ready-progress"
    );

    if (saved) {
      setCompletedLessons(JSON.parse(saved));
    }
  }, []);

  const progress = Math.round(
    (completedLessons.length / lessons.length) * 100
  );

  const nextLesson =
    lessons.find(
      (lesson) =>
        !completedLessons.includes(lesson.week)
    ) || lessons[lessons.length - 1];


  return (
    <main>

      <section className="hero">

        <h1>
          Welcome to Future Ready™
        </h1>

        <h2>
          {student.name}'s Student Dashboard
        </h2>

        <p>
          Discover Purpose. Build Skills. Launch Your Future.
        </p>


        <Link
          href={`/lesson?phase=${encodeURIComponent(
            nextLesson.phase
          )}&lesson=${nextLesson.week}`}
        >
          <button>
            Continue My Journey →
          </button>
        </Link>


        <div className="journey-card">

          <h3>
            Journey Progress
          </h3>

          <p>
            {completedLessons.length} of {lessons.length} lessons completed
          </p>


          <div
            style={{
              width: "100%",
              height: "20px",
              border: "1px solid black",
              borderRadius: "10px",
            }}
          >

            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: "10px",
                background: "black",
              }}
            />

          </div>


          <p>
            {progress}% Complete
          </p>

        </div>


      </section>



      <section>

        <h2>
          Your Future Ready™ Journey
        </h2>


        <div className="journey-grid">

          {curriculum.map((phase) => {

            const phaseLessons =
              lessons.filter(
                (lesson) =>
                  lesson.phase === phase.phase
              );

            const completed =
              phaseLessons.filter(
                (lesson) =>
                  completedLessons.includes(
                    lesson.week
                  )
              ).length;


            return (

              <article
                className="journey-card"
                key={phase.phase}
              >

                <h3>
                  {phase.phase}
                </h3>

                <p>
                  {phase.description}
                </p>

                <p>
                  {completed}/{phaseLessons.length} completed
                </p>

              </article>

            );

          })}

        </div>

      </section>



      <section>

        <h2>
          Skills Growth
        </h2>

        <div className="journey-grid">

          {student.skills.map((skill) => (

            <article
              className="journey-card"
              key={skill.name}
            >

              <h3>
                {skill.name}
              </h3>

              <p>
                Progress: {skill.progress}%
              </p>

            </article>

          ))}

        </div>

      </section>



      <section>

        <h2>
          Portfolio Progress
        </h2>

        <div className="journey-grid">

          {portfolio.sections.map((section) => (

            <article
              className="journey-card"
              key={section.title}
            >

              <h3>
                {section.title}
              </h3>

              <p>
                {section.description}
              </p>

            </article>

          ))}

        </div>

      </section>



      <section>

        <h2>
          Future Ready™ Badges
        </h2>


        <div className="journey-grid">

          {badges.map((badge) => (

            <article
              className="journey-card"
              key={badge.name}
            >

              <h3>
                🏆 {badge.name}
              </h3>

              <p>
                {badge.description}
              </p>

              <p>
                {completedLessons.length >= badge.requiredLessons
                  ? "✅ Unlocked"
                  : "🔒 Locked"}
              </p>

            </article>

          ))}

        </div>

      </section>


    </main>
  );
}