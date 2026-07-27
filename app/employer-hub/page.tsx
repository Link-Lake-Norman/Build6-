import { readiness } from "../../content/readiness";

export default function EmployerHubPage() {
  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Employer Hub
        </h1>

        <p>
          Connecting employers with future talent through skills,
          career interests, mentorship, and workplace experiences.
        </p>

      </section>


      <section className="journey-grid">

        <article className="journey-card">

          <h2>
            Student Readiness Score
          </h2>

          <p>
            {readiness.student.readinessScore}%
          </p>

        </article>


        <article className="journey-card">

          <h2>
            Career Interests
          </h2>

          {readiness.student.careerInterests.map((interest) => (

            <p key={interest}>
              {interest}
            </p>

          ))}

        </article>


      </section>


      <section>

        <h2>
          Future Ready™ Skills Profile
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
                {skill.category}
              </p>

              <p>
                Readiness Level: {skill.level}%
              </p>

            </article>

          ))}

        </div>

      </section>


      <section>

        <h2>
          Employer Engagement Opportunities
        </h2>


        <div className="journey-grid">

          <article className="journey-card">

            <h3>
              Mentorship
            </h3>

            <p>
              Share knowledge and career guidance with Future Ready™ students.
            </p>

          </article>


          <article className="journey-card">

            <h3>
              Workplace Experiences
            </h3>

            <p>
              Provide tours, job shadowing, and real-world exposure.
            </p>

          </article>


          <article className="journey-card">

            <h3>
              Internship Pipeline
            </h3>

            <p>
              Connect with students preparing for future opportunities.
            </p>

          </article>


        </div>

      </section>


      <section className="hero">

        <h2>
          Employer Partnership Status
        </h2>

        <p>
          Internship Ready:
          {" "}
          {readiness.employerReadiness.internshipReady
            ? "✅ Yes"
            : "Not Yet"}
        </p>

        <p>
          Mentorship Ready:
          {" "}
          {readiness.employerReadiness.mentorshipReady
            ? "✅ Yes"
            : "Not Yet"}
        </p>

      </section>


    </main>
  );
}