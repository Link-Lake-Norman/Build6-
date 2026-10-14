export default function EmployerStudentProfilePage() {

  const student = {
    name: "BUILD6 Student",
    readiness: 84,
    interests: [
      "Healthcare",
      "Technology",
    ],
    skills: [
      "Communication",
      "Teamwork",
      "Problem Solving",
    ],
    experiences: [
      "Career Exploration",
      "Mentorship",
      "Workplace Experience",
    ],
  };

  return (
    <main>

      <section className="hero">

        <h1>
          BUILD6™ Employer Student Profile
        </h1>

        <p>
          View student readiness, skills,
          and career development.
        </p>

      </section>


      <section className="journey-grid">

        <article className="journey-card">

          <h2>
            {student.name}
          </h2>

          <h3>
            Readiness Score: {student.readiness}%
          </h3>

        </article>


        <article className="journey-card">

          <h2>
            Skills
          </h2>

          {student.skills.map((skill) => (
            <p key={skill}>
              {skill}
            </p>
          ))}

        </article>


        <article className="journey-card">

          <h2>
            Experiences
          </h2>

          {student.experiences.map((experience) => (
            <p key={experience}>
              {experience}
            </p>
          ))}

        </article>


      </section>

    </main>
  );
}
