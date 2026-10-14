export default function CareersPage() {

  const careers = [
    {
      title: "Healthcare Careers",
      skills: "Communication, Empathy, Problem Solving",
      description:
        "Explore careers supporting people through healthcare and wellness.",
    },
    {
      title: "Technology Careers",
      skills: "Critical Thinking, Innovation, Collaboration",
      description:
        "Explore careers building solutions through technology.",
    },
    {
      title: "Advanced Manufacturing Careers",
      skills: "Teamwork, Precision, Continuous Improvement",
      description:
        "Explore careers creating products and improving processes.",
    },
    {
      title: "Business & Leadership Careers",
      skills: "Communication, Leadership, Strategy",
      description:
        "Explore careers driving organizations and teams forward.",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          BUILD6™ Career Pathways
        </h1>

        <p>
          Discover careers connected to your strengths,
          skills, and experiences.
        </p>

      </section>


      <section className="journey-grid">

        {careers.map((career) => (

          <article
            className="journey-card"
            key={career.title}
          >

            <h2>
              {career.title}
            </h2>

            <p>
              {career.description}
            </p>

            <p>
              Skills: {career.skills}
            </p>

          </article>

        ))}

      </section>

    </main>
  );
}
