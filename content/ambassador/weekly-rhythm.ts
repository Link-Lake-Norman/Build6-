export type AmbassadorDayType =
  | "REFLECT_RESET"
  | "CORE_LESSON"
  | "APPLIED_LEARNING"
  | "EXPERIENCE_FLEX"
  | "FUTURE_READY_FRIDAY";

export type AmbassadorWeeklyDay = {
  dayNumber: number;
  day: string;
  type: AmbassadorDayType;
  title: string;
  purpose: string;
  activities: string[];
  facilitatorFocus: string[];
  flexible?: boolean;
};

export const ambassadorWeeklyRhythm: AmbassadorWeeklyDay[] = [
  {
    dayNumber: 1,
    day: "Monday",
    type: "REFLECT_RESET",
    title: "Reflect + Reset",
    purpose:
      "Help students look back, make meaning from the previous week, organize their work, and prepare for what comes next.",
    activities: [
      "Previous-week reflection",
      "BUILD6 Friday follow-through",
      "Life Economy check-in",
      "Finish or improve incomplete work",
      "Portfolio evidence organization",
      "Project work",
      "Capstone development when introduced later in the program",
    ],
    facilitatorFocus: [
      "Do not rush into new instruction.",
      "Help students connect experiences to learning.",
      "Identify unfinished work or students who need support.",
      "Build organization and follow-through habits.",
      "Use early Mondays for reflection and project habits before capstone work begins.",
    ],
  },

  {
    dayNumber: 2,
    day: "Tuesday",
    type: "CORE_LESSON",
    title: "Core BUILD6™ Lesson",
    purpose:
      "Teach the primary BUILD6™ concept, skill, or framework for the week.",
    activities: [
      "Weekly lesson",
      "Guided discussion",
      "Skill instruction",
      "Student activity",
      "Workplace connection",
      "Lesson reflection",
    ],
    facilitatorFocus: [
      "Teach the existing curriculum rather than adding unnecessary content.",
      "Connect the lesson to real situations students recognize.",
      "Prepare students to apply the skill during Wednesday's lab.",
    ],
  },

  {
    dayNumber: 3,
    day: "Wednesday",
    type: "APPLIED_LEARNING",
    title: "Applied Learning Lab",
    purpose:
      "Move students from understanding a skill to actually demonstrating it.",
    activities: [
      "Role plays",
      "Case scenarios",
      "Improv",
      "Decision labs",
      "Team challenges",
      "Public speaking",
      "Professional communication practice",
      "Leadership and empathy scenarios",
      "Financial decision simulations when relevant",
    ],
    facilitatorFocus: [
      "Students should do more than the facilitator talks.",
      "Allow retries after feedback.",
      "Coach professional language students can actually use.",
      "Ask students to explain the reasoning behind their decisions.",
      "Use Athlete Pathway extensions when they strengthen the lesson.",
    ],
  },

  {
    dayNumber: 4,
    day: "Thursday",
    type: "EXPERIENCE_FLEX",
    title: "Experience + Flex Day",
    purpose:
      "Connect BUILD6™ skills to professionals, workplaces, community experiences, or deeper classroom application.",
    flexible: true,
    activities: [
      "Guest speaker",
      "Employer panel",
      "Field trip",
      "Workplace visit",
      "Career conversation",
      "Community leader session",
      "Special workshop",
      "Applied Learning Lab when no external experience is scheduled",
      "Core lesson continuation when additional instructional time is needed",
    ],
    facilitatorFocus: [
      "Use the Experience Day plan when an external experience is scheduled.",
      "Use the Classroom Lab plan when no experience is scheduled.",
      "Prepare students before speakers, panels, and field trips.",
      "Require active participation rather than passive attendance.",
      "Connect the experience back to the week's skill.",
      "Capture something students can reflect on or add to their BUILD6 record.",
    ],
  },

  {
    dayNumber: 5,
    day: "Friday",
    type: "FUTURE_READY_FRIDAY",
    title: "BUILD6™ Friday",
    purpose:
      "Close the learning loop by reviewing decisions, money, habits, growth, and what students will carry into the next week.",
    activities: [
      "Weekly Economy Heartbeat",
      "Life Economy review",
      "Money decisions and consequences",
      "Professional takeaway",
      "Skill reflection",
      "Goal check",
      "Next-week commitment",
    ],
    facilitatorFocus: [
      "Keep the Friday experience interactive.",
      "Connect money decisions to behavior and real life.",
      "Celebrate progress without removing accountability.",
      "Help students identify one concrete adjustment for the next week.",
    ],
  },
];

export function getAmbassadorDay(dayNumber: number) {
  return ambassadorWeeklyRhythm.find((day) => day.dayNumber === dayNumber);
}
