import Link from "next/link";
import EmailPopup from "./EmailPopup";

export default function SiteHeader() {
  return (
    <>
      <header className="topbar">
        <Link
          className="brand"
          href="/"
          aria-label="BUILD6 home"
        >
          <span className="brand-logo-wrap">
            <img
              src="/brand/build6-logo-approved.png"
              alt="BUILD6 — Build What's Next"
            />

            <sup className="brand-tm">
              ™
            </sup>
          </span>
        </Link>

        <nav
          className="navlinks"
          aria-label="Primary navigation"
        >
          <Link href="/#journey">
            Experience
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

          <Link href="/about">
            About
          </Link>
          <Link
            className="nav-assessment"
            href="/assessment"
          >
            Take the Free Assessment
          </Link>
        </nav>

        <div className="top-actions">
          <Link
            className="login"
            href="/login"
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
