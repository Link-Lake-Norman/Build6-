import { opportunities } from "@/content/opportunities";

export default function ManageOpportunitiesPage() {

  return (
    <main>

      <h1>
        Employer Opportunity Management
      </h1>

      <p>
        Create, manage, and review Future Ready™ career experiences.
      </p>


      <section>

        <h2>
          Active Opportunities
        </h2>

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

    </main>
  );
}
