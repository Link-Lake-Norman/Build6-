import { opportunities } from "../../../content/opportunities";

export default function StudentOpportunitiesPage() {
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

            <button>
              I'm Interested
            </button>

          </article>

        ))}

      </section>

    </main>
  );
}
