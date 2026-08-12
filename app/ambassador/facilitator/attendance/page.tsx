export type StudentStatus =
  | "On Track"
  | "Needs Review"
  | "Needs Support"
  | "Inactive";

export type ReviewStatus =
  | "Pending"
  | "Approved"
  | "Revision Requested";

export type AttendanceStatus =
  | "Present"
  | "Late"
  | "Absent"
  | "Excused"
  | "Not Recorded";

export type AlertLevel = "High" | "Medium" | "Low";

export type FacilitatorProfile = {
  id: string;
  name: string;
  firstName: string;
  title: string;
  email: string;
  phone: string;
  organization: string;
  location: string;
  avatarInitials: string;
};

export type Cohort = {
  id: string;
  name: string;
  school: string;
  academicYear: string;
  programName: string;
  meetingDay: string;
  meetingTime: string;
  room: string;
  startDate: string;
  endDate: string;
  studentCount: number;
  facilitatorId: string;
};

export type StudentRecord = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  initials: string;
  grade: number;
  email: string;
  currentPhase:
    | "Discover"
    | "Develop"
    | "Explore"
    | "Connect"
    | "Experience"
    | "Launch";
  overallProgress: number;
  attendanceRate: number;
  lessonsCompleted: number;
  lessonsTotal: number;
  skillsEarned: number;
  skillsTotal: number;
  badgesEarned: number;
  badgesTotal: number;
  portfolioPieces: number;
  reflectionsCompleted: number;
  internshipReadiness: number;
  status: StudentStatus;
  lastActivity: string;
  nextMilestone: string;
  reflectionPending: boolean;
  badgePending: boolean;
  attendanceConcern: boolean;
  portfolioComplete: boolean;
};

export type DashboardStat = {
  id: string;
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: "navy" | "gold" | "green" | "blue" | "orange" | "red";
};

export type AgendaItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  duration: string;
  type:
    | "Lesson"
    | "Activity"
    | "Reflection"
    | "Badge Review"
    | "Announcement";
  completed: boolean;
};

export type FacilitatorAlert = {
  id: string;
  studentId: string;
  studentName: string;
  studentInitials: string;
  level: AlertLevel;
  category:
    | "Attendance"
    | "Reflection"
    | "Badge"
    | "Progress"
    | "Portfolio"
    | "Engagement";
  title: string;
  description: string;
  createdAt: string;
  actionLabel: string;
  href: string;
};

export type BadgeSubmission = {
  id: string;
  studentId: string;
  studentName: string;
  studentInitials: string;
  badgeName: string;
  badgeIcon: string;
  submittedAt: string;
  evidenceTitle: string;
  evidenceType:
    | "Document"
    | "Reflection"
    | "Project"
    | "Presentation"
    | "Facilitator Observation";
  evidenceSummary: string;
  status: ReviewStatus;
  competency: string;
};

export type ReflectionSubmission = {
  id: string;
  studentId: string;
  studentName: string;
  studentInitials: string;
  lessonTitle: string;
  prompt: string;
  excerpt: string;
  submittedAt: string;
  wordCount: number;
  status: ReviewStatus;
  needsResponse: boolean;
};

export type AttendanceRecord = {
  id: string;
  studentId: string;
  studentName: string;
  studentInitials: string;
  date: string;
  status: AttendanceStatus;
  note: string;
};

export type UpcomingEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type:
    | "Employer Visit"
    | "Career Panel"
    | "Field Experience"
    | "Showcase"
    | "Training"
    | "Deadline";
  description: string;
  attendees: number;
};

export type QuickAction = {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  tone: "navy" | "gold" | "green" | "blue";
};

export type AnalyticsSummary = {
  attendanceRate: number;
  averageProgress: number;
  reflectionCompletion: number;
  badgeApprovalRate: number;
  portfolioCompletion: number;
  internshipReadyStudents: number;
  studentsNeedingSupport: number;
  activeStudentsThisWeek: number;
};

export type WeeklyProgressPoint = {
  week: string;
  averageProgress: number;
  attendanceRate: number;
  reflectionCompletion: number;
};

export type SkillDistribution = {
  skill: string;
  studentsDeveloping: number;
  studentsVerified: number;
};

export const facilitatorProfile: FacilitatorProfile = {
  id: "facilitator-coach-jones",
  name: "Coach Marcus Jones",
  firstName: "Marcus",
  title: "Future Ready™ Facilitator",
  email: "marcus.jones@ambassadorchristian.org",
  phone: "(704) 555-0148",
  organization: "Ambassador Christian Academy",
  location: "Huntersville, North Carolina",
  avatarInitials: "MJ",
};

export const activeCohort: Cohort = {
  id: "ambassador-2026-2027",
  name: "Future Ready™ Ambassador Cohort",
  school: "Ambassador Christian Academy",
  academicYear: "2026–2027",
  programName: "Future Ready™ Student Experience",
  meetingDay: "Wednesday",
  meetingTime: "10:15 AM",
  room: "Innovation Lab",
  startDate: "August 19, 2026",
  endDate: "May 12, 2027",
  studentCount: 18,
  facilitatorId: "facilitator-coach-jones",
};

export const facilitatorStudents: StudentRecord[] = [
  {
    id: "ambassador-student-001",
    name: "Avery Johnson",
    firstName: "Avery",
    lastName: "Johnson",
    initials: "AJ",
    grade: 11,
    email: "avery.johnson@student.org",
    currentPhase: "Develop",
    overallProgress: 68,
    attendanceRate: 96,
    lessonsCompleted: 19,
    lessonsTotal: 36,
    skillsEarned: 8,
    skillsTotal: 12,
    badgesEarned: 5,
    badgesTotal: 12,
    portfolioPieces: 8,
    reflectionsCompleted: 13,
    internshipReadiness: 74,
    status: "On Track",
    lastActivity: "Completed Leadership Reflection",
    nextMilestone: "Emerging Leader Badge",
    reflectionPending: true,
    badgePending: true,
    attendanceConcern: false,
    portfolioComplete: false,
  },
  {
    id: "ambassador-student-002",
    name: "Emma Carter",
    firstName: "Emma",
    lastName: "Carter",
    initials: "EC",
    grade: 10,
    email: "emma.carter@student.org",
    currentPhase: "Develop",
    overallProgress: 64,
    attendanceRate: 94,
    lessonsCompleted: 18,
    lessonsTotal: 36,
    skillsEarned: 7,
    skillsTotal: 12,
    badgesEarned: 4,
    badgesTotal: 12,
    portfolioPieces: 7,
    reflectionsCompleted: 12,
    internshipReadiness: 70,
    status: "On Track",
    lastActivity: "Submitted Teamwork Reflection",
    nextMilestone: "Team Builder Badge",
    reflectionPending: true,
    badgePending: false,
    attendanceConcern: false,
    portfolioComplete: false,
  },
  {
    id: "ambassador-student-003",
    name: "Noah Williams",
    firstName: "Noah",
    lastName: "Williams",
    initials: "NW",
    grade: 11,
    email: "noah.williams@student.org",
    currentPhase: "Develop",
    overallProgress: 61,
    attendanceRate: 91,
    lessonsCompleted: 17,
    lessonsTotal: 36,
    skillsEarned: 7,
    skillsTotal: 12,
    badgesEarned: 4,
    badgesTotal: 12,
    portfolioPieces: 6,
    reflectionsCompleted: 10,
    internshipReadiness: 68,
    status: "Needs Review",
    lastActivity: "Submitted Leadership Badge Evidence",
    nextMilestone: "Leadership Badge Approval",
    reflectionPending: false,
    badgePending: true,
    attendanceConcern: false,
    portfolioComplete: false,
  },
  {
    id: "ambassador-student-004",
    name: "Ava Thompson",
    firstName: "Ava",
    lastName: "Thompson",
    initials: "AT",
    grade: 10,
    email: "ava.thompson@student.org",
    currentPhase: "Discover",
    overallProgress: 42,
    attendanceRate: 78,
    lessonsCompleted: 12,
    lessonsTotal: 36,
    skillsEarned: 5,
    skillsTotal: 12,
    badgesEarned: 2,
    badgesTotal: 12,
    portfolioPieces: 4,
    reflectionsCompleted: 7,
    internshipReadiness: 45,
    status: "Needs Support",
    lastActivity: "Viewed Personal Vision Lesson",
    nextMilestone: "Complete Strengths Snapshot",
    reflectionPending: false,
    badgePending: false,
    attendanceConcern: true,
    portfolioComplete: false,
  },
  {
    id: "ambassador-student-005",
    name: "Liam Brooks",
    firstName: "Liam",
    lastName: "Brooks",
    initials: "LB",
    grade: 12,
    email: "liam.brooks@student.org",
    currentPhase: "Explore",
    overallProgress: 79,
    attendanceRate: 98,
    lessonsCompleted: 24,
    lessonsTotal: 36,
    skillsEarned: 10,
    skillsTotal: 12,
    badgesEarned: 7,
    badgesTotal: 12,
    portfolioPieces: 11,
    reflectionsCompleted: 16,
    internshipReadiness: 88,
    status: "On Track",
    lastActivity: "Portfolio Evidence Approved",
    nextMilestone: "Employer Connection",
    reflectionPending: false,
    badgePending: false,
    attendanceConcern: false,
    portfolioComplete: true,
  },
  {
    id: "ambassador-student-006",
    name: "Sophia Mitchell",
    firstName: "Sophia",
    lastName: "Mitchell",
    initials: "SM",
    grade: 11,
    email: "sophia.mitchell@student.org",
    currentPhase: "Explore",
    overallProgress: 73,
    attendanceRate: 95,
    lessonsCompleted: 22,
    lessonsTotal: 36,
    skillsEarned: 9,
    skillsTotal: 12,
    badgesEarned: 6,
    badgesTotal: 12,
    portfolioPieces: 9,
    reflectionsCompleted: 14,
    internshipReadiness: 82,
    status: "On Track",
    lastActivity: "Completed Career Research Map",
    nextMilestone: "Career Explorer Badge",
    reflectionPending: true,
    badgePending: true,
    attendanceConcern: false,
    portfolioComplete: false,
  },
  {
    id: "ambassador-student-007",
    name: "Ethan Davis",
    firstName: "Ethan",
    lastName: "Davis",
    initials: "ED",
    grade: 10,
    email: "ethan.davis@student.org",
    currentPhase: "Develop",
    overallProgress: 56,
    attendanceRate: 89,
    lessonsCompleted: 16,
    lessonsTotal: 36,
    skillsEarned: 6,
    skillsTotal: 12,
    badgesEarned: 3,
    badgesTotal: 12,
    portfolioPieces: 6,
    reflectionsCompleted: 9,
    internshipReadiness: 61,
    status: "Needs Review",
    lastActivity: "Started Problem-Solving Activity",
    nextMilestone: "Problem Solver Badge",
    reflectionPending: true,
    badgePending: false,
    attendanceConcern: false,
    portfolioComplete: false,
  },
  {
    id: "ambassador-student-008",
    name: "Mia Robinson",
    firstName: "Mia",
    lastName: "Robinson",
    initials: "MR",
    grade: 11,
    email: "mia.robinson@student.org",
    currentPhase: "Explore",
    overallProgress: 75,
    attendanceRate: 97,
    lessonsCompleted: 23,
    lessonsTotal: 36,
    skillsEarned: 9,
    skillsTotal: 12,
    badgesEarned: 6,
    badgesTotal: 12,
    portfolioPieces: 10,
    reflectionsCompleted: 15,
    internshipReadiness: 84,
    status: "On Track",
    lastActivity: "Submitted Career Pathway Comparison",
    nextMilestone: "Mentor Introduction",
    reflectionPending: false,
    badgePending: true,
    attendanceConcern: false,
    portfolioComplete: false,
  },
  {
    id: "ambassador-student-009",
    name: "Jackson Lee",
    firstName: "Jackson",
    lastName: "Lee",
    initials: "JL",
    grade: 12,
    email: "jackson.lee@student.org",
    currentPhase: "Connect",
    overallProgress: 83,
    attendanceRate: 96,
    lessonsCompleted: 27,
    lessonsTotal: 36,
    skillsEarned: 10,
    skillsTotal: 12,
    badgesEarned: 8,
    badgesTotal: 12,
    portfolioPieces: 12,
    reflectionsCompleted: 17,
    internshipReadiness: 91,
    status: "On Track",
    lastActivity: "Completed Professional Email Activity",
    nextMilestone: "Employer Interview Practice",
    reflectionPending: false,
    badgePending: false,
    attendanceConcern: false,
    portfolioComplete: true,
  },
  {
    id: "ambassador-student-010",
    name: "Olivia Harris",
    firstName: "Olivia",
    lastName: "Harris",
    initials: "OH",
    grade: 10,
    email: "olivia.harris@student.org",
    currentPhase: "Develop",
    overallProgress: 59,
    attendanceRate: 92,
    lessonsCompleted: 17,
    lessonsTotal: 36,
    skillsEarned: 7,
    skillsTotal: 12,
    badgesEarned: 4,
    badgesTotal: 12,
    portfolioPieces: 7,
    reflectionsCompleted: 11,
    internshipReadiness: 65,
    status: "On Track",
    lastActivity: "Completed Adaptability Scenario",
    nextMilestone: "Adaptability Badge",
    reflectionPending: true,
    badgePending: false,
    attendanceConcern: false,
    portfolioComplete: false,
  },
  {
    id: "ambassador-student-011",
    name: "Caleb Martin",
    firstName: "Caleb",
    lastName: "Martin",
    initials: "CM",
    grade: 11,
    email: "caleb.martin@student.org",
    currentPhase: "Discover",
    overallProgress: 38,
    attendanceRate: 81,
    lessonsCompleted: 11,
    lessonsTotal: 36,
    skillsEarned: 4,
    skillsTotal: 12,
    badgesEarned: 2,
    badgesTotal: 12,
    portfolioPieces: 3,
    reflectionsCompleted: 6,
    internshipReadiness: 42,
    status: "Needs Support",
    lastActivity: "Last active five days ago",
    nextMilestone: "Complete Personal Vision",
    reflectionPending: false,
    badgePending: false,
    attendanceConcern: true,
    portfolioComplete: false,
  },
  {
    id: "ambassador-student-012",
    name: "Harper Wilson",
    firstName: "Harper",
    lastName: "Wilson",
    initials: "HW",
    grade: 11,
    email: "harper.wilson@student.org",
    currentPhase: "Explore",
    overallProgress: 71,
    attendanceRate: 95,
    lessonsCompleted: 22,
    lessonsTotal: 36,
    skillsEarned: 9,
    skillsTotal: 12,
    badgesEarned: 6,
    badgesTotal: 12,
    portfolioPieces: 9,
    reflectionsCompleted: 14,
    internshipReadiness: 80,
    status: "On Track",
    lastActivity: "Completed Education Pathway Research",
    nextMilestone: "Career Exploration Map",
    reflectionPending: false,
    badgePending: true,
    attendanceConcern: false,
    portfolioComplete: false,
  },
  {
    id: "ambassador-student-013",
    name: "Lucas Anderson",
    firstName: "Lucas",
    lastName: "Anderson",
    initials: "LA",
    grade: 10,
    email: "lucas.anderson@student.org",
    currentPhase: "Develop",
    overallProgress: 52,
    attendanceRate: 88,
    lessonsCompleted: 15,
    lessonsTotal: 36,
    skillsEarned: 6,
    skillsTotal: 12,
    badgesEarned: 3,
    badgesTotal: 12,
    portfolioPieces: 5,
    reflectionsCompleted: 9,
    internshipReadiness: 58,
    status: "Needs Review",
    lastActivity: "Submitted Team Challenge Reflection",
    nextMilestone: "Team Builder Badge",
    reflectionPending: true,
    badgePending: false,
    attendanceConcern: false,
    portfolioComplete: false,
  },
  {
    id: "ambassador-student-014",
    name: "Charlotte Young",
    firstName: "Charlotte",
    lastName: "Young",
    initials: "CY",
    grade: 12,
    email: "charlotte.young@student.org",
    currentPhase: "Connect",
    overallProgress: 86,
    attendanceRate: 99,
    lessonsCompleted: 28,
    lessonsTotal: 36,
    skillsEarned: 11,
    skillsTotal: 12,
    badgesEarned: 9,
    badgesTotal: 12,
    portfolioPieces: 13,
    reflectionsCompleted: 18,
    internshipReadiness: 93,
    status: "On Track",
    lastActivity: "Completed Mentor Meeting Reflection",
    nextMilestone: "Internship Readiness Review",
    reflectionPending: false,
    badgePending: true,
    attendanceConcern: false,
    portfolioComplete: true,
  },
  {
    id: "ambassador-student-015",
    name: "Mason King",
    firstName: "Mason",
    lastName: "King",
    initials: "MK",
    grade: 11,
    email: "mason.king@student.org",
    currentPhase: "Develop",
    overallProgress: 62,
    attendanceRate: 93,
    lessonsCompleted: 18,
    lessonsTotal: 36,
    skillsEarned: 7,
    skillsTotal: 12,
    badgesEarned: 4,
    badgesTotal: 12,
    portfolioPieces: 7,
    reflectionsCompleted: 11,
    internshipReadiness: 67,
    status: "On Track",
    lastActivity: "Completed Reliability Check-In",
    nextMilestone: "Professional Habits Badge",
    reflectionPending: false,
    badgePending: false,
    attendanceConcern: false,
    portfolioComplete: false,
  },
  {
    id: "ambassador-student-016",
    name: "Isabella Wright",
    firstName: "Isabella",
    lastName: "Wright",
    initials: "IW",
    grade: 10,
    email: "isabella.wright@student.org",
    currentPhase: "Explore",
    overallProgress: 69,
    attendanceRate: 94,
    lessonsCompleted: 21,
    lessonsTotal: 36,
    skillsEarned: 8,
    skillsTotal: 12,
    badgesEarned: 5,
    badgesTotal: 12,
    portfolioPieces: 8,
    reflectionsCompleted: 13,
    internshipReadiness: 76,
    status: "On Track",
    lastActivity: "Added Career Research Evidence",
    nextMilestone: "Career Explorer Badge",
    reflectionPending: true,
    badgePending: false,
    attendanceConcern: false,
    portfolioComplete: false,
  },
  {
    id: "ambassador-student-017",
    name: "James Scott",
    firstName: "James",
    lastName: "Scott",
    initials: "JS",
    grade: 12,
    email: "james.scott@student.org",
    currentPhase: "Experience",
    overallProgress: 89,
    attendanceRate: 97,
    lessonsCompleted: 31,
    lessonsTotal: 36,
    skillsEarned: 11,
    skillsTotal: 12,
    badgesEarned: 10,
    badgesTotal: 12,
    portfolioPieces: 14,
    reflectionsCompleted: 20,
    internshipReadiness: 96,
    status: "On Track",
    lastActivity: "Completed Employer Visit Reflection",
    nextMilestone: "Capstone Portfolio",
    reflectionPending: true,
    badgePending: false,
    attendanceConcern: false,
    portfolioComplete: true,
  },
  {
    id: "ambassador-student-018",
    name: "Grace Green",
    firstName: "Grace",
    lastName: "Green",
    initials: "GG",
    grade: 11,
    email: "grace.green@student.org",
    currentPhase: "Develop",
    overallProgress: 57,
    attendanceRate: 90,
    lessonsCompleted: 16,
    lessonsTotal: 36,
    skillsEarned: 6,
    skillsTotal: 12,
    badgesEarned: 3,
    badgesTotal: 12,
    portfolioPieces: 6,
    reflectionsCompleted: 10,
    internshipReadiness: 63,
    status: "Needs Review",
    lastActivity: "Submitted Communication Reflection",
    nextMilestone: "Effective Communicator Badge",
    reflectionPending: true,
    badgePending: true,
    attendanceConcern: false,
    portfolioComplete: false,
  },
];

export const analyticsSummary: AnalyticsSummary = {
  attendanceRate: 93,
  averageProgress: 65,
  reflectionCompletion: 82,
  badgeApprovalRate: 78,
  portfolioCompletion: 61,
  internshipReadyStudents: 7,
  studentsNeedingSupport: 3,
  activeStudentsThisWeek: 16,
};

export const dashboardStats: DashboardStat[] = [
  {
    id: "students",
    label: "Active Students",
    value: "18",
    detail: "16 active this week",
    icon: "👥",
    tone: "navy",
  },
  {
    id: "attendance",
    label: "Attendance",
    value: "93%",
    detail: "Up 2% this month",
    icon: "✓",
    tone: "green",
  },
  {
    id: "progress",
    label: "Average Progress",
    value: "65%",
    detail: "Cohort completion",
    icon: "📈",
    tone: "blue",
  },
  {
    id: "internship",
    label: "Internship Ready",
    value: "7",
    detail: "4 nearly ready",
    icon: "💼",
    tone: "gold",
  },
  {
    id: "reviews",
    label: "Pending Reviews",
    value: "12",
    detail: "Badges and reflections",
    icon: "📋",
    tone: "orange",
  },
  {
    id: "support",
    label: "Needs Attention",
    value: "3",
    detail: "Student support alerts",
    icon: "!",
    tone: "red",
  },
];

export const todaysAgenda: AgendaItem[] = [
  {
    id: "agenda-001",
    title: "Opening Check-In",
    description:
      "Welcome students, review the weekly goal, and complete a brief confidence check.",
    time: "10:15 AM",
    duration: "5 minutes",
    type: "Announcement",
    completed: true,
  },
  {
    id: "agenda-002",
    title: "Leadership in Action",
    description:
      "Facilitate the leadership lesson and introduce situational leadership examples.",
    time: "10:20 AM",
    duration: "15 minutes",
    type: "Lesson",
    completed: false,
  },
  {
    id: "agenda-003",
    title: "Team Decision Challenge",
    description:
      "Students work in teams to solve a workplace scenario and assign leadership roles.",
    time: "10:35 AM",
    duration: "18 minutes",
    type: "Activity",
    completed: false,
  },
  {
    id: "agenda-004",
    title: "Leadership Reflection",
    description:
      "Students document how they contributed, listened, adapted, and supported the team.",
    time: "10:53 AM",
    duration: "8 minutes",
    type: "Reflection",
    completed: false,
  },
  {
    id: "agenda-005",
    title: "Badge Evidence Reminder",
    description:
      "Review the requirements for the Emerging Leader badge before dismissal.",
    time: "11:01 AM",
    duration: "4 minutes",
    type: "Badge Review",
    completed: false,
  },
];

export const facilitatorAlerts: FacilitatorAlert[] = [
  {
    id: "alert-001",
    studentId: "ambassador-student-004",
    studentName: "Ava Thompson",
    studentInitials: "AT",
    level: "High",
    category: "Attendance",
    title: "Attendance concern",
    description:
      "Ava has missed two recent sessions and her attendance rate has fallen to 78%.",
    createdAt: "Today",
    actionLabel: "Review attendance",
    href: "/ambassador/facilitator/attendance",
  },
  {
    id: "alert-002",
    studentId: "ambassador-student-011",
    studentName: "Caleb Martin",
    studentInitials: "CM",
    level: "High",
    category: "Engagement",
    title: "No recent activity",
    description:
      "Caleb has not completed an activity or reflection in the past five days.",
    createdAt: "Today",
    actionLabel: "View student",
    href: "/ambassador/facilitator/students",
  },
  {
    id: "alert-003",
    studentId: "ambassador-student-003",
    studentName: "Noah Williams",
    studentInitials: "NW",
    level: "Medium",
    category: "Badge",
    title: "Badge evidence waiting",
    description:
      "Noah submitted leadership evidence and is waiting for facilitator review.",
    createdAt: "Yesterday",
    actionLabel: "Review badge",
    href: "/ambassador/facilitator/badges",
  },
  {
    id: "alert-004",
    studentId: "ambassador-student-002",
    studentName: "Emma Carter",
    studentInitials: "EC",
    level: "Medium",
    category: "Reflection",
    title: "Reflection needs feedback",
    description:
      "Emma submitted a teamwork reflection and requested facilitator feedback.",
    createdAt: "Yesterday",
    actionLabel: "Review reflection",
    href: "/ambassador/facilitator/reflections",
  },
  {
    id: "alert-005",
    studentId: "ambassador-student-007",
    studentName: "Ethan Davis",
    studentInitials: "ED",
    level: "Low",
    category: "Progress",
    title: "Milestone behind schedule",
    description:
      "Ethan is one lesson behind the expected cohort pace.",
    createdAt: "2 days ago",
    actionLabel: "View progress",
    href: "/ambassador/facilitator/students",
  },
];

export const badgeSubmissions: BadgeSubmission[] = [
  {
    id: "badge-submission-001",
    studentId: "ambassador-student-003",
    studentName: "Noah Williams",
    studentInitials: "NW",
    badgeName: "Emerging Leader",
    badgeIcon: "⭐",
    submittedAt: "Today at 8:42 AM",
    evidenceTitle: "Team Leadership Challenge",
    evidenceType: "Project",
    evidenceSummary:
      "Noah led the team through a workplace scenario, assigned responsibilities, and documented how he adjusted the plan after receiving feedback.",
    status: "Pending",
    competency: "Leadership",
  },
  {
    id: "badge-submission-002",
    studentId: "ambassador-student-001",
    studentName: "Avery Johnson",
    studentInitials: "AJ",
    badgeName: "Emerging Leader",
    badgeIcon: "⭐",
    submittedAt: "Yesterday at 3:18 PM",
    evidenceTitle: "Leadership Reflection and Action Plan",
    evidenceType: "Reflection",
    evidenceSummary:
      "Avery identified a leadership strength, a growth area, and three actions for supporting future teams.",
    status: "Pending",
    competency: "Leadership",
  },
  {
    id: "badge-submission-003",
    studentId: "ambassador-student-006",
    studentName: "Sophia Mitchell",
    studentInitials: "SM",
    badgeName: "Career Explorer",
    badgeIcon: "🧭",
    submittedAt: "Yesterday at 1:07 PM",
    evidenceTitle: "Career Exploration Map",
    evidenceType: "Document",
    evidenceSummary:
      "Sophia compared three healthcare careers, including education requirements, salary ranges, workplace settings, and advancement pathways.",
    status: "Pending",
    competency: "Career Awareness",
  },
  {
    id: "badge-submission-004",
    studentId: "ambassador-student-008",
    studentName: "Mia Robinson",
    studentInitials: "MR",
    badgeName: "Professional Presence",
    badgeIcon: "💼",
    submittedAt: "2 days ago",
    evidenceTitle: "Professional Introduction Video",
    evidenceType: "Presentation",
    evidenceSummary:
      "Mia recorded a 60-second professional introduction explaining her strengths, interests, experience, and career direction.",
    status: "Pending",
    competency: "Professional Presence",
  },
  {
    id: "badge-submission-005",
    studentId: "ambassador-student-012",
    studentName: "Harper Wilson",
    studentInitials: "HW",
    badgeName: "Career Explorer",
    badgeIcon: "🧭",
    submittedAt: "2 days ago",
    evidenceTitle: "Education Pathway Comparison",
    evidenceType: "Document",
    evidenceSummary:
      "Harper compared a four-year degree, community college program, and apprenticeship pathway connected to advanced manufacturing.",
    status: "Pending",
    competency: "Career Awareness",
  },
  {
    id: "badge-submission-006",
    studentId: "ambassador-student-014",
    studentName: "Charlotte Young",
    studentInitials: "CY",
    badgeName: "Internship Ready",
    badgeIcon: "🚀",
    submittedAt: "3 days ago",
    evidenceTitle: "Internship Readiness Portfolio",
    evidenceType: "Project",
    evidenceSummary:
      "Charlotte submitted her résumé, professional introduction, employer research, workplace expectations reflection, and interview preparation notes.",
    status: "Pending",
    competency: "Workplace Readiness",
  },
  {
    id: "badge-submission-007",
    studentId: "ambassador-student-018",
    studentName: "Grace Green",
    studentInitials: "GG",
    badgeName: "Effective Communicator",
    badgeIcon: "💬",
    submittedAt: "3 days ago",
    evidenceTitle: "Communication Scenario Response",
    evidenceType: "Reflection",
    evidenceSummary:
      "Grace described how she would clarify expectations, listen actively, and respond professionally during a workplace misunderstanding.",
    status: "Pending",
    competency: "Communication",
  },
];

export const reflectionSubmissions: ReflectionSubmission[] = [
  {
    id: "reflection-001",
    studentId: "ambassador-student-002",
    studentName: "Emma Carter",
    studentInitials: "EC",
    lessonTitle: "Collaboration and Teamwork",
    prompt:
      "Describe one action you took that helped your team work more effectively.",
    excerpt:
      "I noticed that two people had different ideas and the group was starting to stop listening. I summarized both ideas and asked what parts could work together. That helped us create one plan instead of choosing sides.",
    submittedAt: "Today at 9:02 AM",
    wordCount: 184,
    status: "Pending",
    needsResponse: true,
  },
  {
    id: "reflection-002",
    studentId: "ambassador-student-001",
    studentName: "Avery Johnson",
    studentInitials: "AJ",
    lessonTitle: "Leadership in Action",
    prompt:
      "What leadership behavior did you practice, and what would you improve next time?",
    excerpt:
      "I practiced making sure everyone had a role and understood the goal. Next time I would ask more questions before deciding what the group should do because I moved too quickly at first.",
    submittedAt: "Yesterday at 4:21 PM",
    wordCount: 201,
    status: "Pending",
    needsResponse: true,
  },
  {
    id: "reflection-003",
    studentId: "ambassador-student-007",
    studentName: "Ethan Davis",
    studentInitials: "ED",
    lessonTitle: "Problem Solving",
    prompt:
      "Explain how you approached the challenge and what changed after receiving new information.",
    excerpt:
      "Our first solution was based on assumptions. When we received the customer feedback, I realized we needed to identify the actual cause of the problem before choosing a solution.",
    submittedAt: "Yesterday at 2:48 PM",
    wordCount: 156,
    status: "Pending",
    needsResponse: false,
  },
  {
    id: "reflection-004",
    studentId: "ambassador-student-010",
    studentName: "Olivia Harris",
    studentInitials: "OH",
    lessonTitle: "Adaptability in a Changing World",
    prompt:
      "Describe a time when you had to adjust your approach.",
    excerpt:
      "During the activity, our original plan was no longer possible because the time was shortened. I helped the team decide what was essential and what could be removed.",
    submittedAt: "2 days ago",
    wordCount: 173,
    status: "Pending",
    needsResponse: false,
  },
  {
    id: "reflection-005",
    studentId: "ambassador-student-013",
    studentName: "Lucas Anderson",
    studentInitials: "LA",
    lessonTitle: "Team Decision Challenge",
    prompt:
      "How did your communication affect the outcome of the team challenge?",
    excerpt:
      "I shared my opinion but did not explain my reasoning clearly. The team understood me better after I gave an example and connected it to the goal.",
    submittedAt: "2 days ago",
    wordCount: 142,
    status: "Pending",
    needsResponse: true,
  },
  {
    id: "reflection-006",
    studentId: "ambassador-student-016",
    studentName: "Isabella Wright",
    studentInitials: "IW",
    lessonTitle: "Career Discovery",
    prompt:
      "What did you learn about the relationship between your strengths and possible careers?",
    excerpt:
      "I learned that my ability to organize information and explain ideas connects to more careers than I expected, including project management, training, and communications.",
    submittedAt: "3 days ago",
    wordCount: 211,
    status: "Pending",
    needsResponse: false,
  },
  {
    id: "reflection-007",
    studentId: "ambassador-student-017",
    studentName: "James Scott",
    studentInitials: "JS",
    lessonTitle: "Employer Experience",
    prompt:
      "What workplace behavior did you observe that you want to practice?",
    excerpt:
      "The employees communicated clearly about deadlines and asked questions early instead of waiting until a problem became urgent. I want to practice doing the same.",
    submittedAt: "3 days ago",
    wordCount: 232,
    status: "Pending",
    needsResponse: true,
  },
];

export const attendanceRecords: AttendanceRecord[] =
  facilitatorStudents.map((student, index) => {
    let status: AttendanceStatus = "Present";
    let note = "";

    if (student.id === "ambassador-student-004") {
      status = "Absent";
      note = "Family notification pending.";
    }

    if (student.id === "ambassador-student-011") {
      status = "Late";
      note = "Arrived 12 minutes late.";
    }

    if (student.id === "ambassador-student-007") {
      status = "Excused";
      note = "School activity conflict.";
    }

    return {
      id: `attendance-${String(index + 1).padStart(3, "0")}`,
      studentId: student.id,
      studentName: student.name,
      studentInitials: student.initials,
      date: "August 26, 2026",
      status,
      note,
    };
  });

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: "event-001",
    title: "Healthcare Career Panel",
    date: "September 9, 2026",
    time: "10:15 AM–11:05 AM",
    location: "Ambassador Christian Academy",
    type: "Career Panel",
    description:
      "Local healthcare professionals will discuss career pathways, workplace expectations, and emerging opportunities.",
    attendees: 18,
  },
  {
    id: "event-002",
    title: "MSC Industrial Supply Employer Visit",
    date: "September 23, 2026",
    time: "9:30 AM–12:00 PM",
    location: "MSC Industrial Supply",
    type: "Employer Visit",
    description:
      "Students will tour the workplace, meet employees, and explore careers in manufacturing, technology, operations, and sales.",
    attendees: 18,
  },
  {
    id: "event-003",
    title: "Career Exploration Map Deadline",
    date: "October 2, 2026",
    time: "11:59 PM",
    location: "Future Ready™ Platform",
    type: "Deadline",
    description:
      "Students must submit their completed Career Exploration Map for facilitator review.",
    attendees: 18,
  },
  {
    id: "event-004",
    title: "Professional Networking Lab",
    date: "October 14, 2026",
    time: "10:15 AM–11:05 AM",
    location: "Innovation Lab",
    type: "Training",
    description:
      "Students will practice professional introductions, conversation skills, follow-up communication, and relationship building.",
    attendees: 18,
  },
  {
    id: "event-005",
    title: "Community Career Experience",
    date: "November 6, 2026",
    time: "9:00 AM–1:00 PM",
    location: "Lake Norman Region",
    type: "Field Experience",
    description:
      "Students will rotate through local employer and community partner experiences.",
    attendees: 18,
  },
  {
    id: "event-006",
    title: "Future Ready™ Portfolio Showcase",
    date: "May 12, 2027",
    time: "6:00 PM–8:00 PM",
    location: "Ambassador Christian Academy",
    type: "Showcase",
    description:
      "Students will present their portfolios, verified skills, career direction, and next-step action plans.",
    attendees: 120,
  },
];

export const quickActions: QuickAction[] = [
  {
    id: "quick-attendance",
    title: "Take Attendance",
    description: "Record today’s attendance for the active cohort.",
    icon: "✓",
    href: "/ambassador/facilitator/attendance",
    tone: "green",
  },
  {
    id: "quick-reflections",
    title: "Review Reflections",
    description: "Read student reflections and leave feedback.",
    icon: "✍️",
    href: "/ambassador/facilitator/reflections",
    tone: "blue",
  },
  {
    id: "quick-badges",
    title: "Approve Badges",
    description: "Review evidence and approve earned credentials.",
    icon: "🏅",
    href: "/ambassador/facilitator/badges",
    tone: "gold",
  },
  {
    id: "quick-students",
    title: "View Students",
    description: "Open the complete cohort roster and progress records.",
    icon: "👥",
    href: "/ambassador/facilitator/students",
    tone: "navy",
  },
  {
    id: "quick-analytics",
    title: "View Analytics",
    description: "Review progress, attendance, engagement, and readiness.",
    icon: "📊",
    href: "/ambassador/facilitator/analytics",
    tone: "blue",
  },
  {
    id: "quick-report",
    title: "Export Progress Report",
    description: "Prepare a cohort progress summary for school leaders.",
    icon: "📄",
    href: "/ambassador/facilitator/analytics",
    tone: "navy",
  },
];

export const weeklyProgress: WeeklyProgressPoint[] = [
  {
    week: "Week 1",
    averageProgress: 42,
    attendanceRate: 91,
    reflectionCompletion: 68,
  },
  {
    week: "Week 2",
    averageProgress: 47,
    attendanceRate: 92,
    reflectionCompletion: 71,
  },
  {
    week: "Week 3",
    averageProgress: 52,
    attendanceRate: 90,
    reflectionCompletion: 75,
  },
  {
    week: "Week 4",
    averageProgress: 57,
    attendanceRate: 94,
    reflectionCompletion: 77,
  },
  {
    week: "Week 5",
    averageProgress: 61,
    attendanceRate: 93,
    reflectionCompletion: 80,
  },
  {
    week: "Week 6",
    averageProgress: 65,
    attendanceRate: 93,
    reflectionCompletion: 82,
  },
];

export const skillDistribution: SkillDistribution[] = [
  {
    skill: "Communication",
    studentsDeveloping: 18,
    studentsVerified: 14,
  },
  {
    skill: "Teamwork",
    studentsDeveloping: 18,
    studentsVerified: 12,
  },
  {
    skill: "Leadership",
    studentsDeveloping: 16,
    studentsVerified: 8,
  },
  {
    skill: "Problem Solving",
    studentsDeveloping: 15,
    studentsVerified: 9,
  },
  {
    skill: "Adaptability",
    studentsDeveloping: 14,
    studentsVerified: 8,
  },
  {
    skill: "Reliability",
    studentsDeveloping: 18,
    studentsVerified: 13,
  },
  {
    skill: "Career Awareness",
    studentsDeveloping: 12,
    studentsVerified: 7,
  },
  {
    skill: "Professional Presence",
    studentsDeveloping: 9,
    studentsVerified: 5,
  },
];

export const pendingBadgeCount = badgeSubmissions.filter(
  (submission) => submission.status === "Pending"
).length;

export const pendingReflectionCount = reflectionSubmissions.filter(
  (submission) => submission.status === "Pending"
).length;

export const studentsNeedingAttention =
  facilitatorStudents.filter(
    (student) =>
      student.status === "Needs Support" ||
      student.status === "Needs Review"
  );

export const internshipReadyStudents =
  facilitatorStudents.filter(
    (student) => student.internshipReadiness >= 80
  );

export const portfolioCompleteStudents =
  facilitatorStudents.filter(
    (student) => student.portfolioComplete
  );
export default function FacilitatorAttendancePage() {
return (
<main style={{ padding: "32px" }}>
<h1>Future Ready™ Attendance</h1>
<p>Facilitator attendance management.</p>
</main>
);
}
