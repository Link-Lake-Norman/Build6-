import { cohorts } from "@/content/cohorts";
import { programs } from "@/content/programs";

export default function AmbassadorProgramPage() {
  const program = programs.find(
    (program) =>
      program.id === "ambassador-student-athlete-launch"
  );

  const cohort = cohorts.find(
    (cohort) =>
      cohort.id === "ambassador-2026-student-athletes"
  );

  return (
    <main>

      <section className="hero">
        <h1>
          Ambassador Christian School
        </h1>

        <p>
          Launch Ready™: Professional Skills & Internship Readiness
        </p>
      </section>


      <section className="journey-grid">

        <article className="journey-card">
          <h2>
            Program
          </h2>
          <p>
            {program?.name}
          </p>
          <p>
            {program?.duration}
          </p>
        </article>


        <article className="journey-card">
          <h2>
            Cohort
          </h2>
          <p>
            {cohort?.name}
          </p>
          <p>
            Students: {cohort?.students}
          </p>
        </article>


        <article className="journey-card">
          <h2>
            Facilitator
          </h2>
          <p>
            {cohort?.facilitator}
          </p>
        </article>


        <article className="journey-card">
          <h2>
            Current Week
          </h2>
          <h3>
            Week {cohort?.currentWeek}
          </h3>
        </article>

      </section>


      <section>
        <h2>
          Launch Ready™ Skills
        </h2>

        <ul>
          {program?.features?.map((feature) => (
            <li key={feature}>
              {feature}
            </li>
          ))}
        </ul>
      </section>

    </main>
  );
}

