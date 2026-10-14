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


/** Six exploratory, less-familiar careers ranked against the student's own profile.
 * Education routes are common U.S. examples, not admission/licensure guarantees.
 * No assessment score is used as a gatekeeper for career eligibility.
 */
export type DiscoveryCareer = CareerPathway & {
  educationRoutes: string[];
  searchTerms: string[];
};
const DISCOVERY_CATALOG: DiscoveryCareer[] = [
  { title: "Clinical Informatics Specialist", industry: "Healthcare / Technology", description: "Connects clinical teams, patient workflows and information systems to improve care delivery.", whyItFits: ["Bridges helping people with technology and process improvement."], skillsToDevelop: ["Health information", "Data literacy", "Communication"], experiencesToTry: ["Interview a hospital informatics team", "Map a clinic workflow"], educationRoutes: ["Explore health informatics, health information management or clinical training", "Compare employer requirements; some roles require a clinical license or graduate education"], searchTerms: ["health", "medical", "care", "tech", "data", "help", "systems"] },
  { title: "Athlete Development Coordinator", industry: "Sports / Education", description: "Helps athletes navigate academics, personal development, transitions and preparation for work beyond sport.", whyItFits: ["Connects athletic experience, mentoring and career exploration."], skillsToDevelop: ["Coaching", "Program coordination", "Career advising"], experiencesToTry: ["Interview an athletics student-development professional", "Design an athlete transition workshop"], educationRoutes: ["Explore sport management, education, counseling or student-affairs programs", "Check specific college athletics job postings for degree and experience requirements"], searchTerms: ["sports", "athlet", "mentor", "lead", "coach", "education"] },
  { title: "Supply Chain Sustainability Analyst", industry: "Logistics / Sustainability", description: "Studies supplier practices, materials and transportation to help organizations understand supply-chain impact.", whyItFits: ["Combines analysis, operational problem-solving and values-driven work."], skillsToDevelop: ["Spreadsheets", "Supply chain", "Research"], experiencesToTry: ["Trace a product's supply chain", "Interview a logistics professional"], educationRoutes: ["Explore supply-chain, business analytics or environmental studies certificates and degrees", "Compare entry-level analyst job descriptions and internships"], searchTerms: ["logistic", "operation", "environment", "sustain", "data", "business", "problem"] },
  { title: "User Experience Researcher", industry: "Technology / Design", description: "Studies how people use products and services, then turns observations into design recommendations.", whyItFits: ["Combines curiosity about people, communication and structured problem-solving."], skillsToDevelop: ["Interviewing", "Research methods", "Usability testing"], experiencesToTry: ["Run a small usability interview", "Present findings from a website test"], educationRoutes: ["Explore psychology, human-computer interaction, design or research-methods programs", "Build a portfolio; compare job postings because requirements vary"], searchTerms: ["tech", "design", "creative", "people", "research", "psych", "communication"] },
  { title: "Community Health Program Coordinator", industry: "Healthcare / Community", description: "Organizes outreach, partnerships and programs that connect communities to health resources.", whyItFits: ["Connects service, organization and relationship-building."], skillsToDevelop: ["Program planning", "Outreach", "Evaluation"], experiencesToTry: ["Volunteer with a health nonprofit", "Interview a community health worker"], educationRoutes: ["Explore public health, community health or human-services programs", "Review local employer expectations; community health worker certificates may be relevant"], searchTerms: ["health", "community", "service", "people", "organize", "help", "lead"] },
  { title: "Sports Data Visualization Specialist", industry: "Sports / Analytics", description: "Turns performance and operations data into visual reports that teams and organizations can act on.", whyItFits: ["Connects sports knowledge, storytelling and analytical thinking."], skillsToDevelop: ["Statistics", "Data visualization", "Presentation"], experiencesToTry: ["Build a dashboard from public sports data", "Interview a performance analyst"], educationRoutes: ["Explore statistics, data analytics, computer science or sport analytics programs", "Build a project portfolio and compare internship requirements"], searchTerms: ["sport", "athlet", "data", "math", "tech", "creative", "visual"] },
  { title: "Learning Experience Designer", industry: "Education / Technology", description: "Designs interactive learning activities, training and tools for students or employees.", whyItFits: ["Connects creativity, mentoring, communication and technology."], skillsToDevelop: ["Instructional design", "Facilitation", "Digital tools"], experiencesToTry: ["Design a 15-minute interactive lesson", "Interview a corporate trainer"], educationRoutes: ["Explore education, instructional design or learning-technology programs", "Create a sample learning portfolio; some positions prefer graduate preparation"], searchTerms: ["teach", "education", "mentor", "creative", "tech", "communicat", "training"] },
  { title: "Accessibility Specialist", industry: "Technology / Inclusion", description: "Helps make websites, documents and services easier to use for people with disabilities.", whyItFits: ["Connects empathy, detailed problem-solving and technology."], skillsToDevelop: ["Accessibility testing", "Inclusive design", "Communication"], experiencesToTry: ["Audit a public website with accessibility guidelines", "Interview an accessibility professional"], educationRoutes: ["Explore web development, design, human-computer interaction or accessibility training", "Build practical testing experience; compare certifications and employer requirements"], searchTerms: ["help", "inclusion", "tech", "design", "detail", "people", "access"] },
  { title: "Emergency Management Planner", industry: "Public Service / Operations", description: "Coordinates plans, exercises and partnerships that prepare organizations for emergencies.", whyItFits: ["Connects leadership, teamwork, organization and community impact."], skillsToDevelop: ["Planning", "Risk assessment", "Crisis communication"], experiencesToTry: ["Explore a community emergency-preparedness program", "Practice a tabletop response exercise"], educationRoutes: ["Explore emergency management, public administration or public-safety programs", "Review FEMA training and local agency experience requirements"], searchTerms: ["lead", "public", "community", "operation", "safety", "problem", "service"] },
  { title: "Workforce Development Specialist", industry: "Business / Community", description: "Connects employers, educators and job seekers through training and career opportunities.", whyItFits: ["Connects relationship-building, mentoring and practical problem-solving."], skillsToDevelop: ["Employer outreach", "Coaching", "Program evaluation"], experiencesToTry: ["Interview a workforce board", "Design a career exploration event"], educationRoutes: ["Explore human resources, education, social services or workforce certificates", "Compare local workforce agency and employer job requirements"], searchTerms: ["people", "business", "mentor", "career", "communicat", "community", "lead"] },
  { title: "Geospatial Analyst", industry: "Technology / Environment", description: "Uses maps and location data to answer questions about infrastructure, environment and communities.", whyItFits: ["Combines technology, patterns and practical problem-solving."], skillsToDevelop: ["GIS", "Data analysis", "Mapping"], experiencesToTry: ["Make a map using open GIS data", "Interview a city planning or utilities GIS analyst"], educationRoutes: ["Explore geography, GIS, environmental science or geospatial technology programs", "Look for GIS certificates and entry-level mapping projects"], searchTerms: ["tech", "data", "environment", "map", "geograph", "community", "problem"] },
  { title: "Customer Success Operations Analyst", industry: "Business / Technology", description: "Studies customer experience and service processes to improve retention and solve recurring problems.", whyItFits: ["Connects communication, business relationships and analysis."], skillsToDevelop: ["Customer research", "Reporting", "Process improvement"], experiencesToTry: ["Map a customer journey", "Interview a customer success manager"], educationRoutes: ["Explore business, analytics, communications or information systems programs", "Build spreadsheet and customer-service experience; review employer requirements"], searchTerms: ["business", "sales", "people", "tech", "communicat", "data", "operation"] },
];

export function generateDiscoveryCareers(profile: StudentCareerProfile): DiscoveryCareer[] {
  const signals = [...profile.strengths, ...profile.interests, ...profile.industries]
    .map((value) => value.trim().toLowerCase()).filter(Boolean);
  const ranked = DISCOVERY_CATALOG.map((career, index) => {
    const score = career.searchTerms.reduce((total, term) =>
      total + (signals.some((signal) => signal.includes(term) || term.includes(signal) && signal.length >= 4) ? 1 : 0), 0);
    return { career, score, index };
  }).sort((a, b) => b.score - a.score || a.index - b.index);
  // Rotate the neutral fallback by the profile's actual signals so profiles with
  // no matching catalog terms do not all receive an identical first six.
  if (ranked.every((item) => item.score === 0) && signals.length > 0) {
    const shift = signals.join("").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % ranked.length;
    return [...ranked.slice(shift), ...ranked.slice(0, shift)].slice(0, 6).map(({ career }) => career);
  }
  return ranked.slice(0, 6).map(({ career }) => career);
}
