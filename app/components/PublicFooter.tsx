import Link from "next/link";
import Image from "next/image";

export default function PublicFooter() {
  return (
    <footer className="b6-approved-footer">
      <div className="b6-approved-footer-main">
        <div className="b6-approved-footer-brand">
          <Image
            src="/brand/build6-logo-approved.png"
            alt="BUILD6"
            width={245}
            height={95}
            className="b6-approved-footer-logo"
          />
          <p>
            Equipping today&apos;s students with the mindset, skills and
            connections to build what&apos;s next.
          </p>
          <div className="b6-approved-footer-tagline">BUILD WHAT&apos;S NEXT.</div>
        </div>

        <nav className="b6-approved-footer-column" aria-label="Footer Explore">
          <h2>EXPLORE</h2>
          <Link href="/">Experience</Link>
          <Link href="/schools">Schools</Link>
          <Link href="/athletes">Athletes + Teams</Link>
          <Link href="/workforces">Workforces</Link>
          <Link href="/partners">Partners</Link>
          <Link href="/sponsor">Sponsor BUILD6</Link>
          <Link href="/about">About BUILD6</Link>
        </nav>

        <nav className="b6-approved-footer-column" aria-label="Footer Resources">
          <h2>RESOURCES</h2>
          <Link href="/ambassador/student">Student Portal</Link>
          <Link href="/schools">Educator Tools</Link>
          <Link href="/assessment">Free Assessment</Link>
          <Link href="/interest">Program Inquiry</Link>
          <Link href="/connect">Get Involved</Link>
        </nav>

        <div className="b6-approved-footer-action">
          <div className="b6-approved-footer-action-kicker">BUILD6™</div>
          <h2>STUDENTS TODAY.<br />STRONGER COMMUNITIES TOMORROW.</h2>
          <p>
            Help students discover who they are, build real-world skills and
            connect to the people and experiences that move them forward.
          </p>
          <Link href="/connect" className="b6-approved-footer-button">
            BUILD WHAT&apos;S NEXT.™
          </Link>
        </div>
      </div>

      <div className="b6-approved-footer-bottom">
        <span>© 2026 BUILD6™. ALL RIGHTS RESERVED.</span>
        <span>BUILD6™ IS A PROPRIETARY CAREER-READINESS SYSTEM.</span>
        <span>A PROGRAM OF LINK LAKE NORMAN, LLC</span>
        <span>IP PROTECTION</span>
      </div>
    </footer>
  );
}
