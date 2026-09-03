export type AssessmentDimension =
  | "people"
  | "communication"
  | "leadership"
  | "creativity"
  | "problemSolving"
  | "analytical"
  | "technology"
  | "handsOn"
  | "service"
  | "organization"
  | "entrepreneurship"
  | "outdoors"
  | "movement"
  | "computer"
  | "independence"
  | "teamwork";

export type AssessmentOption = {
  value: string;
  label: string;
  description?: string;
  weights: Partial<Record<AssessmentDimension, number>>;
};

export type AssessmentQuestion = {
  id: string;
  section: string;
  prompt: string;
  help?: string;
  type: "single" | "multi";
  options: AssessmentOption[];
};

export type CareerRole = {
  id: string;
  title: string;
  pathway: string;
  description: string;
  environment: string;
  education: string;
  nextStep: string;
  relatedRoles: string[];
  weights: Partial<Record<AssessmentDimension, number>>;
};
