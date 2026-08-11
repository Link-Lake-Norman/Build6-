export type FacilitatorNavigationItem = {
  label: string;
  href: string;
};

export type StudentStatus =
  | "On Track"
  | "Needs Attention"
  | "Internship Ready";

export type PortfolioStatus =
  | "On Track"
  | "In Progress"
  | "Needs Attention";

export type ReflectionStatus =
  | "Approved"
  | "Submitted"
  | "Needs Revision"
  | "Not Submitted";

export type ReviewStatus =
  | "Pending"
  | "Approved"
  | "Needs Revision";

export type AttendanceStatus =
  | "Present"
  | "Late"
  | "Absent"
  | "Excused";

export type FacilitatorStudent = {
  id: string;
  name: string;
  initials: string;
  email: string;
  grade: string;
  cohort: string;
  readinessScore: number;
  progress: number;
  attendance: number;
  attendanceRate: number;
  badges: number;
  badgesEarned: number;
  portfolioStatus: PortfolioStatus;
  portfolioProgress: number;
  reflectionStatus: ReflectionStatus;
  status: StudentStatus;
};

export type AttendanceRecord = {
  id: string;
  studentId: string;
  studentName: string;
  name: string;
  initials: string;
  email: string;
  date: string;
  status: AttendanceStatus;
  note: string;
};

export type ReflectionSubmission = {
  id: string;
  studentId: string;
  studentName: string;
  student: string;
  week: number;
  lesson: string;
  title: string;
  submitted: string;
  submittedAt: string;
  submittedDate?: string;
  status: ReviewStatus;
  excerpt: string;
  prompt?: string;
  response?: string;
  feedback?: string;
};

export type BadgeSubmission = {
  id: string;
  studentId: string;
  studentName: string;
  student: string;
  badge: string;
  badgeName: string;
  submitted: string;
  submittedAt: string;
  submittedDate?: string;
  status: ReviewStatus;
  evidence: string;
  feedback?: string;
};

export type FacilitatorAlert = {
  id: string;
  level: "High" | "Medium" | "Low";
  title: string;
  description: string;
};

export type AgendaItem = {
  id: string;
  time: string;
  title: string;
  type: string;
};

export type SkillDistributionItem = {
  skill: string;
  label: string;
  value: number;
  percentage: number;
  score: number;
};

export type WeeklyProgressItem = {
  week: string;
  label: string;
  progress: number;
  value: number;
  completion: number;
};

export const facilitatorProfile = {
  name: "Coach Jones",
  role: "Lead Facilitator",
  initials: "CJ",
  organization: "Ambassador Christian School",
  cohort: "5th Year Student Athletes",
};

export const activeCohort = {
  id: "ambassador-2026",
  name: "Ambassador 2026",
  organization: "Ambassador Christian School",
  program: "Future Ready™",
  currentWeek: 12,
  totalWeeks: 36,
  currentPhase: "DEVELOP™",
  studentCount: 20,
  facilitator: "Coach Jones",
};

export const facilitatorNavigation: FacilitatorNavigationItem[] = [
  {
    label: "Dashboard",
    href: "/ambassador/facilitator",
  },
  {
    label: "Students",
    href: "/ambassador/facilitator/students",
  },
  {
    label: "Attendance",
    href: "/ambassador/facilitator/attendance",
  },
  {
    label: "Reflections",
    href: "/ambassador/facilitator/reflections",
  },
  {
    label: "Badges",
    href: "/ambassador/facilitator/badges",
  },
  {
    label: "Analytics",
    href: "/ambassador/facilitator/analytics",
  },
];

export const facilitatorStats = [
  {
    label: "Active Students",
    value: "20",
    detail: "Current Ambassador cohort",
    accent: "blue",
  },
  {
    label: "Current Week",
    value: "12",
    detail: "Of 36 Future Ready™ weeks",
    accent: "gold",
  },
  {
    label: "Attendance",
    value: "94%",
    detail: "Current cohort average",
    accent: "green",
  },
  {
    label: "Pending Reviews",
    value: "7",
    detail: "Reflection and badge approvals",
    accent: "purple",
  },
];

export const facilitatorStudents: FacilitatorStudent[] = [
  {
    id: "student-001",
    name: "Jordan Williams",
    initials: "JW",
    email: "jordan@example.com",
    grade: "5th Year",
    cohort: "Ambassador 2026",
    readinessScore: 88,
    progress: 36,
    attendance: 96,
    attendanceRate: 96,
    badges: 5,
    badgesEarned: 5,
    portfolioStatus: "On Track",
    portfolioProgress: 78,
    reflectionStatus: "Submitted",
    status: "On Track",
  },
  {
    id: "student-002",
    name: "Taylor Brooks",
    initials: "TB",
    email: "taylor@example.com",
    grade: "5th Year",
    cohort: "Ambassador 2026",
    readinessScore: 82,
    progress: 33,
    attendance: 94,
    attendanceRate: 94,
    badges: 4,
    badgesEarned: 4,
    portfolioStatus: "On Track",
    portfolioProgress: 72,
    reflectionStatus: "Approved",
    status: "On Track",
  },
  {
    id: "student-003",
    name: "Morgan Davis",
    initials: "MD",
    email: "morgan@example.com",
    grade: "5th Year",
    cohort: "Ambassador 2026",
    readinessScore: 76,
    progress: 31,
    attendance: 89,
    attendanceRate: 89,
    badges: 3,
    badgesEarned: 3,
    portfolioStatus: "Needs Attention",
    portfolioProgress: 54,
    reflectionStatus: "Needs Revision",
    status: "Needs Attention",
  },
  {
    id: "student-004",
    name: "Cameron Reed",
    initials: "CR",
    email: "cameron@example.com",
    grade: "5th Year",
    cohort: "Ambassador 2026",
    readinessScore: 91,
    progress: 38,
    attendance: 98,
    attendanceRate: 98,
    badges: 6,
    badgesEarned: 6,
    portfolioStatus: "On Track",
    portfolioProgress: 84,
    reflectionStatus: "Submitted",
    status: "Internship Ready",
  },
  {
    id: "student-005",
    name: "Riley Thompson",
    initials: "RT",
    email: "riley@example.com",
    grade: "5th Year",
    cohort: "Ambassador 2026",
    readinessScore: 79,
    progress: 32,
    attendance: 92,
    attendanceRate: 92,
    badges: 4,
    badgesEarned: 4,
    portfolioStatus: "In Progress",
    portfolioProgress: 65,
    reflectionStatus: "Approved",
    status: "On Track",
  },
];

export const attendanceStudents = facilitatorStudents.map(
  (student, index) => ({
    ...student,
    status:
      index === 2
        ? ("Late" as AttendanceStatus)
        : index === 4
          ? ("Absent" as AttendanceStatus)
          : ("Present" as AttendanceStatus),
  }),
);

export const attendanceRecords: AttendanceRecord[] =
  facilitatorStudents.map((student, index) => {
    const status: AttendanceStatus =
      index === 2
        ? "Late"
        : index === 4
          ? "Absent"
          : "Present";

    return {
      id: `attendance-${student.id}`,
      studentId: student.id,
      studentName: student.name,
      name: student.name,
      initials: student.initials,
      email: student.email,
      date: "2026-07-29",
      status,
      note:
        status === "Late"
          ? "Arrived after the session began."
          : status === "Absent"
            ? "Follow-up required."
            : "",
    };
  });

export const reflectionSubmissions: ReflectionSubmission[] = [
  {
    id: "reflection-001",
    studentId: "student-001",
    studentName: "Jordan Williams",
    student: "Jordan Williams",
    week: 12,
    lesson: "Future Ready Skills",
    title: "Week 12 Reflection",
    submitted: "Today",
    submittedAt: "Today",
    submittedDate: "Today",
    prompt: "How did you apply Future Ready skills this week?",
    response: "I learned how adaptability and communication work together when a team is solving a problem.",
    status: "Pending",
    excerpt:
      "I learned how adaptability and communication work together when a team is solving a problem.",
  },
  {
    id: "reflection-002",
    studentId: "student-004",
    studentName: "Cameron Reed",
    student: "Cameron Reed",
    week: 12,
    lesson: "Future Ready Skills",
    title: "Week 12 Reflection",
    submitted: "Yesterday",
    submittedAt: "Yesterday",
    submittedDate: "Yesterday",
    prompt: "What contribution did you make to your team?",
    response: "My strongest contribution was helping the group organize our ideas and decide what to present.",
    status: "Pending",
    excerpt:
      "My strongest contribution was helping the group organize our ideas and decide what to present.",
  },
  {
    id: "reflection-003",
    studentId: "student-003",
    studentName: "Morgan Davis",
    student: "Morgan Davis",
    week: 11,
    lesson: "Adaptability",
    title: "Week 11 Reflection",
    submitted: "Monday",
    submittedAt: "Monday",
    submittedDate: "Monday",
    prompt: "Describe a time you had to adapt.",
    response: "I need to add a clearer example of how I adjusted when our original plan changed.",
    status: "Needs Revision",
    excerpt:
      "I need to add a clearer example of how I adjusted when our original plan changed.",
  },
  {
    id: "reflection-004",
    studentId: "student-002",
    studentName: "Taylor Brooks",
    student: "Taylor Brooks",
    week: 11,
    lesson: "Adaptability",
    title: "Week 11 Reflection",
    submitted: "Last week",
    submittedAt: "Last week",
    submittedDate: "Last week",
    prompt: "How did you respond when the plan changed?",
    response: "I stayed calm, listened to my teammates, and helped create a new plan.",
    status: "Approved",
    excerpt:
      "I stayed calm, listened to my teammates, and helped create a new plan.",
  },
];

export const pendingReflections = reflectionSubmissions;

export const badgeSubmissions: BadgeSubmission[] = [
  {
    id: "badge-001",
    studentId: "student-001",
    studentName: "Jordan Williams",
    student: "Jordan Williams",
    badge: "Professional Communication",
    badgeName: "Professional Communication",
    submitted: "Today",
    submittedAt: "Today",
    submittedDate: "Today",
    status: "Pending",
    evidence:
      "Completed the professional communication activity and uploaded a reflection.",
  },
  {
    id: "badge-002",
    studentId: "student-002",
    studentName: "Taylor Brooks",
    student: "Taylor Brooks",
    badge: "Adaptability",
    badgeName: "Adaptability",
    submitted: "Yesterday",
    submittedAt: "Yesterday",
    submittedDate: "Yesterday",
    status: "Pending",
    evidence:
      "Demonstrated adaptability during the team problem-solving exercise.",
  },
  {
    id: "badge-003",
    studentId: "student-004",
    studentName: "Cameron Reed",
    student: "Cameron Reed",
    badge: "Team Contributor",
    badgeName: "Team Contributor",
    submitted: "Monday",
    submittedAt: "Monday",
    submittedDate: "Monday",
    status: "Pending",
    evidence:
      "Facilitated team roles and helped the group complete its presentation.",
  },
  {
    id: "badge-004",
    studentId: "student-005",
    studentName: "Riley Thompson",
    student: "Riley Thompson",
    badge: "Career Explorer",
    badgeName: "Career Explorer",
    submitted: "Last week",
    submittedAt: "Last week",
    submittedDate: "Last week",
    status: "Approved",
    evidence:
      "Completed the career exploration map and identified three pathways.",
  },
];

export const badgeRequests = badgeSubmissions;

export const todaysAgenda: AgendaItem[] = [
  {
    id: "agenda-001",
    time: "9:00 AM",
    title: "Opening Check-In",
    type: "Student engagement",
  },
  {
    id: "agenda-002",
    time: "9:10 AM",
    title: "Future Ready Skills Workshop",
    type: "Week 12 lesson",
  },
  {
    id: "agenda-003",
    time: "9:40 AM",
    title: "Team Application Activity",
    type: "Collaborative practice",
  },
  {
    id: "agenda-004",
    time: "9:55 AM",
    title: "Reflection and Close",
    type: "Portfolio evidence",
  },
];

export const facilitatorAlerts: FacilitatorAlert[] = [
  {
    id: "alert-001",
    level: "High",
    title: "Morgan needs a reflection revision",
    description:
      "Week 11 evidence needs a more specific example before approval.",
  },
  {
    id: "alert-002",
    level: "Medium",
    title: "Riley was absent",
    description:
      "Confirm the reason for the absence and share the missed activity.",
  },
  {
    id: "alert-003",
    level: "Low",
    title: "Three badges await review",
    description:
      "Professional Communication, Adaptability, and Team Contributor are pending.",
  },
];

export const skillDistribution: SkillDistributionItem[] = [
  {
    skill: "Communication",
    label: "Communication",
    value: 88,
    percentage: 88,
    score: 88,
  },
  {
    skill: "Teamwork",
    label: "Teamwork",
    value: 84,
    percentage: 84,
    score: 84,
  },
  {
    skill: "Problem Solving",
    label: "Problem Solving",
    value: 79,
    percentage: 79,
    score: 79,
  },
  {
    skill: "Adaptability",
    label: "Adaptability",
    value: 81,
    percentage: 81,
    score: 81,
  },
  {
    skill: "Leadership",
    label: "Leadership",
    value: 76,
    percentage: 76,
    score: 76,
  },
];

export const weeklyProgress: WeeklyProgressItem[] = [
  {
    week: "Week 7",
    label: "Week 7",
    progress: 58,
    value: 58,
    completion: 58,
  },
  {
    week: "Week 8",
    label: "Week 8",
    progress: 63,
    value: 63,
    completion: 63,
  },
  {
    week: "Week 9",
    label: "Week 9",
    progress: 69,
    value: 69,
    completion: 69,
  },
  {
    week: "Week 10",
    label: "Week 10",
    progress: 74,
    value: 74,
    completion: 74,
  },
  {
    week: "Week 11",
    label: "Week 11",
    progress: 79,
    value: 79,
    completion: 79,
  },
  {
    week: "Week 12",
    label: "Week 12",
    progress: 84,
    value: 84,
    completion: 84,
  },
];

export const facilitatorAnalytics = {
  readiness: 82,
  attendance: 94,
  lessonCompletion: 84,
  reflectionCompletion: 78,
  portfolioCompletion: 71,
  badgeApproval: 88,
};

export const recentFacilitatorActivity = [
  {
    id: "activity-001",
    title: "Jordan Williams submitted Week 12 Reflection",
    time: "18 minutes ago",
  },
  {
    id: "activity-002",
    title: "Attendance completed",
    time: "Today",
  },
  {
    id: "activity-003",
    title: "Team Contributor badge approved",
    time: "Yesterday",
  },
];
