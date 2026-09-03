import AudienceLanding from "../components/AudienceLanding";

export default function AthletesPage() {
  return (
    <AudienceLanding
      eyebrow="ATHLETES + TEAMS"
      title="BUILD SKILLS THAT GO"
      accent="BEYOND THE GAME."
      lead="BUILD6™ helps student athletes and teams translate the skills built through competition into leadership, professional confidence, career readiness and life beyond athletics."
      kicker="ATHLETIC DEVELOPMENT. HUMAN DEVELOPMENT."
      introTitle="The strongest skills athletes build are transferable."
      intro="Communication, accountability, resilience, leadership, teamwork and adaptability matter on a team, in a classroom, at work and in life. BUILD6™ helps participants recognize those strengths and learn how to apply them intentionally."
      benefits={[
        {
          number: "01",
          title: "LEADERSHIP + ACCOUNTABILITY",
          copy: "Turn team expectations into practical leadership habits, ownership and professional responsibility.",
        },
        {
          number: "02",
          title: "COMMUNICATION",
          copy: "Practice difficult conversations, speaking, interviewing, teamwork and professional interaction.",
        },
        {
          number: "03",
          title: "IDENTITY + TRANSITION",
          copy: "Help athletes explore who they are beyond competition and build confidence about future pathways.",
        },
        {
          number: "04",
          title: "CAREER + FINANCIAL READINESS",
          copy: "Connect personal branding, financial confidence, career exploration and professional relationships to life after sport.",
        },
      ]}
      outcomeLabel="BUILD THE PERSON. NOT JUST THE PLAYER."
      outcome="Translate performance into readiness for what comes next."
      ctaHref="/interest?for=athletics"
      ctaLabel="BUILD6™ FOR ATHLETES + TEAMS →"
      tone="gold"
    />
  );
}
