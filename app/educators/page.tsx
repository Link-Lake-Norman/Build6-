import SponsorBanner from "../components/SponsorBanner";
import "../approved-public-pages.css";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";

import PublicFooter from "../components/PublicFooter";
export default function EducatorsPage() {
  return (
    <main className="audience-page">
      <SiteHeader />
      <section className="audience-hero audience-hero-blue b6-visual-hero b6-visual-educators">
        

        <div className="audience-hero-content">
          <p className="eyebrow">SCHOOLS + STUDENTS</p>

          <h1>
            BUILD CONFIDENCE FOR WHAT
            <span> COMES NEXT.</span>
          </h1>

          <p className="audience-lead">
            BUILD6™ connects career and life readiness with applied learning and real-world relationships. Students discover their strengths, develop communication and leadership, build financial and AI literacy, explore careers and prepare for opportunities beyond graduation.
          </p>

          <div className="audience-hero-actions">
            <Link href="/assessment" className="audience-button">TAKE THE FREE ASSESSMENT →</Link>
            <Link href="/interest?for=school" className="audience-button audience-button-secondary">BRING BUILD6™ TO YOUR SCHOOL →</Link>
          </div>
        </div>
      </section>

      <section className="audience-intro">
        <p className="section-kicker">STRUCTURE FOR EDUCATORS. EXPERIENCE FOR STUDENTS.</p>

        <h2>Learning becomes more meaningful when students can connect it to life.</h2>

        <p>
          BUILD6™ supports educators with a guided student-development experience
          while creating space for reflection, conversation, career exploration,
          professional relationships, community connection, and authentic
          real-world learning.
        </p>
      </section>

      <section className="audience-benefits">
        <article>
          <span>01</span>
          <h3>GUIDED EXPERIENCE</h3>
          <p>
            Give students a clear progression while maintaining the flexibility
            needed for meaningful discussion and reflection.
          </p>
        </article>

        <article>
          <span>02</span>
          <h3>STUDENT GROWTH</h3>
          <p>
            Help students build self-awareness, communication, leadership,
            confidence, adaptability, and professional readiness.
          </p>
        </article>

        <article>
          <span>03</span>
          <h3>REAL-WORLD CONNECTION</h3>
          <p>
            Create meaningful ways for employers, mentors, professionals, and
            community partners to participate in student development.
          </p>
        </article>

        <article>
          <span>04</span>
          <h3>EVIDENCE OF PROGRESS</h3>
          <p>
            Help students capture reflection, growth, skills, experiences, and
            evidence of what they are learning along the way.
          </p>
        </article>
      </section>

      <section className="audience-outcome">
        <p>BUILD MORE THAN READINESS.</p>
        <h2>
          Build <strong>confident, connected, capable students.</strong>
        </h2>
      </section>
      <SponsorBanner />
      <PublicFooter />
    </main>
  );
}
