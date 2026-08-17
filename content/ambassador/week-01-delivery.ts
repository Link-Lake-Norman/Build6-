import type { AmbassadorWeekDelivery } from "./week-delivery";

export const ambassadorWeek01Delivery: AmbassadorWeekDelivery = {
  week: 1,

  monday: {
    reflectionPrompt: [
      "What experiences from school, sports, work, family, volunteering, or life have shaped who you are?",
      "What is one strength you already bring into Future Ready™?",
      "What is one skill you want to strengthen this semester?",
      "What do you want people to understand about you beyond your role, position, or title?",
    ],

    organizationTasks: [
      "Set up or review your Future Ready™ workspace.",
      "Confirm your profile information is complete.",
      "Organize your first portfolio folder or digital evidence space.",
      "Record one personal goal for the semester.",
      "Identify any unfinished onboarding or assessment work.",
    ],

    projectWork: [
      "Begin your Future Ready Identity Map.",
      "Collect examples from athletics, school, work, volunteering, family responsibilities, or life that demonstrate transferable skills.",
    ],
  },

  tuesday: {
    lessonWeek: 1,
  },

  wednesday: {
    appliedLearningAssetIds: [
      "week-01-identity-under-pressure",
      "week-01-read-the-room",
    ],
  },

  thursday: {
    experience: {
      preparationQuestions: [
        "Who are we meeting and what can we learn from their experience?",
        "What is one thoughtful question you could ask about communication, leadership, career decisions, or personal growth?",
        "What does professional participation look like during this experience?",
        "How will you introduce yourself if you have the opportunity?",
      ],

      duringExperience: [
        "Introduce yourself professionally when appropriate.",
        "Ask at least one thoughtful question.",
        "Listen for a story that demonstrates a transferable skill.",
        "Notice how the speaker or professional communicates with the group.",
        "Write down one piece of advice you want to remember.",
      ],

      debriefQuestions: [
        "What did you learn about the person beyond their job title?",
        "What experience seemed to shape them the most?",
        "What skill did you hear them demonstrate through their story?",
        "What did you notice about how they communicated?",
        "What is one idea you can apply to your own Future Ready identity?",
      ],

      portfolioEvidence:
        "Guest speaker or experience reflection: identity, transferable skills, and professional communication takeaway.",
    },

    classroom: {
      title: "Who Are You Without the Title?",
      description:
        "If no speaker, panel, field trip, or external experience is scheduled, students complete the Week 1 public-speaking lab and Athlete Pathway extension.",
      appliedLearningAssetIds: ["week-01-who-are-you-without-the-title"],
    },
  },

  friday: {
    closingQuestions: [
      "What did you learn about yourself this week?",
      "What strength did you demonstrate instead of just naming?",
      "What did someone else notice about you that you may not have noticed yourself?",
      "When did you practice empathy or active listening?",
      "What was one moment when you had to speak even though you were nervous?",
      "What would you change if you introduced yourself again?",
      "What is one thing Future You should remember from this week?",
    ],
  },
};
