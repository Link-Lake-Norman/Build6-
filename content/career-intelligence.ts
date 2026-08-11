export type CareerPathway = {
  title: string;
  industry: string;
  whyItFits: string[];
  skillsToDevelop: string[];
  experiencesToTry: string[];
};


export type StudentCareerProfile = {
  studentId: string;
  strengths: string[];
  interests: string[];
  industries: string[];
  recommendedPathways: CareerPathway[];
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


export function generateCareerPathways(
  profile: StudentCareerProfile
): CareerPathway[] {

  const pathways: CareerPathway[] = [];


  if (
    profile.interests.includes("Sports") ||
    profile.interests.includes("Athletics")
  ) {

    pathways.push({

      title: "Sports Operations Manager",

      industry: "Sports",

      whyItFits: [
        "Uses teamwork and leadership experience.",
        "Connects athletic experience to business operations.",
        "Allows continued involvement in sports beyond playing."
      ],

      skillsToDevelop: [
        "Project Management",
        "Communication",
        "Business Operations"
      ],

      experiencesToTry: [
        "Shadow an athletic department.",
        "Interview a sports professional.",
        "Lead a team project."
      ]

    });


    pathways.push({

      title: "Sports Performance Analyst",

      industry: "Sports Technology",

      whyItFits: [
        "Connects sports knowledge with data and improvement.",
        "Supports athletes without being on the field."
      ],

      skillsToDevelop: [
        "Data Analysis",
        "Technology Skills",
        "Problem Solving"
      ],

      experiencesToTry: [
        "Analyze game statistics.",
        "Explore sports technology.",
        "Create a performance project."
      ]

    });

  }



  if (
    profile.interests.includes("Healthcare") ||
    profile.strengths.includes("Helping Others")
  ) {

    pathways.push({

      title: "Healthcare Operations Manager",

      industry: "Healthcare",

      whyItFits: [
        "Combines leadership with helping people.",
        "Uses organization and communication skills."
      ],

      skillsToDevelop: [
        "Healthcare Knowledge",
        "Leadership",
        "Process Improvement"
      ],

      experiencesToTry: [
        "Interview a healthcare leader.",
        "Visit a healthcare organization.",
        "Explore patient experience roles."
      ]

    });


    pathways.push({

      title: "Physical Therapy & Human Performance",

      industry: "Healthcare",

      whyItFits: [
        "Connects interest in movement, health, and performance.",
        "Supports athletes and patients."
      ],

      skillsToDevelop: [
        "Science Foundations",
        "Communication",
        "Patient Care"
      ],

      experiencesToTry: [
        "Shadow a physical therapist.",
        "Learn about sports medicine.",
        "Explore rehabilitation careers."
      ]

    });

  }



  pathways.push({

    title: "Business Development & Sales",

    industry: "Business",

    whyItFits: [
      "Uses communication, relationship building, and problem solving.",
      "Creates opportunities across many industries."
    ],

    skillsToDevelop: [
      "Negotiation",
      "Presentation Skills",
      "Relationship Management"
    ],

    experiencesToTry: [
      "Practice professional conversations.",
      "Interview a business leader.",
      "Complete a sales challenge."
    ]

  });



  pathways.push({

    title: "Marketing & Brand Strategy",

    industry: "Marketing",

    whyItFits: [
      "Uses creativity and storytelling.",
      "Connects people with ideas and organizations."
    ],

    skillsToDevelop: [
      "Digital Marketing",
      "Content Creation",
      "Communication"
    ],

    experiencesToTry: [
      "Create a marketing campaign.",
      "Analyze a brand.",
      "Build a portfolio project."
    ]

  });



  pathways.push({

    title: "Operations & Logistics",

    industry: "Operations",

    whyItFits: [
      "Uses organization and problem solving.",
      "Every industry needs people who improve systems."
    ],

    skillsToDevelop: [
      "Planning",
      "Data Skills",
      "Process Improvement"
    ],

    experiencesToTry: [
      "Study how a company operates.",
      "Explore supply chain careers.",
      "Complete an improvement project."
    ]

  });


  return pathways;

}
