import { readiness } from "../../../content/readiness";

export default function EmployerOpportunitiesPage() {
  const opportunities = [
    {
      title: "Career Mentorship",
      type: "Mentorship",
      description:
        "Connect students with professionals who can share career guidance and industry insight.",
    },
    {
      title: "Workplace Experience",
      type: "Job Shadow / Tour",
      description:
        "Introduce students to real workplace environments and career pathways.",
    },
    {
      title: "Internship Opportunity",
      type: "Internship",
      description:
        "Create meaningful experiences that help students build career-ready skills.",
    },
  ];

  return (
    <main>

      <section className="hero">
        <h1>
          Future Ready™ Opportunity Marketplace
        </h1>

        <p>
          Connecting students with employers through mentorship,
          experiences, and career opportunities.
        </p>
      </section>


      <section className="journey-grid">

        <article className="journey-card">

          <h2>
            Student Readiness
          </h2>

          <h3>
            {readiness.student.readinessScore}%
          </h3>

          <p>
            Current Future Ready™ readiness score
          </p>

        </article>


        <article className="journey-card">

          <h2>
            Career Interests
          </h2>

          {readiness.student.careerInterests.map((interest) => (
            <p key={interest}>
              {interest}
            </p>
          ))}

        </article>

      </section>


      <section>

        <h2>
          Available Opportunities
        </h2>

        <div className="journey-grid">

          {opportunities.map((opportunity) => (

            <article
              className="journey-card"
              key={opportunity.title}
            >

              <h3>
                {opportunity.title}
              </h3>

              <p>
                {opportunity.type}
              </p>

              <p>
                {opportunity.description}
              </p>

            </article>

          ))}

        </div>

      </section>


    </main>
  );
}
