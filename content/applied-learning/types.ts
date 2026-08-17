export type AppliedLearningAudience = "Core" | "Athlete Pathway" | "Both";

export type AppliedLearningFormat =
  | "Role Play"
  | "Case Scenario"
  | "Improv"
  | "Team Challenge"
  | "Panel Simulation"
  | "Public Speaking"
  | "Decision Lab"
  | "Money Lab";

export type AppliedLearningAsset = {
  id: string;
  week: number;
  title: string;
  format: AppliedLearningFormat;
  audience: AppliedLearningAudience;

  skills: string[];
  lessonConnection: string;
  whyItMatters: string;

  scenario: string;

  studentChallenge: string[];

  curveballs?: string[];

  consequenceReveal?: string[];

  retryPrompt?: string;

  roles?: {
    role: string;
    responsibility: string;
  }[];

  watchFor?: string[];

  professionalLanguage?: {
    situation: string;
    insteadOf: string;
    tryThis: string;
  }[];

  discussionQuestions: string[];

  facilitatorAnswerGuide: {
    strongResponses: string[];
    reasoning: string[];
    coachingPoints: string[];
  };

  reflectionPrompts: string[];

  portfolioEvidence?: string;

  athleteExtension?: {
    title: string;
    scenario: string;
    considerations: string[];
  };
};
