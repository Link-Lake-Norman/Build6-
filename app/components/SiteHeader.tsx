import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="BUILD6 home">
        <span className="brand-logo-wrap">
          <img
            src="/brand/build6-logo-approved.png"
            alt="BUILD6 — Build What's Next"
          />
          <sup className="brand-tm">™</sup>
        </span>
      </Link>

      <nav className="navlinks" aria-label="Primary navigation">
        <Link href="/students">Students</Link>
        <Link href="/educators">Educators</Link>
        <Link href="/employers">Employers</Link>
        <Link href="/partners">Partners</Link>
        <Link href="/#journey">How It Works</Link>
        <Link href="/#difference">About</Link>
        <Link href="/#resources">Resources</Link>
      </nav>

      <div className="top-actions">
        <Link className="login" href="/login">
          LOG IN
        </Link>

        <Link className="school-button" href="/schools">
          BRING BUILD6 TO YOUR SCHOOL
        </Link>
      </div>
    </header>
  );
}
