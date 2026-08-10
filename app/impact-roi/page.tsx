"use client";

import { impact } from "../../content/impact";

export default function ImpactROIDashboardPage() {

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
            {impact.studentsServed}
          </h3>

        </article>


        <article className="journey-card">

          <h2>
            Employer Partners
          </h2>

          <h3>
            {impact.employersConnected}
          </h3>

        </article>


        <article className="journey-card">

          <h2>
            Opportunities Created
          </h2>

          <h3>
            {impact.internshipsCreated}
          </h3>

        </article>


        <article className="journey-card">

          <h2>
            Experiences Completed
          </h2>

          <h3>
            {impact.skillsDeveloped}
          </h3>

        </article>


        <article className="journey-card">

          <h2>
            Readiness Growth
          </h2>

          <h3>
            {impact.completionRate}%
          </h3>

        </article>

      </section>

    </main>
  );
}
