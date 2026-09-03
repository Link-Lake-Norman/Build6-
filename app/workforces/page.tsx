import AudienceLanding from "../components/AudienceLanding";

export default function WorkforcesPage() {
  return (
    <AudienceLanding
      eyebrow="EMPLOYEES + WORKFORCES"
      title="DEVELOP PEOPLE FOR"
      accent="THE WORKPLACE AHEAD."
      lead="BUILD6™ adapts the same human-centered development framework for onboarding, professional growth, team effectiveness, leadership, AI readiness and employee retention."
      kicker="PEOPLE DEVELOPMENT THAT CONNECTS TO REAL WORK."
      introTitle="Workforce readiness does not end when someone gets hired."
      intro="Organizations need people who can communicate, adapt, collaborate, lead, solve problems and navigate changing expectations. BUILD6™ creates structured opportunities to practice those skills while connecting development to the employee experience."
      benefits={[
        {
          number: "01",
          title: "ONBOARDING",
          copy: "Build shared expectations, communication habits, confidence and workplace fluency early in the employee experience.",
        },
        {
          number: "02",
          title: "TEAM EFFECTIVENESS",
          copy: "Practice collaboration, conflict management, problem solving, accountability and communication across personalities and roles.",
        },
        {
          number: "03",
          title: "LEADERSHIP DEVELOPMENT",
          copy: "Develop emerging leaders through reflection, applied practice, decision making and real workplace scenarios.",
        },
        {
          number: "04",
          title: "RETENTION + GROWTH",
          copy: "Help employees see development, internal pathways and professional growth as part of a connected employee experience.",
        },
      ]}
      outcomeLabel="DEVELOP PEOPLE. STRENGTHEN ORGANIZATIONS."
      outcome="Build more capable, adaptable and connected workforces."
      ctaHref="/interest?for=workforce"
      ctaLabel="EXPLORE BUILD6™ FOR YOUR WORKFORCE →"
      tone="teal"
    />
  );
}
