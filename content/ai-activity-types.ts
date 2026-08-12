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

export type AIGeneratedActivity = {
  title: string;
  activityType: AIActivityType;

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
