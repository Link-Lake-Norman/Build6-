export default function ModuleThreePage() {

  const lessons = [
    {
      title: "Career Exploration",
      description:
        "Connect interests, skills, and career possibilities through real-world exploration.",
    },
    {
      title: "Workplace Experiences",
      description:
        "Engage with employers through tours, mentorships, and hands-on learning.",
    },
    {
      title: "My Future Launch Plan",
      description:
        "Create a personal action plan for education, career, and continued growth.",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Module 3: Launch Your Future
        </h1>

        <p>
          Connect learning, experiences, and opportunities to build your future pathway.
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
