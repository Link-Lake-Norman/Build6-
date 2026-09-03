import type {
  CareerRole,
} from "./types";

export const careerRoles: CareerRole[] = [
  {
    id: "marketing-strategist",
    title: "Marketing Strategist",
    pathway: "Marketing + Communications",
    description:
      "Studies audiences, develops ideas and helps organizations decide how to communicate, grow and reach the right people.",
    environment:
      "Office, agency, hybrid or client-facing environment with substantial collaboration and computer work.",
    education:
      "Common paths include marketing, communications or business degrees, internships and portfolio-based experience.",
    nextStep:
      "Try creating a campaign for a real organization, event or cause.",
    relatedRoles: [
      "Brand Strategist",
      "Content Strategist",
      "Market Research Analyst",
    ],
    weights: {
      creativity: 4,
      communication: 4,
      people: 2,
      analytical: 2,
      computer: 2,
    },
  },
  {
    id: "project-manager",
    title: "Project Manager",
    pathway: "Business + Operations",
    description:
      "Coordinates people, deadlines, resources and priorities so a project moves from idea to completion.",
    environment:
      "Professional, corporate, construction, technology, healthcare or hybrid environments.",
    education:
      "Multiple entry paths exist. Business or industry experience plus project-management training or certification is common.",
    nextStep:
      "Lead a small project and practice building a timeline, assigning responsibilities and communicating progress.",
    relatedRoles: [
      "Operations Manager",
      "Program Manager",
      "Event Manager",
    ],
    weights: {
      organization: 5,
      leadership: 4,
      communication: 3,
      problemSolving: 3,
      teamwork: 2,
    },
  },
  {
    id: "software-developer",
    title: "Software Developer",
    pathway: "Technology + AI",
    description:
      "Designs, builds, tests and improves software used by people and organizations.",
    environment:
      "Primarily computer-based work in technology companies, internal technology teams or remote environments.",
    education:
      "Computer science degrees are common, but technical programs, certifications, portfolios and demonstrated coding ability can also create pathways.",
    nextStep:
      "Build a small application or complete an introductory coding project.",
    relatedRoles: [
      "Software Engineer",
      "Web Developer",
      "Automation Developer",
    ],
    weights: {
      technology: 5,
      computer: 5,
      problemSolving: 4,
      analytical: 4,
      independence: 2,
    },
  },
  {
    id: "ux-designer",
    title: "UX / Product Designer",
    pathway: "Technology + Design",
    description:
      "Studies how people use products and designs clearer, easier and more useful digital experiences.",
    environment:
      "Creative, technology and product teams with a mix of computer work, research and collaboration.",
    education:
      "Design, human-computer interaction and related degrees are common, but a strong portfolio can be especially important.",
    nextStep:
      "Redesign an app or website experience and explain the problem your design solves.",
    relatedRoles: [
      "Product Designer",
      "UX Researcher",
      "Interaction Designer",
    ],
    weights: {
      creativity: 5,
      technology: 3,
      people: 3,
      problemSolving: 4,
      computer: 3,
    },
  },
  {
    id: "nurse",
    title: "Registered Nurse",
    pathway: "Healthcare",
    description:
      "Provides direct patient care, monitors health, communicates with patients and families and coordinates with healthcare teams.",
    environment:
      "Hospitals, clinics, schools, community health settings and other patient-care environments.",
    education:
      "Requires an approved nursing education pathway and professional licensure.",
    nextStep:
      "Explore nursing specialties and speak with a healthcare professional about different care environments.",
    relatedRoles: [
      "Nurse Practitioner",
      "Clinical Coordinator",
      "Public Health Nurse",
    ],
    weights: {
      service: 5,
      people: 5,
      communication: 4,
      problemSolving: 3,
      teamwork: 3,
      movement: 2,
    },
  },
  {
    id: "physical-therapist",
    title: "Physical Therapist",
    pathway: "Healthcare + Human Performance",
    description:
      "Helps people improve movement, recover from injury and build physical function through evaluation and treatment.",
    environment:
      "Clinics, hospitals, sports settings, rehabilitation facilities and community environments.",
    education:
      "Requires undergraduate preparation followed by professional physical-therapy education and licensure.",
    nextStep:
      "Observe a rehabilitation or sports-performance setting and learn how movement is evaluated.",
    relatedRoles: [
      "Physical Therapist Assistant",
      "Athletic Trainer",
      "Occupational Therapist",
    ],
    weights: {
      service: 5,
      people: 4,
      movement: 4,
      analytical: 2,
      communication: 3,
    },
  },
  {
    id: "electrician",
    title: "Electrician",
    pathway: "Skilled Trades",
    description:
      "Installs, maintains and troubleshoots electrical systems in homes, businesses, industrial facilities and other environments.",
    environment:
      "Jobsites, facilities, construction projects and field environments with substantial hands-on work.",
    education:
      "Apprenticeship, technical education and licensing pathways are common.",
    nextStep:
      "Explore a registered apprenticeship or visit a skilled-trades training program.",
    relatedRoles: [
      "Industrial Electrician",
      "Electrical Technician",
      "Controls Technician",
    ],
    weights: {
      handsOn: 5,
      problemSolving: 4,
      movement: 4,
      analytical: 2,
      independence: 2,
    },
  },
  {
    id: "mechatronics-technician",
    title: "Mechatronics Technician",
    pathway: "Advanced Manufacturing",
    description:
      "Works with automated equipment that combines mechanical, electrical, robotics and computer-controlled systems.",
    environment:
      "Advanced manufacturing plants, technical labs and automated production environments.",
    education:
      "Technical college, associate-degree, apprenticeship and employer-training pathways are common.",
    nextStep:
      "Visit an advanced manufacturing facility or explore robotics and automation training.",
    relatedRoles: [
      "Automation Technician",
      "Robotics Technician",
      "Controls Technician",
    ],
    weights: {
      handsOn: 5,
      technology: 4,
      problemSolving: 5,
      analytical: 3,
      movement: 2,
    },
  },
  {
    id: "civil-engineer",
    title: "Civil Engineer",
    pathway: "Engineering + Infrastructure",
    description:
      "Plans and designs infrastructure such as roads, structures, water systems and community development projects.",
    environment:
      "Combination of office/design work, project meetings and field or construction-site visits.",
    education:
      "A bachelor's degree in civil engineering is a standard pathway, with professional licensing important for many roles.",
    nextStep:
      "Explore a local infrastructure project and investigate the engineering decisions behind it.",
    relatedRoles: [
      "Structural Engineer",
      "Transportation Engineer",
      "Construction Engineer",
    ],
    weights: {
      analytical: 5,
      problemSolving: 5,
      organization: 3,
      computer: 2,
      outdoors: 1,
    },
  },
  {
    id: "sales-account-executive",
    title: "Account Executive / Business Development",
    pathway: "Business + Sales",
    description:
      "Builds relationships, understands customer needs and connects people or organizations with solutions.",
    environment:
      "Client-facing, office, hybrid and travel environments with significant conversation and relationship building.",
    education:
      "Business degrees are common but communication ability, industry knowledge, sales experience and performance can be equally important.",
    nextStep:
      "Practice a discovery conversation: learn someone's needs before recommending a solution.",
    relatedRoles: [
      "Business Development Manager",
      "Partnership Manager",
      "Sales Consultant",
    ],
    weights: {
      people: 5,
      communication: 5,
      leadership: 2,
      entrepreneurship: 3,
      teamwork: 2,
    },
  },
  {
    id: "entrepreneur",
    title: "Entrepreneur / Business Owner",
    pathway: "Entrepreneurship",
    description:
      "Identifies a problem or opportunity, develops a solution and builds the people, resources and systems needed to create a business.",
    environment:
      "Highly variable. May include home, office, client sites, community settings, retail or field environments.",
    education:
      "There is no single required path. Business knowledge, industry expertise, financial literacy, sales and execution matter.",
    nextStep:
      "Identify one real problem and test whether people would value a solution.",
    relatedRoles: [
      "Founder",
      "Small Business Owner",
      "Innovation Manager",
    ],
    weights: {
      entrepreneurship: 5,
      creativity: 4,
      leadership: 4,
      problemSolving: 4,
      communication: 3,
      independence: 3,
    },
  },
  {
    id: "community-engagement-manager",
    title: "Community Engagement Manager",
    pathway: "Community + Public Relations",
    description:
      "Builds relationships between organizations and communities, coordinates initiatives and communicates opportunities for involvement and impact.",
    environment:
      "Combination of office work, meetings, events, community organizations and public-facing environments.",
    education:
      "Communications, public relations, nonprofit management, public administration and business are common backgrounds.",
    nextStep:
      "Volunteer with a community initiative and observe how organizations build partnerships.",
    relatedRoles: [
      "Public Relations Manager",
      "Community Relations Manager",
      "Partnership Manager",
    ],
    weights: {
      people: 5,
      communication: 5,
      service: 4,
      leadership: 3,
      organization: 2,
    },
  },
  {
    id: "financial-analyst",
    title: "Financial Analyst",
    pathway: "Finance + Business",
    description:
      "Uses financial information, trends and models to help organizations understand performance and make decisions.",
    environment:
      "Primarily professional office or hybrid environments with significant computer and analytical work.",
    education:
      "Finance, accounting, economics and business degrees are common pathways.",
    nextStep:
      "Learn to read a basic income statement and analyze the financial performance of a company.",
    relatedRoles: [
      "Investment Analyst",
      "FP&A Analyst",
      "Business Analyst",
    ],
    weights: {
      analytical: 5,
      computer: 4,
      organization: 3,
      problemSolving: 3,
      independence: 2,
    },
  },
  {
    id: "teacher",
    title: "Teacher / Educator",
    pathway: "Education",
    description:
      "Helps learners build knowledge, skills and confidence through instruction, coaching, feedback and relationships.",
    environment:
      "Schools, training organizations, community programs and other learning environments.",
    education:
      "Traditional teaching roles commonly require an education degree and state credential, although training roles vary.",
    nextStep:
      "Teach a skill to someone else and notice what helps them understand it.",
    relatedRoles: [
      "Instructional Coach",
      "Corporate Trainer",
      "Learning Designer",
    ],
    weights: {
      people: 5,
      communication: 5,
      service: 4,
      leadership: 2,
      creativity: 2,
    },
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    pathway: "Data + Technology",
    description:
      "Turns raw information into patterns, findings and visual explanations that help organizations make decisions.",
    environment:
      "Primarily computer-based work in business, healthcare, technology, government and many other industries.",
    education:
      "Degrees in analytics, statistics, business, economics or technology are common, alongside technical certificates and portfolios.",
    nextStep:
      "Use a spreadsheet or data tool to answer a real question with a dataset.",
    relatedRoles: [
      "Business Intelligence Analyst",
      "Operations Analyst",
      "Data Scientist",
    ],
    weights: {
      analytical: 5,
      computer: 5,
      technology: 3,
      problemSolving: 4,
      organization: 2,
    },
  },
  {
    id: "construction-manager",
    title: "Construction Manager",
    pathway: "Construction + Management",
    description:
      "Coordinates people, schedules, budgets, materials and safety to move construction projects from plans to completion.",
    environment:
      "Combination of jobsite, field and office work with frequent communication and problem solving.",
    education:
      "Construction management degrees are common, while trade and field experience can also lead into management.",
    nextStep:
      "Visit a construction project and learn how scheduling, trades and project leadership work together.",
    relatedRoles: [
      "Project Superintendent",
      "Estimator",
      "Construction Project Manager",
    ],
    weights: {
      leadership: 4,
      handsOn: 3,
      organization: 5,
      problemSolving: 4,
      movement: 3,
      people: 2,
    },
  },
];
