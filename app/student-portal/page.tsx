import Link from "next/link";
import { readiness } from "../../content/readiness";

export default function StudentPortalPage() {
  return (
    <main>

      <section className="hero">
        <h1>
          Future Ready™ Student Portal
        </h1>

        <p>
          Discover your strengths, build skills, and connect your future.
        </p>
      </section>


      <section className="journey-grid">

        <article className="journey-card">
          <h2>
            Readiness Score
          </h2>

          <h3>
            {readiness.student.readinessScore}%
          </h3>

          <p>
            Your current Future Ready™ progress
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


        <article className="journey-card">
          <h2>
            Skills Building
          </h2>

          <p>
            {readiness.skills.length} Future Ready™ skills tracked
          </p>
        </article>

      </section>


      <section>

        <h2>
          Your Future Ready™ Journey
        </h2>


        <div className="journey-grid">

          <Link
            href="/student-portal/profile"
            className="journey-card"
          >
            <h3>
              My Profile
            </h3>

            <p>
              View your strengths, interests, and career identity.
            </p>
          </Link>


          <Link
            href="/student-portal/opportunities"
            className="journey-card"
          >
            <h3>
              Opportunities
            </h3>

            <p>
              Explore internships, mentorships, and experiences.
            </p>
          </Link>


          <article className="journey-card">
            <h3>
              Skills Growth
            </h3>

            <p>
              Continue building communication, leadership,
              teamwork, and professional skills.
            </p>
          </article>

        </div>

      </section>

    </main>
  );
}
