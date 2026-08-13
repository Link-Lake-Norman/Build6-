export const DAY_ONE_ASSESSMENT = {
  name: "Future Ready™ Day 1 Baseline Assessment",
  type: "BASELINE",
  version: "1.0",
};

export const READINESS_SCALE = [
  { value: 1, label: "Not yet" },
  { value: 2, label: "I'm developing this" },
  { value: 3, label: "Sometimes / somewhat confident" },
  { value: 4, label: "Usually / confident" },
  { value: 5, label: "Absolutely / consistently" },
];

export const DAY_ONE_QUESTIONS = [
  // SELF AWARENESS
  {
    category: "SELF_AWARENESS",
    question: "I can identify the strengths I bring to a team.",
    position: 1,
  },
  {
    category: "SELF_AWARENESS",
    question: "I can explain what I am good at without feeling like I am bragging.",
    position: 2,
  },
  {
    category: "SELF_AWARENESS",
    question: "I know which skills I still need to improve.",
    position: 3,
  },
  {
    category: "SELF_AWARENESS",
    question: "I have a good understanding of the values that are important to me.",
    position: 4,
  },

  // COMMUNICATION
  {
    category: "COMMUNICATION",
    question: "I can introduce myself confidently to an adult I have never met.",
    position: 5,
  },
  {
    category: "COMMUNICATION",
    question: "I can communicate professionally by email, text, or message.",
    position: 6,
  },
  {
    category: "COMMUNICATION",
    question: "I listen carefully when someone else is speaking, even when I disagree.",
    position: 7,
  },
  {
    category: "COMMUNICATION",
    question: "I can explain my ideas clearly in front of other people.",
    position: 8,
  },

  // LEADERSHIP
  {
    category: "LEADERSHIP",
    question: "I take responsibility for my role when I am part of a team.",
    position: 9,
  },
  {
    category: "LEADERSHIP",
    question: "I can step up and lead when a situation requires it.",
    position: 10,
  },
  {
    category: "LEADERSHIP",
    question: "I can receive feedback without becoming defensive.",
    position: 11,
  },
  {
    category: "LEADERSHIP",
    question: "I try to make the people around me better, not just myself.",
    position: 12,
  },

  // PROFESSIONAL PRESENCE
  {
    category: "PROFESSIONAL_PRESENCE",
    question: "I know how to make a professional first impression.",
    position: 13,
  },
  {
    category: "PROFESSIONAL_PRESENCE",
    question: "I understand how my attitude and body language affect how others see me.",
    position: 14,
  },
  {
    category: "PROFESSIONAL_PRESENCE",
    question: "I know how to behave professionally in a workplace, meeting, or networking setting.",
    position: 15,
  },
  {
    category: "PROFESSIONAL_PRESENCE",
    question: "I can talk about my accomplishments and experiences professionally.",
    position: 16,
  },

  // CAREER READINESS
  {
    category: "CAREER_READINESS",
    question: "I can name career paths or industries I would genuinely like to explore.",
    position: 17,
  },
  {
    category: "CAREER_READINESS",
    question: "I understand that there are multiple pathways into a successful career.",
    position: 18,
  },
  {
    category: "CAREER_READINESS",
    question: "I know how to begin building professional relationships and a network.",
    position: 19,
  },
  {
    category: "CAREER_READINESS",
    question: "I would feel prepared to have a professional conversation with an employer today.",
    position: 20,
  },

  // ADAPTABILITY
  {
    category: "ADAPTABILITY",
    question: "When something does not go according to plan, I can adjust and keep moving.",
    position: 21,
  },
  {
    category: "ADAPTABILITY",
    question: "I can work effectively with people whose personalities are different from mine.",
    position: 22,
  },
  {
    category: "ADAPTABILITY",
    question: "I am willing to learn a new skill even when it is uncomfortable at first.",
    position: 23,
  },
  {
    category: "ADAPTABILITY",
    question: "I can solve problems without always needing someone else to tell me what to do.",
    position: 24,
  },

  // AI READINESS
  {
    category: "AI_READINESS",
    question: "I understand ways AI is already changing school, work, and careers.",
    position: 25,
  },
  {
    category: "AI_READINESS",
    question: "I know how to use AI as a tool without letting it do all of my thinking for me.",
    position: 26,
  },
  {
    category: "AI_READINESS",
    question: "I know that information produced by AI should be checked before I rely on it.",
    position: 27,
  },
  {
    category: "AI_READINESS",
    question: "I understand that responsible AI use includes judgment, ethics, and accountability.",
    position: 28,
  },
] as const;

export type ReadinessCategory =
  | "SELF_AWARENESS"
  | "COMMUNICATION"
  | "LEADERSHIP"
  | "PROFESSIONAL_PRESENCE"
  | "CAREER_READINESS"
  | "ADAPTABILITY"
  | "AI_READINESS";
