"use client";

import { useEffect, useState } from "react";
import { student } from "../../content/student";
import { badges } from "../../content/badges";

export default function StudentPortalPage() {
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

  const currentWeek =
    completedLessons.length + 1 > 36
      ? 36
      : completedLessons.length + 1;


  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Student Portal
        </h1>

        <h2>
          Welcome, {student.name}
        </h2>

        <p>
          Discover Purpose. Build Skills. Launch Your Future.
        </p>

      </section>



      <section className="journey-grid">

        <article className="journey-card">

          <h3>
            Current Journey Stage
          </h3>

          <p>
            Week {currentWeek} of 36
          </p>

        </article>


        <article className="journey-card">

          <h3>
            Progress
          </h3>

          <p>
            {progress}%
          </p>

        </article>


        <article className="journey-card">

          <h3>
            Lessons Complete
          </h3>

          <p>
            {completedLessons.length}/36
          </p>

        </article>

      </section>




      <section>

        <h2>
          Your Skills Profile
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
                Developing Future Ready™ skills
              </p>

            </article>

          ))}

        </div>

      </section>




      <section>

        <h2>
          Your Achievements
        </h2>


        <div className="journey-grid">

          {badges.map((badge) => {

            const unlocked =
              completedLessons.length >=
              badge.requiredLessons;


            return (

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
                  {unlocked
                    ? "Unlocked"
                    : "Locked"}
                </p>

              </article>

            );

          })}

        </div>

      </section>



      <section className="journey-card">

        <h2>
          Next Step
        </h2>

        <p>
          Continue your Future Ready™ journey by completing Week {currentWeek}.
        </p>


        <a
          href={`/lesson?phase=${currentWeek}&lesson=${currentWeek}`}
        >
          Continue Learning →
        </a>

      </section>


    </main>
  );
}