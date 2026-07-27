import Link from "next/link";

export default function EmployerHubPage() {
  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Employer Hub
        </h1>

        <p>
          Building the bridge between education and the workforce by connecting
          employers with future talent.
        </p>

        <Link href="/employer-hub/dashboard">
          <button>
            Open Employer Dashboard →
          </button>
        </Link>

      </section>


      <section className="journey-grid">

        <article className="journey-card">
          <h2>
            Career Exploration
          </h2>

          <p>
            Help students discover industries, careers, and opportunities
            through real-world employer connections.
          </p>
        </article>


        <article className="journey-card">
          <h2>
            Workplace Experiences
          </h2>

          <p>
            Provide workplace tours, job shadowing, and project-based learning.
          </p>
        </article>


        <article className="journey-card">
          <h2>
            Mentorship
          </h2>

          <p>
            Develop future talent through employee mentorship and guidance.
          </p>
        </article>


        <article className="journey-card">
          <h2>
            Internship Readiness
          </h2>

          <p>
            Connect with students building professional skills and confidence.
          </p>
        </article>

      </section>


      <section className="hero">

        <h2>
          Become a Future Ready™ Employer Partner
        </h2>

        <p>
          Strengthen your workforce pipeline while helping students discover
          their future.
        </p>

      </section>

    </main>
  );
}