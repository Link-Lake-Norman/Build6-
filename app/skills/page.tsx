export default function SkillsPage() {

  const skills = [
    {
      title: "Communication",
      description:
        "Build confidence communicating ideas, listening, and collaborating.",
    },
    {
      title: "Leadership",
      description:
        "Develop the ability to influence, support, and guide others.",
    },
    {
      title: "Teamwork",
      description:
        "Learn how to contribute effectively in diverse teams.",
    },
    {
      title: "Problem Solving",
      description:
        "Develop critical thinking and decision-making skills.",
    },
    {
      title: "Professionalism",
      description:
        "Understand workplace expectations and career success habits.",
    },
    {
      title: "Career Exploration",
      description:
        "Connect personal strengths to future career pathways.",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          BUILD6™ Skills Library
        </h1>

        <p>
          The human skills students need to thrive in the future of work.
        </p>

      </section>


      <section className="journey-grid">

        {skills.map((skill) => (

          <article
            className="journey-card"
            key={skill.title}
          >

            <h2>
              {skill.title}
            </h2>

            <p>
              {skill.description}
            </p>

          </article>

        ))}

      </section>

    </main>
  );
}
