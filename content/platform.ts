import { curriculum } from "./curriculum";

export type Student = {
  id: string;
  name: string;
  grade: string;
  email: string;
  cohort: string;
  currentWeek: number;
  readinessScore: number;
  attendanceRate: number;
  status: "Active" | "Inactive";
  careerInterests: string[];
  skills: string[];
  badges: string[];
};

export type Facilitator = {
  id: string;
  name: string;
  email: string;
  title: string;
  cohort: string;
  status: "Active" | "Inactive";
};

export type CurriculumWeek = {
  week: number;
  phase: string;
  title: string;
  objective: string;
  facilitatorGuide: string;
  discussionQuestions: string[];
  studentActivity: string;
  workplaceConnection: string;
  skillsEarned: string[];
  portfolioEvidence: string;
  badgeEarned: string;
  dailyLessons?: {
    day: string;
    title: string;
    objective: string;
    activity: string;
    reflection: string;
  }[];
  aiCoachPrompt?: string;
  weeklyReflection?: string;
  assessmentTitle?: string;
  assessmentDescription?: string;
  homework?: string;
};

export const organization = {
  id: "ambassador-christian-school",
  name: "Ambassador Christian School",
  cohort: "Ambassador 2026",
  program: "Launch Ready™ Professional Skills & Internship Readiness",
  currentWeek: 1,
  studentsEnrolled: 20,
};

export const facilitators: Facilitator[] = [
  {
    id: "facilitator-001",
    name: "Coach Jones",
    email: "coach.jones@ambassadorchristian.org",
    title: "Future Ready™ Facilitator",
    cohort: "Ambassador 2026",
    status: "Active",
  },
];

export const students: Student[] = Array.from(
  { length: 20 },
  (_, index): Student => {
    const number = index + 1;

    return {
      id: `ambassador-student-${String(number).padStart(3, "0")}`,
      name: `Student ${number}`,
      grade: "5th Year",
      email: `student${number}@ambassadorchristian.org`,
      cohort: "Ambassador 2026",
      currentWeek: 1,
      readinessScore: number === 1 ? 84 : number === 2 ? 82 : 75,
      attendanceRate: 100,
      status: "Active",
      careerInterests: ["Business", "Healthcare", "Technology"],
      skills: ["Communication", "Teamwork", "Professionalism"],
      badges: ["Future Ready Explorer"],
    };
  },
);

export { curriculum };
