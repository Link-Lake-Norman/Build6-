export type FacilitatorNavigationItem = {
  label: string;
  href: string;
};

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
  badges: number;
  portfolioStatus: "On Track" | "In Progress" | "Needs Attention";
  reflectionStatus:
    | "Approved"
    | "Submitted"
    | "Needs Revision"
    | "Not Submitted";
};

export type AttendanceStatus =
  | "PRESENT"
  | "LATE"
  | "ABSENT"
  | "EXCUSED";

export const facilitatorProfile = {
  name: "Coach Jones",
  role: "Lead Facilitator",
  initials: "CJ",
  organization: "Ambassador Christian School",
  cohort: "5th Year Student Athletes",
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
    detail: "Reflections and badge evidence",
    accent: "purple",
  },
];

export const facilitatorCohorts = [
  {
    id: "ambassador-2026",
    name: "5th Year Student Athletes",
    organization: "Ambassador Christian School",
    program: "Launch Ready™",
    status: "ACTIVE",
    students: 20,
    capacity: 20,
    currentWeek: 12,
    totalWeeks: 36,
    progress: 33,
    nextLesson: "Future Ready Skills",
    nextLessonHref: "/ambassador/curriculum/12",
    meetingTime: "Friday · 10:00 AM",
    facilitator: "Coach Jones",
  },
];

export const facilitatorStudents: FacilitatorStudent[] = [
  {
    id: "ambassador-student-001",
    name: "Jordan Williams",
    initials: "JW",
    email: "jordan.williams@example.com",
    grade: "5th Year",
    cohort: "5th Year Student Athletes",
    readinessScore: 88,
    progress: 36,
    attendance: 96,
    badges: 5,
    portfolioStatus: "On Track",
    reflectionStatus: "Submitted",
  },
  {
    id: "ambassador-student-002",
    name: "Taylor Brooks",
    initials: "TB",
    email: "taylor.brooks@example.com",
    grade: "5th Year",
    cohort: "5th Year Student Athletes",
    readinessScore: 82,
    progress: 33,
    attendance: 94,
    badges: 4,
    portfolioStatus: "On Track",
    reflectionStatus: "Approved",
  },
  {
    id: "ambassador-student-003",
    name: "Morgan Davis",
    initials: "MD",
    email: "morgan.davis@example.com",
    grade: "5th Year",
    cohort: "5th Year Student Athletes",
    readinessScore: 76,
    progress: 31,
    attendance: 89,
    badges: 3,
    portfolioStatus: "Needs Attention",
    reflectionStatus: "Needs Revision",
  },
  {
    id: "ambassador-student-004",
    name: "Cameron Reed",
    initials: "CR",
    email: "cameron.reed@example.com",
    grade: "5th Year",
    cohort: "5th Year Student Athletes",
    readinessScore: 91,
    progress: 38,
    attendance: 98,
    badges: 6,
    portfolioStatus: "On Track",
    reflectionStatus: "Submitted",
  },
  {
    id: "ambassador-student-005",
    name: "Riley Thompson",
    initials: "RT",
    email: "riley.thompson@example.com",
    grade: "5th Year",
    cohort: "5th Year Student Athletes",
    readinessScore: 79,
    progress: 32,
    attendance: 92,
    badges: 4,
    portfolioStatus: "In Progress",
    reflectionStatus: "Approved",
  },
  {
    id: "ambassador-student-006",
    name: "Alex Johnson",
    initials: "AJ",
    email: "alex.johnson@example.com",
    grade: "5th Year",
    cohort: "5th Year Student Athletes",
    readinessScore: 73,
    progress: 28,
    attendance: 86,
    badges: 2,
    portfolioStatus: "Needs Attention",
    reflectionStatus: "Not Submitted",
  },
  {
    id: "ambassador-student-007",
    name: "Avery Mitchell",
    initials: "AM",
    email: "avery.mitchell@example.com",
    grade: "5th Year",
    cohort: "5th Year Student Athletes",
    readinessScore: 84,
    progress: 34,
    attendance: 95,
    badges: 5,
    portfolioStatus: "On Track",
    reflectionStatus: "Approved",
  },
  {
    id: "ambassador-student-008",
    name: "Parker Lewis",
    initials: "PL",
    email: "parker.lewis@example.com",
    grade: "5th Year",
    cohort: "5th Year Student Athletes",
    readinessScore: 78,
    progress: 30,
    attendance: 91,
    badges: 3,
    portfolioStatus: "In Progress",
    reflectionStatus: "Submitted",
  },
];

export const attendanceStudents = facilitatorStudents.map(
  (student, index) => ({
    ...student,
    status: (
      index === 2
        ? "LATE"
        : index === 5
          ? "ABSENT"
          : index === 7
            ? "EXCUSED"
            : "PRESENT"
    ) as AttendanceStatus,
    note:
      index === 2
        ? "Arrived after class began."
        : index === 5
          ? "Follow-up required."
          : index === 7
            ? "Approved school activity."
            : "",
  }),
);

export const pendingReflections = [
  {
    id: "reflection-001",
    studentId: "ambassador-student-001",
    studentName: "Jordan Williams",
    week: 12,
    lesson: "Future Ready Skills",
    prompt:
      "Which Future Ready skill will be most important in your next opportunity, and why?",
    response:
      "Adaptability will matter most because every workplace changes. I want to become better at learning new systems, asking questions, and staying calm when expectations shift.",
    status: "SUBMITTED",
    submitted: "Today · 9:18 AM",
  },
  {
    id: "reflection-002",
    studentId: "ambassador-student-004",
    studentName: "Cameron Reed",
    week: 12,
    lesson: "Future Ready Skills",
    prompt:
      "Which Future Ready skill will be most important in your next opportunity, and why?",
    response:
      "Communication is the skill I need to strengthen. I can contribute more when I clearly explain my ideas and listen before responding.",
    status: "SUBMITTED",
    submitted: "Yesterday · 4:42 PM",
  },
  {
    id: "reflection-003",
    studentId: "ambassador-student-003",
    studentName: "Morgan Davis",
    week: 11,
    lesson: "Adaptability",
    prompt:
      "Describe a time when you adjusted your approach after receiving new information.",
    response:
      "During a team project, I changed my section after the group decided to use a different presentation format.",
    status: "NEEDS_REVISION",
    submitted: "Monday · 2:11 PM",
  },
];

export const badgeRequests = [
  {
    id: "badge-request-001",
    studentId: "ambassador-student-001",
    studentName: "Jordan Williams",
    badge: "Professional Communication",
    evidence:
      "Completed the communication role-play, demonstrated active listening, and submitted the required reflection.",
    criteria: [
      "Uses professional verbal communication",
      "Demonstrates active listening",
      "Responds appropriately to feedback",
    ],
    status: "Pending",
    submitted: "Today",
  },
  {
    id: "badge-request-002",
    studentId: "ambassador-student-004",
    studentName: "Cameron Reed",
    badge: "Team Contributor",
    evidence:
      "Led team planning, delegated responsibilities, and supported peer participation during the workplace challenge.",
    criteria: [
      "Contributes consistently",
      "Supports team accountability",
      "Demonstrates collaborative leadership",
    ],
    status: "Pending",
    submitted: "Yesterday",
  },
  {
    id: "badge-request-003",
    studentId: "ambassador-student-002",
    studentName: "Taylor Brooks",
    badge: "Adaptability",
    evidence:
      "Adjusted the team plan during a workplace scenario and documented the reason for the change.",
    criteria: [
      "Responds constructively to change",
      "Revises an approach when needed",
      "Maintains focus under pressure",
    ],
    status: "Pending",
    submitted: "Monday",
  },
];

export const recentFacilitatorActivity = [
  {
    title: "Jordan Williams submitted a reflection",
    detail: "Week 12 · Future Ready Skills",
    time: "18 minutes ago",
  },
  {
    title: "Cameron Reed completed Week 12",
    detail: "Lesson progress updated",
    time: "1 hour ago",
  },
  {
    title: "Taylor Brooks earned the Team Contributor badge",
    detail: "Badge added to student passport",
    time: "Yesterday",
  },
  {
    title: "Attendance was recorded",
    detail: "Ambassador Christian School cohort",
    time: "Yesterday",
  },
];

export const facilitatorAnalytics = {
  readiness: 82,
  attendance: 94,
  lessonCompletion: 84,
  reflectionCompletion: 78,
  portfolioCompletion: 71,
  badgeApproval: 88,
  monthlyGrowth: [
    { month: "Aug", score: 58 },
    { month: "Sep", score: 64 },
    { month: "Oct", score: 70 },
    { month: "Nov", score: 75 },
    { month: "Dec", score: 82 },
  ],
  skillGrowth: [
    { skill: "Communication", score: 86 },
    { skill: "Teamwork", score: 83 },
    { skill: "Leadership", score: 76 },
    { skill: "Problem Solving", score: 79 },
    { skill: "Adaptability", score: 81 },
    { skill: "Professionalism", score: 88 },
  ],
};