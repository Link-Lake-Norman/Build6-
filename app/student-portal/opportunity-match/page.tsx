export default function OpportunityMatchPage() {

  const opportunities = [
    {
      title: "Healthcare Career Exploration",
      type: "Workplace Experience",
      match: 95,
      description:
        "Meet healthcare professionals and explore career pathways.",
    },
    {
      title: "Technology Mentorship",
      type: "Mentorship",
      match: 82,
      description:
        "Connect with technology professionals and build career insight.",
    },
    {
      title: "Leadership Internship",
      type: "Internship",
      match: 88,
      description:
        "Gain professional experience through a workplace internship.",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Opportunity Match
        </h1>

        <p>
          Discover experiences connected to your career goals.
        </p>

      </section>


      <section className="journey-grid">

        {opportunities.map((opportunity) => (

          <article
            className="journey-card"
            key={opportunity.title}
          >

            <h2>
              {opportunity.title}
            </h2>

            <h3>
              Match: {opportunity.match}%
            </h3>

            <p>
              {opportunity.type}
            </p>

            <p>
              {opportunity.description}
            </p>

          </article>

        ))}

      </section>

    </main>
  );
}
