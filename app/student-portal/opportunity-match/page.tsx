"use client";

import { opportunities } from "../../../content/opportunities";

export default function OpportunityMatchPage() {

  return (
    <main>

      <section className="hero">

        <h1>
          BUILD6™ Opportunity Match
        </h1>

        <p>
          Explore opportunities aligned with your
          skills, interests, and future goals.
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
              Employer: {opportunity.employer}
            </p>

            <p>
              Industry: {opportunity.industry}
            </p>

            <p>
              Type: {opportunity.type}
            </p>

            <h3>
              Skills:
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
