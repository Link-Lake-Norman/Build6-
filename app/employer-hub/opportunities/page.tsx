import { opportunities } from "../../../content/opportunities";

export default function EmployerOpportunitiesPage() {
  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Employer Opportunities
        </h1>

        <p>
          Create and manage workplace experiences, mentorships,
          and career opportunities for Future Ready™ students.
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
              Type: {opportunity.type}
            </p>

            <p>
              Status: {opportunity.status}
            </p>

            <p>
              Students Interested: {opportunity.interested}
            </p>

            <button>
              Manage Opportunity
            </button>

          </article>

        ))}

      </section>

    </main>
  );
}
