export default function EmployerDashboardPage() {

  const dashboard = {
    opportunities: 8,
    students: 42,
    matches: 15,
    experiences: 21,
  };

  return (
    <main>

      <section className="hero">

        <h1>
          BUILD6™ Employer Dashboard
        </h1>

        <p>
          Build your future talent pipeline through
          meaningful student connections and experiences.
        </p>

      </section>


      <section className="journey-grid">

        <article className="journey-card">
          <h2>
            Active Opportunities
          </h2>
          <h3>
            {dashboard.opportunities}
          </h3>
        </article>


        <article className="journey-card">
          <h2>
            Students Connected
          </h2>
          <h3>
            {dashboard.students}
          </h3>
        </article>


        <article className="journey-card">
          <h2>
            Talent Matches
          </h2>
          <h3>
            {dashboard.matches}
          </h3>
        </article>


        <article className="journey-card">
          <h2>
            Experiences Created
          </h2>
          <h3>
            {dashboard.experiences}
          </h3>
        </article>

      </section>

    </main>
  );
}
