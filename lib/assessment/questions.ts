import type {
  AssessmentQuestion,
} from "./types";

export const assessmentQuestions:
  AssessmentQuestion[] = [
  {
    id: "identity",
    section: "HOW YOU SEE YOURSELF",
    prompt:
      "Which words sound most like you?",
    help:
      "Choose the ones that feel natural — not the ones you think you should choose.",
    type: "multi",
    options: [
      {
        value: "visionary",
        label: "Visionary",
        weights: {
          creativity: 3,
          leadership: 2,
          entrepreneurship: 2,
        },
      },
      {
        value: "dreamer",
        label: "Dreamer",
        weights: {
          creativity: 3,
          entrepreneurship: 1,
        },
      },
      {
        value: "thinker",
        label: "Thinker",
        weights: {
          analytical: 3,
          problemSolving: 2,
        },
      },
      {
        value: "communicator",
        label: "Communicator",
        weights: {
          communication: 3,
          people: 2,
        },
      },
      {
        value: "problem-solver",
        label: "Problem Solver",
        weights: {
          problemSolving: 3,
          analytical: 2,
        },
      },
      {
        value: "builder",
        label: "Builder / Maker",
        weights: {
          handsOn: 3,
          problemSolving: 2,
        },
      },
      {
        value: "leader",
        label: "Leader",
        weights: {
          leadership: 3,
          communication: 2,
        },
      },
      {
        value: "helper",
        label: "Helper",
        weights: {
          service: 3,
          people: 2,
        },
      },
      {
        value: "organizer",
        label: "Organizer",
        weights: {
          organization: 3,
          leadership: 1,
        },
      },
    ],
  },

  {
    id: "subjects",
    section: "WHAT COMES NATURALLY",
    prompt:
      "Which subjects or areas are you strongest in or enjoy most?",
    type: "multi",
    options: [
      {
        value: "math",
        label: "Math",
        weights: {
          analytical: 3,
          problemSolving: 2,
        },
      },
      {
        value: "science",
        label: "Science",
        weights: {
          analytical: 2,
          problemSolving: 2,
        },
      },
      {
        value: "english",
        label: "English / Writing",
        weights: {
          communication: 3,
          creativity: 1,
        },
      },
      {
        value: "history",
        label: "History / Social Studies",
        weights: {
          communication: 1,
          analytical: 2,
          people: 1,
        },
      },
      {
        value: "technology",
        label: "Technology / Computers",
        weights: {
          technology: 3,
          computer: 2,
          problemSolving: 1,
        },
      },
      {
        value: "arts",
        label: "Art / Design / Creative Work",
        weights: {
          creativity: 3,
        },
      },
      {
        value: "business",
        label: "Business / Entrepreneurship",
        weights: {
          entrepreneurship: 3,
          leadership: 2,
        },
      },
      {
        value: "trades",
        label: "Hands-On / Trades / Building",
        weights: {
          handsOn: 3,
          movement: 2,
        },
      },
      {
        value: "health",
        label: "Health / Human Performance",
        weights: {
          service: 2,
          people: 2,
          analytical: 1,
        },
      },
    ],
  },

  {
    id: "people",
    section: "HOW YOU WORK",
    prompt:
      "How much do you want to work with people?",
    type: "single",
    options: [
      {
        value: "all-day",
        label: "A lot — people energize me",
        weights: {
          people: 4,
          communication: 2,
          teamwork: 2,
        },
      },
      {
        value: "mix",
        label: "A mix of people time and independent work",
        weights: {
          people: 2,
          independence: 2,
          teamwork: 1,
        },
      },
      {
        value: "mostly-independent",
        label: "Mostly independently",
        weights: {
          independence: 4,
          analytical: 1,
        },
      },
    ],
  },

  {
    id: "environment",
    section: "WHERE YOU WORK",
    prompt:
      "Which work environment sounds best?",
    type: "single",
    options: [
      {
        value: "office",
        label: "Office / professional environment",
        weights: {
          organization: 2,
          computer: 2,
        },
      },
      {
        value: "outside",
        label: "Outside / in the field",
        weights: {
          outdoors: 4,
          movement: 3,
        },
      },
      {
        value: "hands-on",
        label: "Workshop / lab / jobsite / hands-on",
        weights: {
          handsOn: 4,
          movement: 2,
        },
      },
      {
        value: "community",
        label: "Out in the community working with people",
        weights: {
          people: 3,
          service: 2,
          communication: 2,
          movement: 1,
        },
      },
      {
        value: "variety",
        label: "A mix — I don't want every day to look the same",
        weights: {
          creativity: 1,
          people: 1,
          movement: 2,
          independence: 1,
        },
      },
    ],
  },

  {
    id: "computer",
    section: "YOUR WORKDAY",
    prompt:
      "How would you feel about spending most of your day on a computer?",
    type: "single",
    options: [
      {
        value: "love-it",
        label: "I'd be completely comfortable with that",
        weights: {
          computer: 4,
          technology: 2,
        },
      },
      {
        value: "some",
        label: "Some computer work is fine, but I want variety",
        weights: {
          computer: 2,
          movement: 1,
          people: 1,
        },
      },
      {
        value: "little",
        label: "I'd rather be moving, building, helping or doing",
        weights: {
          handsOn: 3,
          movement: 3,
          outdoors: 1,
        },
      },
    ],
  },

  {
    id: "dress",
    section: "WORKPLACE FIT",
    prompt:
      "How would you most like to dress for work?",
    type: "single",
    options: [
      {
        value: "professional",
        label: "Professional / business attire",
        weights: {
          organization: 2,
          communication: 1,
          leadership: 1,
        },
      },
      {
        value: "business-casual",
        label: "Business casual",
        weights: {
          people: 1,
          organization: 1,
        },
      },
      {
        value: "casual",
        label: "Casual / creative",
        weights: {
          creativity: 2,
          technology: 1,
        },
      },
      {
        value: "uniform",
        label: "Uniform / scrubs / specialized gear",
        weights: {
          service: 1,
          handsOn: 2,
          organization: 1,
        },
      },
      {
        value: "doesnt-matter",
        label: "It doesn't really matter to me",
        weights: {},
      },
    ],
  },

  {
    id: "energy",
    section: "WHAT ENERGIZES YOU",
    prompt:
      "Which activities sound most exciting?",
    type: "multi",
    options: [
      {
        value: "create",
        label: "Creating something new",
        weights: {
          creativity: 3,
          entrepreneurship: 2,
        },
      },
      {
        value: "solve",
        label: "Solving a difficult problem",
        weights: {
          problemSolving: 3,
          analytical: 2,
        },
      },
      {
        value: "help",
        label: "Helping someone",
        weights: {
          service: 3,
          people: 2,
        },
      },
      {
        value: "lead",
        label: "Leading a group or project",
        weights: {
          leadership: 3,
          communication: 2,
        },
      },
      {
        value: "build",
        label: "Building, fixing or improving something",
        weights: {
          handsOn: 3,
          problemSolving: 2,
        },
      },
      {
        value: "present",
        label: "Presenting, persuading or telling a story",
        weights: {
          communication: 3,
          creativity: 1,
        },
      },
      {
        value: "analyze",
        label: "Researching, analyzing or finding patterns",
        weights: {
          analytical: 3,
          problemSolving: 2,
        },
      },
      {
        value: "organize",
        label: "Planning and making things run smoothly",
        weights: {
          organization: 3,
          leadership: 1,
        },
      },
    ],
  },

  {
    id: "future",
    section: "WHAT YOU WANT",
    prompt:
      "What matters most when you imagine your future work?",
    type: "multi",
    options: [
      {
        value: "impact",
        label: "Making an impact",
        weights: {
          service: 2,
          leadership: 2,
        },
      },
      {
        value: "income",
        label: "Strong earning potential",
        weights: {
          entrepreneurship: 1,
          technology: 1,
          analytical: 1,
        },
      },
      {
        value: "stability",
        label: "Stability and a clear path",
        weights: {
          organization: 2,
        },
      },
      {
        value: "freedom",
        label: "Freedom and flexibility",
        weights: {
          independence: 2,
          entrepreneurship: 2,
        },
      },
      {
        value: "variety",
        label: "Variety and new experiences",
        weights: {
          creativity: 1,
          people: 1,
          movement: 2,
        },
      },
      {
        value: "growth",
        label: "Opportunities to grow and lead",
        weights: {
          leadership: 3,
        },
      },
      {
        value: "people",
        label: "Relationships and connection",
        weights: {
          people: 3,
          communication: 2,
        },
      },
    ],
  },
];
