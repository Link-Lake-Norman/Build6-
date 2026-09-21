import Link from "next/link";
import SiteHeader from "./SiteHeader";

type Benefit = {
  number: string;
  title: string;
  copy: string;
};

type AudienceLandingProps = {
  eyebrow: string;
  title: string;
  accent: string;
  lead: string;

  kicker: string;
  introTitle: string;
  intro: string;

  benefits: Benefit[];

  outcomeLabel: string;
  outcome: string;

  ctaLabel?: string;
  ctaHref?: string;

  tone?: "teal" | "blue" | "gold" | "purple";
};

export default function AudienceLanding({
  eyebrow,
  title,
  accent,
  lead,

  kicker,
  introTitle,
  intro,

  benefits,

  outcomeLabel,
  outcome,

  ctaLabel = "START A CONVERSATION →",
  ctaHref = "/interest",

  tone = "teal",
}: AudienceLandingProps) {
  return (
    <main className="b6-audience-page">
      <SiteHeader />

      <section
        className={`b6-audience-hero b6-audience-hero-${tone}`}
      >
        <div className="b6-audience-hero-content">
          <p className="eyebrow">
            {eyebrow}
          </p>

          <h1>
            {title}{" "}
            <span>{accent}</span>
          </h1>

          <p className="b6-audience-lead">
            {lead}
          </p>

          <Link
            href={ctaHref}
            className="b6-audience-button"
          >
            {ctaLabel}
          </Link>
        </div>
      </section>

      <section className="b6-audience-intro">
        <p className="section-kicker">
          {kicker}
        </p>

        <h2>
          {introTitle}
        </h2>

        <p>
          {intro}
        </p>
      </section>

      <section className="b6-audience-benefits">
        {benefits.map(
          (benefit) => (
            <article key={benefit.number}>
              <span>
                {benefit.number}
              </span>

              <h3>
                {benefit.title}
              </h3>

              <p>
                {benefit.copy}
              </p>
            </article>
          )
        )}
      </section>

      <section className="b6-audience-outcome">
        <p>
          {outcomeLabel}
        </p>

        <h2>
          {outcome}
        </h2>

        <Link
          href={ctaHref}
          className="b6-audience-outcome-button"
        >
          {ctaLabel}
        </Link>
      </section>

      <footer className="b6-audience-mini-footer">
        © 2026 BUILD6™. All Rights Reserved.
        Proprietary brand, platform, curriculum,
        research, data, methodologies, designs
        &amp; program materials.
      </footer>
    </main>
  );
}
