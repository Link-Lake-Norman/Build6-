import { opportunities } from "../../../content/opportunities";

export default function EmployerMatchingPage() {
  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Talent Matching
        </h1>

        <p>
          Connect employers with students building career-ready skills.
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
              Employer: {opportunity.employer}
            </p>

            <p>
              Status: {opportunity.status}
            </p>

            <h3>
              Interested Students
            </h3>

            <p>
              {opportunity.interested}
            </p>

          </article>

        ))}

      </section>

    </main>
  );
}
