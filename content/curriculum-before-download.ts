cat > content/curriculum.ts <<'EOF'
export type CurriculumWeek = {
  week: number;
  phase: string;
  title: string;
  objective: string;
  facilitatorGuide: string;
  discussionQuestions: string[];
  studentActivity: string;
  workplaceConnection: string;
  skillsEarned: string[];
  portfolioEvidence: string;
  badgeEarned: string;
};

export const curriculum: CurriculumWeek[] = [
  {
    week: 1,
    phase: "Discover Purpose",
    title: "Welcome to Future Ready™",
    objective:
      "Students understand the Future Ready journey and begin exploring who they are, their goals, and their future possibilities.",
    facilitatorGuide:
      "Introduce Future Ready as a journey of self-discovery, skill development, career exploration, and future planning.",
    discussionQuestions: [
      "What does being Future Ready mean to you?",
      "What are you curious to discover about yourself?",
      "Where do you see yourself in the future?"
    ],
    studentActivity:
      "Complete the Future Ready Identity Map and personal goals reflection.",
    workplaceConnection:
      "Employers look for self-awareness, communication, teamwork, reliability, and problem-solving skills.",
    skillsEarned: [
      "Self Awareness",
      "Reflection",
      "Communication"
    ],
    portfolioEvidence:
      "Future Ready Identity Map",
    badgeEarned:
      "Self Discovery Badge"
  },

  {
    week: 2,
    phase: "Discover Purpose",
    title: "Strengths & Values: Understanding What Drives Me",
    objective:
      "Students discover personal strengths, core values, and motivations.",
    facilitatorGuide:
      "Guide students through identifying strengths and values that influence their decisions.",
    discussionQuestions: [
      "What activities make you feel energized?",
      "What challenges have helped you grow?",
      "What values guide your decisions?"
    ],
    studentActivity:
      "Complete the Strengths and Values Assessment.",
    workplaceConnection:
      "Strong professionals understand themselves and align their strengths with opportunities.",
    skillsEarned: [
      "Self Awareness",
      "Decision Making",
      "Growth Mindset"
    ],
    portfolioEvidence:
      "Personal Strengths Profile",
    badgeEarned:
      "Strength Finder Badge"
  },

  {
    week: 3,
    phase: "Discover Purpose",
    title: "Personal Brand: How Others Experience Me",
    objective:
      "Students develop awareness of their reputation, communication style, and personal brand.",
    facilitatorGuide:
      "Introduce personal branding as the combination of actions, values, skills, and relationships that define how others experience you.",
    discussionQuestions: [
      "What words describe you today?",
      "How do your actions impact your reputation?",
      "What do you want people to know about you?"
    ],
    studentActivity:
      "Create a Future Ready Personal Brand Statement.",
    workplaceConnection:
      "Employers evaluate professionalism, communication, and authenticity.",
    skillsEarned: [
      "Professional Communication",
      "Confidence",
      "Personal Branding"
    ],
    portfolioEvidence:
      "Personal Brand Statement",
    badgeEarned:
      "Personal Brand Badge"
  },

  {
    week: 4,
    phase: "Discover Purpose",
    title: "Career Discovery: Exploring Possibilities",
    objective:
      "Students explore careers and industries connected to their strengths, interests, and goals.",
    facilitatorGuide:
      "Help students move from asking what job they want toward understanding what problems they want to solve.",
    discussionQuestions: [
      "What industries interest you?",
      "What problems would you like to solve?",
      "What careers connect with your strengths?"
    ],
    studentActivity:
      "Complete Career Exploration Map.",
    workplaceConnection:
      "Career success begins with curiosity, exploration, and relationship building.",
    skillsEarned: [
      "Career Awareness",
      "Research",
      "Networking"
    ],
    portfolioEvidence:
      "Career Exploration Map",
    badgeEarned:
      "Career Explorer Badge"
  },

  {
    week: 5,
    phase: "Discover Purpose",
    title: "Building Confidence & Resilience",
    objective:
      "Students develop confidence by recognizing growth, overcoming challenges, and learning from experiences.",
    facilitatorGuide:
      "Help students understand confidence is built through action, practice, reflection, and learning.",
    discussionQuestions: [
      "What is something difficult you have accomplished?",
      "What did a challenge teach you?",
      "How can mistakes help us grow?"
    ],
    studentActivity:
      "Complete the Confidence and Resilience Reflection.",
    workplaceConnection:
      "Employers value people who can adapt, learn, and overcome challenges.",
    skillsEarned: [
      "Confidence",
      "Resilience",
      "Growth Mindset"
    ],
    portfolioEvidence:
      "Personal Growth Reflection",
    badgeEarned:
      "Resilience Builder Badge"
  },


  {
    week: 6,
    phase: "Discover Purpose",
    title: "My Purpose Statement",
    objective:
      "Students connect strengths, values, and interests to create a personal purpose statement.",
    facilitatorGuide:
      "Guide students to identify how their abilities can create value and impact.",
    discussionQuestions: [
      "What matters most to you?",
      "What strengths do you want to use?",
      "How do you want to make an impact?"
    ],
    studentActivity:
      "Create a Future Ready Purpose Statement.",
    workplaceConnection:
      "Professionals who understand their purpose make stronger career decisions.",
    skillsEarned: [
      "Self Awareness",
      "Goal Setting",
      "Communication"
    ],
    portfolioEvidence:
      "Future Ready Purpose Statement",
    badgeEarned:
      "Purpose Builder Badge"
  },


  {
    week: 7,
    phase: "Discover Purpose",
    title: "Growth Mindset: Becoming a Lifelong Learner",
    objective:
      "Students understand that skills can improve through effort, practice, feedback, and persistence.",
    facilitatorGuide:
      "Teach students the difference between fixed mindset and growth mindset.",
    discussionQuestions: [
      "What skill are you currently improving?",
      "How do successful people respond to failure?",
      "Why is learning important in every career?"
    ],
    studentActivity:
      "Complete the Growth Mindset Reflection.",
    workplaceConnection:
      "Successful professionals continue learning throughout their careers.",
    skillsEarned: [
      "Adaptability",
      "Learning Agility",
      "Self Improvement"
    ],
    portfolioEvidence:
      "Growth Mindset Reflection",
    badgeEarned:
      "Growth Mindset Badge"
  },


  {
    week: 8,
    phase: "Build Skills",
    title: "Communication: The Skill Behind Every Career",
    objective:
      "Students develop communication skills through listening, speaking, questioning, and professional interaction.",
    facilitatorGuide:
      "Teach students that communication includes listening, understanding, and adapting messages for different audiences.",
    discussionQuestions: [
      "Why is communication important in every career?",
      "What makes someone a strong communicator?",
      "How can listening improve relationships?"
    ],
    studentActivity:
      "Practice professional introductions and active listening scenarios.",
    workplaceConnection:
      "Employers value employees who communicate clearly and build relationships.",
    skillsEarned: [
      "Communication",
      "Active Listening",
      "Professional Interaction"
    ],
    portfolioEvidence:
      "Professional Introduction",
    badgeEarned:
      "Communication Builder Badge"
  },


  {
    week: 9,
    phase: "Build Skills",
    title: "Professional Presence",
    objective:
      "Students understand workplace expectations and professional behaviors.",
    facilitatorGuide:
      "Explain that professionalism is built through reliability, respect, preparation, and accountability.",
    discussionQuestions: [
      "What does professionalism mean to you?",
      "How do small actions impact trust?",
      "What habits create a positive reputation?"
    ],
    studentActivity:
      "Complete Workplace Professionalism Scenarios.",
    workplaceConnection:
      "Employers need dependable team members who follow through.",
    skillsEarned: [
      "Professionalism",
      "Reliability",
      "Responsibility"
    ],
    portfolioEvidence:
      "Professional Habits Reflection",
    badgeEarned:
      "Professional Presence Badge"
  },


  {
    week: 10,
    phase: "Build Skills",
    title: "Teamwork & Collaboration",
    objective:
      "Students develop skills needed to work effectively with different people and perspectives.",
    facilitatorGuide:
      "Guide students through understanding team roles, trust, communication styles, and collaboration strategies.",
    discussionQuestions: [
      "What makes a team successful?",
      "What role do you naturally play on a team?",
      "How do different perspectives improve results?"
    ],
    studentActivity:
      "Complete a collaborative team challenge.",
    workplaceConnection:
      "Every career requires people who can collaborate and contribute to team success.",
    skillsEarned: [
      "Collaboration",
      "Teamwork",
      "Conflict Resolution"
    ],
    portfolioEvidence:
      "Team Challenge Reflection",
    badgeEarned:
      "Team Builder Badge"
  },
  {
    week: 11,
    phase: "Build Skills",
    title: "Problem Solving & Critical Thinking",

    objective:
      "Students learn how to identify challenges, evaluate options, and create solutions.",

    facilitatorGuide:
      "Help students understand that employers value people who can analyze situations and create solutions.",

    discussionQuestions: [
      "Why are problem-solving skills important?",
      "How do you approach challenges?",
      "What makes a solution effective?"
    ],

    studentActivity:
      "Complete a real-world problem-solving challenge.",

    workplaceConnection:
      "Organizations need employees who can think critically and solve problems.",

    skillsEarned: [
      "Critical Thinking",
      "Problem Solving",
      "Decision Making"
    ],

    portfolioEvidence:
      "Problem Solving Challenge",

    badgeEarned:
      "Problem Solver Badge"
  },


  {
    week: 12,
    phase: "Build Skills",
    title: "Leadership Starts With Me",

    objective:
      "Students understand leadership behaviors and personal responsibility.",

    facilitatorGuide:
      "Teach students that leadership begins with ownership, initiative, and helping others succeed.",

    discussionQuestions: [
      "What qualities make someone a leader?",
      "How can you demonstrate leadership?",
      "Why does accountability matter?"
    ],

    studentActivity:
      "Complete My Leadership Reflection.",

    workplaceConnection:
      "Employers value people who take initiative and positively influence others.",

    skillsEarned: [
      "Leadership",
      "Initiative",
      "Accountability"
    ],

    portfolioEvidence:
      "Leadership Reflection",

    badgeEarned:
      "Leadership Builder Badge"
  },


  {
    week: 13,
    phase: "Build Skills",
    title: "Adaptability & Change",

    objective:
      "Students develop the ability to respond positively to change.",

    facilitatorGuide:
      "Help students understand that careers and industries constantly evolve. Adaptability is a lifelong career skill.",

    discussionQuestions: [
      "How do you respond when things change?",
      "Why is learning important?",
      "What skills will future workers need?"
    ],

    studentActivity:
      "Complete the Future Skills Challenge.",

    workplaceConnection:
      "The workforce changes constantly, and adaptable employees remain valuable.",

    skillsEarned: [
      "Adaptability",
      "Flexibility",
      "Continuous Learning"
    ],

    portfolioEvidence:
      "Future Skills Reflection",

    badgeEarned:
      "Future Ready Mindset Badge"
  },


  {
    week: 14,
    phase: "Build Skills",
    title: "AI & The Future of Work",

    objective:
      "Students understand how artificial intelligence and technology are changing careers.",

    facilitatorGuide:
      "Introduce AI as a tool that supports human creativity, decision-making, and productivity.",

    discussionQuestions: [
      "How does technology impact careers?",
      "What skills will humans always need?",
      "How can AI be used responsibly?"
    ],

    studentActivity:
      "Complete the Human Skills + Technology Challenge.",

    workplaceConnection:
      "Future workplaces require technology awareness combined with human skills.",

    skillsEarned: [
      "Technology Awareness",
      "Critical Thinking",
      "Adaptability"
    ],

    portfolioEvidence:
      "AI & Future of Work Reflection",

    badgeEarned:
      "Future Technology Badge"
  },


  {
    week: 15,
    phase: "Build Skills",
    title: "Financial & Life Readiness",

    objective:
      "Students understand how career decisions connect to personal goals and financial choices.",

    facilitatorGuide:
      "Help students explore planning, responsibility, and how future decisions influence opportunities.",

    discussionQuestions: [
      "Why do career choices impact life choices?",
      "What does financial responsibility mean?",
      "How can planning create opportunities?"
    ],

    studentActivity:
      "Create My Future Life Plan.",

    workplaceConnection:
      "Successful professionals understand how work connects to personal goals.",

    skillsEarned: [
      "Planning",
      "Financial Awareness",
      "Decision Making"
    ],

    portfolioEvidence:
      "Future Life Plan",

    badgeEarned:
      "Life Ready Badge"
  },
  {
    week: 16,
    phase: "Explore Opportunities",
    title: "Career Discovery: Exploring Possibilities",

    objective:
      "Students explore careers and industries connected to their strengths, interests, and goals.",

    facilitatorGuide:
      "Help students move from asking 'What job do I want?' to understanding what problems they want to solve and what impact they want to make.",

    discussionQuestions: [
      "What careers interest you?",
      "What problems would you like to solve?",
      "What industries connect with your strengths?"
    ],

    studentActivity:
      "Complete Career Exploration Map.",

    workplaceConnection:
      "Career success begins with curiosity, exploration, and relationship building.",

    skillsEarned: [
      "Career Awareness",
      "Research",
      "Networking"
    ],

    portfolioEvidence:
      "Career Exploration Map",

    badgeEarned:
      "Career Explorer Badge"
  },


  {
    week: 17,
    phase: "Explore Opportunities",
    title: "Understanding Industries & Organizations",

    objective:
      "Students understand how industries operate and the variety of careers available within organizations.",

    facilitatorGuide:
      "Introduce students to different industries and how teams work together to create value.",

    discussionQuestions: [
      "What industries impact your community?",
      "What roles exist inside organizations?",
      "What careers are you curious about?"
    ],

    studentActivity:
      "Research an industry and identify career pathways.",

    workplaceConnection:
      "Organizations need people with different skills, experiences, and perspectives.",

    skillsEarned: [
      "Industry Awareness",
      "Research",
      "Career Exploration"
    ],

    portfolioEvidence:
      "Industry Exploration Report",

    badgeEarned:
      "Industry Explorer Badge"
  },


  {
    week: 18,
    phase: "Explore Opportunities",
    title: "Career Research Skills",

    objective:
      "Students learn how to research careers, education requirements, skills, and workplace environments.",

    facilitatorGuide:
      "Teach students how to gather information and evaluate career options.",

    discussionQuestions: [
      "What should you know before choosing a career?",
      "Why is research important?",
      "How do your interests guide choices?"
    ],

    studentActivity:
      "Complete a Career Investigation Worksheet.",

    workplaceConnection:
      "Successful professionals understand their industry and continue learning.",

    skillsEarned: [
      "Research",
      "Decision Making",
      "Career Planning"
    ],

    portfolioEvidence:
      "Career Investigation",

    badgeEarned:
      "Career Research Badge"
  },


  {
    week: 19,
    phase: "Explore Opportunities",
    title: "Employer Connection Experience",

    objective:
      "Students connect with professionals and learn from workplace experiences.",

    facilitatorGuide:
      "Prepare students to engage with employers through questions, curiosity, and professionalism.",

    discussionQuestions: [
      "What questions should you ask a professional?",
      "What can you learn from someone's journey?",
      "How do relationships create opportunities?"
    ],

    studentActivity:
      "Participate in an employer conversation, site visit, or career panel.",

    workplaceConnection:
      "Real-world connections help students understand careers and build professional networks.",

    skillsEarned: [
      "Networking",
      "Communication",
      "Career Awareness"
    ],

    portfolioEvidence:
      "Employer Experience Reflection",

    badgeEarned:
      "Career Connector Badge"
  },


  {
    week: 20,
    phase: "Explore Opportunities",
    title: "Workplace Culture & Fit",

    objective:
      "Students understand that career satisfaction includes finding environments that match their values.",

    facilitatorGuide:
      "Help students explore workplace expectations, environments, and organizational cultures.",

    discussionQuestions: [
      "What workplace helps you succeed?",
      "Why do values matter in a career?",
      "What environment brings out your best?"
    ],

    studentActivity:
      "Create My Ideal Workplace Profile.",

    workplaceConnection:
      "Employees are more successful when their values and workplace environment align.",

    skillsEarned: [
      "Self Awareness",
      "Career Alignment",
      "Decision Making"
    ],

    portfolioEvidence:
      "Workplace Culture Reflection",

    badgeEarned:
      "Workplace Awareness Badge"
  },


  {
    week: 21,
    phase: "Explore Opportunities",
    title: "Networking: Building Relationships",

    objective:
      "Students learn how relationships create learning and career opportunities.",

    facilitatorGuide:
      "Teach students that networking is about authentic relationships, not simply asking for opportunities.",

    discussionQuestions: [
      "Why are relationships important?",
      "How can you introduce yourself professionally?",
      "Who can help you learn?"
    ],

    studentActivity:
      "Create and practice a Future Ready Introduction.",

    workplaceConnection:
      "Professionals grow through relationships, mentors, and connections.",

    skillsEarned: [
      "Networking",
      "Communication",
      "Confidence"
    ],

    portfolioEvidence:
      "Professional Introduction",

    badgeEarned:
      "Networking Builder Badge"
  },
  {
    week: 22,
    phase: "Explore Opportunities",
    title: "Resume Foundations",

    objective:
      "Students learn how to communicate experiences, skills, and accomplishments.",

    facilitatorGuide:
      "Help students recognize that experiences come from school, sports, projects, volunteering, and leadership.",

    discussionQuestions: [
      "What experiences have helped you grow?",
      "What skills have you developed?",
      "How can you show your value?"
    ],

    studentActivity:
      "Create the first draft of a Future Ready Resume.",

    workplaceConnection:
      "Employers want to understand what candidates can contribute.",

    skillsEarned: [
      "Professional Writing",
      "Self Presentation",
      "Reflection"
    ],

    portfolioEvidence:
      "Future Ready Resume Draft",

    badgeEarned:
      "Resume Ready Badge"
  },


  {
    week: 23,
    phase: "Explore Opportunities",
    title: "Interview Skills",

    objective:
      "Students build confidence communicating their experiences and strengths.",

    facilitatorGuide:
      "Teach students how to answer questions using examples, stories, and reflection.",

    discussionQuestions: [
      "What makes someone confident in an interview?",
      "Why are examples important?",
      "How can preparation improve performance?"
    ],

    studentActivity:
      "Complete mock interview practice.",

    workplaceConnection:
      "Strong communication helps employers understand a candidate's potential.",

    skillsEarned: [
      "Communication",
      "Confidence",
      "Professional Presence"
    ],

    portfolioEvidence:
      "Interview Reflection",

    badgeEarned:
      "Interview Ready Badge"
  },


  {
    week: 24,
    phase: "Explore Opportunities",
    title: "Career Explorer Milestone",

    objective:
      "Students demonstrate progress in career awareness and professional preparation.",

    facilitatorGuide:
      "Celebrate student growth and reinforce the importance of exploration, relationships, and preparation.",

    discussionQuestions: [
      "What career possibilities interest you?",
      "What connections have you made?",
      "What is your next step?"
    ],

    studentActivity:
      "Complete Career Explorer Portfolio Review.",

    workplaceConnection:
      "Career readiness grows through exploration, experience, and relationships.",

    skillsEarned: [
      "Career Planning",
      "Networking",
      "Professional Readiness"
    ],

    portfolioEvidence:
      "Career Explorer Portfolio",

    badgeEarned:
      "Future Ready Career Explorer Badge"
  },


  {
    week: 25,
    phase: "Launch Your Future",
    title: "Building My Professional Profile",

    objective:
      "Students create a professional profile that communicates strengths, skills, experiences, and goals.",

    facilitatorGuide:
      "Guide students in combining their personal brand, skills, experiences, and career interests into a professional identity.",

    discussionQuestions: [
      "How do you want employers to see you?",
      "What strengths do you want to highlight?",
      "What makes you unique?"
    ],

    studentActivity:
      "Create a Future Ready Professional Profile.",

    workplaceConnection:
      "Professionals must communicate their value and demonstrate their skills.",

    skillsEarned: [
      "Personal Branding",
      "Communication",
      "Self Presentation"
    ],

    portfolioEvidence:
      "Professional Profile",

    badgeEarned:
      "Professional Profile Badge"
  },


  {
    week: 26,
    phase: "Launch Your Future",
    title: "Building My Career Portfolio",

    objective:
      "Students organize evidence of their skills, accomplishments, experiences, and growth.",

    facilitatorGuide:
      "Help students understand that portfolios demonstrate what they know and what they can do.",

    discussionQuestions: [
      "What experiences demonstrate your skills?",
      "Why is evidence important?",
      "How can you show growth?"
    ],

    studentActivity:
      "Build the Future Ready Student Portfolio.",

    workplaceConnection:
      "Employers value candidates who can demonstrate skills through experiences.",

    skillsEarned: [
      "Organization",
      "Reflection",
      "Professional Presentation"
    ],

    portfolioEvidence:
      "Future Ready Portfolio",

    badgeEarned:
      "Portfolio Builder Badge"
  },


  {
    week: 27,
    phase: "Launch Your Future",
    title: "Internship & Workplace Readiness",

    objective:
      "Students prepare for internships, job experiences, and workplace expectations.",

    facilitatorGuide:
      "Review workplace expectations including communication, reliability, professionalism, and learning mindset.",

    discussionQuestions: [
      "What makes someone successful in an internship?",
      "How should you handle challenges?",
      "What questions should you ask?"
    ],

    studentActivity:
      "Complete Internship Readiness Checklist.",

    workplaceConnection:
      "Workplace experiences help students apply skills and discover career interests.",

    skillsEarned: [
      "Professionalism",
      "Responsibility",
      "Workplace Readiness"
    ],

    portfolioEvidence:
      "Internship Readiness Plan",

    badgeEarned:
      "Workplace Ready Badge"
  },
  {
    week: 28,
    phase: "Launch Your Future",
    title: "Mentorship & Professional Relationships",

    objective:
      "Students understand the importance of mentors, relationships, and professional networks.",

    facilitatorGuide:
      "Help students identify mentors and understand how relationships support growth.",

    discussionQuestions: [
      "What makes a good mentor?",
      "Who can help guide your future?",
      "How can you build meaningful relationships?"
    ],

    studentActivity:
      "Create a Personal Mentorship Map.",

    workplaceConnection:
      "Successful professionals learn from others and build strong relationships.",

    skillsEarned: [
      "Networking",
      "Relationship Building",
      "Communication"
    ],

    portfolioEvidence:
      "Mentorship Map",

    badgeEarned:
      "Relationship Builder Badge"
  },


  {
    week: 29,
    phase: "Launch Your Future",
    title: "Goal Setting & Future Planning",

    objective:
      "Students create short-term and long-term goals connected to their future vision.",

    facilitatorGuide:
      "Teach students how to create goals, identify action steps, and track progress.",

    discussionQuestions: [
      "What do you want to accomplish?",
      "What steps will move you forward?",
      "How will you measure success?"
    ],

    studentActivity:
      "Create My Future Ready Action Plan.",

    workplaceConnection:
      "Professionals who set goals are more intentional and successful.",

    skillsEarned: [
      "Goal Setting",
      "Planning",
      "Accountability"
    ],

    portfolioEvidence:
      "Future Action Plan",

    badgeEarned:
      "Goal Setter Badge"
  },


  {
    week: 30,
    phase: "Launch Your Future",
    title: "Career Decision Making",

    objective:
      "Students evaluate options and make informed decisions about education, careers, and opportunities.",

    facilitatorGuide:
      "Help students understand career decisions should connect strengths, values, skills, and opportunities.",

    discussionQuestions: [
      "What factors influence career decisions?",
      "How can you make informed choices?",
      "Why is flexibility important?"
    ],

    studentActivity:
      "Complete My Career Decision Framework.",

    workplaceConnection:
      "Successful professionals continuously evaluate opportunities and make thoughtful decisions.",

    skillsEarned: [
      "Decision Making",
      "Critical Thinking",
      "Planning"
    ],

    portfolioEvidence:
      "Career Decision Framework",

    badgeEarned:
      "Future Planner Badge"
  },


  {
    week: 31,
    phase: "Launch Your Future",
    title: "Student Showcase Preparation",

    objective:
      "Students prepare to present their growth, skills, and future goals.",

    facilitatorGuide:
      "Coach students on storytelling, presentation skills, and confidently communicating their journey.",

    discussionQuestions: [
      "What growth are you most proud of?",
      "What skills have you developed?",
      "What do you want others to know?"
    ],

    studentActivity:
      "Prepare Future Ready Showcase Presentation.",

    workplaceConnection:
      "Professionals must communicate accomplishments and share their value.",

    skillsEarned: [
      "Presentation Skills",
      "Confidence",
      "Communication"
    ],

    portfolioEvidence:
      "Future Ready Showcase",

    badgeEarned:
      "Storyteller Badge"
  },


  {
    week: 32,
    phase: "Launch Your Future",
    title: "Future Ready Reflection",

    objective:
      "Students reflect on their growth and recognize how they have changed throughout the program.",

    facilitatorGuide:
      "Celebrate student progress and encourage continued development.",

    discussionQuestions: [
      "How have you grown?",
      "What skills will you continue developing?",
      "What are you ready for next?"
    ],

    studentActivity:
      "Complete Final Future Ready Reflection.",

    workplaceConnection:
      "Growth mindset and reflection help professionals continue improving.",

    skillsEarned: [
      "Reflection",
      "Self Awareness",
      "Growth Mindset"
    ],

    portfolioEvidence:
      "Final Reflection",

    badgeEarned:
      "Growth Journey Badge"
  },


  {
    week: 33,
    phase: "Launch Your Future",
    title: "Future Ready Graduation & Launch",

    objective:
      "Students celebrate completion of the Future Ready journey and prepare for their next step.",

    facilitatorGuide:
      "Celebrate students, recognize accomplishments, and reinforce that being Future Ready is a lifelong mindset.",

    discussionQuestions: [
      "What are you most proud of?",
      "What future opportunity are you excited about?",
      "How will you continue being Future Ready?"
    ],

    studentActivity:
      "Complete Future Ready Graduation Portfolio and Commitment Statement.",

    workplaceConnection:
      "Career readiness is a lifelong journey of learning, growth, and connection.",

    skillsEarned: [
      "Leadership",
      "Professional Readiness",
      "Future Planning"
    ],

    portfolioEvidence:
      "Future Ready Graduate Portfolio",

    badgeEarned:
      "Future Ready Graduate Badge"
  }

];
