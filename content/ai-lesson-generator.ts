export type AIActivityType =
  | "Role Play"
  | "Case Scenario"
  | "Improv"
  | "Team Building"
  | "Pop Quiz"
  | "Reflection"
  | "Career Connection"
  | "Media Practice"
  | "Capstone Activity";

export type AILessonRequest = {
  week: number;
  day: string;
  topic: string;
  objective: string;
  audience: string;
};

export type AIGeneratedActivity = {
  title: string;
  activityType: AIActivityType;
  purpose: string;
  timeRequired: string;
  materials: string[];
  directions: string[];
  facilitatorNotes: string[];
};

export const AI_ACTIVITY_OPTIONS: AIActivityType[] = [
  "Role Play",
  "Case Scenario",
  "Improv",
  "Team Building",
  "Pop Quiz",
  "Reflection",
  "Career Connection",
  "Media Practice",
  "Capstone Activity",
];

export function generateActivityOptions(
  request: AILessonRequest,
): AIGeneratedActivity[] {
  return [
    {
      title: `${request.topic} Role Play Challenge`,
      activityType: "Role Play",
      purpose:
        "Students practice applying the weekly skill in a professional scenario.",
      timeRequired: "20 minutes",
      materials: [
        "Scenario Cards",
        "Role Cards",
        "Reflection Sheet",
      ],
      directions: [
        "Assign student roles.",
        "Review the scenario.",
        "Allow preparation time.",
        "Complete the role play.",
        "Discuss lessons learned.",
      ],
      facilitatorNotes: [
        "Connect the activity back to workplace expectations.",
      ],
    },
    {
      title: `${request.topic} Workplace Case Study`,
      activityType: "Case Scenario",
      purpose:
        "Students analyze a workplace challenge and develop solutions.",
      timeRequired: "25 minutes",
      materials: [
        "Case Study Handout",
        "Discussion Questions",
      ],
      directions: [
        "Read the scenario.",
        "Identify the challenge.",
        "Develop solutions.",
        "Share recommendations.",
      ],
      facilitatorNotes: [
        "Ask students to explain their reasoning.",
      ],
    },
    {
      title: `${request.topic} Improv Challenge`,
      activityType: "Improv",
      purpose:
        "Students build confidence and communication skills.",
      timeRequired: "15 minutes",
      materials: [
        "Prompt Cards",
      ],
      directions: [
        "Choose a prompt.",
        "Respond quickly.",
        "Reflect on communication style.",
      ],
      facilitatorNotes: [
        "Focus on confidence and adaptability.",
      ],
    },
    {
      title: `${request.topic} Team Challenge`,
      activityType: "Team Building",
      purpose:
        "Students practice collaboration and problem solving.",
      timeRequired: "20 minutes",
      materials: [
        "Challenge Instructions",
        "Team Supplies",
      ],
      directions: [
        "Create teams.",
        "Complete the challenge.",
        "Discuss teamwork.",
      ],
      facilitatorNotes: [
        "Observe leadership behaviors.",
      ],
    },
    {
      title: `${request.topic} Knowledge Check`,
      activityType: "Pop Quiz",
      purpose:
        "Students demonstrate understanding and receive feedback.",
      timeRequired: "10 minutes",
      materials: [
        "Digital Quiz",
        "Student Portal",
      ],
      directions: [
        "Complete quiz.",
        "Submit answers.",
        "Review feedback.",
      ],
      facilitatorNotes: [
        "Use results for coaching support.",
      ],
    },
  ];
}
