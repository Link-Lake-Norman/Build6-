export type LessonResourceType =
  | "Facilitator Guide"
  | "Student Workbook"
  | "Slides"
  | "Activity"
  | "Role Play"
  | "Improv"
  | "Case Scenario"
  | "Video"
  | "Handout"
  | "Link";

export type LessonResource = {
  id: string;
  title: string;
  type: LessonResourceType;
  url: string;
  notes: string;
};

export type LessonCustomization = {
  week: number;
  schoolId: string;
  cohortId: string;
  status: "Draft" | "Pending Approval" | "Published";
  editedBy: "Admin" | "Facilitator";
  updatedAt: string;
  localTitle: string;
  deliveryNotes: string;
  timing: string;
  materials: string;
  speakerName: string;
  speakerTopic: string;
  launchActivity: string;
  teamHuddle: string;
  workplaceChallenge: string;
  rolePlay: string;
  improv: string;
  caseScenario: string;
  reflectionPrompt: string;
  assessmentNotes: string;
  resources: LessonResource[];
};

export const LESSON_BUILDER_STORAGE_KEY =
  "future-ready:ambassador-lesson-customizations";

export const LESSON_BUILDER_PERMISSION_KEY =
  "future-ready:ambassador-permissions";

export function createLessonCustomization(week: number): LessonCustomization {
  return {
    week,
    schoolId: "ambassador-christian-school",
    cohortId: "ambassador-2026",
    status: "Draft",
    editedBy: "Admin",
    updatedAt: "",
    localTitle: "",
    deliveryNotes: "",
    timing: "50 minutes",
    materials: "",
    speakerName: "",
    speakerTopic: "",
    launchActivity: "",
    teamHuddle: "",
    workplaceChallenge: "",
    rolePlay: "",
    improv: "",
    caseScenario: "",
    reflectionPrompt: "",
    assessmentNotes: "",
    resources: [],
  };
}
