export default function StudentDashboardPage() {

  const dashboard = {
    readiness: 84,
    skills: 4,
    matches: 3,
    opportunities: 5,
  };

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Student Dashboard
        </h1>

        <p>
          Your personal pathway to discover purpose,
          build skills, and launch your future.
        </p>

      </section>


      <section className="journey-grid">

        <article className="journey-card">
          <h2>
            Readiness Score
          </h2>
          <h3>
            {dashboard.readiness}%
          </h3>
        </article>


        <article className="journey-card">
          <h2>
            Skills Developed
          </h2>
          <h3>
            {dashboard.skills}
          </h3>
        </article>


        <article className="journey-card">
          <h2>
            Career Matches
          </h2>
          <h3>
            {dashboard.matches}
          </h3>
        </article>


        <article className="journey-card">
          <h2>
            Opportunities
          </h2>
          <h3>
            {dashboard.opportunities}
          </h3>
        </article>

      </section>

    </main>
  );
}
