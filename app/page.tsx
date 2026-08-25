type Stage = {
  number: string;
  title: string;
  text: string;
  tone: string;
  icon: React.ReactNode;
};

const IconWrap = ({ children }: { children: React.ReactNode }) => (
  <span className="stage-icon" aria-hidden="true">{children}</span>
);

const stages: Stage[] = [
  {
    number: "01",
    title: "DISCOVER",
    text: "Build who you are.",
    tone: "teal",
    icon: (
      <IconWrap>
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="m15.3 8.7-2.2 4.4-4.4 2.2 2.2-4.4 4.4-2.2Z"/></svg>
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
        <svg viewBox="0 0 24 24"><path d="M4 19V11M9 19V8M14 19V5M19 19V3"/><path d="m4 8 4-4 4 3 4-4 4 2"/></svg>
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
        <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.4"/><path d="m15.4 15.4 5 5"/></svg>
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
        <svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="2.4"/><circle cx="16" cy="8" r="2.4"/><path d="M2.8 19c.4-3.5 2.1-5.3 5.2-5.3M21.2 19c-.4-3.5-2.1-5.3-5.2-5.3M8.5 16h7"/></svg>
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
        <svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="12" rx="1.5"/><path d="M9 7V5h6v2M3 12h18M10 12v2h4v-2"/></svg>
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
        <svg viewBox="0 0 24 24"><path d="M14 4c3.6.1 5.7 1.2 6 1.5-.3 4.6-2 8-5.5 10.5L8 9.5C10 6.5 11.8 4.7 14 4Z"/><path d="m9 14-3 1-2 4 4-2 1-3ZM15 8h.01M13 17l-1 4M7 11 3 12"/></svg>
      </IconWrap>
    ),
  },
];

const audienceCards = [
  {
    title: "STUDENTS",
    heading: "Make it personal.",
    copy: "Discover purpose. Build skills. Gain confidence. Launch your future.",
    tone: "teal",
    symbol: "◎",
  },
  {
    title: "EDUCATORS",
    heading: "Bring the real world into learning.",
    copy: "Engage students with real-world learning that makes an impact.",
    tone: "blue",
    symbol: "◇",
  },
  {
    title: "EMPLOYERS",
    heading: "Invest in tomorrow’s talent.",
    copy: "Build your pipeline. Strengthen your community.",
    tone: "purple",
    symbol: "▣",
  },
  {
    title: "PARTNERS",
    heading: "Create opportunity together.",
    copy: "Work together to expand opportunities and create lasting change.",
    tone: "teal",
    symbol: "◉",
  },
  {
    title: "COMMUNITIES",
    heading: "Stronger together.",
    copy: "Stronger connections. Better outcomes. Brighter futures.",
    tone: "gold",
    symbol: "★",
  },
];

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="BUILD6 home">
          <img src="/brand/build6-logo-approved.png" alt="BUILD6 — Build What's Next" />
        </a>

        <nav className="navlinks" aria-label="Primary">
          <a href="/students">Students</a>
          <a href="/educators">Educators</a>
          <a href="#employers">Employers</a>
          <a href="#partners">Partners</a>
          <a href="#journey">How It Works</a>
          <a href="#difference">About</a>
          <a href="#resources">Resources</a>
        </nav>

        <div className="top-actions">
          <a className="login" href="#">LOG IN</a>
          <a className="school-button" href="#school">BRING BUILD6 TO YOUR SCHOOL</a>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="hero-left">
          <div className="hero-lockup" aria-label="BUILD6">
            <span className="hero-build">BUILD</span>
            <span className="hero-six">
              <sup className="hero-tm">™</sup>
              <span className="six-number">6</span>
              <span className="six-wheel"><span>✦</span></span>
            </span>
          </div>

          <h1>BUILD WHAT&apos;S NEXT.</h1>
          <span className="hero-rule" />

          <h2>Students don&apos;t discover what&apos;s possible from a workbook alone.</h2>

          <p>
            BUILD6 connects students with the skills, people, experiences, and opportunities
            that help them build what comes next.
          </p>

          <div className="hero-actions">
            <a className="primary-cta" href="#journey">EXPLORE BUILD6 <span>→</span></a>
            <a className="secondary-cta" href="#difference"><span className="play">▶</span> WATCH VIDEO</a>
          </div>
        </div>

        <div className="hero-right">
          <img src="/images/build6-hero-approved.png" alt="Students connecting through BUILD6" />
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
          This isn&apos;t six modules to complete. It&apos;s <strong>six stages of becoming.</strong>
        </p>
      </section>

      <section id="difference" className="difference">
        <div className="difference-copy">
          <p className="difference-label">THE DIFFERENCE IS THE CONNECTION.</p>
          <h2>BUILD6 isn&apos;t designed to keep students inside a platform.</h2>
          <h3>It&apos;s designed to move them beyond it.</h3>
          <p>
            BUILD6 brings educators, employers, mentors, and community partners together
            with students to create conversations, experiences, and opportunities that
            lead to real growth and real possibilities.
          </p>
        </div>

        <div className="connection-visual" aria-label="Student relationship ecosystem">
          <span className="ring ring-a" />
          <span className="ring ring-b" />
          <div className="node student-node">STUDENT</div>
          <div className="node educator-node">EDUCATOR</div>
          <div className="node employer-node">EMPLOYER</div>
          <div className="node mentor-node">MENTOR</div>
          <div className="node community-node">COMMUNITY</div>
          <div className="opportunity">★ <span>REAL OPPORTUNITY</span></div>
        </div>
      </section>

      <section id="resources" className="audiences">
        <div className="audiences-heading">
          <span />
          <h2>BUILT FOR EVERYONE IN THE JOURNEY.</h2>
          <span />
        </div>

        <div className="audience-grid">
          {audienceCards.map((card, i) => {
            const ids = ["students", "educators", "employers", "partners", "communities"];
            return (
              <article id={ids[i]} className={`audience-card ${card.tone}`} key={card.title}>
                <span className="audience-icon">{card.symbol}</span>
                <p className="audience-label">{card.title}</p>
                <h3>{card.heading}</h3>
                <p className="audience-copy">{card.copy}</p>
                <a href="#">LEARN MORE →</a>
              </article>
            );
          })}
        </div>
      </section>

      <section id="school" className="bottom-cta">
        <img src="/images/build6-bottom-approved.png" alt="" />
        <a href="mailto:hello@build6.education" className="bottom-click">
          <span className="sr-only">Bring BUILD6 to your school or organization</span>
        </a>
      </section>

      <footer className="build6-footer">
        <div className="footer-inner">
          <div className="footer-identity">
            <div className="footer-logo">
              BUILD<span>6</span><sup>™</sup>
            </div>
            <div className="footer-tagline">BUILD WHAT&apos;S NEXT.</div>
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
