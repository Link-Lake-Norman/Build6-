export const ambassadorStudents = [
  {
    id: "ambassador-student-001",
    name: "Student 1",
    grade: "5th Year",
    organization: "ambassador-christian-school",
    cohort: "ambassador-2026",
    readinessScore: 84,
    currentWeek: 1,
    internshipReady: false,
    status: "active",
  },
  {
    id: "ambassador-student-002",
    name: "Student 2",
    grade: "5th Year",
    organization: "ambassador-christian-school",
    cohort: "ambassador-2026",
    readinessScore: 82,
    currentWeek: 1,
    internshipReady: false,
    status: "active",
  },

  ...Array.from({ length: 18 }, (_, index) => ({
    id: `ambassador-student-${String(index + 3).padStart(3, "0")}`,
    name: `Student ${index + 3}`,
    grade: "5th Year",
    organization: "ambassador-christian-school",
    cohort: "ambassador-2026",
    readinessScore: 75,
    currentWeek: 1,
    internshipReady: false,
    status: "active",
  })),
];


