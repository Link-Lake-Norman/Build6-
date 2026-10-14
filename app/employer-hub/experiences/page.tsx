export default function EmployerExperiencesPage() {
  const experiences = [
    {
      title: "Career Exploration Tour",
      type: "Workplace Experience",
      students: 20,
      status: "Active",
    },
    {
      title: "Professional Mentorship",
      type: "Mentorship",
      students: 8,
      status: "Active",
    },
    {
      title: "BUILD6 Internship",
      type: "Internship Pipeline",
      students: 5,
      status: "Building",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          BUILD6™ Employer Experience Dashboard
        </h1>

        <p>
          Track employer engagement, student experiences,
          and workforce pipeline development.
        </p>

      </section>


      <section className="journey-grid">

        {experiences.map((experience) => (

          <article
            className="journey-card"
            key={experience.title}
          >

            <h2>
              {experience.title}
            </h2>

            <p>
              {experience.type}
            </p>

            <p>
              Students Connected: {experience.students}
            </p>

            <p>
              Status: {experience.status}
            </p>

          </article>

        ))}

      </section>

    </main>
  );
}
