"use client";

import { useEffect, useState } from "react";
import { curriculum } from "../../content/curriculum";
import { student } from "../../content/student";
import { portfolio } from "../../content/portfolio";
import { badges } from "../../content/badges";

export default function DashboardPage() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  useEffect(() => {
    const savedProgress = localStorage.getItem(
      "future-ready-progress"
    );

    if (savedProgress) {
      setCompletedLessons(JSON.parse(savedProgress));
    }
  }, []);

  const journeyProgress = Math.round(
    (completedLessons.length / 36) * 100
  );

  return (
    <main>
      {/* Student Header */}
      <section className="hero">
        <h1>Welcome to Future Ready™</h1>

        <p>
          <strong>{student.name}'s Student Dashboard</strong>
        </p>

        <p>
          Discover Purpose. Build Skills. Launch Your Future.
        </p>

        <div className="profile-stats">
          <div className="journey-card">
            <h3>{student.currentPhase}</h3>
            <p>Current Phase</p>
          </div>

          <div className="journey-card">
            <h3>{journeyProgress}%</h3>
            <p>Journey Progress</p>
          </div>
        </div>

        <div className="hero-actions">
          <a href="/academy">
            Continue Journey
          </a>
        </div>
      </section>


      {/* Journey */}
      <section>
        <h2>Your Future Ready™ Journey</h2>

        <div className="journey-grid">
          {curriculum.map((phase, index) => (
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

              <p>
                {index === 0
                  ? "🟢 Current Phase"
                  : "⚪ Upcoming"}
              </p>

              <ul>
                {phase.modules.map((module) => (
                  <li key={module}>
                    {module}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>


      {/* Skills */}
      <section>
        <h2>Your Skills Growth</h2>

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


      {/* Portfolio */}
      <section>
        <h2>Your Future Ready™ Portfolio</h2>

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

              <ul>
                {section.items.map((item) => (
                  <li key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>


      {/* Badges */}
      <section>
        <h2>Your Future Ready™ Milestones</h2>

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
                  Status:{" "}
                  {unlocked
                    ? "✅ Unlocked"
                    : "🔒 Locked"}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}