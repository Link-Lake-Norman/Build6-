import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import PublicFooter from "../components/PublicFooter";
import "../approved-public-pages.css";
import "./sponsor.css";

const options = [
  { title: "Sponsor a Student", price: "$350", description: "Help an individual participate in an approved BUILD6 development experience or cohort." },
  { title: "Sponsor an Athlete", price: "$350", description: "Support career exploration, leadership and preparation for life beyond athletics." },
  { title: "Sponsor a Club or Team", price: "From $2,500", description: "Underwrite a defined team workshop or series in communication, teamwork and leadership." },
  { title: "Sponsor a BUILD6 Experience", price: "From $3,500", description: "Support a career exposure day, workplace visit, professional speaker series or hands-on challenge." },
  { title: "Sponsor a School Cohort", price: "From $7,500", description: "Help a defined student cohort access multi-session programming and agreed-upon experiences." },
  { title: "Sponsor a Workforce Program", price: "From $10,000", description: "Support a customized employer-connected cohort focused on professional readiness and real-world opportunities." },
];

const levels = [
  { title: "Community Supporter", amount: "$350–$2,499", benefit: "Acknowledgment and an aggregate impact update." },
  { title: "Program Partner", amount: "$2,500–$9,999", benefit: "Program-level recognition, approved website acknowledgment and an impact summary." },
  { title: "Strategic Partner", amount: "$10,000+", benefit: "A tailored partnership agreement, recognition and periodic aggregate impact reporting." },
];

export default function SponsorPage() {
  return (
    <>
      <SiteHeader />
      <main className="b6-sponsor">
        <section className="b6-sponsor-hero">
          <div className="b6-sponsor-hero-media"><img src="/images/sponsor/sponsor-hero.png" alt="Student exploring career opportunities in a collaborative learning space" /></div>
          <div className="b6-sponsor-container b6-sponsor-hero-copy">
            <p className="b6-sponsor-eyebrow">BUILD6™ PARTNERSHIPS</p>
            <h1>SPONSOR <span>WHAT’S NEXT.</span></h1>
            <p className="b6-sponsor-lead">Help students, athletes and emerging professionals discover their strengths, develop real-world skills and connect with opportunities.</p>
            <div className="b6-sponsor-actions"><Link className="b6-sponsor-button" href="/connect">REQUEST A SPONSORSHIP PROPOSAL →</Link><Link className="b6-sponsor-secondary" href="/partners">EXPLORE PARTNERSHIPS</Link></div>
          </div>
        </section>
        <section className="b6-sponsor-container b6-sponsor-section" aria-labelledby="sponsor-options">
          <p className="b6-sponsor-eyebrow">CHOOSE YOUR IMPACT</p>
          <h2 id="sponsor-options">Six ways to build opportunity</h2>
          <p className="b6-sponsor-intro">Select a specific school, student population, team or program, or ask BUILD6 about current sponsorship opportunities.</p>
          <div className="b6-sponsor-grid">{options.map((option, index) => <article className="b6-sponsor-card" key={option.title}><img className="b6-sponsor-card-photo" src={`/images/sponsor/sponsor-option-${index + 1}.jpg`} alt="" loading="lazy" /><h3>{option.title}</h3><p className="b6-sponsor-price">{option.price}</p><p>{option.description}</p><Link href="/connect">INQUIRE ABOUT THIS OPTION →</Link></article>)}</div>
          <p className="b6-sponsor-note">Prices are introductory starting points, subject to scope, participant count, location and delivery requirements. Individual sponsorships contribute toward defined program costs; they do not guarantee an entire semester of programming.</p>
        </section>
        <section className="b6-sponsor-band"><div className="b6-sponsor-container b6-sponsor-section"><p className="b6-sponsor-eyebrow">MORE THAN FUNDING</p><h2>Three ways to contribute</h2><div className="b6-sponsor-three"><article><h3>Financial sponsorship</h3><p>Fund access, workshops, cohorts and approved program experiences.</p></article><article><h3>Experience sponsorship</h3><p>Offer professional expertise, workplace visits, mentoring or approved project opportunities.</p></article><article><h3>Strategic partnership</h3><p>Support multiple cohorts, schools or programs through a tailored agreement.</p></article></div></div></section>
        <section className="b6-sponsor-container b6-sponsor-section"><p className="b6-sponsor-eyebrow">RECOGNITION + ACCOUNTABILITY</p><h2>Sponsor recognition</h2><div className="b6-sponsor-three">{levels.map((level) => <article className="b6-sponsor-level" key={level.title}><h3>{level.title}</h3><p className="b6-sponsor-price">{level.amount}</p><p>{level.benefit}</p></article>)}</div><p className="b6-sponsor-note">Recognition is subject to agreement and applicable school or program approval. Sponsors do not receive individual student records, assessment results, preferential hiring rights or control over curriculum.</p></section>
        <section className="b6-sponsor-cta"><div className="b6-sponsor-container"><h2>Build the next opportunity together.</h2><p>Tell us whom you want to support, where you want to make an impact and whether you prefer funding, expertise or hands-on experiences.</p><Link className="b6-sponsor-button" href="/connect">START A SPONSORSHIP CONVERSATION →</Link><p className="b6-sponsor-note">BUILD6 is a program of LINK Lake Norman, LLC. Sponsorship payments to the LLC are not represented as tax-deductible charitable donations.</p></div></section>
      </main>
      <PublicFooter />
    </>
  );
}
