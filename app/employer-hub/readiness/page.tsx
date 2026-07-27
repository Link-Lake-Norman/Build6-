export default function EmployerReadinessPage() {

  const students = [
    {
      name: "Future Ready Student",
      readiness: 85,
      skills: "Communication, Leadership, Teamwork",
      experiences: 3,
    },
    {
      name: "Future Ready Student",
      readiness: 72,
      skills: "Problem Solving, Professional Skills",
      experiences: 2,
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Employer Readiness View
        </h1>

        <p>
          View student development, skills, and career readiness.
        </p>

      </section>


      <section className="journey-grid">

        {students.map((student, index) => (

          <article
            className="journey-card"
            key={index}
          >

            <h2>
              {student.name}
            </h2>

            <h3>
              Readiness Score: {student.readiness}%
            </h3>

            <p>
              Skills: {student.skills}
            </p>

            <p>
              Experiences Completed: {student.experiences}
            </p>

          </article>

        ))}

      </section>

    </main>
  );
}
