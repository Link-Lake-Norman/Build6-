export default function ModuleOnePage() {

  const lessons = [
    {
      title: "Who Am I?",
      description:
        "Explore strengths, interests, values, and personal identity.",
    },
    {
      title: "My Strengths",
      description:
        "Identify natural talents and skills that shape your future.",
    },
    {
      title: "My Future Vision",
      description:
        "Create a vision for the person and professional you want to become.",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Module 1: Discover Purpose
        </h1>

        <p>
          Build self-awareness and understand what makes you uniquely BUILD6™.
        </p>

      </section>


      <section className="journey-grid">

        {lessons.map((lesson) => (

          <article
            className="journey-card"
            key={lesson.title}
          >

            <h2>
              {lesson.title}
            </h2>

            <p>
              {lesson.description}
            </p>

          </article>

        ))}

      </section>

    </main>
  );
}
