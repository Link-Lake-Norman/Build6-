"use client";

import { useState } from "react";
import { opportunities } from "../../../content/opportunities";

export default function StudentOpportunitiesPage() {

  const [selected, setSelected] = useState<number[]>([]);

  function showInterest(id: number) {
    setSelected((current) =>
      current.includes(id)
        ? current
        : [...current, id]
    );
  }

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Opportunities
        </h1>

        <p>
          Explore internships, mentorships, and workplace experiences.
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
              {opportunity.type}
            </p>

            <p>
              Employer: {opportunity.employer}
            </p>


            <button
              onClick={() => showInterest(opportunity.id)}
            >
              {selected.includes(opportunity.id)
                ? "Interested ✓"
                : "I'm Interested"}
            </button>


          </article>

        ))}

      </section>


      <section className="hero">

        <h2>
          My Interests
        </h2>

        <p>
          Opportunities selected: {selected.length}
        </p>

      </section>


    </main>
  );
}
