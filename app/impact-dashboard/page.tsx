export default function ImpactDashboardPage() {

  const metrics = [
    {
      title: "Students Served",
      value: "20",
      description: "Students participating in Future Ready™",
    },
    {
      title: "Skills Developed",
      value: "6",
      description: "Career-ready skills being built",
    },
    {
      title: "Employer Experiences",
      value: "12",
      description: "Tours, mentorships, and workplace experiences",
    },
    {
      title: "Internship Pipeline",
      value: "5",
      description: "Students preparing for opportunities",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Impact Dashboard
        </h1>

        <p>
          Measuring workforce readiness, student growth,
          and employer engagement.
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

    </main>
  );
}
