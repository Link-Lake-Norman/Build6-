export default function ManageOpportunitiesPage() {

  const opportunities = [
    {
      title: "Healthcare Shadow Experience",
      type: "Career Exploration",
      students: 12,
      status: "Active",
    },
    {
      title: "Manufacturing Internship",
      type: "Internship",
      students: 5,
      status: "Recruiting",
    },
    {
      title: "Business Mentor Program",
      type: "Mentorship",
      students: 8,
      status: "Active",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Employer Opportunity Management
        </h1>

        <p>
          Manage workplace experiences, mentorships,
          and talent pipeline opportunities.
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

            <p>
              {opportunity.type}
            </p>

            <p>
              Students Interested: {opportunity.students}
            </p>

            <p>
              Status: {opportunity.status}
            </p>

          </article>

        ))}

      </section>

    </main>
  );
}
