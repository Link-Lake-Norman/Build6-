export type FutureReadyTradition = {
  id: string;
  emoji: string;
  title: string;
  shortName: string;
  description: string;
  defaultMinutes: number;
  suggestedDay: number | null;
  takeawayExamples: string[];
};

export const FUTURE_READY_TRADITIONS: FutureReadyTradition[] = [
  {
    id: "friday-hot-seat",
    emoji: "🎤",
    title: "Friday Hot Seat",
    shortName: "Hot Seat",
    description:
      "One student practices a real interview question with live coaching, feedback, and a second attempt.",
    defaultMinutes: 12,
    suggestedDay: 5,
    takeawayExamples: [
      "A stronger interview answer",
      "A polished personal story",
      "A confident Tell Me About Yourself response",
    ],
  },
  {
    id: "networking-minute",
    emoji: "🤝",
    title: "Networking Minute",
    shortName: "Networking Minute",
    description:
      "Students introduce themselves to someone new and practice making a professional connection.",
    defaultMinutes: 5,
    suggestedDay: null,
    takeawayExamples: [
      "A networking introduction",
      "A stronger elevator pitch",
      "A follow-up question to use with professionals",
    ],
  },
  {
    id: "coffee-chat",
    emoji: "☕",
    title: "Coffee Chat",
    shortName: "Coffee Chat",
    description:
      "Small-group conversation with a guest professional focused on career stories, lessons, and questions.",
    defaultMinutes: 20,
    suggestedDay: null,
    takeawayExamples: [
      "A professional contact",
      "Three career insights",
      "A thoughtful follow-up message",
    ],
  },
  {
    id: "workplace-wednesday",
    emoji: "🎭",
    title: "Workplace Wednesday",
    shortName: "Workplace Wednesday",
    description:
      "Students act out a realistic workplace situation and practice how they would respond.",
    defaultMinutes: 15,
    suggestedDay: 3,
    takeawayExamples: [
      "A conflict resolution script",
      "A professional response",
      "A workplace communication strategy",
    ],
  },
  {
    id: "five-minute-failure",
    emoji: "⚡",
    title: "Five-Minute Failure",
    shortName: "Five-Minute Failure",
    description:
      "A guest or facilitator shares a mistake, what happened next, and what they learned.",
    defaultMinutes: 5,
    suggestedDay: null,
    takeawayExamples: [
      "A resilience reflection",
      "A lesson learned statement",
      "A new response to failure",
    ],
  },
  {
    id: "ai-challenge",
    emoji: "💡",
    title: "AI Challenge",
    shortName: "AI Challenge",
    description:
      "Students solve a workplace problem using AI responsibly, verify the result, and explain their thinking.",
    defaultMinutes: 15,
    suggestedDay: null,
    takeawayExamples: [
      "An AI prompt",
      "An AI prompt library entry",
      "A responsible AI checklist",
    ],
  },
  {
    id: "team-challenge",
    emoji: "🏆",
    title: "Team Challenge",
    shortName: "Team Challenge",
    description:
      "Teams solve a realistic business or workplace problem with limited time and defined roles.",
    defaultMinutes: 20,
    suggestedDay: null,
    takeawayExamples: [
      "A team solution",
      "A leadership reflection",
      "A problem-solving framework",
    ],
  },
];

export const FUTURE_READY_TAKEAWAYS = [
  "A stronger résumé bullet",
  "A polished LinkedIn headline",
  "An interview answer I can actually use",
  "A conflict resolution script",
  "A networking introduction",
  "An AI prompt library entry",
  "A leadership reflection",
  "A SMART goal",
  "A professional email template",
  "A follow-up message to a professional",
  "A stronger elevator pitch",
  "A workplace communication script",
  "A career question to ask a professional",
  "A responsible AI checklist",
  "A personal action step",
] as const;

export const FUTURE_READY_CULTURE_PROMISE =
  "Every Future Ready™ session includes something students do, something students practice, and something useful students leave with.";
