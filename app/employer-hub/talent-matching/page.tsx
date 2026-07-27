import { matches } from "@/content/matches";

export default function TalentMatchingPage() {

  return (
    <main>

      <h1>
        Employer Talent Matching
      </h1>

      <p>
        Connect Future Ready™ students with aligned career opportunities.
      </p>


      <section>

        <h2>
          Recommended Matches
        </h2>


        {matches.map((match) => (

          <article key={match.id}>

            <h3>
              {match.studentName}
            </h3>

            <p>
              Opportunity: {match.opportunity}
            </p>

            <p>
              Match Score: {match.matchScore}%
            </p>


            <h4>
              Alignment Reasons
            </h4>

            {match.reasons.map((reason) => (

              <p key={reason}>
                {reason}
              </p>

            ))}


            <p>
              Status: {match.status}
            </p>

          </article>

        ))}


      </section>


    </main>
  );
}
