export default function EmployerHubPage() {
  const partners = [
    {
      title: "Career Exploration",
      description:
        "Introduce students to industries, careers, and opportunities through real-world employer connections.",
    },
    {
      title: "Workplace Experiences",
      description:
        "Create meaningful exposure through workplace tours, job shadowing, and project-based learning.",
    },
    {
      title: "Mentorship",
      description:
        "Develop the next generation of talent through employee mentorship and career guidance.",
    },
    {
      title: "Internship Readiness",
      description:
        "Connect with students who are building professional skills, confidence, and workplace readiness.",
    },
  ];

  const engagement = [
    "Career Talks",
    "Workplace Tours",
    "Job Shadowing",
    "Mentorship",
    "Internships",
    "Project-Based Learning",
  ];

  const readiness = [
    "Communication",
    "Problem Solving",
    "Teamwork",
    "Leadership",
    "Professionalism",
    "Technology Skills",
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Employer Hub
        </h1>

        <p>
          Building the bridge between education and the workforce by connecting
          employers with future talent.
        </p>

      </section>


      <section className="journey-grid">

        {partners.map((partner) => (

          <article
            className="journey-card"
            key={partner.title}
          >

            <h2>
              {partner.title}
            </h2>

            <p>
              {partner.description}
            </p>

          </article>

        ))}

      </section>


      <section>

        <h2>
          Employer Engagement Opportunities
        </h2>

        <div className="journey-grid">

          {engagement.map((item) => (

            <article
              className="journey-card"
              key={item}
            >

              <h3>
                {item}
              </h3>

              <p>
                Partner with Future Ready™ students through meaningful
                workforce connections.
              </p>

            </article>

          ))}

        </div>

      </section>


      <section>

        <h2>
          Student Readiness Indicators
        </h2>

        <div className="journey-grid">

          {readiness.map((skill) => (

            <article
              className="journey-card"
              key={skill}
            >

              <h3>
                {skill}
              </h3>

              <p>
                Developing through the Future Ready™ learning journey.
              </p>

            </article>

          ))}

        </div>

      </section>


      <section className="hero">

        <h2>
          Become a Future Ready™ Employer Partner
        </h2>

        <p>
          Help prepare students today while strengthening your future workforce
          pipeline.
        </p>

        <button>
          Partner With Future Ready™
        </button>

      </section>


    </main>
  );
}