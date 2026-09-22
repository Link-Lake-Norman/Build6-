import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="build6-universal-footer">
      <div className="b6uf-main">
        <div className="b6uf-brand">
          <Link href="/" aria-label="BUILD6 home">
            <img src="/brand/build6-logo-approved.png" alt="BUILD6 — Build What's Next" />
          </Link>
          <p>
            Equipping today&apos;s students with the mindset, skills and
            connections to build what&apos;s next.
          </p>
        </div>

        <div className="b6uf-column">
          <h3>EXPLORE</h3>
          <Link href="/">Experience</Link>
          <Link href="/schools">Schools</Link>
          <Link href="/athletes">Athletes + Teams</Link>
          <Link href="/workforces">Workforces</Link>
          <Link href="/partners">Partners</Link>
          <Link href="/about">About</Link>
        </div>

        <div className="b6uf-column">
          <h3>RESOURCES</h3>
          <Link href="/ambassador/student">Student Portal</Link>
          <Link href="/educators">Educator Tools</Link>
          <Link href="/assessment">Free Assessment</Link>
          <Link href="/interest">Program Inquiry</Link>
          <Link href="/connect">Get Involved</Link>
        </div>

        <div className="b6uf-action">
          <p>STUDENTS TODAY.<br />STRONGER COMMUNITIES<br />TOMORROW.</p>
          <span />
          <Link href="/interest">BUILD WHAT&apos;S NEXT.™</Link>
        </div>
      </div>

      <div className="b6uf-bottom">
        <div>
          <span>© 2026 BUILD6™. All Rights Reserved.</span>
          <span>Proprietary brand, platform, curriculum, research, data, methodologies, designs &amp; program materials.</span>
        </div>
        <div>
          <span>A PROGRAM OF LINK LAKE NORMAN, LLC</span>
          <span>IP PROTECTION</span>
        </div>
      </div>
    </footer>
  );
}
