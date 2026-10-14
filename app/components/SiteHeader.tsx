import Link from "next/link";
import EmailPopup from "./EmailPopup";

export default function SiteHeader() {
  return (
    <>
      <link rel="stylesheet" href="/build6-public-stable.css?v=20260924a" />
      <header className="topbar">
        <Link
          className="brand"
          href="/"
          aria-label="BUILD6 home"
        >
          <span className="brand-logo-wrap">
            <img
              src="/brand/build6-horizontal-lockup.png"
              alt="BUILD6 — Build What's Next"
            />
          </span>
        </Link>

        <nav
          className="navlinks"
          aria-label="Primary navigation"
        >
          <Link href="/#journey">
            Experience
          </Link>

          <Link href="/about">
            About
          </Link>

          <Link href="/schools">
            Schools
          </Link>

          <Link href="/athletes">
            Athletes + Teams
          </Link>

          <Link href="/workforces">
            Workforces
          </Link>

          <Link href="/partners">
            Partners
          </Link>
        </nav>

        <div className="top-actions">
          <Link href="/toolkits" className="nav-assessment">TOOLKITS</Link>
          <Link className="nav-assessment" href="/assessment">FREE ASSESSMENT</Link>
          <Link
            className="login"
            href="/ambassador/login"
          >
            LOG IN
          </Link>

          <Link
            className="school-button"
            href="/interest"
          >
            BRING BUILD6™
          </Link>
        </div>
      </header>

      <EmailPopup />
    </>
  );
}
