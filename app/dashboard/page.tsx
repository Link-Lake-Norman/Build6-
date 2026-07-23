import { curriculum } from "@/content/curriculum";

export default function DashboardPage() {
  return (
    <main>
      <section className="hero">
        <h1>Future Ready™ Student Dashboard</h1>
        <p>
          Discover Purpose. Build Skills. Launch Your Future.
        </p>
      </section>

      <section>
        <h2>Your Future Ready™ Journey</h2>

        <div className="journey-grid">
          {curriculum.map((phase) => (
            <article className="journey-card" key={phase.phase}>
              <h3>{phase.phase}</h3>

              <p className="weeks">
                {phase.weeks}
              </p>

              <p>
                {phase.description}
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

      <section>
        <h2>Skills You Are Building</h2>

        <div className="skills">
          <span>Communication</span>
          <span>Leadership</span>
          <span>Collaboration</span>
          <span>Problem Solving</span>
          <span>Adaptability</span>
          <span>Professional Presence</span>
        </div>
      </section>

      <section>
        <h2>Your Future Portfolio</h2>
        <p>
          Capture your strengths, experiences, projects,
          accomplishments, and goals.
        </p>
      </section>
    </main>
  );
}
