export default function FacilitatorHubPage() {

  const resources = [
    {
      title: "Weekly Lessons",
      description:
        "Access the Future Ready™ curriculum and weekly activities.",
    },
    {
      title: "Student Progress",
      description:
        "Monitor student growth, participation, and readiness.",
    },
    {
      title: "Employer Experiences",
      description:
        "Coordinate workplace tours, mentors, and opportunities.",
    },
    {
      title: "Facilitator Resources",
      description:
        "Access guides, activities, and implementation tools.",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Facilitator Hub
        </h1>

        <p>
          Everything educators and program leaders need
          to deliver the Future Ready™ experience.
        </p>

      </section>


      <section className="journey-grid">

        {resources.map((resource) => (

          <article
            className="journey-card"
            key={resource.title}
          >

            <h2>
              {resource.title}
            </h2>

            <p>
              {resource.description}
            </p>

          </article>

        ))}

      </section>

    </main>
  );
}
