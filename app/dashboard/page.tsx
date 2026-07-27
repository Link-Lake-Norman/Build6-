import Link from "next/link";
import { useEffect, useState } from "react";
import { student } from "../../content/student";
import { curriculum } from "../../content/curriculum";
import { portfolio } from "../../content/portfolio";
import { badges } from "../../content/badges";

export default function DashboardPage() {
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
    completedLessons.length + 1 <= 36
      ? completedLessons.length + 1
      : 36;

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


        <div style={{ marginTop: "20px" }}>

          <Link href="/student-portal/profile">
            <button>
              View My Future Ready™ Profile →
            </button>
          </Link>

        </div>

      </section>


      <section className="journey-grid">

        <article className="journey-card">
          <h3>
            Current Week
          </h3>

          <p>
            Week {currentWeek}
          </p>
        </article>


        <article className="journey-card">
          <h3>
            Journey Progress
          </h3>

          <p>
            {progress}%
          </p>
        </article>


        <article className="journey-card">
          <h3>
            Lessons Completed
          </h3>

          <p>
            {completedLessons.length}/36
          </p>
        </article>

      </section>


      <section>

        <h2>
          Your Future Ready™ Journey
        </h2>

        <div className="journey-grid">

          {curriculum.map((phase) => (

            <article
              className="journey-card"
              key={phase.phase}
            >

              <h3>
                {phase.phase}
              </h3>

              <p>
                {phase.weeks}
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
          Portfolio Development
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
          Future Ready™ Milestones
        </h2>

        <div className="journey-grid">

          {badges.map((badge) => {

            const unlocked =
              completedLessons.length >= badge.requiredLessons;

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
                    ? "✅ Unlocked"
                    : "🔒 Locked"}
                </p>

              </article>

            );

          })}

        </div>

      </section>


      <section className="hero">

        <h2>
          Employer Connection Pathway
        </h2>

        <p>
          Your Future Ready™ profile helps connect your skills,
          interests, and growth with future opportunities.
        </p>


        <Link href="/employer-hub">
          <button>
            Explore Employer Opportunities →
          </button>
        </Link>

      </section>


    </main>
  );
}