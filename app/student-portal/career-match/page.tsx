export default function CareerMatchPage() {

  const matches = [
    {
      career: "Healthcare Careers",
      match: 92,
      reason:
        "Strong communication skills and interest in helping others.",
    },
    {
      career: "Technology Careers",
      match: 78,
      reason:
        "Strong problem solving and innovation skills.",
    },
    {
      career: "Business & Leadership Careers",
      match: 85,
      reason:
        "Leadership and teamwork strengths align well.",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Career Match
        </h1>

        <p>
          Explore career pathways connected to your strengths and skills.
        </p>

      </section>


      <section className="journey-grid">

        {matches.map((match) => (

          <article
            className="journey-card"
            key={match.career}
          >

            <h2>
              {match.career}
            </h2>

            <h3>
              Match Score: {match.match}%
            </h3>

            <p>
              {match.reason}
            </p>

          </article>

        ))}

      </section>

    </main>
  );
}
