import { readiness } from "../../../content/readiness";

export default function StudentProfilePage() {
  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Student Profile
        </h1>

        <p>
          Your personalized readiness profile showing your skills,
          interests, growth, and future opportunities.
        </p>

      </section>


      <section className="journey-grid">

        <article className="journey-card">

          <h2>
            Readiness Score
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
          Skills Development
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
                Progress: {skill.level}%
              </p>

            </article>

          ))}

        </div>

      </section>


      <section>

        <h2>
          Portfolio Progress
        </h2>


        <div className="journey-grid">

          {readiness.portfolio.map((item) => (

            <article
              className="journey-card"
              key={item.title}
            >

              <h3>
                {item.title}
              </h3>

              <p>
                Status: {item.status}
              </p>

            </article>

          ))}

        </div>

      </section>


      <section>

        <h2>
          Employer Readiness
        </h2>


        <div className="journey-grid">

          <article className="journey-card">

            <h3>
              Internship Ready
            </h3>

            <p>
              {readiness.employerReadiness.internshipReady
                ? "✅ Ready"
                : "Not Yet"}

            </p>

          </article>


          <article className="journey-card">

            <h3>
              Mentorship Ready
            </h3>

            <p>
              {readiness.employerReadiness.mentorshipReady
                ? "✅ Ready"
                : "Not Yet"}

            </p>

          </article>


          <article className="journey-card">

            <h3>
              Workplace Experience
            </h3>

            <p>
              {readiness.employerReadiness.workplaceExperienceNeeded
                ? "Experience Needed"
                : "Completed"}

            </p>

          </article>


        </div>

      </section>


    </main>
  );
}
