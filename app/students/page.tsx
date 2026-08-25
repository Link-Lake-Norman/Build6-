import Link from "next/link";
import SiteHeader from "../components/SiteHeader";

export default function StudentsPage() {
  return (
    <main className="audience-page">
      <SiteHeader />
      <section className="audience-hero audience-hero-teal">
        

        <div className="audience-hero-content">
          <p className="eyebrow">FOR STUDENTS</p>

          <h1>
            YOUR FUTURE ISN&apos;T SOMETHING YOU WAIT FOR.
            <span> YOU BUILD IT.</span>
          </h1>

          <p className="audience-lead">
            BUILD6™ helps you understand who you are, build skills that matter,
            meet people doing real work, explore possibilities, gain experience,
            and become more confident about what comes next.
          </p>

          <Link href="/#journey" className="audience-button">
            EXPLORE THE BUILD6™ JOURNEY →
          </Link>
        </div>
      </section>

      <section className="audience-intro">
        <p className="section-kicker">THIS IS ABOUT MORE THAN A CAREER.</p>

        <h2>It&apos;s about learning how to navigate what comes next.</h2>

        <p>
          You do not need to have your entire future figured out. BUILD6™ gives
          you opportunities to discover more about yourself, practice real-world
          skills, connect with adults and professionals, explore industries,
          experience workplaces, and learn how to find your next step.
        </p>
      </section>

      <section className="audience-benefits">
        <article>
          <span>01</span>
          <h3>KNOW YOURSELF</h3>
          <p>
            Understand your strengths, interests, values, goals, and the experiences
            that are shaping who you are becoming.
          </p>
        </article>

        <article>
          <span>02</span>
          <h3>BUILD CONFIDENCE</h3>
          <p>
            Practice communication, leadership, problem solving, teamwork, and the
            human skills that matter wherever you go.
          </p>
        </article>

        <article>
          <span>03</span>
          <h3>MEET REAL PEOPLE</h3>
          <p>
            Learn through conversations with professionals, mentors, employers,
            community leaders, and people whose paths may expand your thinking.
          </p>
        </article>

        <article>
          <span>04</span>
          <h3>GAIN EXPERIENCE</h3>
          <p>
            Connect learning with authentic experiences that help you understand
            workplaces, possibilities, and yourself differently.
          </p>
        </article>
      </section>

      <section className="audience-outcome">
        <p>THE BUILD6™ OUTCOME</p>
        <h2>
          From “I don&apos;t know.” to <strong>“I know how to find out.”</strong>
        </h2>
      </section>

      <footer className="audience-mini-footer">
        © 2026 BUILD6™. All Rights Reserved. Proprietary brand, platform,
        curriculum, research, data, methodologies, designs &amp; program materials.
      </footer>
    </main>
  );
}
