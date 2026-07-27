"use client";

import { matches } from "../../../content/matches";

export default function TalentMatchingPage() {

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Talent Matching
        </h1>

        <p>
          Connect with students whose skills,
          interests, and goals align with your needs.
        </p>

      </section>


      <section className="journey-grid">

        {matches.map((match) => (

          <article
            className="journey-card"
            key={match.id}
          >

            <h2>
              {match.student}
            </h2>

            <p>
              Opportunity: {match.opportunity}
            </p>

            <h3>
              Match Score: {match.matchScore}%
            </h3>

            <h3>
              Alignment:
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
