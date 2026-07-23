import { curriculum } from "@/content/curriculum";

export default function DashboardPage() {
  return (
    <main>
      <h1>Future Ready™ Student Dashboard</h1>

      <p>
        Discover Purpose. Build Skills. Launch Your Future.
      </p>

      <h2>Your Journey</h2>

      {curriculum.map((phase) => (
        <section key={phase.phase}>
          <h3>{phase.phase}</h3>
          <p>{phase.weeks}</p>
          <p>{phase.description}</p>

          <ul>
            {phase.modules.map((module) => (
              <li key={module}>{module}</li>
            ))}
          </ul>
        </section>
      ))}

      <h2>Skills You Are Building</h2>

      <ul>
        <li>Communication</li>
        <li>Leadership</li>
        <li>Collaboration</li>
        <li>Problem Solving</li>
        <li>Adaptability</li>
      </ul>

      <h2>Your Future Portfolio</h2>

      <p>
        Build your collection of experiences, achievements,
        projects, and future goals.
      </p>
    </main>
  );
}
