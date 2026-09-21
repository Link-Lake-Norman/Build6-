import Link from "next/link";
import "../approved-public-pages.css";
import SiteHeader from "../components/SiteHeader";

export default function AssessmentPage() {
  return (
    <main className="assessment-page">
      <SiteHeader />
      <section className="assessment-hero">
        <div className="assessment-shell">
          <Link href="/" className="brand-link" aria-label="BUILD6 home">
            <img
              src="/brand/build6-logo-approved.png"
              alt="BUILD6 — Build What's Next"
              className="brand-logo"
            />
          </Link>

          <div className="assessment-hero-grid">
            <div className="assessment-hero-copy">
              <div className="eyebrow">DISCOVER™ · BUILD6™ READINESS ASSESSMENT</div>

          <h1>Know where you are.<br />Build what comes next.</h1>

          <p className="hero-copy">
            The BUILD6™ Readiness Assessment helps students identify current
            strengths, growth areas and the skills they can continue developing
            for school, work and life beyond the classroom.
          </p>

          <div className="hero-actions">
            <Link
              href="/ambassador/login?next=/ambassador/student"
              className="primary-button"
            >
              STUDENT LOGIN →
            </Link>

            <Link href="/interest" className="secondary-button">
              NEW TO BUILD6? START HERE →
            </Link>
          </div>

          <p className="account-note">
            Already enrolled in BUILD6? Sign in with your student account to
            access your assigned readiness assessment and saved results.
          </p>
            </div>

          </div>
        </div>
      </section>

      <section className="assessment-overview">
        <div className="assessment-shell">
          <div className="section-heading">
            <span>YOUR STARTING POINT</span>
            <h2>This is about growth — not getting a perfect score.</h2>
            <p>
              Your responses create a starting point that can help you and your
              BUILD6 team focus on the skills, experiences and next steps that
              matter most.
            </p>
          </div>

          <div className="assessment-grid">
            <article>
              <div className="number">01</div>
              <h3>Answer honestly</h3>
              <p>
                Choose the response that best reflects where you are today.
                There is no benefit to trying to guess the “right” answer.
              </p>
            </article>

            <article>
              <div className="number">02</div>
              <h3>See your starting point</h3>
              <p>
                Your assessment helps identify areas of confidence and areas
                where additional practice and experience can help.
              </p>
            </article>

            <article>
              <div className="number">03</div>
              <h3>Use it to build</h3>
              <p>
                BUILD6 connects reflection to real skill development,
                experiences and preparation for what comes next.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="assessment-path">
        <div className="assessment-shell path-grid">
          <div>
            <div className="eyebrow dark">HOW IT WORKS</div>
            <h2>Your assessment stays connected to your BUILD6 journey.</h2>
          </div>

          <div className="path-steps">
            <div>
              <strong>1</strong>
              <span>Sign in to your BUILD6 student account.</span>
            </div>
            <div>
              <strong>2</strong>
              <span>Complete the readiness assessment assigned to you.</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Your responses and results stay with your student profile.</span>
            </div>
            <div>
              <strong>4</strong>
              <span>
                Use your results to guide reflection, skill-building and future
                experiences.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="assessment-cta">
        <div className="assessment-shell cta-inner">
          <div>
            <span>READY?</span>
            <h2>Start with where you are.</h2>
          </div>

          <Link
            href="/ambassador/login?next=/ambassador/student"
            className="primary-button gold"
          >
            ACCESS MY ASSESSMENT →
          </Link>
        </div>
      </section>


      <footer className="build6-assessment-footer">
        <div className="assessment-footer-inner">
          <div className="assessment-footer-identity">
            <div className="assessment-footer-logo">
              BUILD<span>6</span><sup>™</sup>
            </div>
            <div className="assessment-footer-tagline">BUILD WHAT&apos;S NEXT.</div>
          </div>

          <div className="assessment-footer-right">
            <p className="assessment-footer-copyright">
              © 2026 BUILD6™. All Rights Reserved.
            </p>
            <p className="assessment-footer-protection">
              Proprietary brand, platform, curriculum, research, data,
              methodologies, designs &amp; program materials.
            </p>
            <div className="assessment-footer-links">
              <span>IP PROTECTION</span>
              <span>TERMS</span>
              <span>PRIVACY</span>
              <span>LICENSING</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        :global(body) {
          margin: 0;
        }


        /* BUILD6 UNIVERSAL FOOTER — MATCHES APPROVED HOMEPAGE */
        .build6-assessment-footer {
          background: #04192b;
          color: #ffffff;
          padding: 24px 5%;
          border-top: 3px solid #f4b942;
          text-align: left;
        }

        .assessment-footer-inner {
          max-width: 1380px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 50px;
        }

        .assessment-footer-identity {
          flex: 0 0 auto;
        }

        .assessment-footer-logo {
          position: relative;
          display: inline-block;
          color: #ffffff;
          font-size: 55.3px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -2px;
        }

        .assessment-footer-logo span {
          color: #f4b942;
        }

        .assessment-footer-logo sup {
          position: absolute;
          top: -4px;
          right: -18px;
          color: #ffffff;
          font-size: 15.55px;
          font-weight: 800;
          letter-spacing: 0;
        }

        .assessment-footer-tagline {
          margin-top: 7px;
          color: #f4b942;
          font-size: 13.82px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .assessment-footer-right {
          max-width: 720px;
          text-align: right;
        }

        .assessment-footer-copyright {
          margin: 0 0 5px;
          color: #ffffff;
          font-size: 17.28px;
          font-weight: 700;
        }

        .assessment-footer-protection {
          margin: 0;
          max-width: none;
          color: rgba(255,255,255,.58);
          font-size: 14.69px;
          line-height: 1.4;
        }

        .assessment-footer-links {
          margin-top: 9px;
          display: flex;
          justify-content: flex-end;
          gap: 18px;
          color: #66c2c6;
          font-size: 12.96px;
          font-weight: 800;
          letter-spacing: .7px;
        }

        .assessment-footer-links span {
          white-space: nowrap;
        }

        @media (max-width: 700px) {
          .assessment-footer-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
          }

          .assessment-footer-right {
            text-align: left;
          }

          .assessment-footer-links {
            justify-content: flex-start;
            flex-wrap: wrap;
          }
        }

        .assessment-page {
          min-height: 100vh;
          background: #ffffff;
          color: #0b3b60;
          font-family: Arial, Helvetica, sans-serif;
        }

        .assessment-shell {
          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;
        }

        .assessment-hero {
          position: relative;
          isolation: isolate;
          min-height: 650px;
          display: flex;
          align-items: center;
          overflow: hidden;
          background:
            linear-gradient(
              90deg,
              rgba(5, 35, 57, .97) 0%,
              rgba(5, 35, 57, .92) 31%,
              rgba(5, 35, 57, .68) 49%,
              rgba(5, 35, 57, .20) 68%,
              rgba(5, 35, 57, .04) 100%
            ),
            url("/images/build6-assessment-students.png")
              center center / cover no-repeat;
          color: #ffffff;
        }

        .brand-link {
          display: inline-block;
          margin-bottom: 44px;
        }

        .assessment-hero .actions {
          position: relative;
          z-index: 3;
        }

        .assessment-hero .account-note {
          position: relative;
          z-index: 3;
          max-width: 660px;
        }

        .assessment-hero-grid {
          position: relative;
          z-index: 2;
          display: block;
          width: 100%;
        }

        .assessment-hero-copy {
          position: relative;
          z-index: 2;
          width: min(720px, 58%);
          min-width: 0;
        }


        .brand-logo {
          display: block;
          width: min(300px, 70vw);
          height: auto;
        }

        .eyebrow {
          color: #f4b942;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: .12em;
          margin-bottom: 18px;
        }

        .eyebrow.dark {
          color: #007f82;
        }

        h1 {
          max-width: 900px;
          margin: 0;
          font-size: clamp(52.8px, 7.2vw, 93.6px);
          line-height: .98;
          letter-spacing: -.045em;
          font-weight: 900;
        }

        .hero-copy {
          max-width: 760px;
          margin: 28px 0 0;
          font-size: clamp(21.6px, 1.92vw, 26.4px);
          line-height: 1.6;
          color: rgba(255,255,255,.92);
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 34px;
        }

        .primary-button,
        .secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 54px;
          padding: 0 24px;
          border-radius: 8px;
          font-size: 19.2px;
          font-weight: 900;
          text-decoration: none;
          letter-spacing: .02em;
        }

        .primary-button {
          background: #f4b942;
          color: #082f4c;
        }

        .secondary-button {
          border: 2px solid rgba(255,255,255,.8);
          color: #ffffff;
          background: transparent;
        }

        .account-note {
          max-width: 720px;
          margin-top: 22px;
          color: rgba(255,255,255,.78);
          font-size: 19.2px;
          line-height: 1.55;
        }

        .assessment-overview {
          padding: 78px 0 86px;
        }

        .section-heading {
          max-width: 850px;
        }

        .section-heading > span,
        .assessment-cta span {
          color: #008d90;
          font-size: 16.8px;
          font-weight: 900;
          letter-spacing: .12em;
        }

        h2 {
          margin: 12px 0 16px;
          font-size: clamp(38.4px, 4.8vw, 62.4px);
          line-height: 1.05;
          letter-spacing: -.035em;
        }

        .section-heading p {
          margin: 0;
          max-width: 760px;
          color: #3f5669;
          font-size: 21.6px;
          line-height: 1.65;
        }

        .assessment-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 48px;
        }

        .assessment-grid article {
          border: 1px solid #dce5eb;
          border-radius: 14px;
          padding: 30px;
          background: #ffffff;
          box-shadow: 0 12px 35px rgba(11,59,96,.07);
        }

        .number {
          color: #f4b942;
          font-size: 33.6px;
          font-weight: 900;
        }

        h3 {
          margin: 18px 0 10px;
          font-size: 27.6px;
        }

        .assessment-grid p {
          margin: 0;
          color: #4b6172;
          font-size: 20.4px;
          line-height: 1.6;
        }

        .assessment-path {
          padding: 78px 0;
          background: #f2f4f7;
        }

        .path-grid {
          display: grid;
          grid-template-columns: .9fr 1.1fr;
          gap: 70px;
          align-items: start;
        }

        .path-grid h2 {
          margin-top: 12px;
        }

        .path-steps {
          display: grid;
          gap: 14px;
        }

        .path-steps > div {
          display: grid;
          grid-template-columns: 48px 1fr;
          align-items: center;
          gap: 15px;
          background: #ffffff;
          border-radius: 12px;
          padding: 18px 20px;
          font-size: 20.4px;
          line-height: 1.5;
        }

        .path-steps strong {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #00a6a6;
          color: #ffffff;
          font-size: 21.6px;
        }

        .assessment-cta {
          background: #0b3b60;
          color: #ffffff;
          padding: 58px 0;
        }

        .cta-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
        }

        .assessment-cta span {
          color: #66c2c6;
        }

        .assessment-cta h2 {
          margin-bottom: 0;
        }

        .primary-button.gold {
          flex: 0 0 auto;
        }

        @media (max-width: 800px) {
          .assessment-shell {
            width: min(100% - 30px, 1180px);
          }

          .assessment-hero {
            padding-bottom: 56px;
          }

          .brand-link {
            margin-bottom: 44px;
          }

          .assessment-hero-grid,
          .assessment-grid,
          .path-grid {
            grid-template-columns: 1fr;
          }

          .assessment-hero {
            min-height: auto;
            background:
              linear-gradient(
                90deg,
                rgba(5, 35, 57, .97) 0%,
                rgba(5, 35, 57, .88) 62%,
                rgba(5, 35, 57, .58) 100%
              ),
              url("/images/build6-assessment-students.png")
                64% center / cover no-repeat;
          }

          .assessment-hero-copy {
            width: 100%;
            max-width: 680px;
          }



          .path-grid {
            gap: 30px;
          }

          .cta-inner {
            align-items: flex-start;
            flex-direction: column;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
            box-sizing: border-box;
          }
        }
      `}</style>
    </main>
  );
}
