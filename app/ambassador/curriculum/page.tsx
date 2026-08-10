const curriculum = [
  {
    week: 1,
    title: "Who You Are Matters",
    focus: "Identity, strengths, values, and professionalism",
  },
  {
    week: 2,
    title: "Discover Your Strengths",
    focus: "Understanding talents, skills, and personal brand",
  },
  {
    week: 3,
    title: "Professional Communication",
    focus: "Email, conversations, listening, and workplace presence",
  },
  {
    week: 4,
    title: "Leadership & Teamwork",
    focus: "Leading yourself and contributing to teams",
  },
  {
    week: 5,
    title: "Career Exploration",
    focus: "Understanding industries, roles, and opportunities",
  },
  {
    week: 6,
    title: "Resume & Personal Brand",
    focus: "Building professional profiles and resumes",
  },
  {
    week: 7,
    title: "Interview Preparation",
    focus: "Confidence, storytelling, and answering questions",
  },
  {
    week: 8,
    title: "Financial Literacy",
    focus: "Money management, budgeting, and financial decisions",
  },
  {
    week: 9,
    title: "AI Literacy",
    focus: "Using AI tools responsibly in school and work",
  },
  {
    week: 10,
    title: "Workplace Expectations",
    focus: "Professional habits, accountability, and reliability",
  },
  {
    week: 11,
    title: "Networking & Mentors",
    focus: "Building relationships that create opportunity",
  },
  {
    week: 12,
    title: "Problem Solving",
    focus: "Critical thinking and decision making",
  },
  {
    week: 13,
    title: "Internship Readiness",
    focus: "Preparing for workplace experiences",
  },
  {
    week: 14,
    title: "Professional Presentation",
    focus: "Speaking, presenting, and representing yourself",
  },
  {
    week: 15,
    title: "Future Planning",
    focus: "Creating your next-step action plan",
  },
  {
    week: 16,
    title: "Launch Ready Showcase",
    focus: "Presenting your growth and future goals",
  },
];

export default function AmbassadorCurriculumPage() {
  return (
    <main>

      <section className="hero">
        <h1>
          Launch Ready™ Curriculum
        </h1>

        <p>
          Ambassador Christian School
        </p>

        <p>
          16-Week Professional Skills & Internship Readiness Experience
        </p>
      </section>


      <section className="journey-grid">

        {curriculum.map((lesson) => (
          <article
            className="journey-card"
            key={lesson.week}
          >
            <h2>
              Week {lesson.week}
            </h2>

            <h3>
              {lesson.title}
            </h3>

            <p>
              {lesson.focus}
            </p>
          </article>
        ))}

      </section>

    </main>
  );
}
