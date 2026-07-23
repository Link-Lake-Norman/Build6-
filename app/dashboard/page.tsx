import { curriculum } from "@/content/curriculum";

export default function DashboardPage() {
  return (
    <main>
      <section>
        <h1>Welcome to Your Future Ready™ Journey</h1>
        <p>
          Track your growth, skills, experiences, and next steps.
        </p>
      </section>

      <section>
        <h2>Your Future Ready™ Pathway</h2>

        {curriculum.map((phase) => (
          <div key={phase.phase}>
            <h3>{phase.phase}</h3>
            <p>{phase.weeks}</p>
            <p>{phase.description}</p>

            <ul>
              {phase.modules.map((module) => (
                <li key={module}>{module}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2>Your Skills</h2>

        <ul>
          <li>Communication</li>
          <li>Leadership</li>
          <li>Problem Solving</li>
          <li>Adaptability</li>
          <li>Professional Presence</li>
        </ul>
      </section>

      <section>
        <h2>Your Portfolio</h2>

        <p>
          Build your collection of strengths, experiences,
          accomplishments, career discoveries, and future goals.
        </p>
      </section>
    </main>
  );
}
