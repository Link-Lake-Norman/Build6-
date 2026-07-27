"use client";

import { opportunities } from "../../../content/opportunities";

export default function ManageOpportunitiesPage() {

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Employer Opportunity Management
        </h1>

        <p>
          Manage workplace experiences, internships,
          and career opportunities.
        </p>

      </section>


      <section className="journey-grid">

        {opportunities.map((opportunity) => (

          <article
            className="journey-card"
            key={opportunity.id}
          >

            <h2>
              {opportunity.title}
            </h2>

            <p>
              Industry: {opportunity.industry}
            </p>

            <p>
              Type: {opportunity.type}
            </p>

            <p>
              Status: {opportunity.status}
            </p>

            <h3>
              Skills Needed:
            </h3>

            {opportunity.skills.map((skill) => (
              <p key={skill}>
                {skill}
              </p>
            ))}

          </article>

        ))}

      </section>

    </main>
  );
}
