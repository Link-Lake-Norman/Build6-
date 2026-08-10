export const progress = [
  {
    studentId: "ambassador-student-001",
    completedLessons: [
      "Who You Are Matters",
    ],
    currentLesson: "Professional Communication",
    reflectionSubmitted: true,
    skillsEarned: [
      "Self Awareness",
      "Professionalism",
    ],
    badges: [
      "Identity Builder",
    ],
    internshipReadiness: "Preparing",
    progressPercent: 25,
  },

  {
    studentId: "ambassador-student-002",
    completedLessons: [
      "Who You Are Matters",
    ],
    currentLesson: "Professional Communication",
    reflectionSubmitted: false,
    skillsEarned: [
      "Teamwork",
    ],
    badges: [
      "Team Contributor",
    ],
    internshipReadiness: "Preparing",
    progressPercent: 20,
  },

  ...Array.from({ length: 18 }, (_, index) => ({
    studentId: `ambassador-student-${String(index + 3).padStart(3, "0")}`,
    completedLessons: [],
    currentLesson: "Who You Are Matters",
    reflectionSubmitted: false,
    skillsEarned: [],
    badges: [],
    internshipReadiness: "Preparing",
    progressPercent: 0,
  })),
];

