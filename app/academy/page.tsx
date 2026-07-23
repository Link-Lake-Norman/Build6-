import { curriculum } from "@/content/curriculum";

export default function AcademyPage() {
  return (
    <main>
      <section>
        <h1>Future Ready™ Academy</h1>
        <p>
          Discover Purpose. Build Skills. Launch Your Future.
        </p>
      </section>

      <section>
        {curriculum.map((phase) => (
          <div key={phase.phase}>
            <h2>{phase.phase}</h2>
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
    </main>
  );
}
