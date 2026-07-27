import Link from "next/link";

export default function StudentPortalPage() {
  const journey = [
    {
      title: "Discover™",
      description:
        "Explore your strengths, interests, values, and possible career paths.",
    },
    {
      title: "Build™",
      description:
        "Develop skills, confidence, and professional readiness.",
    },
    {
      title: "Launch™",
      description:
        "Connect your learning to employers, internships, and opportunities.",
    },
  ];

  const skills = [
    "Communication",
    "Leadership",
    "Problem Solving",
    "Teamwork",
    "Professionalism",
    "Technology",
  ];

  const opportunities = [
    "Career Exploration",
    "Mentorship",
    "Workplace Tours",
    "Internships",
  ];

  return (
    <main>

      <section className="hero">

        <h1>
          Future Ready™ Student Portal
        </h1>

        <p>
          Discover Purpose. Build Skills. Launch Your Future.
        </p>

        <Link href="/student-portal/profile">
          <button>
            View My Future Ready™ Profile →
          </button>
        </Link>

      </section>


      <section>

        <h2>
          Your Future Ready™ Journey
        </h2>

        <div className="journey-grid">

          {journey.map((item) => (

            <article
              className="journey-card"
              key={item.title}
            >

              <h3>
                {item.title}
              </h3>

              <p>
                {item.description}
              </p>

            </article>

          ))}

        </div>

      </section>


      <section>

        <h2>
          Skills You Are Building
        </h2>

        <div className="journey-grid">

          {skills.map((skill) => (

            <article
              className="journey-card"
              key={skill}
            >

              <h3>
                {skill}
              </h3>

              <p>
                Developing through Future Ready™ lessons and experiences.
              </p>

            </article>

          ))}

        </div>

      </section>


      <section>

        <h2>
          Career Opportunities
        </h2>

        <div className="journey-grid">

          {opportunities.map((opportunity) => (

            <article
              className="journey-card"
              key={opportunity}
            >

              <h3>
                {opportunity}
              </h3>

              <p>
                Connect learning with real-world experiences.
              </p>

            </article>

          ))}

        </div>

      </section>


      <section className="hero">

        <h2>
          Continue Your Journey
        </h2>

        <p>
          Track your growth, build your portfolio, and prepare for your future.
        </p>


        <div>

          <Link href="/dashboard">
            <button>
              Student Dashboard →
            </button>
          </Link>


          <Link href="/student-portal/profile">
            <button>
              My Readiness Profile →
            </button>
          </Link>

        </div>

      </section>


    </main>
  );
}