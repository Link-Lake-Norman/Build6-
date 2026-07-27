export default function AICoachPage() {

  const recommendations = [
    {
      title: "Explore Healthcare",
      reason:
        "Your communication skills and interest in helping others align with healthcare pathways.",
    },
    {
      title: "Build Leadership Experience",
      reason:
        "Join team projects, mentorship opportunities, and workplace experiences.",
    },
    {
      title: "Develop Your Career Plan",
      reason:
        "Connect your strengths with future education and career opportunities.",
    },
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ AI Career Coach
        </h1>

        <p>
          Personalized guidance to help students discover
          pathways and next steps.
        </p>

      </section>


      <section className="journey-grid">

        {recommendations.map((item) => (

          <article
            className="journey-card"
            key={item.title}
          >

            <h2>
              {item.title}
            </h2>

            <p>
              {item.reason}
            </p>

          </article>

        ))}

      </section>

    </main>
  );
}
