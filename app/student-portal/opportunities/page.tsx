import { readiness } from "../../../content/readiness";

export default function StudentOpportunitiesPage() {
  const opportunities = [
    {
      title: "Healthcare Career Exploration",
      type: "Workplace Experience",
      description:
        "Explore healthcare careers through employer conversations and workplace exposure.",
    },
    {
      title: "Professional Mentorship",
      type: "Mentorship",
      description:
        "Connect with professionals who can provide career guidance and industry insight.",
    },
    {
      title: "Future Ready Internship",
      type: "Internship",
      description:
        "Apply your skills through real workplace experiences.",
    },
  ];

  return (
    <main>

      <section className="hero">
        <h1>
          Future Ready™ Student Opportunities
        </h1>

        <p>
          Discover experiences that connect your skills,
          interests, and future career goals.
        </p>
      </section>


      <section className="journey-grid">

        <article className="journey-card">

          <h2>
            Your Readiness Score
          </h2>

          <h3>
            {readiness.student.readinessScore}%
          </h3>

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