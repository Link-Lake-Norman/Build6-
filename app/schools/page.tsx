import "../approved-public-pages.css";
import AudienceLanding from "../components/AudienceLanding";

export default function SchoolsPage() {
  return (
    <AudienceLanding
      eyebrow="SCHOOLS + STUDENTS"
      title="CONNECT LEARNING TO"
      accent="WHAT COMES NEXT."
      lead="BUILD6™ gives schools a facilitator-ready framework for helping students build human skills, career awareness, professional confidence, real-world relationships and evidence of growth."
      kicker="STRUCTURE FOR EDUCATORS. EXPERIENCE FOR STUDENTS."
      introTitle="Students need more than information about the future."
      intro="BUILD6™ creates a connected experience where students discover more about themselves, practice the skills that matter, explore pathways, meet real professionals, gain exposure to workplaces and reflect on what they are learning."
      benefits={[
        {
          number: "01",
          title: "FACILITATOR-READY",
          copy: "A structured experience schools can deliver without asking educators to become career or workforce experts.",
        },
        {
          number: "02",
          title: "REAL SKILL DEVELOPMENT",
          copy: "Communication, teamwork, leadership, problem solving, adaptability, professionalism, financial literacy and AI literacy.",
        },
        {
          number: "03",
          title: "REAL-WORLD CONNECTION",
          copy: "Employers, speakers, mentors, workplace visits, career conversations and applied learning bring possibility to life.",
        },
        {
          number: "04",
          title: "EVIDENCE OF GROWTH",
          copy: "Reflections, portfolio evidence and the BUILD6™ Student Passport help students capture what they are learning along the way.",
        },
      ]}
      outcomeLabel="BUILD MORE THAN READINESS."
      outcome="Build confident, connected, capable students."
      ctaHref="/interest?for=school"
      ctaLabel="BRING BUILD6™ TO YOUR SCHOOL →"
      tone="blue"
    />
  );
}
