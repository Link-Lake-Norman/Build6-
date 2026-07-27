import { employers } from "@/content/employers";
import { opportunities } from "@/content/opportunities";
import { matches } from "@/content/matches";

export default function PartnerEmployersPage() {

  return (
    <main>

      <h1>
        Future Ready™ Partner Employer Connections
      </h1>

      <p>
        Explore employer partnerships, opportunities, and student connections.
      </p>


      <section>

        <h2>
          Employer Partners
        </h2>

        {employers.map((employer) => (

          <article key={employer.id}>

            <h3>
              {employer.name}
            </h3>

            <p>
              Industry: {employer.industry}
            </p>

            <p>
              Status: {employer.status}
            </p>

          </article>

        ))}

      </section>


      <section>

        <h2>
          Available Opportunities
        </h2>

        <p>
          Total Opportunities: {opportunities.length}
        </p>

        {opportunities.map((opportunity) => (

          <article key={opportunity.id}>

            <h3>
              {opportunity.title}
            </h3>

            <p>
              Type: {opportunity.type}
            </p>

            <p>
              Employer: {opportunity.employer}
            </p>

          </article>

        ))}

      </section>


      <section>

        <h2>
          Student Connections
        </h2>

        <p>
          Active Matches: {matches.length}
        </p>

      </section>


    </main>
  );
}
