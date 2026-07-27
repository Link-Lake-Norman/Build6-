export default function SuperAdminPage() {

  const metrics = {
    schools: 12,
    employers: 48,
    partners: 20,
    students: 500,
  };

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Super Admin Command Center
        </h1>

        <p>
          Manage the Future Ready™ ecosystem,
          partners, programs, and platform growth.
        </p>

      </section>


      <section className="journey-grid">

        <article className="journey-card">

          <h2>
            School Partners
          </h2>

          <h3>
            {metrics.schools}
          </h3>

        </article>


        <article className="journey-card">

          <h2>
            Employer Partners
          </h2>

          <h3>
            {metrics.employers}
          </h3>

        </article>


        <article className="journey-card">

          <h2>
            Licensed Partners
          </h2>

          <h3>
            {metrics.partners}
          </h3>

        </article>


        <article className="journey-card">

          <h2>
            Students
          </h2>

          <h3>
            {metrics.students}
          </h3>

        </article>

      </section>

    </main>
  );
}
