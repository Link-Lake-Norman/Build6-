export default function StudentExperiencesPage() {
  const experiences = [
    {
      title: "Career Exploration Tour",
      type: "Workplace Experience",
      status: "Completed",
    },
    {
      title: "Professional Mentorship",
      type: "Mentorship",
      status: "In Progress",
    },
    {
      title: "BUILD6 Internship",
      type: "Internship",
      status: "Upcoming",
    },
  ];

  return (
    <main>

      <section className="hero">
        <h1>
          BUILD6™ Experience Tracker
        </h1>

        <p>
          Track your career experiences, mentorships,
          and workplace learning journey.
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
              Status: {experience.status}
            </p>

          </article>

        ))}

      </section>

    </main>
  );
}
