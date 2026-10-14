"use client";

import { students } from "../../content/students";
import { employers } from "../../content/employers";
import { opportunities } from "../../content/opportunities";
import { impact } from "../../content/impact";

export default function SuperAdminPage() {

  const metrics = {
    students: students.length,
    employers: employers.length,
    opportunities: opportunities.length,
    experiences: impact.skillsDeveloped,
  };

  return (
    <main>

      <section className="hero">

        <h1>
          BUILD6™ Super Admin Command Center
        </h1>

        <p>
          Manage the BUILD6™ ecosystem,
          partners, programs, and platform growth.
        </p>

      </section>


      <section className="journey-grid">

        <article className="journey-card">

          <h2>
            Students
          </h2>

          <h3>
            {metrics.students}
          </h3>

        </article>


        <article className="journey-card">

          <h2>
            Employers
          </h2>

          <h3>
            {metrics.employers}
          </h3>

        </article>


        <article className="journey-card">

          <h2>
            Opportunities
          </h2>

          <h3>
            {metrics.opportunities}
          </h3>

        </article>


        <article className="journey-card">

          <h2>
            Experiences Completed
          </h2>

          <h3>
            {metrics.experiences}
          </h3>

        </article>

      </section>

    </main>
  );
}
