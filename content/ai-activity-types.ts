export type AIActivityType =
  | "Role Play"
  | "Case Scenario"
  | "Improv"
  | "Team Building"
  | "Pop Quiz"
  | "Reflection"
  | "Career Connection"
  | "Media Practice"
  | "Capstone Workshop"
  | "Guest Speaker Preparation";

import type { Build6Case } from "./build6-case-library";

export type AIGeneratedActivity = {
  presentationCases?: Build6Case[];
  title: string;
  activityType: AIActivityType;
  durationMinutes?: number;

  lessonConnection: string;
  learningObjective: string;
  whyThisMatters: string;
  facilitatorBackground: string;

  classroomSetup: string;
  materials: string[];

  teachingPoints: string[];
  openingConversation: string[];
  examplesToShare: string[];
  facilitatorQuestions: string[];
  observationGuide: string[];
  debriefGuide: string[];

  studentRoles: {
    role: string;
    responsibility: string;
  }[];

  facilitatorScript: string[];
  stepByStepInstructions: string[];
  discussionQuestions: string[];
  reflectionPrompts: string[];
  assessmentRubric: string[];

  portfolioEvidence: string;
  capstoneConnection: string;
};
