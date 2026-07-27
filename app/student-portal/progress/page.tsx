export default function StudentProgressPage() {

  const progress = [
    {
      module: "Module 1: Discover Purpose",
      progress: 100,
      status: "Complete",
    },
    {
      module: "Module 2: Build Skills",
      progress: 60,
      status: "In Progress",
    },
    {
      module: "Module 3: Launch Your Future",
      progress: 20,
      status: "Started",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Student Progress
        </h1>

        <p>
          Track your growth throughout the Future Ready™ journey.
        </p>

      </section>


      <section className="journey-grid">

        {progress.map((item) => (

          <article
            className="journey-card"
            key={item.module}
          >

            <h2>
              {item.module}
            </h2>

            <h3>
              {item.progress}%
            </h3>

            <p>
              {item.status}
            </p>

          </article>

        ))}

      </section>

    </main>
  );
}
