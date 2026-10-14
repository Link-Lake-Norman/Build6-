import SponsorBanner from "../components/SponsorBanner";
import "../approved-public-pages.css";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";

import PublicFooter from "../components/PublicFooter";
const stages = [
  ["DISCOVER™", "Who am I?"],
  ["DEVELOP™", "What skills do I need?"],
  ["EXPLORE™", "What's possible?"],
  ["CONNECT™", "Who can I learn from?"],
  [
    "EXPERIENCE™",
    "What does the real world look like?",
  ],
  ["LAUNCH™", "What's my next step?"],
];

export default function AboutPage() {
  return (
    <main className="public-page">
      <SiteHeader />

      <section className="about-hero b6-visual-hero b6-visual-about">
        <div>
          <p className="public-eyebrow">
            THE BUILD6™ EXPERIENCE
          </p>

          <h1>
            SIX STAGES.{" "}
            <span>
              ONE CONNECTED EXPERIENCE.
            </span>
          </h1>

          <p>
            BUILD6™ is an experiential
            development platform that helps
            people discover who they are,
            build the skills that matter,
            explore what’s possible and
            confidently prepare for what
            comes next.
          </p>
        </div>
      </section>

      <section className="about-framework">
        <div className="about-framework-intro">
          <p className="section-kicker">
            THE FOUNDATION
          </p>

          <h2>
            Different people. Different
            goals. Same foundation.
          </h2>

          <p>
            BUILD6™ can be configured
            around students, athletes,
            teams, employees, colleges
            and workforce or community
            initiatives while maintaining
            one connected six-stage
            development journey.
          </p>
        </div>

        <div className="about-stage-grid">
          {stages.map(
            ([stage, question], index) => (
              <article key={stage}>
                <span>
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <h3>{stage}</h3>

                <p>{question}</p>
              </article>
            )
          )}
        </div>
      </section>

      <section className="about-principles">
        <article>
          <p>LEARN BY DOING</p>

          <h3>
            Practice matters.
          </h3>

          <span>
            Participants present,
            collaborate, role-play,
            problem solve, communicate,
            reflect and apply what they
            are learning.
          </span>
        </article>

        <article>
          <p>
            CONNECT TO REAL PEOPLE
          </p>

          <h3>
            Relationships expand
            possibility.
          </h3>

          <span>
            Employers, professionals,
            mentors, facilitators and
            community partners help bring
            learning to life.
          </span>
        </article>

        <article>
          <p>
            CAPTURE GROWTH
          </p>

          <h3>
            Reflection turns activity
            into learning.
          </h3>

          <span>
            Participants build evidence
            of growth, skills,
            experiences and next-step
            thinking throughout the
            journey.
          </span>
        </article>
      </section>

      <section className="about-final-cta">
        <p>
          BUILD WHAT’S NEXT.
        </p>

        <h2>
          Bring BUILD6™ to your people.
        </h2>

        <div>
          <Link href="/interest">
            START A CONVERSATION →
          </Link>

          <Link href="/connect">
            PARTICIPATE IN BUILD6™ →
          </Link>
        </div>
      </section>
      <SponsorBanner />
      <PublicFooter />
    </main>
  );
}
