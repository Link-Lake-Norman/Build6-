export default function ImpactROIDashboardPage() {

  const impact = {
    students: 250,
    employers: 35,
    experiences: 120,
    readinessGrowth: 38,
  };

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Impact & ROI Dashboard
        </h1>

        <p>
          Measure workforce impact, student growth,
          and community outcomes.
        </p>

      </section>


      <section className="journey-grid">

        <article className="journey-card">

          <h2>
            Students Served
          </h2>

          <h3>
            {impact.students}
          </h3>

        </article>


        <article className="journey-card">

          <h2>
            Employer Partners
          </h2>

          <h3>
            {impact.employers}
          </h3>

        </article>


        <article className="journey-card">

          <h2>
            Experiences Created
          </h2>

          <h3>
            {impact.experiences}
          </h3>

        </article>


        <article className="journey-card">

          <h2>
            Readiness Growth
          </h2>

          <h3>
            {impact.readinessGrowth}%
          </h3>

        </article>

      </section>

    </main>
  );
}
