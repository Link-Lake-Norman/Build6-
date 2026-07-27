import { readiness } from "../../../content/readiness";

export default function EmployerMatchingPage() {
  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Talent Matching
        </h1>

        <p>
          Connecting employer opportunities with student skills,
          interests, and career readiness.
        </p>

      </section>


      <section className="journey-grid">

        <article className="journey-card">

          <h2>
            Student Career Interests
          </h2>

          {readiness.student.careerInterests.map((interest) => (

            <p key={interest}>
              ✅ {interest}
            </p>

          ))}

        </article>


        <article className="journey-card">

          <h2>
            Readiness Score
          </h2>

          <h3>
            {readiness.student.readinessScore}%
          </h3>

          <p>
            Future Ready™ workplace readiness indicator
          </p>

        </article>

      </section>


      <section>

        <h2>
          Skills Alignment
        </h2>


        <div className="journey-grid">

          {readiness.skills.map((skill) => (

            <article
              className="journey-card"
              key={skill.name}
            >

              <h3>
                {skill.name}
              </h3>

              <p>
                Category: {skill.category}
              </p>

              <p>
                Match Strength: {skill.level}%
              </p>

            </article>

          ))}

        </div>

      </section>


      <section className="hero">

        <h2>
          Employer Connection Opportunities
        </h2>

        <p>
          Employers can connect with Future Ready™ students through:
        </p>

        <p>
          🤝 Mentorship
        </p>

        <p>
          🏢 Workplace Experiences
        </p>

        <p>
          🚀 Internship Opportunities
        </p>

      </section>


    </main>
  );
}