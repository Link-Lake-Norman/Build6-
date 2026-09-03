import AudienceLanding from "../components/AudienceLanding";

export default function CollegesPage() {
  return (
    <AudienceLanding
      eyebrow="COLLEGES + POSTSECONDARY PROGRAMS"
      title="CONNECT EDUCATION TO"
      accent="EMPLOYMENT + LIFE."
      lead="BUILD6™ helps postsecondary programs strengthen professional skills, career clarity, employer connection and transition readiness before students enter the workforce."
      kicker="FROM EDUCATION TO APPLICATION."
      introTitle="A degree or credential is only part of readiness."
      intro="Students also need confidence, professional communication, relationships, practical experience and the ability to articulate what they know and what they can do. BUILD6™ helps programs connect those pieces."
      benefits={[
        {
          number: "01",
          title: "PROFESSIONAL READINESS",
          copy: "Communication, interviewing, networking, professional etiquette and workplace expectations.",
        },
        {
          number: "02",
          title: "CAREER CLARITY",
          copy: "Structured reflection and exploration help students connect strengths, values and skills to possible pathways.",
        },
        {
          number: "03",
          title: "EMPLOYER CONNECTION",
          copy: "Bring professionals, employers and workplace experiences into the student development process.",
        },
        {
          number: "04",
          title: "TRANSITION EVIDENCE",
          copy: "Help students capture reflection, accomplishments, experiences and next-step planning before graduation.",
        },
      ]}
      outcomeLabel="PREPARE STUDENTS TO MOVE FORWARD WITH CONFIDENCE."
      outcome="Turn education into a stronger launch."
      ctaHref="/interest?for=postsecondary"
      ctaLabel="EXPLORE BUILD6™ FOR YOUR PROGRAM →"
      tone="purple"
    />
  );
}
