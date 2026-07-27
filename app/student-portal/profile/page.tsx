export default function StudentProfilePage() {
  const skills = [
    "Communication",
    "Leadership",
    "Problem Solving",
    "Teamwork",
    "Professionalism",
    "Technology",
  ];

  const interests = [
    "Healthcare",
    "Advanced Manufacturing",
    "Business",
    "Technology",
    "Community Leadership",
  ];

  const portfolio = [
    "Career Vision",
    "Personal Strengths",
    "Future Goals",
    "Completed Projects",
  ];

  return (
    <main>

      <section className="hero">
        <h1>
          Future Ready™ Student Profile
        </h1>

        <p>
          Your personal readiness profile showcasing your skills,
          interests, growth, and future goals.
        </p>
      </section>


      <section className="journey-grid">

        <article className="journey-card">
          <h2>Student</h2>
          <p>Future Ready™ Participant</p>
        </article>

        <article className="journey-card">
          <h2>Journey Status</h2>
          <p>Building career readiness</p>
        </article>

        <article className="journey-card">
          <h2>Career Goal</h2>
          <p>Exploring future opportunities</p>
        </article>

      </section>


      <section>
        <h2>Skills Developed</h2>

        <div className="journey-grid">

          {skills.map((skill) => (
            <article
              className="journey-card"
              key={skill}
            >
              <h3>{skill}</h3>
              <p>
                Developing through Future Ready™ experiences.
              </p>
            </article>
          ))}

        </div>
      </section>


      <section>
        <h2>Career Interests</h2>

        <div className="journey-grid">

          {interests.map((interest) => (
            <article
              className="journey-card"
              key={interest}
            >
              <h3>{interest}</h3>
            </article>
          ))}

        </div>
      </section>


      <section>
        <h2>Portfolio Highlights</h2>

        <div className="journey-grid">

          {portfolio.map((item) => (
            <article
              className="journey-card"
              key={item}
            >
              <h3>{item}</h3>

              <p>
                Future Ready™ growth evidence.
              </p>
            </article>
          ))}

        </div>
      </section>

    </main>
  );
}