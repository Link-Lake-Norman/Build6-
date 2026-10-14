import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import AthleticsFooter from "./AthleticsFooter";
import "../../approved-public-pages.css";
import styles from "./professionals.module.css";

const stages = [
  ["01", "DISCOVER™", "Know the professional behind the care", "Notice your communication habits, values and responsibilities in the moments athletes rely on you."],
  ["02", "DEVELOP™", "Communicate under pressure", "Practice listening, empathy and clear explanations during injury and return-to-play conversations."],
  ["03", "EXPLORE™", "Navigate trust and conflict", "Work through disagreements among athletes, coaches, families and care teams."],
  ["04", "CONNECT™", "Motivate and mentor", "Support an athlete’s goals through setbacks, recovery and changing expectations."],
  ["05", "EXPERIENCE™", "Practice the difficult moments", "Use facilitated scenarios, role-play and feedback to strengthen real responses."],
  ["06", "LAUNCH™", "Carry it into practice", "Leave with a practical plan for communication, referrals, collaboration and follow-through."],
] as const;

export const metadata = {
  title: "Professionals in Athletics | BUILD6™",
  description: "BUILD6™ experiential professional development for athletic trainers, coaches, physical therapists, strength and conditioning specialists, sports administrators and athlete-support teams.",
};

export default function AthleticsProfessionalsPage() {
  return <main className={`b6-audience-page ${styles.page}`}>
    <SiteHeader />
    <section className={`b6-audience-hero b6-audience-hero-gold b6-visual-hero b6-visual-athletes ${styles.hero}`}>
      <div className="b6-audience-hero-content">
        <p className="eyebrow">ATHLETES + TEAMS / PROFESSIONALS</p>
        <h1>CARE FOR THE ATHLETE. <span>BUILD WHAT’S NEXT.</span></h1>
        <p className="b6-audience-lead">From athletic trainers and physical therapists to coaches, performance teams and athletic directors, BUILD6™ develops communication, leadership, trust, collaboration and career readiness across the athletics ecosystem.</p>
        <div className={styles.actions}><Link className="b6-audience-button" href="#experience">EXPLORE THE EXPERIENCE →</Link><Link className={styles.secondary} href="/athletes">ATHLETES + TEAMS</Link></div>
      </div>
    </section>
    <section className={`b6-audience-intro ${styles.intro}`} id="experience">
      <p className="section-kicker">ONE BUILD6™ FOUNDATION. AN ATHLETICS APPLICATION.</p>
      <h2>Human skills for moments that matter.</h2>
      <p>Injury, recovery, competition and the transition beyond sport ask a lot of athletes and their support teams. This application of the six BUILD6™ stages gives professionals room to rehearse conversations and decisions before those moments arrive.</p>
    </section>
    <section className={styles.photoBand} aria-label="The BUILD6 athletics experience"><div className={styles.photo} role="img" aria-label="BUILD6 athletics program image"/><div className={styles.photoCopy}><p className="section-kicker">PRACTICE IN ACTION</p><h2>Learn it. Try it. Reflect. Use it.</h2><p>Facilitated scenarios, role-play, team decisions and reflection help professionals connect what they know with how they show up for athletes.</p></div></section>
    <section className={styles.section} id="audience"><p className="section-kicker">WHO IT SERVES</p><h2>For the people beside the athlete.</h2><div className={styles.cards}>{[
      ["Athletic trainers + sports medicine", "Athlete-centered communication and care-team collaboration."],
      ["Physical therapists + rehabilitation", "Goal-setting, motivational communication and coordinated recovery support."],
      ["Strength + conditioning specialists", "Leadership, feedback and interdisciplinary teamwork."],
      ["Coaches + team leaders", "Mentoring, conflict resolution and life-beyond-sport conversations."],
      ["Athletic directors + administrators", "Staff development, athlete welfare and program culture."],
      ["Sports business + operations", "Professional judgment, leadership and organizational collaboration."],
      ["Athletic training + sport science students", "Professional identity, ethical communication and career readiness."],
      ["Teams + professional associations", "Role-specific professional development and shared learning experiences."],
    ].map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className={`${styles.section} ${styles.stages}`} id="stages"><p className="section-kicker">THE BUILD6™ JOURNEY</p><h2>Six stages. One connected experience.</h2><div className={styles.stageGrid}>{stages.map(([number,stage,title,copy])=><article key={number}><span className={styles.number}>{number}</span><p className={styles.stageName}>{stage}</p><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className={styles.section} id="beyond"><p className="section-kicker">LIFE BEYOND SPORT</p><h2>Support the person beyond the player.</h2><p className={styles.wide}>Athletes carry strengths from sport into work, relationships and community. Professionals can help them recognize those strengths, discuss changing identities and connect with the right support when the path changes.</p></section>
    <section className={styles.closing}><p className="section-kicker">BUILD WHAT’S NEXT.</p><h2>Explore the athletics application of BUILD6™.</h2><p>Tell us about your team and the real situations your professionals want to practice.</p><Link className="b6-audience-button" href="/interest?for=athletics-professionals">CONNECT WITH BUILD6 →</Link></section>
    <AthleticsFooter />
  </main>;
}
