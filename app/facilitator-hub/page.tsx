export default function FacilitatorHubPage() {

  const resources = [
    {
      title: "Weekly Lessons",
      description:
        "Access the BUILD6™ curriculum and weekly activities.",
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
          BUILD6™ Facilitator Hub
        </h1>

        <p>
          Everything educators and program leaders need
          to deliver the BUILD6™ experience.
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
