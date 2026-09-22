type Stage = {
  number: string;
  title: string;
  text: string;
  tone: string;
  icon: React.ReactNode;
};

const IconWrap = ({ children }: { children: React.ReactNode }) => (
  <span className="stage-icon" aria-hidden="true">
    {children}
  </span>
);

const stages: Stage[] = [
  {
    number: "01",
    title: "DISCOVER",
    text: "Build who you are.",
    tone: "teal",
    icon: (
      <IconWrap>
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" />
          <path d="m15.3 8.7-2.2 4.4-4.4 2.2 2.2-4.4 4.4-2.2Z" />
        </svg>
      </IconWrap>
    ),
  },
  {
    number: "02",
    title: "DEVELOP",
    text: "Build the skills that matter.",
    tone: "blue",
    icon: (
      <IconWrap>
        <svg viewBox="0 0 24 24">
          <path d="M4 19V11M9 19V8M14 19V5M19 19V3" />
          <path d="m4 8 4-4 4 3 4-4 4 2" />
        </svg>
      </IconWrap>
    ),
  },
  {
    number: "03",
    title: "EXPLORE",
    text: "Build awareness of what’s possible.",
    tone: "purple",
    icon: (
      <IconWrap>
        <svg viewBox="0 0 24 24">
          <circle cx="10.5" cy="10.5" r="6.4" />
          <path d="m15.4 15.4 5 5" />
        </svg>
      </IconWrap>
    ),
  },
  {
    number: "04",
    title: "CONNECT",
    text: "Build relationships that open doors.",
    tone: "orange",
    icon: (
      <IconWrap>
        <svg viewBox="0 0 24 24">
          <circle cx="8" cy="8" r="2.4" />
          <circle cx="16" cy="8" r="2.4" />
          <path d="M2.8 19c.4-3.5 2.1-5.3 5.2-5.3M21.2 19c-.4-3.5-2.1-5.3-5.2-5.3M8.5 16h7" />
        </svg>
      </IconWrap>
    ),
  },
  {
    number: "05",
    title: "EXPERIENCE",
    text: "Build through the real world.",
    tone: "gold",
    icon: (
      <IconWrap>
        <svg viewBox="0 0 24 24">
          <rect x="3" y="7" width="18" height="12" rx="1.5" />
          <path d="M9 7V5h6v2M3 12h18M10 12v2h4v-2" />
        </svg>
      </IconWrap>
    ),
  },
  {
    number: "06",
    title: "LAUNCH",
    text: "Build your next move.",
    tone: "teal",
    icon: (
      <IconWrap>
        <svg viewBox="0 0 24 24">
          <path d="M14 4c3.6.1 5.7 1.2 6 1.5-.3 4.6-2 8-5.5 10.5L8 9.5C10 6.5 11.8 4.7 14 4Z" />
          <path d="m9 14-3 1-2 4 4-2 1-3ZM15 8h.01M13 17l-1 4M7 11 3 12" />
        </svg>
      </IconWrap>
    ),
  },
];

const actionCards = [
  {
    step: "PRESENT",
    heading: "Build confidence by using your voice.",
    copy: "Practice communication, storytelling and public speaking in ways that prepare people for real conversations.",
  },
  {
    step: "COLLABORATE",
    heading: "Learn how to work with people.",
    copy: "Build teamwork, leadership, problem-solving and adaptability through hands-on challenges and shared decisions.",
  },
  {
    step: "PRACTICE",
    heading: "Try it before it counts.",
    copy: "Use role-play, workplace scenarios, interviews and professional conversations to turn knowledge into capability.",
  },
  {
    step: "PREPARE",
    heading: "Build the tools for what comes next.",
    copy: "Develop resumes, interview skills, professional presence, financial confidence and responsible AI literacy.",
  },
  {
    step: "CONNECT",
    heading: "Meet people who expand what is possible.",
    copy: "Learn directly from employers, professionals, mentors and community leaders through authentic real-world connection.",
  },
  {
    step: "REFLECT + BUILD",
    heading: "Turn experiences into evidence of growth.",
    copy: "Capture reflections, progress and accomplishments so participants can see what they have built and where they are going.",
  },
];

const applications = [
  {
    label: "SCHOOLS + STUDENTS",
    heading: "Career + life readiness that becomes real.",
    copy: "Build confidence, communication, career awareness, financial literacy, AI literacy and professional readiness through applied learning and real-world connection.",
    href: "/educators",
    action: "BUILD6 FOR SCHOOLS",
    tone: "teal",
  },
  {
    label: "STUDENT ATHLETES + TEAMS",
    heading: "Build beyond the game.",
    copy: "Translate teamwork, discipline and performance into leadership, communication, financial readiness, career exploration and confidence for life beyond competition.",
    href: "/interest?for=athletics",
    action: "BUILD6 FOR ATHLETES + TEAMS",
    tone: "gold",
  },
  {
    label: "EMPLOYEES + WORKFORCES",
    heading: "Develop people. Strengthen teams.",
    copy: "Customize BUILD6™ for onboarding, communication, professional development, leadership, workplace expectations, AI readiness and employee growth.",
    href: "/interest?for=workforce",
    action: "BUILD6 FOR WORKFORCES",
    tone: "purple",
  },
  {
    label: "COLLEGES + WORKFORCE PROGRAMS",
    heading: "Connect learning to the next move.",
    copy: "Support career transition, professional readiness, employer connection and the practical skills people need to move confidently into work and opportunity.",
    href: "/interest?for=postsecondary",
    action: "BUILD6 FOR PROGRAMS",
    tone: "blue",
  },
];

const ecosystem = [
  {
    title: "EDUCATORS",
    heading: "Bring the real world into learning.",
    copy: "Use a facilitator-ready experience designed to connect learning, reflection and real-world readiness.",
    href: "/educators",
    tone: "blue",
    symbol: "◇",
  },
  {
    title: "EMPLOYERS",
    heading: "Help build tomorrow’s talent.",
    copy: "Share insight, open doors and create meaningful exposure to industries, careers and workplace expectations.",
    href: "/connect",
    tone: "purple",
    symbol: "▣",
  },
  {
    title: "MENTORS + SPEAKERS",
    heading: "Share what experience taught you.",
    copy: "Help participants understand careers, decisions, leadership and the realities behind professional success.",
    href: "/connect",
    tone: "teal",
    symbol: "◎",
  },
  {
    title: "PARTNERS",
    heading: "Create opportunity together.",
    copy: "Support experiences, connections and pathways that move people beyond learning and toward possibility.",
    href: "/connect",
    tone: "teal",
    symbol: "◉",
  },
  {
    title: "COMMUNITIES",
    heading: "Build stronger local connections.",
    copy: "Connect education, employers and community resources around stronger people and better workforce outcomes.",
    href: "/interest?for=community",
    tone: "gold",
    symbol: "★",
  },
];

import "./build6-home-recovered.css";

export default function Home() {
  return (
    <main className="build6-public-home">

<style>{`
/* BUILD6-HOMEPAGE-120-SCALE */

/* Header/navigation */
header nav a,
header nav button {
  font-size: 120% !important;
}

/* Hero copy */
main section:first-of-type h1 {
  font-size: 120% !important;
  line-height: 1.02 !important;
}

main section:first-of-type h2,
main section:first-of-type h3 {
  font-size: 120% !important;
  line-height: 1.12 !important;
}

main section:first-of-type p,
main section:first-of-type a,
main section:first-of-type button {
  font-size: 120% !important;
  line-height: 1.45 !important;
}

/* All remaining homepage typography */
main section:not(:first-of-type) h1,
main section:not(:first-of-type) h2,
main section:not(:first-of-type) h3,
main section:not(:first-of-type) h4,
main section:not(:first-of-type) h5,
main section:not(:first-of-type) h6,
main section:not(:first-of-type) p,
main section:not(:first-of-type) a,
main section:not(:first-of-type) button,
main section:not(:first-of-type) span,
main section:not(:first-of-type) li {
  font-size: 120% !important;
  line-height: 1.45 !important;
}

/*
 * HERO VISUAL
 * Give the approved image substantially more visual weight.
 * Keep object-cover so we enlarge the photograph rather than
 * distort the students.
 */
main section:first-of-type img:not([alt*="logo" i]):not([alt*="BUILD6" i]) {
  width: 100% !important;
  height: 100% !important;
  min-height: 430px !important;
  object-fit: cover !important;
  object-position: center center !important;
}

@media (min-width: 900px) {
  main section:first-of-type {
    min-height: 500px !important;
  }

  main section:first-of-type img:not([alt*="logo" i]):not([alt*="BUILD6" i]) {
    min-height: 500px !important;
    transform: scale(1.06);
    transform-origin: center center;
  }
}

@media (max-width: 899px) {
  main section:first-of-type img:not([alt*="logo" i]):not([alt*="BUILD6" i]) {
    min-height: 320px !important;
    transform: none;
  }
}
`}</style>

      <header className="topbar">
        <a className="brand" href="#top" aria-label="BUILD6 home">
          <img
            src="/brand/build6-logo-approved.png"
            alt="BUILD6 — Build What's Next"
          />
        </a>

        <nav className="navlinks" aria-label="Primary">
          <a href="#journey">Experience</a>
          <a href="/educators">Schools</a>
          <a href="#applications">Athletes + Teams</a>
          <a href="#applications">Workforces</a>
          <a href="#ecosystem">Partners</a>
          <a href="#difference">About</a>
        </nav>

        <div className="top-actions">
          <a className="login" href="/ambassador/login">
            LOG IN
          </a>
          <a className="school-button" href="/interest">
            BRING BUILD6™
          </a>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="hero-left">
          <div className="hero-lockup" aria-label="BUILD6">
            <span className="hero-build">BUILD</span>
            <span className="hero-six">
              <sup className="hero-tm">™</sup>
              <span className="six-number">6</span>
              <span className="six-wheel">
                <span>✦</span>
              </span>
            </span>
          </div>

          <h1>BUILD WHAT’S NEXT.</h1>
          <span className="hero-rule" />

          <h2>
            Real skills. Real experiences.
            <br />
            Real-world readiness.
          </h2>

          <p>
            BUILD6™ is an experiential development platform that helps people
            discover who they are, build the skills that matter, explore
            what’s possible and confidently prepare for what comes next.
          </p>

          <div className="hero-actions">
            <a className="primary-cta" href="#journey">
              EXPLORE BUILD6 <span>→</span>
            </a>
            <a className="secondary-cta" href="/interest">
              BRING BUILD6™
            </a>
          </div>
        </div>

        <div className="hero-right">
          <img
            src="/images/build6-hero-approved.png"
            alt="People connecting through the BUILD6 experience"
          />
        </div>
      </section>

      <section id="journey" className="journey">
        <h2>SIX STAGES. ONE CONNECTED EXPERIENCE.</h2>

        <div className="journey-grid">
          {stages.map((stage) => (
            <article className={`stage ${stage.tone}`} key={stage.number}>
              <span className="stage-number">{stage.number}</span>
              {stage.icon}
              <h3>{stage.title}</h3>
              <p>{stage.text}</p>
            </article>
          ))}
        </div>

        <p className="journey-note">
          This isn’t six modules to complete. It’s{" "}
          <strong>six stages of becoming.</strong>
        </p>
      </section>

      <section className="build6-action">
        <div className="action-intro">
          <p className="section-kicker">BUILD6™ IN ACTION</p>
          <h2>People build readiness by doing.</h2>
          <p>
            BUILD6™ moves development beyond worksheets and passive learning.
            Participants practice, communicate, collaborate, connect and
            reflect — building skills they can actually use.
          </p>
        </div>

        <div className="action-grid">
          {actionCards.map((card) => (
            <article className="action-card" key={card.step}>
              <span>{card.step}</span>
              <h3>{card.heading}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="proof" className="proof-behind-build6">
        <div className="proof-copy">
          <p className="proof-kicker">THE PROOF BEHIND BUILD6™</p>
          <h2>Before BUILD6™ had its name, the model was already working.</h2>
          <p className="proof-lead">
            BUILD6™ wasn’t created from theory. It grew from real students,
            real employers, real experiences and lessons learned through years of
            career-readiness and workforce-development work. This is what that
            looks like through a student’s eyes.
          </p>

          <div className="proof-lineage" aria-label="BUILD6 program lineage">
            <span>FUTURE READY</span>
            <b>→</b>
            <span>REAL STUDENT EXPERIENCE</span>
            <b>→</b>
            <span>LESSONS LEARNED</span>
            <b>→</b>
            <span>BUILD6™</span>
          </div>

          <p className="proof-guardrail">
            This interview documents a student’s experience in the earlier
            Future Ready internship model that preceded and informed BUILD6™. It
            is not presented as a claim that the student completed the current
            BUILD6™ program.
          </p>
        </div>

        <div className="proof-video-card">
          <div className="proof-video-frame">
            <video
              controls
              preload="metadata"
              poster="/media/future-ready-intern-interview-poster.jpg"
            >
              <source
                src="/media/future-ready-intern-interview-web.mp4"
                type="video/mp4"
              />
              Your browser does not support the video element.
            </video>
          </div>
          <div className="proof-video-copy">
            <p>STUDENT STORY • LAKE NORMAN, NORTH CAROLINA</p>
            <h3>A Student’s Story: From Future Ready to BUILD6™</h3>
            <strong>Real student. Real internship. Real-world growth.</strong>
          </div>
        </div>
      </section>

      <section id="difference" className="difference">
        <div className="difference-copy">
          <p className="difference-label">THE DIFFERENCE IS THE CONNECTION.</p>

          <h2>
            BUILD6™ isn’t designed to keep people inside a platform.
          </h2>

          <h3>It’s designed to move them beyond it.</h3>

          <p>
            BUILD6™ connects learning with people, workplaces, conversations,
            experiences and opportunities — helping participants understand
            themselves, practice the skills that matter and see what is
            possible beyond the program.
          </p>
        </div>

        <div
          className="connection-visual"
          aria-label="BUILD6 relationship ecosystem"
        >
          <span className="ring ring-a" />
          <span className="ring ring-b" />

          <div className="node student-node">PARTICIPANT</div>
          <div className="node educator-node">FACILITATOR</div>
          <div className="node employer-node">EMPLOYER</div>
          <div className="node mentor-node">MENTOR</div>
          <div className="node community-node">COMMUNITY</div>

          <div className="opportunity">
            ★ <span>REAL OPPORTUNITY</span>
          </div>
        </div>
      </section>

      <section id="applications" className="build6-applications">
        <div className="applications-intro">
          <p className="section-kicker">ONE FOUNDATION. MULTIPLE APPLICATIONS.</p>
          <h2>Built around your people.</h2>
          <p>
            The same six-stage BUILD6™ foundation can be customized around
            different people, goals, environments and readiness needs.
          </p>
        </div>

        <div className="application-grid">
          {applications.map((item) => (
            <article
              className={`application-card ${item.tone}`}
              key={item.label}
            >
              <p className="application-label">{item.label}</p>
              <h3>{item.heading}</h3>
              <p>{item.copy}</p>
              <a href={item.href}>{item.action} →</a>
            </article>
          ))}
        </div>
      </section>

      <section id="ecosystem" className="audiences">
        <div className="audiences-heading">
          <span />
          <h2>REAL PEOPLE HELP CREATE REAL READINESS.</h2>
          <span />
        </div>

        <p className="ecosystem-intro">
          BUILD6™ connects participants with the people and organizations that
          can bring learning to life.
        </p>

        <div className="audience-grid">
          {ecosystem.map((card) => (
            <article
              className={`audience-card ${card.tone}`}
              key={card.title}
            >
              <span className="audience-icon">{card.symbol}</span>
              <p className="audience-label">{card.title}</p>
              <h3>{card.heading}</h3>
              <p className="audience-copy">{card.copy}</p>
              <a href={card.href}>LEARN MORE →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="choice-cta">
        <div className="choice-panel choice-primary">
          <p>I WANT BUILD6™</p>
          <h2>Bring BUILD6™ to your organization.</h2>
          <span>
            Schools, athletic programs, teams, employers, colleges and
            workforce initiatives can customize the experience around their
            people and goals.
          </span>
          <a href="/interest">START A CONVERSATION →</a>
        </div>

        <div className="choice-panel choice-secondary">
          <p>I WANT TO PARTICIPATE</p>
          <h2>Help create the experience.</h2>
          <span>
            Speak, mentor, facilitate, host a workplace experience, support an
            internship or job shadow, sponsor, or become a BUILD6™ partner.
          </span>
          <a href="/connect">GET INVOLVED →</a>
        </div>
      </section>

      <footer className="build6-footer">
        <div className="footer-inner">
          <div className="footer-identity">
            <div className="footer-logo">
              BUILD<span>6</span>
              <sup>™</sup>
            </div>
            <div className="footer-tagline">BUILD WHAT’S NEXT.</div>
          </div>

          <div className="footer-right">
            <p className="footer-copyright">
              © 2026 BUILD6™. All Rights Reserved.
            </p>
            <p className="footer-protection">
              Proprietary brand, platform, curriculum, research, data,
              methodologies, designs &amp; program materials.
            </p>
            <div className="footer-links">
              <span>IP PROTECTION</span>
              <span>TERMS</span>
              <span>PRIVACY</span>
              <span>LICENSING</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
