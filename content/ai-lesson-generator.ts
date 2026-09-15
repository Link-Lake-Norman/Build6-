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

  let activity =
    request.week === 5
      ? buildWeek5Activity(
          request.activityType,
          request.variation ?? 1,
          request.day,
          request.availableMinutes ?? 20,
          request.classSize ?? 20,
        )
      : buildActivity(
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

    activity =
      request.week === 5
        ? buildWeek5Activity(
            request.activityType,
            (request.variation ?? 1) + attempt,
            request.day,
            request.availableMinutes ?? 20,
            request.classSize ?? 20,
          )
        : buildActivity(
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

  activity = {
    ...activity,
    durationMinutes: Math.max(
      15,
      Math.min(
        35,
        request.availableMinutes ?? 20
      )
    ),
  };

  return [activity];
}


function buildWeek5Activity(
  activityType: AIActivityType,
  variation: number,
  day: string,
  availableMinutes: number,
  classSize: number,
): AIGeneratedActivity {
  const options = [
    {
      title: "Opportunity Map Challenge",
      focus:
        "Students investigate one industry and uncover at least five different roles, showing that one industry contains many possible pathways.",
      setup:
        "Place students in teams of three or four. Give each team one industry or let them select one from the Week 5 Opportunity Map.",
      steps: [
        "Choose one industry worth investigating.",
        "Identify at least five different roles inside that industry.",
        "For each role, identify what the person actually does.",
        "Identify possible education, training, certification, experience, or entry pathways.",
        "Circle one role that surprised the team.",
        "Prepare a 60-second explanation of why that role deserves a closer look.",
      ],
      questions: [
        "Which role did you not know existed?",
        "Which roles require different kinds of education or training?",
        "What did this reveal about the idea that an industry equals one job?",
      ],
      evidence:
        "Completed Opportunity Map with at least five roles, pathway notes, and one role selected for further investigation.",
    },
    {
      title: "Pathway Puzzle",
      focus:
        "Students compare different routes into careers and challenge the assumption that everyone reaches opportunity through the same path.",
      setup:
        "Divide students into small teams. Give each team a fictional career destination and several possible education, training, work, certification, mentorship, or experience routes.",
      steps: [
        "Review the career destination.",
        "Build at least three plausible pathways to reach it.",
        "Identify the advantages and tradeoffs of each pathway.",
        "Add one unexpected change such as cost, relocation, injury, a new interest, or a job opportunity.",
        "Adjust the pathway without abandoning the end goal.",
        "Defend the team's revised pathway.",
      ],
      questions: [
        "Why can two people reach similar careers differently?",
        "What matters besides a four-year degree?",
        "How does adaptability create more options?",
      ],
      evidence:
        "Three-pathway comparison with a revised route after an unexpected change.",
    },
    {
      title: "Question Lab: Ask Better Questions",
      focus:
        "Students turn vague networking questions into thoughtful questions that help them learn from professionals.",
      setup:
        "Students work in pairs and then rotate. One student plays the professional and the other practices asking questions.",
      steps: [
        "Write three questions you could ask a professional about their work.",
        "Replace questions that can be answered with yes or no.",
        "Add a question about how the professional got started.",
        "Add a question about a challenge, mistake, or unexpected turn.",
        "Add a question about skills or technology changing the work.",
        "Practice asking the strongest questions naturally rather than reading a list.",
      ],
      questions: [
        "Which questions created the best conversation?",
        "What makes someone want to keep talking with you?",
        "What did you learn by listening instead of trying to impress?",
      ],
      evidence:
        "Five-question professional conversation bank including the student's strongest personal question.",
    },
    {
      title: "30-Second Opportunity Ask",
      focus:
        "Students practice introducing themselves, explaining what they are curious about, and asking for a realistic next step without asking someone for a job.",
      setup:
        "Create pairs or triads. Students rotate through Student, Professional, and Observer roles.",
      steps: [
        "State your name and one relevant part of who you are.",
        "Name an industry, role, problem, or pathway you are curious about.",
        "Explain briefly why it caught your attention.",
        "Ask for one realistic next step: advice, a conversation, a resource, an introduction, or something to investigate.",
        "Observer gives one strength and one improvement.",
        "Repeat the ask with the improvement.",
      ],
      questions: [
        "What made an opportunity ask sound professional rather than transactional?",
        "What is the difference between asking for access to learning and asking someone to give you a job?",
        "What would make a professional remember you positively?",
      ],
      evidence:
        "Written and practiced 30-second opportunity ask plus peer feedback.",
    },
    {
      title: "Professional Conversation Hot Seat",
      focus:
        "Students prepare for a former-athlete, employer, mentor, or professional conversation by practicing curiosity, listening, follow-up questions, and professional presence.",
      setup:
        "One student takes the professional hot seat while classmates practice opening questions and unscripted follow-up questions.",
      steps: [
        "Prepare one strong opening question.",
        "Listen to the professional's answer without planning the next question while they speak.",
        "Ask one follow-up based specifically on something you heard.",
        "Connect the answer to a career, skill, relationship, or decision.",
        "Close professionally with thanks.",
        "Write one thing you would investigate after the conversation.",
      ],
      questions: [
        "What did the follow-up question reveal that the prepared question did not?",
        "How can curiosity make a professional conversation stronger?",
        "What does good listening look like in a career conversation?",
      ],
      evidence:
        "Speaker/professional question, follow-up question, learning note, and next-step reflection.",
    },
    {
      title: "One Real Next Move",
      focus:
        "Students convert career curiosity into one specific action they can actually take after Week 5.",
      setup:
        "Students work individually first, then use a partner as an accountability coach.",
      steps: [
        "Choose one role, industry, skill, or pathway you want to understand better.",
        "Write what you still need to learn.",
        "Identify one person, organization, program, experience, or resource that could help.",
        "Choose one action you can take next.",
        "Give the action a realistic deadline.",
        "Tell a partner exactly what you will do and why.",
      ],
      questions: [
        "What is the difference between being interested and taking initiative?",
        "Which next move is completely within your control?",
        "What could stop you, and how will you respond?",
      ],
      evidence:
        "Week 5 Next Move statement naming one curiosity, one action, one resource or relationship, and one deadline.",
    },
  ];

  const selected = options[Math.abs(variation - 1) % options.length];

  const roleSets: Record<string, { role: string; responsibility: string }[]> = {
    "Role Play": [
      {
        role: "Student",
        responsibility:
          "Practice the conversation, question, or opportunity ask.",
      },
      {
        role: "Professional",
        responsibility:
          "Respond realistically and ask the student a follow-up question.",
      },
      {
        role: "Observer",
        responsibility:
          "Listen for curiosity, clarity, professionalism, and a specific next step.",
      },
    ],
    "Case Scenario": [
      {
        role: "Decision Team",
        responsibility:
          "Evaluate the available pathways and defend a next move.",
      },
      {
        role: "Challenge Team",
        responsibility:
          "Introduce a realistic obstacle or alternative perspective.",
      },
      {
        role: "Reporter",
        responsibility:
          "Explain the team's decision and supporting evidence.",
      },
    ],
  };

  const defaultRoles = [
    {
      role: "Explorer",
      responsibility:
        "Investigate possibilities and identify useful evidence.",
    },
    {
      role: "Connector",
      responsibility:
        "Look for people, relationships, resources, and next steps.",
    },
    {
      role: "Reporter",
      responsibility:
        "Share the team's strongest discovery and why it matters.",
    },
  ];

  const typeDirections: Record<string, string> = {
    "Role Play":
      "Run this as a professional-conversation role play with coaching and an immediate second attempt.",
    "Case Scenario":
      "Introduce a realistic career decision or obstacle and require students to defend their response.",
    "Improv":
      "Keep students on their feet. Introduce new information during the activity and require them to adapt professionally.",
    "Team Building":
      "Make the investigation collaborative. Every student must contribute one discovery before the team can present.",
    "Pop Quiz":
      "Use rapid questions to challenge career assumptions, then require students to explain the reasoning behind each answer.",
    "Reflection":
      "Give students quiet individual thinking time before partner discussion and a written next move.",
    "Career Connection":
      "Center the activity on discovering roles, pathways, people, and realistic ways to gain access to learning.",
    "Media Practice":
      "Have students explain a career discovery or opportunity ask clearly in a concise on-camera style response.",
    "Capstone Workshop":
      "Capture the student's strongest Week 5 discovery as evidence for Beyond the Game · My Capstone.",
    "Guest Speaker Preparation":
      "Prepare students to ask strong questions, listen actively, follow up naturally, and turn the conversation into evidence.",
  };

  const minutes = Math.max(15, Math.min(35, availableMinutes));

  return {
    title: `${selected.title} · ${day} · ${variation}`,
    activityType,
    lessonConnection: "FROM POSSIBILITY TO OPPORTUNITY",
    learningObjective:
      "Students expand career possibilities, investigate pathways, build professional relationship skills, and identify one real next move.",
    whyThisMatters:
      "Career exploration is not about choosing one permanent job. Students learn how to investigate possibilities, understand different pathways, learn from people, and take initiative.",
    facilitatorBackground:
      "Week 5 moves students from passive curiosity to active exploration. The goal is not a final career choice. Students should leave with more possibilities, better questions, stronger professional curiosity, and one concrete next move.",
    classroomSetup: `${selected.setup} Designed for approximately ${classSize} students and ${minutes} minutes.`,
    materials: [
      "Week 5 Student Workbook",
      "Opportunity Map",
      "Paper or index cards",
      "Pen or pencil",
      "Timer if useful",
    ],
    teachingPoints: [
      "One industry can contain many different roles.",
      "People can reach similar careers through different pathways.",
      "Career exploration begins with curiosity, not certainty.",
      "Relationships can create access to information and opportunity.",
      "Strong professional questions are more useful than trying to sound impressive.",
      "Initiative means converting curiosity into a specific next move.",
    ],
    openingConversation: [
      "What is one career or industry you know very little about?",
      "How many different jobs do you think could exist inside one organization?",
      "Who could teach you something about work that you cannot learn from a job title alone?",
    ],
    examplesToShare: [
      "A healthcare organization needs far more than doctors and nurses.",
      "A manufacturing company can include engineering, technology, finance, operations, sales, HR, logistics, skilled trades, and marketing.",
      "A professional conversation can create information, perspective, mentorship, an introduction, or a future opportunity.",
    ],
    facilitatorQuestions: selected.questions,
    observationGuide: [
      "Is the student exploring rather than forcing a premature career decision?",
      "Can the student identify more than one possible role or pathway?",
      "Does the student ask thoughtful professional questions?",
      "Can the student identify a specific next action?",
    ],
    debriefGuide: [
      "Ask students what possibility surprised them.",
      "Identify assumptions that changed during the activity.",
      "Ask which question produced the most useful information.",
      "End with each student naming one real next move.",
    ],
    studentRoles:
      roleSets[activityType] ?? defaultRoles,
    facilitatorScript: [
      "Say: 'You do not need to know exactly what you want to do with your life today.'",
      "Say: 'Our job this week is to replace guessing with investigating.'",
      `Explain today's challenge: ${selected.focus}`,
      typeDirections[activityType] ??
        "Run the activity as an active Future Ready™ career exploration challenge.",
      "Push students past job titles by asking: 'What does that person actually do?'",
      "Push students past one pathway by asking: 'What is another way someone could get there?'",
      "Close by asking every student: 'What will you do next because of what you learned?'",
    ],
    stepByStepInstructions: [
      typeDirections[activityType] ??
        "Complete the activity as an active career exploration challenge.",
      ...selected.steps,
    ],
    discussionQuestions: selected.questions,
    reflectionPrompts: [
      "One possibility I had not seriously considered before is ______.",
      "One assumption about careers or pathways I am questioning is ______.",
      "One person or type of professional I could learn from is ______.",
      "My real next move is ______.",
      "What I want my future self to be grateful I started building now is ______.",
    ],
    assessmentRubric: [
      "Career Curiosity",
      "Pathway Awareness",
      "Professional Communication",
      "Relationship Building",
      "Initiative / Next Move",
    ],
    portfolioEvidence: selected.evidence,
    capstoneConnection:
      "Students preserve their Week 5 discoveries, professional questions, pathway evidence, and next move for Beyond the Game · My Capstone and their Future Ready™ Passport.",
    durationMinutes: minutes,
  };
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
