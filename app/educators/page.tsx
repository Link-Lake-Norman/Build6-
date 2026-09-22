import "../approved-public-pages.css";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";

import PublicFooter from "../components/PublicFooter";
export default function EducatorsPage() {
  return (
    <main className="audience-page">
      <SiteHeader />
      <section className="audience-hero audience-hero-blue">
        

        <div className="audience-hero-content">
          <p className="eyebrow">FOR EDUCATORS</p>

          <h1>
            BRING THE REAL WORLD
            <span> INTO LEARNING.</span>
          </h1>

          <p className="audience-lead">
            BUILD6™ gives educators a structured way to help students develop
            confidence, skills, relationships, career awareness, and real-world
            experience—without asking teachers to become workforce experts.
          </p>

          <Link href="/interest?for=school" className="audience-button">
            BRING BUILD6™ TO YOUR SCHOOL →
          </Link>
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
      <PublicFooter />
    </main>
  );
}
