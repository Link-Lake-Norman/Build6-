export type CareerPathway = {
  title: string;
  industry: string;
  description: string;
  whyItFits: string[];
  skillsToDevelop: string[];
  experiencesToTry: string[];
};

export type StudentCareerProfile = {
  studentId: string;
  strengths: string[];
  interests: string[];
  industries: string[];
  recommendedPathways?: CareerPathway[];
};

export const careerIndustries = [
  "Healthcare",
  "Sports",
  "Business Management",
  "Marketing",
  "Sales",
  "Finance",
  "Logistics & Supply Chain",
  "Technology & AI",
  "Operations",
  "Communications",
];

function containsAny(
  values: string[],
  terms: string[]
) {
  const normalized = values.map((value) =>
    value.toLowerCase()
  );

  return terms.some((term) =>
    normalized.some((value) =>
      value.includes(term.toLowerCase())
    )
  );
}

export function generateCareerPathways(
  profile: StudentCareerProfile
): CareerPathway[] {
  const pathways: CareerPathway[] = [];

  const allInterests = [
    ...profile.interests,
    ...profile.industries,
  ];

  if (
    containsAny(allInterests, [
      "sports",
      "athletics",
      "athlete",
    ])
  ) {
    pathways.push({
      title: "Sports Operations Manager",
      industry: "Sports",
      description:
        "Sports operations managers help athletic organizations, teams, facilities, and events run effectively. They may coordinate schedules, facilities, events, staff, budgets, logistics, and day-to-day operations behind the scenes.",
      whyItFits: [
        "Uses teamwork and leadership experience.",
        "Connects athletic experience to business operations.",
        "Allows continued involvement in sports beyond playing.",
      ],
      skillsToDevelop: [
        "Project Management",
        "Communication",
        "Business Operations",
      ],
      experiencesToTry: [
        "Shadow an athletic department.",
        "Interview a sports professional.",
        "Lead a team project.",
      ],
    });

    pathways.push({
      title: "Sports Performance Analyst",
      industry: "Sports Technology",
      description:
        "Sports performance analysts use statistics, video, technology, and performance information to help athletes and teams understand what is working and where they can improve.",
      whyItFits: [
        "Connects sports knowledge with data and improvement.",
        "Supports athletes and teams through analysis.",
        "Combines athletics, technology, and problem solving.",
      ],
      skillsToDevelop: [
        "Data Analysis",
        "Technology Skills",
        "Problem Solving",
      ],
      experiencesToTry: [
        "Analyze game statistics.",
        "Explore sports technology.",
        "Create a performance project.",
      ],
    });
  }

  if (
    containsAny(allInterests, [
      "health",
      "healthcare",
      "medicine",
      "medical",
      "patient",
      "therapy",
      "fitness",
    ]) ||
    containsAny(profile.strengths, [
      "helping others",
      "empathy",
      "caring",
    ])
  ) {
    pathways.push({
      title: "Healthcare Operations Manager",
      industry: "Healthcare",
      description:
        "Healthcare operations managers help hospitals, clinics, medical practices, rehabilitation centers, and other healthcare organizations operate effectively. Their work can involve people, scheduling, patient experience, processes, technology, and business operations.",
      whyItFits: [
        "Combines leadership with helping people.",
        "Uses organization and communication skills.",
        "Provides a healthcare pathway beyond direct clinical care.",
      ],
      skillsToDevelop: [
        "Healthcare Knowledge",
        "Leadership",
        "Process Improvement",
      ],
      experiencesToTry: [
        "Interview a healthcare leader.",
        "Visit a healthcare organization.",
        "Explore patient experience roles.",
      ],
    });

    pathways.push({
      title: "Physical Therapy & Human Performance",
      industry: "Healthcare",
      description:
        "Physical therapy and human performance careers focus on movement, rehabilitation, injury recovery, strength, mobility, and helping people improve their physical function and quality of life.",
      whyItFits: [
        "Connects interest in movement, health, and performance.",
        "Creates opportunities to support athletes and patients.",
        "Combines science with strong interpersonal skills.",
      ],
      skillsToDevelop: [
        "Science Foundations",
        "Communication",
        "Patient Care",
      ],
      experiencesToTry: [
        "Shadow a physical therapist.",
        "Learn about sports medicine.",
        "Explore rehabilitation careers.",
      ],
    });
  }

  if (
    containsAny(allInterests, [
      "technology",
      "tech",
      "ai",
      "computer",
      "software",
      "data",
    ])
  ) {
    pathways.push({
      title: "Technology & AI Solutions Specialist",
      industry: "Technology & AI",
      description:
        "Technology and AI solutions specialists help organizations understand, implement, and use technology to solve business problems. The work can combine technical knowledge with communication, training, problem solving, and customer support.",
      whyItFits: [
        "Connects technology with real-world problem solving.",
        "Can combine technical and people skills.",
        "Provides opportunities across nearly every industry.",
      ],
      skillsToDevelop: [
        "AI Literacy",
        "Technology Skills",
        "Problem Solving",
        "Communication",
      ],
      experiencesToTry: [
        "Test an AI or technology tool.",
        "Interview someone working in technology.",
        "Design a technology solution for a real problem.",
      ],
    });
  }

  if (
    containsAny(allInterests, [
      "finance",
      "money",
      "accounting",
      "banking",
    ])
  ) {
    pathways.push({
      title: "Financial Services Professional",
      industry: "Finance",
      description:
        "Financial services professionals help individuals or organizations understand, manage, protect, invest, or plan their money. Careers can include banking, financial planning, accounting, lending, insurance, and business finance.",
      whyItFits: [
        "Uses analytical thinking and decision making.",
        "Connects financial knowledge with real-world outcomes.",
        "Offers career options in many types of organizations.",
      ],
      skillsToDevelop: [
        "Financial Literacy",
        "Data Analysis",
        "Communication",
      ],
      experiencesToTry: [
        "Interview a banking or finance professional.",
        "Build a sample personal budget.",
        "Explore financial planning careers.",
      ],
    });
  }

  pathways.push({
    title: "Business Development & Sales",
    industry: "Business",
    description:
      "Business development and sales professionals help organizations grow by identifying opportunities, building relationships, understanding customer needs, presenting solutions, and creating new business partnerships.",
    whyItFits: [
      "Uses communication, relationship building, and problem solving.",
      "Creates opportunities across many industries.",
      "Rewards confidence, curiosity, and the ability to connect with people.",
    ],
    skillsToDevelop: [
      "Negotiation",
      "Presentation Skills",
      "Relationship Management",
    ],
    experiencesToTry: [
      "Practice professional conversations.",
      "Interview a business leader.",
      "Complete a sales challenge.",
    ],
  });

  pathways.push({
    title: "Marketing & Brand Strategy",
    industry: "Marketing",
    description:
      "Marketing and brand professionals help organizations communicate who they are, reach the right audiences, tell compelling stories, promote products or services, and build relationships with customers and communities.",
    whyItFits: [
      "Uses creativity and storytelling.",
      "Connects people with ideas and organizations.",
      "Combines communication, strategy, and digital tools.",
    ],
    skillsToDevelop: [
      "Digital Marketing",
      "Content Creation",
      "Communication",
    ],
    experiencesToTry: [
      "Create a marketing campaign.",
      "Analyze a brand.",
      "Build a portfolio project.",
    ],
  });

  pathways.push({
    title: "Operations & Logistics",
    industry: "Operations",
    description:
      "Operations and logistics professionals make sure organizations, products, people, materials, and processes work efficiently. They solve problems, coordinate resources, improve systems, and help businesses deliver what customers need.",
    whyItFits: [
      "Uses organization and problem solving.",
      "Every industry needs people who improve systems.",
      "Connects planning with measurable results.",
    ],
    skillsToDevelop: [
      "Planning",
      "Data Skills",
      "Process Improvement",
    ],
    experiencesToTry: [
      "Study how a company operates.",
      "Explore supply chain careers.",
      "Complete an improvement project.",
    ],
  });

  return pathways;
}
