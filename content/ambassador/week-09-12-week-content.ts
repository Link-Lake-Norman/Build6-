export type Build6Week0912Content = {
  week: number;
  title: string;
  phase: string;
  objective: string;
  studentActivity: string;
  reflection: string;
  workplaceConnection: string;
  skillsEarned: string[];
  portfolioEvidence: string;
  badgeEarned: string;
  facilitatorGuide: string;
  discussionQuestions: string[];
  midweekReflection: string;
  fridayReflection: string;
  capstoneConnection: string;
};

const CONTENT: Record<number, Build6Week0912Content> = {
  9: {
    week: 9,
    title: "AI at Work — Think Better. Work Smarter. Stay Human.",
    phase: "DEVELOP™",
    objective: "Use AI as a professional thinking partner while keeping human judgment, verification, privacy, ownership, and communication in the driver's seat.",
    studentActivity: "Prompt Makeover Relay + AI Judgment & Verification Lab + Human/AI Project Studio.",
    reflection: "What did I notice about the difference between getting an AI answer and making a professional decision?",
    workplaceConnection: "AI can accelerate research, writing, planning, analysis, and communication, but professionals remain responsible for accuracy, confidentiality, judgment, and the final decision.",
    skillsEarned: ["AI Literacy", "Critical Thinking", "Prompt Design", "Verification", "Privacy", "Professional Judgment", "Human Ownership"],
    portfolioEvidence: "AI Verification Checklist + Human/AI Project Evidence + Professional AI Rules",
    badgeEarned: "BUILD6™ Responsible AI Navigator",
    facilitatorGuide: "Monday is catch-up and discussion. Tuesday teaches prompting through realistic workplace problems. Wednesday is Coach Jones's AI Judgment + Verification Lab. Thursday applies AI to a real student project. Friday closes with Human Advantage, Professional AI Rules, completion, reflection, and portfolio/capstone evidence.",
    discussionQuestions: [
      "Where is AI useful but still not enough?",
      "What information should never be entered into an AI system?",
      "How do you verify a confident-sounding answer?",
      "What part of the final work must still be yours?"
    ],
    midweekReflection: "What did I notice about the difference between getting an AI answer and making a professional decision?",
    fridayReflection: "What are my rules for using AI professionally, and which human skill do I want to strengthen because AI exists?",
    capstoneConnection: "Preserve one example showing how you used judgment: the original AI output, what you changed or rejected, what you verified, and why your final decision was better."
  },
  10: {
    week: 10,
    title: "Professional Curiosity + Business Literacy — Julie + Eric",
    phase: "EXPLORE™",
    objective: "Enter a professional room prepared, understand how people and organizations create value, ask intelligent questions, listen for opportunity, and follow up.",
    studentActivity: "Curiosity Lab + Julie & Eric research + live professional conversation + Professional Connection Record.",
    reflection: "Which question or follow-up showed the strongest curiosity today, and what made it stronger?",
    workplaceConnection: "Career opportunities often begin with professional curiosity, active listening, business understanding, thoughtful questions, and appropriate follow-up.",
    skillsEarned: ["Professional Curiosity", "Active Listening", "Question Design", "Business Literacy", "Professional Introductions", "Relationship Building", "Follow-Up"],
    portfolioEvidence: "Professional Question Set + Julie & Eric Connection Record + Thank-You/Follow-Up",
    badgeEarned: "BUILD6™ Professional Connector",
    facilitatorGuide: "Monday is catch-up and curiosity reset. Tuesday builds introductions, stronger questions, and follow-ups. Wednesday uses only confirmed/public information to research Julie and Eric and prepare 3–5 thoughtful questions. Thursday is the live professional conversation. Friday is thank-you/follow-up, completion, and portfolio/capstone evidence.",
    discussionQuestions: [
      "What makes a professional question worth asking?",
      "How do you listen for something worth following up on?",
      "What did you learn that a website could not tell you?",
      "What is an appropriate next step after a strong professional conversation?"
    ],
    midweekReflection: "Which question or follow-up showed the strongest curiosity today, and what made it stronger?",
    fridayReflection: "What did I learn from Julie and Eric that I could not have learned from a website, and what will I do with that information?",
    capstoneConnection: "Preserve one professional connection story: what you researched, the question you asked, what you learned, and the next action you chose because of the conversation."
  },
  11: {
    week: 11,
    title: "How a Business Actually Works — Champion Tire & Wheel",
    phase: "EXPLORE™",
    objective: "Use a real workplace to understand operations, workflow, customer experience, quality, safety, supply chain, technology, financial impact, teamwork, and hidden career paths.",
    studentActivity: "Business Systems Lab + Champion research + Operations Detective tour challenge + business/career debrief.",
    reflection: "What part of a business system had I never thought about before, and why does it matter?",
    workplaceConnection: "Every business outcome depends on connected people, processes, technology, materials, safety, quality, customer communication, and financial decisions.",
    skillsEarned: ["Systems Thinking", "Operations", "Workflow", "Quality Control", "Customer Experience", "Safety", "Supply Chain Awareness", "Business Economics", "Career Exploration"],
    portfolioEvidence: "Business Workflow Map + Champion Operations Detective + Career/Skill Map",
    badgeEarned: "BUILD6™ Business Systems Explorer",
    facilitatorGuide: "Monday is catch-up and business-systems discussion. Tuesday maps customer need to finished outcome. Wednesday researches Champion Tire & Wheel, likely workflow, technology, safety, customers and careers. Thursday is the Operations Detective tour; closed-toe shoes. Friday is thank-you, operations debrief, transferable skills, completion and portfolio/capstone evidence.",
    discussionQuestions: [
      "Where can one mistake affect quality, safety, time, money, or reputation?",
      "What roles are invisible to the customer but essential to the outcome?",
      "Where did you see technology or quality control supporting the workflow?",
      "What career did you notice that you did not expect?"
    ],
    midweekReflection: "What part of a business system had I never thought about before, and why does it matter?",
    fridayReflection: "What did Champion Tire & Wheel show me about how one person's work affects customers, quality, safety, time, money, and the rest of the team?",
    capstoneConnection: "Preserve one operations insight that changed how you understand work: what you observed, which roles were connected, and what could happen if one handoff failed."
  },
  12: {
    week: 12,
    title: "Communication Under Pressure — Michelle Boudin",
    phase: "DEVELOP™",
    objective: "Build interview, presentation, panel, conflict, media, and workplace communication skills by practicing how to think, respond, recover, and stay credible under pressure.",
    studentActivity: "Camera Lab + Pressure/Conflict/Panel Lab + Michelle Boudin live coaching + immediate retry.",
    reflection: "What pressure reaction did I notice in myself, and what recovery technique helped me remain credible?",
    workplaceConnection: "Interviews, presentations, meetings, customer conversations, leadership, conflict, and media all require clear thinking and credible communication when the situation becomes uncomfortable or unscripted.",
    skillsEarned: ["Camera Presence", "Interview Communication", "Panel Discussion", "Conflict Response", "Pressure Recovery", "Concise Answers", "Active Listening", "Body Language", "Credibility"],
    portfolioEvidence: "Before/After Communication Evidence + Panel/Conflict Feedback + Michelle Boudin Coaching Reflection",
    badgeEarned: "BUILD6™ Communication Under Pressure",
    facilitatorGuide: "Monday is catch-up and pressure awareness. Tuesday is Camera Lab with first take, one coaching point, and immediate retry. Wednesday is Pressure + Conflict + Panel Lab with difficult questions, disagreement, interruption, blanking, correction, uncertainty, and role rotation. Thursday applies those skills with Michelle Boudin. Friday is thank-you, before/after artifact, completion, reflection, and portfolio/capstone evidence.",
    discussionQuestions: [
      "What happens to your communication when you feel pressure?",
      "How can you disagree without becoming defensive?",
      "What can you say when you do not know the answer?",
      "What changed after feedback and a second attempt?"
    ],
    midweekReflection: "What pressure reaction did I notice in myself, and what recovery technique helped me remain credible?",
    fridayReflection: "What changed between my first attempt and my later attempt, and what will I deliberately practice next?",
    capstoneConnection: "Preserve a before/after communication example: what pressure did to your first attempt, the feedback you received, what you changed, and evidence that your second attempt was stronger."
  }
};

export function getBuild6Week0912Content(week: number): Build6Week0912Content | null {
  return CONTENT[week] ?? null;
}

export const build6Week0912Content = CONTENT;
