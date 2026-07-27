import Link from "next/link";

export default function HomePage() {
  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™
        </h1>

        <p>
          Discover Purpose. Build Skills. Launch Your Future.
        </p>

        <p>
          A workforce readiness platform connecting students,
          employers, and communities.
        </p>

      </section>


      <section className="journey-grid">

        <Link
          href="/student-portal"
          className="journey-card"
        >

          <h2>
            Student Journey
          </h2>

          <p>
            Explore strengths, skills, opportunities,
            and career experiences.
          </p>

        </Link>


        <Link
          href="/employer-hub"
          className="journey-card"
        >

          <h2>
            Employer Partnership
          </h2>

          <p>
            Connect with future talent through experiences,
            mentorship, and internships.
          </p>

        </Link>


        <Link
          href="/impact-dashboard"
          className="journey-card"
        >

          <h2>
            Community Impact
          </h2>

          <p>
            Measure workforce readiness and outcomes.
          </p>

        </Link>

      </section>

    </main>
  );
}
