import "../approved-public-pages.css";
import AudienceLanding from "../components/AudienceLanding";

export default function PartnersPage() {
  return (
    <AudienceLanding
      eyebrow="EMPLOYERS + MENTORS + PARTNERS"
      title="HELP PEOPLE SEE"
      accent="WHAT'S POSSIBLE."
      lead="BUILD6™ creates structured ways for employers, professionals, mentors, speakers, workplace hosts, sponsors and community partners to contribute to real-world development."
      kicker="REAL PEOPLE HELP CREATE REAL READINESS."
      introTitle="Experience becomes more meaningful when people can connect learning to the real world."
      intro="Partners can share expertise, open workplaces, introduce industries, mentor participants, support applied experiences, sponsor access or help create stronger local and industry connections."
      benefits={[
        {
          number: "01",
          title: "SPEAK + SHARE",
          copy: "Introduce a career, industry, professional lesson or real-world perspective.",
        },
        {
          number: "02",
          title: "MENTOR + CONNECT",
          copy: "Help participants learn through authentic conversation, guidance and professional relationships.",
        },
        {
          number: "03",
          title: "HOST + EXPERIENCE",
          copy: "Open a workplace, support a job shadow or internship, or create another applied learning opportunity.",
        },
        {
          number: "04",
          title: "SPONSOR + SUPPORT",
          copy: "Help expand access, strengthen experiences or support implementation for a school, team or community.",
        },
      ]}
      outcomeLabel="HELP BUILD THE BRIDGE."
      outcome="Connect people with the experiences and relationships that expand possibility."
      ctaHref="/connect"
      ctaLabel="GET INVOLVED →"
      tone="gold"
    />
  );
}
