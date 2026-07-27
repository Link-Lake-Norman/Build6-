export default function CurriculumPage() {

  const modules = [
    {
      title: "Module 1: Discover Purpose",
      weeks: "Weeks 1-6",
      description:
        "Explore strengths, identity, interests, and future possibilities.",
    },
    {
      title: "Module 2: Build Skills",
      weeks: "Weeks 7-18",
      description:
        "Develop communication, leadership, teamwork, and professional skills.",
    },
    {
      title: "Module 3: Launch Your Future",
      weeks: "Weeks 19-36",
      description:
        "Connect students with careers, employers, internships, and experiences.",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Curriculum Hub
        </h1>

        <p>
          A 36-week workforce readiness journey.
        </p>

      </section>


      <section className="journey-grid">

        {modules.map((module) => (

          <article
            className="journey-card"
            key={module.title}
          >

            <h2>
              {module.title}
            </h2>

            <p>
              {module.weeks}
            </p>

            <p>
              {module.description}
            </p>

          </article>

        ))}

      </section>

    </main>
  );
}
