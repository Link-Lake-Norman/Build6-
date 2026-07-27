export default function AdminPage() {

  const metrics = [
    {
      title: "Students",
      value: "20",
      description: "Active Future Ready™ participants",
    },
    {
      title: "Employers",
      value: "12",
      description: "Employer partners connected",
    },
    {
      title: "Opportunities",
      value: "8",
      description: "Career experiences available",
    },
    {
      title: "Experiences",
      value: "15",
      description: "Completed and active experiences",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Admin Hub
        </h1>

        <p>
          Manage students, employers, experiences,
          and workforce readiness data.
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
