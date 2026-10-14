"use client";

import { matches } from "../../../content/matches";

export default function CareerMatchPage() {

  return (
    <main>

      <section className="hero">

        <h1>
          BUILD6™ Career Match
        </h1>

        <p>
          Discover career pathways aligned with
          your skills, interests, and experiences.
        </p>

      </section>


      <section className="journey-grid">

        {matches.map((match) => (

          <article
            className="journey-card"
            key={match.id}
          >

            <h2>
              {match.opportunity}
            </h2>

            <p>
              Employer: {match.employer}
            </p>

            <h3>
              Match Score: {match.matchScore}%
            </h3>

            <h3>
              Why This Matches:
            </h3>

            {match.reasons.map((reason) => (
              <p key={reason}>
                {reason}
              </p>
            ))}

          </article>

        ))}

      </section>

    </main>
  );
}
