export const weekOneMainDelivery = {
  week: 1,
  phase: "DISCOVER",
  title: "Who You Are Matters",
  capstoneTitle: "My Story Begins Here",
  weeklyGoal:
    "Begin understanding who you are, what has shaped you, and how your strengths, interests, values, experiences, and ideas become part of your BUILD6™ story.",

  rhythm: [
    {
      day: "Monday",
      label: "START IT",
      title: "My Story Brain Map",
      goal: "Begin defining what your personal story looks and feels like.",
    },
    {
      day: "Tuesday",
      label: "DISCOVER IT",
      title: "Who Am I?",
      goal: "Identify strengths, interests, values, experiences, and ideas that are important to your story.",
    },
    {
      day: "Wednesday",
      label: "DEVELOP IT",
      title: "Build My Story",
      goal: "Practice communicating what your experiences reveal about who you are and who you are becoming.",
    },
    {
      day: "Thursday",
      label: "APPLY IT",
      title: "Take It Into the Real World",
      goal: "Connect this week's learning to life, work, careers, speakers, experiences, or applied practice.",
    },
    {
      day: "Friday",
      label: "REFLECT ON IT",
      title: "What Did I Learn?",
      goal: "Reflect, catch up, save meaningful evidence, and identify what you want to carry forward.",
    },
  ],

  monday: {
    goal: "Students understand the BUILD6™ Capstone and begin their My Story Brain Map.",

    agenda: [
      {
        time: "0–10",
        title: "ARRIVE + RESET",
        detail:
          "Attendance, portal access, registration check, and unfinished assessment only for students who still need it.",
      },
      {
        time: "10–15",
        title: "CONNECT",
        detail:
          "Introduce the Capstone: students are building a story about the person they are becoming.",
      },
      {
        time: "15–35",
        title: "START IT",
        detail:
          "Launch My Story Brain Map using colors, words, images, people, places, symbols, experiences, writing, dreams, and future ideas.",
      },
      {
        time: "35–45",
        title: "COACH FLEX",
        detail:
          "Coach may add discussion, sharing, personal examples, sketching, partner work, or another activity that supports today's goal.",
      },
      {
        time: "45–50",
        title: "PROVE IT",
        detail:
          "Students preserve their ideas and identify at least one piece they want to carry into their Capstone.",
      },
    ],

    required: [
      "Attendance is recorded.",
      "Remaining registration/access issues are identified.",
      "Incomplete assessments are addressed without repeating completed assessments.",
      "Students understand what the Capstone is.",
      "Every student begins a My Story Brain Map.",
      "Brain Map ideas are preserved for Tuesday's follow-up.",
    ],

    coachFlex:
      "Add your own coaching, examples, discussion, team activity, or extension. The method is flexible; the BUILD6™ outcome stays aligned.",
  },
} as const;
