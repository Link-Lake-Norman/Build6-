export default function EmployerDashboardPage() {
  const metrics = [
    {
      title: "Students Connected",
      value: "20",
      description:
        "Students participating in Future Ready™ experiences",
    },
    {
      title: "Skills Developing",
      value: "6",
      description:
        "Career-ready skills being built",
    },
    {
      title: "Career Experiences",
      value: "12",
      description:
        "Tours, talks, mentorships, and projects",
    },
  ];

  const skills = [
    "Communication",
    "Leadership",
    "Problem Solving",
    "Teamwork",
    "Professionalism",
    "Technology",
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Employer Dashboard
        </h1>

        <p>
          Employer view of student readiness, workforce skills,
          and partnership opportunities.
        </p>

      </section>


      <section className="journey-grid">

        {metrics.map((metric) => (
          <article
            className="journey-card"
            key={metric.title}
          >
            <h2>
              {metric.title}
            </h2>

            <h3>
              {metric.value}
            </h3>

            <p>
              {metric.description}
            </p>
          </article>
        ))}

      </section>


      <section>

        <h2>
          Student Skills Growth
        </h2>

        <div className="journey-grid">

          {skills.map((skill) => (
            <article
              className="journey-card"
              key={skill}
            >
              <h3>
                {skill}
              </h3>

              <p>
                Developing through the Future Ready™ curriculum.
              </p>

            </article>
          ))}

        </div>

      </section>


    </main>
  );
}