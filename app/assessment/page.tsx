export default function AssessmentPage() {

  const assessments = [
    {
      skill: "Communication",
      score: 85,
      growth: "Continue practicing presentations and professional conversations.",
    },
    {
      skill: "Leadership",
      score: 75,
      growth: "Build confidence through team projects and experiences.",
    },
    {
      skill: "Problem Solving",
      score: 90,
      growth: "Explore advanced challenges and real-world projects.",
    },
    {
      skill: "Professional Readiness",
      score: 80,
      growth: "Continue developing workplace habits and expectations.",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Skills Assessment
        </h1>

        <p>
          Measure growth, identify strengths,
          and prepare for future opportunities.
        </p>

      </section>


      <section className="journey-grid">

        {assessments.map((assessment) => (

          <article
            className="journey-card"
            key={assessment.skill}
          >

            <h2>
              {assessment.skill}
            </h2>

            <h3>
              Score: {assessment.score}%
            </h3>

            <p>
              {assessment.growth}
            </p>

          </article>

        ))}

      </section>

    </main>
  );
}
