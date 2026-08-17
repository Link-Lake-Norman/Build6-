import type { AIGeneratedActivity, AIActivityType } from "./ai-activity-types";

import { curriculum } from "./curriculum";

export type AILessonRequest = {
  week: number;
  day: string;
  topic: string;
  objective: string;
  activityType: AIActivityType;
  audience: string;
  variation?: number;

  existingTaskTitles?: string[];
  availableMinutes?: number;
  classSize?: number;
};

export const AI_ACTIVITY_OPTIONS: AIActivityType[] = [
  "Role Play",
  "Case Scenario",
  "Improv",
  "Team Building",
  "Pop Quiz",
  "Reflection",
  "Career Connection",
  "Media Practice",
  "Capstone Workshop",
  "Guest Speaker Preparation",
];

export function generateActivityOptions(
  request: AILessonRequest,
): AIGeneratedActivity[] {
  const lesson = curriculum.find((item) => item.week === request.week);

  const title = lesson?.title ?? request.topic;
  const objective = lesson?.objective ?? request.objective;
  const workplaceConnection =
    lesson?.workplaceConnection ??
    "Students connect this Future Ready skill to real workplace expectations.";

  const skills = lesson?.skillsEarned ?? [];
  const discussionQuestions = lesson?.discussionQuestions ?? [];

  const existingTaskTitles = request.existingTaskTitles ?? [];

  let activity = buildActivity(
    request.activityType,
    title,
    objective,
    workplaceConnection,
    skills,
    discussionQuestions,
    lesson?.studentActivity ?? "",
    lesson?.portfolioEvidence ?? "",
    request.variation ?? 1,
    request.day,
    request.availableMinutes ?? 20,
    request.classSize ?? 20,
  );

  for (let attempt = 1; attempt <= 12; attempt += 1) {
    const normalizedTitle = activity.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

    const duplicate = existingTaskTitles.some((existing) => {
      const normalizedExisting = existing
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

      return (
        normalizedExisting === normalizedTitle ||
        normalizedExisting.includes(normalizedTitle) ||
        normalizedTitle.includes(normalizedExisting)
      );
    });

    if (!duplicate) {
      break;
    }

    activity = buildActivity(
      request.activityType,
      title,
      objective,
      workplaceConnection,
      skills,
      discussionQuestions,
      lesson?.studentActivity ?? "",
      lesson?.portfolioEvidence ?? "",
      (request.variation ?? 1) + attempt,
      request.day,
      request.availableMinutes ?? 20,
      request.classSize ?? 20,
    );
  }

  return [activity];
}

function buildActivity(
  activityType: AIActivityType,
  lessonTitle: string,
  objective: string,
  workplaceConnection: string,
  skills: string[],
  discussionQuestions: string[],
  studentActivity: string,
  portfolioEvidence: string,
  variation: number,
  day: string,
  availableMinutes: number,
  classSize: number,
): AIGeneratedActivity {
  /*
   * The previous engine only had three variants and then repeated.
   * We now use a much larger deterministic variation space that also
   * changes by day, class time, and class size.
   */
  const variant =
    Math.abs(
      variation * 7 + day.length * 11 + availableMinutes * 3 + classSize,
    ) % 18;

  const scenarioVariant = variant % 6;
  const deliveryVariant = Math.floor(variant / 3) % 6;

  const challengeModifiers = [
    "with a 90-second decision deadline",
    "after receiving incomplete information",
    "while another stakeholder disagrees",
    "after an unexpected change is introduced",
    "with a customer or supervisor waiting for an answer",
    "while balancing professionalism, speed, and quality",
  ];

  const deliveryFormats = [
    "first attempt, coaching, and immediate replay",
    "individual decision followed by team negotiation",
    "pairs followed by a live hot-seat demonstration",
    "small-group challenge followed by a 60-second executive report",
    "rotating roles with peer observation",
    "silent individual preparation followed by rapid-response rounds",
  ];

  const challengeModifier = challengeModifiers[scenarioVariant];

  const deliveryFormat = deliveryFormats[deliveryVariant];
  switch (activityType) {
    case "Role Play":
      return {
        title: `${lessonTitle}: ${day} Professional Response Challenge ${variation}`,
        activityType: "Role Play",

        lessonConnection: lessonTitle,
        learningObjective: objective,

        whyThisMatters: `${workplaceConnection} Students practice translating who they are into language they could actually use with an employer, mentor, teacher, or professional connection.`,

        facilitatorBackground:
          "Students often know more about themselves than they know how to communicate. This exercise helps them turn everyday experiences from school, sports, jobs, family responsibilities, volunteering, and personal challenges into evidence of transferable skills.",

        classroomSetup:
          "Place students in groups of three. Each group needs an Interviewer, Student Candidate, and Skills Observer. Students rotate until everyone has practiced all three roles.",

        materials: [
          "Future Ready Identity Map or blank paper",
          "Pen or pencil",
          "Transferable Skills prompt list",
          "Observer feedback notes",
        ],

        teachingPoints: [
          ...skills,
          "An experience becomes valuable when you can explain what it taught you.",
          "Students do not need formal job experience to have workplace skills.",
          "Specific examples are stronger than simply naming a skill.",
        ],

        openingConversation: [
          "If an employer asked, 'Tell me about yourself,' what would you say after your name?",
          "What have sports, school, work, family responsibilities, volunteering, or life taught you?",
          "Which of those experiences prove something about how you work?",
        ],

        examplesToShare: [
          "Being team captain can demonstrate leadership and accountability.",
          "Balancing school and athletics can demonstrate time management.",
          "Helping care for siblings can demonstrate responsibility.",
          "Working through a difficult class can demonstrate persistence and adaptability.",
        ],

        facilitatorQuestions: discussionQuestions,

        observationGuide: [
          "Does the student give a specific experience rather than only naming a skill?",
          "Can the student explain what that experience taught them?",
          "Does the student communicate with confidence and clarity?",
          "Can the observer identify transferable skills in the student's story?",
        ],

        debriefGuide: [
          "Ask which experiences students originally underestimated.",
          "Discuss the difference between saying 'I am a leader' and proving leadership with an example.",
          "Connect the strongest examples to interviews, networking, resumes, and future opportunities.",
        ],

        studentRoles: [
          {
            role: "Student Candidate",
            responsibility:
              "Answer the interviewer's questions using real experiences from school, athletics, work, volunteering, family responsibilities, or life.",
          },
          {
            role: "Interviewer",
            responsibility:
              "Ask the candidate questions and push for specific examples when an answer is too general.",
          },
          {
            role: "Skills Observer",
            responsibility:
              "Listen for transferable skills demonstrated in the candidate's answers and record evidence.",
          },
        ],

        facilitatorScript: [
          "Say: 'Today we are going to prove that you already have skills employers value—even if you have never had a formal job.'",
          "Ask students to think of three experiences that have shaped them.",
          "Explain: 'Your job is not just to tell us what you did. Tell us what it proves about you.'",
          "Model an example: 'I played basketball' becomes 'Basketball taught me how to receive feedback, communicate under pressure, and stay accountable to a team.'",
          "Place students into groups of three and assign the first roles.",
          "Tell interviewers to ask follow-up questions whenever they hear a vague answer.",
          "Rotate roles so every student practices speaking, interviewing, and identifying skills.",
          "Close by asking students which experience they will now describe differently.",
        ],

        stepByStepInstructions: [
          `Today's delivery format: ${deliveryFormat}.`,
          `Add the workplace pressure: ${challengeModifier}.`,
          "Individually, students write down three experiences that have shaped them.",
          "Beside each experience, students identify at least one skill it helped them develop.",
          "Student Candidate begins with a 30-second answer to: 'Tell me about yourself beyond your name, grade, or position.'",
          "Interviewer asks: 'Tell me about a time you had to work with someone different from you.'",
          "Interviewer asks: 'Tell me about a challenge you had to work through.'",
          "Interviewer asks: 'What is something people depend on you for?'",
          "Skills Observer records the skills demonstrated by each answer and the evidence they heard.",
          "Observer gives the candidate one strength and one suggestion for making an answer more specific.",
          "Students rotate roles and repeat.",
          `Students connect the exercise to the lesson assignment: ${studentActivity || "their Future Ready identity work."}`,
        ],

        discussionQuestions: [
          ...discussionQuestions,
          "Which experience revealed a skill you had never thought about before?",
          "Which answer sounded strongest and why?",
          "What is the difference between claiming a skill and proving it?",
        ],

        reflectionPrompts: [
          "One experience that says something important about who I am is ______.",
          "That experience helped me develop ______.",
          "The evidence that proves I have this skill is ______.",
          "If an employer asked me to describe myself, I would now say ______.",
        ],

        assessmentRubric: [
          "Self Awareness",
          "Communication",
          "Specific Evidence",
          "Transferable Skill Recognition",
        ],

        portfolioEvidence:
          portfolioEvidence ||
          "Future Ready Identity interview reflection and transferable skills evidence.",

        capstoneConnection:
          "Students preserve their strongest experience-to-skill examples for future resumes, interviews, personal branding, portfolio evidence, and their Future Ready capstone.",
      };

    case "Case Scenario":
      return {
        title: `${lessonTitle}: Who Would You Choose?`,
        activityType: "Case Scenario",

        lessonConnection: lessonTitle,
        learningObjective: objective,

        whyThisMatters: `${workplaceConnection} Students learn that employers evaluate behaviors and evidence—not simply titles, grades, or whether someone has previously held a formal job.`,

        facilitatorBackground:
          "This scenario asks students to evaluate several fictional candidates whose experiences demonstrate different transferable skills. Students must defend a hiring recommendation using evidence.",

        classroomSetup:
          "Divide students into small hiring committees of three to five students. Each committee evaluates the same three fictional candidates.",

        materials: [
          "Paper or Future Ready workbook",
          "Candidate notes",
          "Pen or pencil",
          "Hiring decision worksheet",
        ],

        teachingPoints: [
          ...skills,
          "Transferable skills can come from many types of experience.",
          "Employers look for evidence of behavior.",
          "A title does not automatically make one candidate stronger than another.",
        ],

        openingConversation: [
          "Would you rather hire someone with experience but poor reliability, or less experience and strong evidence of learning quickly?",
          "What actually makes someone valuable on a team?",
        ],

        examplesToShare: [
          "A student athlete may demonstrate discipline and teamwork.",
          "A part-time employee may demonstrate customer service and reliability.",
          "A student with family responsibilities may demonstrate organization and accountability.",
        ],

        facilitatorQuestions: discussionQuestions,

        observationGuide: [
          "Are students using evidence to defend their decision?",
          "Are students recognizing skills from non-work experiences?",
          "Can students distinguish experience from transferable ability?",
        ],

        debriefGuide: [
          "Compare hiring decisions across groups.",
          "Ask what evidence changed students' opinions.",
          "Connect candidate evaluation back to how students present their own experiences.",
        ],

        studentRoles: [
          {
            role: "Hiring Committee Member",
            responsibility:
              "Evaluate each candidate and identify evidence of workplace-ready skills.",
          },
          {
            role: "Decision Advocate",
            responsibility:
              "Defend the group's final candidate selection using specific evidence.",
          },
          {
            role: "Evidence Checker",
            responsibility:
              "Challenge assumptions and require the group to explain what evidence supports each conclusion.",
          },
        ],

        facilitatorScript: [
          "Say: 'You are now the hiring committee. You have one opening and three candidates.'",
          "Explain that there is no automatic correct choice; students must defend their decision with evidence.",
          "Read the three candidate profiles.",
          "Give teams time to identify strengths, risks, and transferable skills.",
          "Require each team to select one candidate.",
          "Have teams present their decision and evidence.",
          "Reveal that the real purpose was learning how experiences communicate skills.",
        ],

        stepByStepInstructions: [
          `Today's delivery format: ${deliveryFormat}.`,
          `Add the workplace pressure: ${challengeModifier}.`,
          "Candidate A has excellent grades and several school awards but gives vague examples of teamwork and admits frequently missing commitments.",
          "Candidate B has average grades, plays a team sport, helps care for younger siblings, and describes how those responsibilities taught organization, patience, and accountability.",
          "Candidate C has previous part-time work experience but describes repeated conflicts with coworkers and says they prefer working only when someone tells them exactly what to do.",
          "Teams identify at least three strengths or concerns for each candidate.",
          "Teams identify the transferable skills demonstrated by each candidate.",
          "Teams choose the candidate they would hire.",
          "Teams must cite at least three pieces of evidence supporting the decision.",
          "Each committee presents its recommendation.",
          "Class discusses why different groups made different choices.",
          "Students identify what their own experiences currently communicate about them.",
        ],

        discussionQuestions: [
          ...discussionQuestions,
          "What mattered more than you expected when evaluating the candidates?",
          "What evidence made a candidate believable?",
          "What would you want an employer to recognize about you?",
        ],

        reflectionPrompts: [
          "The candidate I selected was ______ because ______.",
          "The most important evidence was ______.",
          "One skill my own experiences demonstrate is ______.",
          "I can prove that skill by explaining ______.",
        ],

        assessmentRubric: [
          "Evidence-Based Decision Making",
          "Self Awareness",
          "Communication",
          "Critical Thinking",
        ],

        portfolioEvidence:
          portfolioEvidence ||
          "Candidate evaluation and personal transferable-skills reflection.",

        capstoneConnection:
          "Students use the same evidence-based thinking to identify experiences they can feature in their Future Ready portfolio.",
      };

    case "Improv":
      return createImprov(
        lessonTitle,
        objective,
        workplaceConnection,
        skills,
        discussionQuestions,
        portfolioEvidence,
        day,
        deliveryFormat,
        challengeModifier,
        classSize,
        availableMinutes,
      );

    case "Team Building":
      return createTeamBuilding(
        lessonTitle,
        objective,
        workplaceConnection,
        skills,
        discussionQuestions,
        portfolioEvidence,
        day,
        deliveryFormat,
        challengeModifier,
        classSize,
        availableMinutes,
      );

    case "Pop Quiz":
      return createPopQuiz(
        lessonTitle,
        objective,
        workplaceConnection,
        skills,
        discussionQuestions,
        portfolioEvidence,
        day,
        deliveryFormat,
        challengeModifier,
        classSize,
        availableMinutes,
      );

    default:
      return createTeamBuilding(
        lessonTitle,
        objective,
        workplaceConnection,
        skills,
        discussionQuestions,
        portfolioEvidence,
        day,
        deliveryFormat,
        challengeModifier,
        classSize,
        availableMinutes,
      );
  }
}

function createImprov(
  lessonTitle: string,
  objective: string,
  workplaceConnection: string,
  skills: string[],
  discussionQuestions: string[],
  portfolioEvidence: string,
  day: string,
  deliveryFormat: string,
  challengeModifier: string,
  classSize: number,
  availableMinutes: number,
): AIGeneratedActivity {
  return {
    title: `${lessonTitle}: 30-Second Story Switch`,
    activityType: "Improv",
    lessonConnection: lessonTitle,
    learningObjective: objective,
    whyThisMatters: workplaceConnection,
    facilitatorBackground:
      "Students practice thinking on their feet while connecting real experiences to transferable skills.",
    classroomSetup: `${day}: ${deliveryFormat}. Class size: ${classSize}. ${availableMinutes} minutes available. Students stand or sit in a circle. One student responds at a time to a randomly selected experience prompt.`,
    materials: ["Experience prompts", "Timer", "Paper or reflection journal"],
    teachingPoints: [
      ...skills,
      "Confidence improves through practice.",
      "Strong professional stories connect an experience to what was learned.",
    ],
    openingConversation: [
      "Could you explain what one of your experiences taught you with no preparation?",
    ],
    examplesToShare: [
      "A mistake can demonstrate learning.",
      "A difficult teammate can demonstrate communication.",
      "An unexpected change can demonstrate adaptability.",
    ],
    facilitatorQuestions: discussionQuestions,
    observationGuide: [
      "Listen for specific experiences.",
      "Listen for a clear skill connection.",
      "Notice confidence and communication.",
    ],
    debriefGuide: [
      "Ask which prompts were hardest.",
      "Identify strong experience-to-skill connections.",
    ],
    studentRoles: [
      {
        role: "Speaker",
        responsibility:
          "Respond to the prompt for 30 seconds using a real experience.",
      },
      {
        role: "Skill Spotter",
        responsibility:
          "Identify the transferable skill demonstrated in the story.",
      },
    ],
    facilitatorScript: [
      "Say: 'You will have 30 seconds. No perfect answers and no long preparation.'",
      "Give a student an experience prompt.",
      "After the response, ask another student to identify the skill they heard.",
      "Continue rapidly so students practice communicating without overthinking.",
    ],
    stepByStepInstructions: [
      `Today's delivery format: ${deliveryFormat}.`,
      `Add the workplace pressure: ${challengeModifier}.`,
      "Choose a student to begin.",
      "Give the student one prompt: a challenge you overcame, a time you helped someone, a mistake you learned from, a time your team needed you, or something you taught yourself.",
      "Student has five seconds to think.",
      "Student speaks for up to 30 seconds.",
      "Another student names the skill demonstrated.",
      "Speaker explains whether they agree and why.",
      "Continue until every student has participated.",
    ],
    discussionQuestions: [
      ...discussionQuestions,
      "Which stories revealed skills most clearly?",
      "What made an answer memorable?",
    ],
    reflectionPrompts: [
      "The story I want to remember for a future interview is ______.",
      "It demonstrates ______ because ______.",
    ],
    assessmentRubric: [
      "Communication",
      "Confidence",
      "Self Awareness",
      "Skill Recognition",
    ],
    portfolioEvidence:
      portfolioEvidence || "Experience-to-skill story reflection.",
    capstoneConnection:
      "Strong stories can later become interview examples, portfolio evidence, and personal-brand content.",
  };
}

function createTeamBuilding(
  lessonTitle: string,
  objective: string,
  workplaceConnection: string,
  skills: string[],
  discussionQuestions: string[],
  portfolioEvidence: string,
  day: string,
  deliveryFormat: string,
  challengeModifier: string,
  classSize: number,
  availableMinutes: number,
): AIGeneratedActivity {
  return {
    title: `${lessonTitle}: Hidden Strengths Team Challenge`,
    activityType: "Team Building",
    lessonConnection: lessonTitle,
    learningObjective: objective,
    whyThisMatters: workplaceConnection,
    facilitatorBackground:
      "Students often recognize strengths in peers more easily than in themselves. This activity uses peer evidence to strengthen self-awareness.",
    classroomSetup: `${day}: ${deliveryFormat}. Class size: ${classSize}. ${availableMinutes} minutes available. Create teams of four to five students.`,
    materials: [
      "Index cards or paper",
      "Pens",
      "Future Ready reflection journal",
    ],
    teachingPoints: [
      ...skills,
      "Strengths are demonstrated through behavior.",
      "Other people can provide useful evidence about how we contribute.",
    ],
    openingConversation: [
      "What strengths might other people see in you that you overlook?",
    ],
    examplesToShare: [
      "The person who keeps a group organized may demonstrate leadership.",
      "The person who notices when someone needs help may demonstrate emotional intelligence.",
    ],
    facilitatorQuestions: discussionQuestions,
    observationGuide: [
      "Watch whether feedback is specific and constructive.",
      "Ask students to provide evidence for the strengths they identify.",
    ],
    debriefGuide: [
      "Discuss unexpected feedback.",
      "Connect peer observations to future professional identity.",
    ],
    studentRoles: [
      {
        role: "Team Member",
        responsibility:
          "Identify specific strengths demonstrated by peers and provide evidence.",
      },
    ],
    facilitatorScript: [
      "Say: 'Your teammates may notice strengths in you that you do not recognize yourself.'",
      "Require all feedback to include an example or reason.",
      "Keep feedback focused on strengths, behaviors, and contributions.",
    ],
    stepByStepInstructions: [
      `Today's delivery format: ${deliveryFormat}.`,
      `Add the workplace pressure: ${challengeModifier}.`,
      "Each student writes their name at the top of a sheet.",
      "Pass each sheet around the team.",
      "Every teammate writes one strength they have observed in that student.",
      "Beside the strength, they write a specific example or reason.",
      "Return sheets to their owners.",
      "Students circle the two strengths that appear most important or surprising.",
      "Students write how those strengths could transfer into a workplace.",
      "Teams discuss what different strengths contribute to successful groups.",
    ],
    discussionQuestions: [
      ...discussionQuestions,
      "Which strength surprised you?",
      "What evidence made the feedback meaningful?",
    ],
    reflectionPrompts: [
      "Others see ______ as one of my strengths.",
      "The evidence they gave was ______.",
      "I can use this strength in the future by ______.",
    ],
    assessmentRubric: [
      "Self Awareness",
      "Collaboration",
      "Constructive Feedback",
      "Communication",
    ],
    portfolioEvidence: portfolioEvidence || "Peer strengths evidence sheet.",
    capstoneConnection:
      "Students preserve verified strengths and supporting examples as evidence of their developing professional identity.",
  };
}

function createPopQuiz(
  lessonTitle: string,
  objective: string,
  workplaceConnection: string,
  skills: string[],
  discussionQuestions: string[],
  portfolioEvidence: string,
  day: string,
  deliveryFormat: string,
  challengeModifier: string,
  classSize: number,
  availableMinutes: number,
): AIGeneratedActivity {
  return {
    title: `${lessonTitle}: Skill or Just a Task?`,
    activityType: "Pop Quiz",
    lessonConnection: lessonTitle,
    learningObjective: objective,
    whyThisMatters: workplaceConnection,
    facilitatorBackground:
      "This quick assessment checks whether students can identify transferable skills hidden inside ordinary experiences.",
    classroomSetup: `${day}: ${deliveryFormat}. Class size: ${classSize}. ${availableMinutes} minutes available. Students answer individually before reviewing responses as a class.`,
    materials: ["Paper or Future Ready journal", "Pen or pencil"],
    teachingPoints: [
      ...skills,
      "Tasks describe what you did; skills explain what you demonstrated.",
    ],
    openingConversation: [
      "What is the difference between saying what you did and explaining what skill it proves?",
    ],
    examplesToShare: [
      "'Worked the front desk' is a task; communication and customer service are skills demonstrated through it.",
    ],
    facilitatorQuestions: discussionQuestions,
    observationGuide: [
      "Check whether students can translate experiences into skills.",
    ],
    debriefGuide: [
      "Review each answer and require students to explain their reasoning.",
    ],
    studentRoles: [
      {
        role: "Individual Challenger",
        responsibility:
          "Identify the strongest transferable skill demonstrated in each situation.",
      },
    ],
    facilitatorScript: [
      "Say: 'For each situation, write the workplace skill you think is being demonstrated.'",
      "After each question, ask students to defend their answer with evidence.",
    ],
    stepByStepInstructions: [
      `Today's delivery format: ${deliveryFormat}.`,
      `Add the workplace pressure: ${challengeModifier}.`,
      "1. A student balances athletics, school, and a weekend job. What skills might this demonstrate?",
      "2. A teammate notices conflict and helps two people reach a solution. What skill is being demonstrated?",
      "3. A student receives critical feedback and changes their approach. What skill is being demonstrated?",
      "4. A student teaches themselves new software to finish a project. What skills might this demonstrate?",
      "5. A student consistently arrives prepared and completes what they promise. What does this demonstrate?",
      "6. Write one experience from your own life and identify two transferable skills it proves.",
      "Review answers as a class and require evidence for each response.",
    ],
    discussionQuestions: [
      ...discussionQuestions,
      "Why can the same experience demonstrate more than one skill?",
    ],
    reflectionPrompts: [
      "An everyday experience I previously overlooked is ______.",
      "It demonstrates ______ and ______.",
    ],
    assessmentRubric: [
      "Skill Recognition",
      "Evidence",
      "Self Awareness",
      "Application",
    ],
    portfolioEvidence:
      portfolioEvidence || "Transferable skills quiz and personal example.",
    capstoneConnection:
      "Students begin building an evidence bank connecting experiences to Future Ready skills.",
  };
}
