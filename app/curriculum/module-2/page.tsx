export default function ModuleTwoPage() {

  const lessons = [
    {
      title: "Communication Skills",
      description:
        "Build confidence in professional communication, listening, and collaboration.",
    },
    {
      title: "Leadership & Teamwork",
      description:
        "Develop the skills needed to lead, contribute, and work effectively with others.",
    },
    {
      title: "Professional Readiness",
      description:
        "Learn workplace expectations, professionalism, and career success habits.",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Module 2: Build Skills
        </h1>

        <p>
          Develop the human skills that prepare students for the future of work.
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
