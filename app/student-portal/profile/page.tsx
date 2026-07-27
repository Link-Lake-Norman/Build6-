export default function StudentProfilePage() {

  const profile = {
    name: "Future Ready Student",
    interests: [
      "Healthcare",
      "Technology",
      "Leadership",
    ],
    readiness: 84,
    skills: [
      "Communication",
      "Teamwork",
      "Problem Solving",
    ],
  };

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Student Profile
        </h1>

        <p>
          Your strengths, skills, interests,
          and future pathway.
        </p>

      </section>


      <section className="journey-grid">

        <article className="journey-card">

          <h2>
            Student
          </h2>

          <p>
            {profile.name}
          </p>

          <h3>
            Readiness Score: {profile.readiness}%
          </h3>

        </article>


        <article className="journey-card">

          <h2>
            Career Interests
          </h2>

          {profile.interests.map((interest) => (
            <p key={interest}>
              {interest}
            </p>
          ))}

        </article>


        <article className="journey-card">

          <h2>
            Skills
          </h2>

          {profile.skills.map((skill) => (
            <p key={skill}>
              {skill}
            </p>
          ))}

        </article>

      </section>

    </main>
  );
}
