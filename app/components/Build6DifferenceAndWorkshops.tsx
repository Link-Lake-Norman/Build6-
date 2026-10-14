import styles from "./Build6DifferenceAndWorkshops.module.css";

const differences = [
  {
    typical: "Career information and worksheets",
    build6: "Practice-first career and life development through realistic decisions, challenges, and reflection.",
  },
  {
    typical: "Soft skills discussed",
    build6: "Communication, judgment, teamwork, conflict resolution, adaptability, and professionalism practiced under pressure.",
  },
  {
    typical: "Guest speakers give presentations",
    build6: "Professionals participate through interactive Q&A, challenges, stories, demonstrations, and career exposure.",
  },
  {
    typical: "Career exploration by job title",
    build6: "Students explore industries, hidden roles, workplace systems, pathways, and transferable skills.",
  },
  {
    typical: "One-time exposure",
    build6: "A six-stage pathway: DISCOVER → DEVELOP → EXPLORE → CONNECT → EXPERIENCE → LAUNCH.",
  },
  {
    typical: "Attendance proves completion",
    build6: "Students build evidence through applied work, reflection, portfolio artifacts, presentations, and readiness growth.",
  },
];

const oneDay = [
  "Discover strengths, values, transferable skills, and career identity",
  "Professional communication and first-impression practice",
  "Interactive workplace improv, role play, and a realistic case challenge",
  "Career exploration across industries, roles, systems, and pathways",
  "Team decision-making under pressure with a live twist",
  "Personal action plan: what I can build next",
];

const twoDay = [
  "Everything in the 1-day workshop, with more time for practice and coaching",
  "Deeper teamwork, leadership, conflict-resolution, and professional judgment scenarios",
  "Career pathway mapping and hidden-role exploration",
  "Professional pitch, camera/presentation practice, and feedback",
  "Employer/professional engagement or industry exposure when available",
  "Applied capstone challenge with reflection and evidence of learning",
  "Individual next-step plan for education, career, work experience, or leadership",
];

export default function Build6DifferenceAndWorkshops() {
  return (
    <section className={styles.section} id="why-build6">
      <div className={styles.inner}>
        <div className={styles.eyebrow}>WHY BUILD6™ IS DIFFERENT</div>
        <div className={styles.headingRow}>
          <div>
            <h2>Students do not just hear about readiness. They practice it.</h2>
            <p className={styles.lead}>
              BUILD6™ is a career and life-development experience built around application,
              professional judgment, communication, exploration, and real-world practice — not
              another lecture-first career-readiness class.
            </p>
          </div>
          <img
            className={styles.logo}
            src="/brand/build6-horizontal-lockup.png"
            alt="BUILD6 — Build What's Next"
          />
        </div>

        <div className={styles.statement}>
          <strong>Most programs tell students what they need to know.</strong>
          <span>BUILD6™ puts them in situations where they have to use it.</span>
        </div>

        <div className={styles.compareGrid}>
          <div className={styles.compareHead}>Typical approach</div>
          <div className={styles.compareHead}>BUILD6™ approach</div>
          {differences.map((item) => (
            <div className={styles.compareRow} key={item.typical}>
              <div className={styles.typical}>{item.typical}</div>
              <div className={styles.build6}>{item.build6}</div>
            </div>
          ))}
        </div>

        <div className={styles.optionalBox}>
          <div>
            <span className={styles.optionalTag}>OPTIONAL ADD-ON</span>
            <h3>Internship support & placement coordination</h3>
          </div>
          <p>
            Organizations may add internship-readiness support, employer introductions, host
            coordination, and local placement assistance. Internship support is optional and
            separate from the core BUILD6™ curriculum. Placement depends on student readiness,
            employer fit, host availability, program requirements, and local opportunities; a
            placement is not guaranteed.
          </p>
        </div>

        <div className={styles.workshopHeader}>
          <div className={styles.eyebrow}>WAYS TO BRING BUILD6™ IN</div>
          <h2>Start with a workshop or build the full pathway.</h2>
          <p>
            Workshops are active, facilitator-led experiences that can be customized for students,
            athletes, teams, colleges, workforce programs, or emerging professionals.
          </p>
        </div>

        <div className={styles.workshopGrid}>
          <article className={styles.workshopCard}>
            <div className={styles.dayBadge}>1 DAY</div>
            <h3>BUILD6™ Career + Life Readiness Intensive</h3>
            <p className={styles.duration}>Approximately 4.5–6 hours • customizable</p>
            <p>
              A high-energy introduction to the BUILD6™ experience. Participants move from
              self-awareness into professional communication, career exploration, teamwork, and
              real-world decision-making in one concentrated day.
            </p>
            <ul>
              {oneDay.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <div className={styles.outcome}>
              <strong>Participants leave with:</strong> clearer self-awareness, practiced workplace
              skills, broader career visibility, and a specific next-step plan.
            </div>
          </article>

          <article className={styles.workshopCard}>
            <div className={styles.dayBadge}>2 DAYS</div>
            <h3>BUILD6™ Applied Career Readiness Lab</h3>
            <p className={styles.duration}>Two immersive workshop days • customizable</p>
            <p>
              A deeper BUILD6™ experience with repetition, coaching, multiple workplace scenarios,
              career-pathway exploration, professional practice, and an applied final challenge.
            </p>
            <ul>
              {twoDay.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <div className={styles.outcome}>
              <strong>Participants leave with:</strong> stronger evidence of how they communicate,
              decide, adapt, collaborate, present themselves, and connect their strengths to future
              pathways.
            </div>
          </article>
        </div>

        <div className={styles.fullProgram}>
          <div>
            <span className={styles.optionalTag}>FULL PROGRAM</span>
            <h3>BUILD6™ Six-Stage Experience</h3>
            <p>
              For organizations that want sustained development, BUILD6™ expands beyond a workshop
              into the complete DISCOVER → DEVELOP → EXPLORE → CONNECT → EXPERIENCE → LAUNCH
              pathway with repeated practice, reflection, professional exposure, and evidence of
              growth.
            </p>
          </div>
          <a className={styles.cta} href="/connect">Explore BUILD6™ for your organization</a>
        </div>
      </div>
    </section>
  );
}
