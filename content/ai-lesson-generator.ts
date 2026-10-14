import { selectBuild6Cases } from "./build6-case-library";
import { applyBuild6GameEngine, type Build6GameMode, type Build6GameModifier } from "./build6-game-engine";
import { getBuild6Week09To12AIContext } from "./ambassador/week-09-12-ai-context";
import { alignGeneratedWeek0912Activity } from "./ambassador/week-09-12-ai-generation";
import type {
  AIGeneratedActivity,
  AIActivityType,
} from "./ai-activity-types";

import { curriculum } from "./curriculum";

export type AILessonRequest = {
  week: number;
  day: string;
  topic: string;
  objective: string;
  activityType: AIActivityType;
  audience: string;
  variation?: number;

  excludedCaseIds?: string[];
  existingTaskTitles?: string[];
  availableMinutes?: number;
  classSize?: number;
  gameMode?: Build6GameMode;
  gameModifiers?: Build6GameModifier[];
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

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function readString(
  source: Record<string, unknown>,
  key: string,
  fallback = "",
): string {
  const value = source[key];
  return typeof value === "string" ? value : fallback;
}

function readStrings(
  source: Record<string, unknown>,
  key: string,
): string[] {
  const value = source[key];

  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is string => typeof item === "string",
  );
}

function clampDuration(value?: number): number {
  return Math.max(10, Math.min(15, value ?? 12));
}

function stableHash(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash >>> 0);
}

function choose<T>(items: T[], seed: number, offset = 0): T {
  return items[(seed + offset) % items.length];
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isExperienceDay(day: string): boolean {
  const value = day.toLowerCase();

  return [
    "tour",
    "site visit",
    "site-visit",
    "speaker",
    "guest",
    "employer visit",
    "industry visit",
    "field trip",
    "career panel",
  ].some((term) => value.includes(term));
}

function inferEnvironment(
  topic: string,
  objective: string,
  day: string,
): string {
  const combined = `${topic} ${objective}`.toLowerCase();

  if (!isExperienceDay(day)) {
    return "a realistic professional workplace";
  }

  if (
    combined.includes("engineering") ||
    combined.includes("terracon") ||
    combined.includes("construction") ||
    combined.includes("environmental")
  ) {
    return "an engineering, environmental, or project-services workplace";
  }

  if (
    combined.includes("health") ||
    combined.includes("medical") ||
    combined.includes("patient")
  ) {
    return "a healthcare workplace";
  }

  if (
    combined.includes("manufactur") ||
    combined.includes("production")
  ) {
    return "a manufacturing workplace";
  }

  if (
    combined.includes("finance") ||
    combined.includes("money") ||
    combined.includes("bank")
  ) {
    return "a financial-services workplace";
  }

  if (
    combined.includes("sport") ||
    combined.includes("athlete")
  ) {
    return "a sports or athletics organization";
  }

  if (
    combined.includes("government") ||
    combined.includes("public service")
  ) {
    return "a public-sector workplace";
  }

  if (
    combined.includes("nonprofit") ||
    combined.includes("community")
  ) {
    return "a nonprofit or community organization";
  }

  return "a professional workplace connected to the day's experience";
}

function buildScenarioContext(
  request: AILessonRequest,
  lessonTitle: string,
  objective: string,
  studentActivity: string,
): {
  dayFocus: string;
  situation: string;
  complication: string;
  decision: string;
  environment: string;
} {
  const dayTasks = (request.existingTaskTitles ?? [])
    .filter(Boolean)
    .slice(0, 3);

  const dayFocus =
    dayTasks.length > 0
      ? dayTasks.join("; ")
      : studentActivity ||
        objective ||
        lessonTitle;

  const seed = stableHash(
    [
      request.week,
      request.day,
      request.activityType,
      request.variation ?? 1,
      lessonTitle,
      dayFocus,
    ].join("|"),
  );

  const environment = inferEnvironment(
    request.topic || lessonTitle,
    objective,
    request.day,
  );

  const situations = [
    `A team in ${environment} is working through a task connected to "${dayFocus}" when the original plan stops working.`,
    `A group in ${environment} must apply today's skill during a normal workday when a problem appears without warning.`,
    `A supervisor in ${environment} gives a team responsibility for a situation tied to "${dayFocus}", but the team members interpret the goal differently.`,
    `A project in ${environment} is moving forward until new information forces the team to reconsider its next step.`,
    `A team in ${environment} has to make a professional decision connected to today's lesson while protecting trust, quality, and accountability.`,
    `A new employee or intern in ${environment} notices a problem related to "${dayFocus}" and must decide how to respond professionally.`,
  ];

  const complications = [
    "New information arrives halfway through and changes the best option.",
    "Two people involved have reasonable but conflicting priorities.",
    "The team has incomplete information and cannot wait for every answer.",
    "A deadline moves up unexpectedly.",
    "Someone challenges the team's recommendation and asks for evidence.",
    "A communication breakdown creates confusion about responsibility.",
    "A customer, client, teammate, or stakeholder raises a concern that was not part of the original plan.",
    "The easiest solution creates a professionalism, safety, fairness, or quality concern.",
  ];

  const decisions = [
    "Decide what should happen next, who should act, and how the decision should be communicated.",
    "Choose a response and defend it using evidence from today's BUILD6 skill.",
    "Agree on the first three actions the team should take and explain why.",
    "Resolve the disagreement without avoiding the problem or escalating it unnecessarily.",
    "Make a professional recommendation even though the information is incomplete.",
    "Identify the risk, decide who needs to know, and determine the best next move.",
  ];

  return {
    dayFocus,
    situation: choose(situations, seed),
    complication: choose(complications, seed, 2),
    decision: choose(decisions, seed, 4),
    environment,
  };
}

function buildRoles(
  type: AIActivityType,
  seed: number,
  classSize = 20,
): { role: string; responsibility: string }[] {
  const roleSets = [
    [
      {
        role: "Team Lead",
        responsibility:
          "Keep the team moving, clarify the goal, and make sure the final decision can be explained.",
      },
      {
        role: "Team Member",
        responsibility:
          "Raise concerns, contribute information, and challenge assumptions professionally.",
      },
      {
        role: "Stakeholder",
        responsibility:
          "Represent a different priority and respond realistically to the team's choices.",
      },
    ],
    [
      {
        role: "Employee or Intern",
        responsibility:
          "Handle the situation professionally while asking questions when information is unclear.",
      },
      {
        role: "Supervisor",
        responsibility:
          "Protect the goal, standards, and people involved without simply giving away the answer.",
      },
      {
        role: "Observer",
        responsibility:
          "Watch for communication, judgment, teamwork, ownership, and adaptability.",
      },
    ],
    [
      {
        role: "Project Owner",
        responsibility:
          "Protect the outcome, timeline, and quality of the work.",
      },
      {
        role: "Colleague",
        responsibility:
          "Bring a different perspective or concern that the project owner must address.",
      },
      {
        role: "Client or Community Stakeholder",
        responsibility:
          "Ask questions and respond based on the impact of the team's decision.",
      },
    ],
  ];

  const selected = choose(roleSets, seed);

  if (type === "Case Scenario") {
    return [
      {
        role: "Decision Team",
        responsibility:
          "Review the case, identify missing information, choose a response, and defend the decision.",
      },
      {
        role: "Challenge Team",
        responsibility:
          "Question assumptions, identify risks, and test whether the recommendation is realistic.",
      },
      {
        role: "Observer",
        responsibility:
          "Listen for evidence, professionalism, reasoning, and use of today's BUILD6 skill.",
      },
    ];
  }

  return selected;
}

function baseActivity(
  request: AILessonRequest,
  lessonTitle: string,
  objective: string,
  workplaceConnection: string,
  skills: string[],
  discussionQuestions: string[],
  studentActivity: string,
  portfolioEvidence: string,
): AIGeneratedActivity {
  const duration = clampDuration(request.availableMinutes);

  const context = buildScenarioContext(
    request,
    lessonTitle,
    objective,
    studentActivity,
  );

  const seed = stableHash(
    `${request.week}|${request.day}|${request.activityType}|${request.variation ?? 1}|${context.dayFocus}`,
  );

  const primarySkills =
    skills.length > 0
      ? skills.slice(0, 4)
      : [
          "Communication",
          "Problem Solving",
          "Professionalism",
          "Teamwork",
        ];

  return {
    title: `Week ${request.week} · ${request.day} · ${request.activityType}`,

    activityType: request.activityType,

    durationMinutes: duration,

    lessonConnection:
      `${lessonTitle} — ${context.dayFocus}`,

    learningObjective: objective,

    whyThisMatters:
      `${workplaceConnection || "Students apply the BUILD6 skill in a realistic situation."} ` +
      `The goal is application, judgment, communication, and professional decision-making—not memorizing a script.`,

    facilitatorBackground:
      `This is a short real-world BUILD6 application activity. ` +
      `The facilitator sets the situation, assigns roles, releases the complication, observes, and debriefs. ` +
      `Do not rescue students too quickly. Let them make decisions, communicate, adjust, and explain their reasoning.`,

    classroomSetup:
      `Total time: ${duration} minutes. For ${request.classSize ?? 20} students, divide the class into small working groups of about 3–5 students. ` +
      `Assign or rotate the generated roles inside each group. Keep setup under 2 minutes, active practice about 6–8 minutes, and debrief about 3–4 minutes.`,

    materials: [
      "Timer",
      "Role or case prompts",
      "Optional scratch paper",
      "No slides required",
    ],

    teachingPoints: [
      ...primarySkills,
      `Today's focus: ${context.dayFocus}`,
      "There may be more than one reasonable answer.",
      "Students must explain why their response is professional and realistic.",
    ],

    openingConversation: [
      `What would make this situation difficult in real life?`,
      `What information would you want before making a decision?`,
      `What does a professional response look and sound like here?`,
    ],

    examplesToShare: [
      "Strong professionals clarify before reacting.",
      "A good decision can still require adjustment when new information appears.",
      "Professional disagreement focuses on the problem, evidence, and next action.",
    ],

    facilitatorQuestions: [
      "What are you assuming?",
      "What information are you missing?",
      "Who is affected by this decision?",
      "What would you say out loud in the real situation?",
      "What is the most professional next move?",
    ],

    observationGuide: [
      "Did students communicate clearly?",
      "Did they ask useful questions before deciding?",
      "Did they adapt when the complication appeared?",
      "Did they use evidence rather than guess?",
      "Did they demonstrate ownership and professionalism?",
    ],

    debriefGuide: [
      "What changed once the complication appeared?",
      "What decision did your group make and why?",
      "What would you do differently in a real workplace?",
      "Where did today's BUILD6 skill show up?",
    ],

    studentRoles: buildRoles(
      request.activityType,
      seed,
      request.classSize ?? 20,
    ),

    facilitatorScript: [
      `SETUP: "You are not acting out a perfect answer. You are solving a realistic situation."`,
      `SITUATION: ${context.situation}`,
      `GOAL: ${context.decision}`,
      `After students begin, release this TWIST: ${context.complication}`,
      `Close with: "Defend your decision. What made it the most professional response?"`,
    ],

    stepByStepInstructions: [
      "1. Give the situation and assign roles. Do not provide dialogue.",
      "2. Give students 60–90 seconds to understand their role and goal.",
      "3. Start the activity. Let students respond naturally.",
      `4. Halfway through, introduce the complication: ${context.complication}`,
      "5. Require the group to adjust rather than restart.",
      `6. Stop active play by about minute ${Math.max(7, duration - 4)}.`,
      "7. Debrief the decision, communication, and BUILD6 skill used.",
    ],

    discussionQuestions:
      discussionQuestions.length > 0
        ? discussionQuestions.slice(0, 4)
        : [
            "What made this situation realistic?",
            "What was the hardest decision?",
            "Whose perspective changed the outcome?",
            "How does this connect to the current week?",
          ],

    reflectionPrompts: [
      "What did you do or say that helped the situation?",
      "What would you change if this happened for real?",
      "What BUILD6 skill did you actually practice?",
    ],

    assessmentRubric: [
      "Participated actively in the situation.",
      "Communicated professionally.",
      "Used reasoning or evidence to support a decision.",
      "Adapted when the situation changed.",
      "Connected the experience to the current BUILD6 lesson.",
    ],

    portfolioEvidence:
      portfolioEvidence ||
      `One-sentence professional takeaway from Week ${request.week}, ${request.day}.`,

    capstoneConnection:
      `This activity gives students another piece of evidence about how they communicate, decide, adapt, and work with others.`,
  };
}

function buildRolePlay(
  request: AILessonRequest,
  activity: AIGeneratedActivity,
): AIGeneratedActivity {
  return {
    ...activity,

    title:
      `Week ${request.week} · ${request.day} · Real-World Role Play`,

    facilitatorBackground:
      `${activity.facilitatorBackground} ` +
      `ROLE PLAY RULE: students receive roles and objectives, not scripted lines. Each role should want or need something slightly different.`,

    facilitatorScript: [
      `ROLE PLAY: Assign the roles below. Do not give students dialogue.`,
      ...activity.facilitatorScript,
    ],

    stepByStepInstructions: [
      "1. Assign roles and privately clarify each person's responsibility.",
      "2. Give the situation only—no script and no model answer.",
      "3. Students begin the conversation naturally.",
      "4. Introduce the complication after 3–4 minutes.",
      "5. Students must continue and resolve or advance the situation.",
      "6. Debrief what sounded realistic, what did not, and why.",
    ],
  };
}

function buildImprov(
  request: AILessonRequest,
  activity: AIGeneratedActivity,
): AIGeneratedActivity {
  return {
    ...activity,

    title:
      `Week ${request.week} · ${request.day} · Real-World Improv`,

    facilitatorBackground:
      `${activity.facilitatorBackground} ` +
      `IMPROV RULE: absolutely no student script. Students know only their role, goal, setting, and the information their character would reasonably know.`,

    materials: [
      "Timer",
      "Role cards or verbal role assignments",
      "No student script",
      "Optional observer notes",
    ],

    facilitatorScript: [
      `IMPROV: "You will not receive lines. Respond as the situation develops."`,
      ...activity.facilitatorScript,
    ],

    stepByStepInstructions: [
      "1. Assign each student a role and goal.",
      "2. Give the setting and situation.",
      "3. Students get no more than 60 seconds to prepare.",
      "4. Begin the improv with no scripted dialogue.",
      "5. At the midpoint, introduce the unexpected complication.",
      "6. Students must stay in role and adapt.",
      "7. Freeze the scene and ask what each person was trying to accomplish.",
      "8. Debrief the professional choices and BUILD6 skill practiced.",
    ],
  };
}

function buildCaseScenario(
  request: AILessonRequest,
  activity: AIGeneratedActivity,
): AIGeneratedActivity {
  return {
    ...activity,

    title:
      `Week ${request.week} · ${request.day} · Real-World Case Scenario`,

    facilitatorBackground:
      `${activity.facilitatorBackground} ` +
      `CASE RULE: students receive an imperfect situation with incomplete information. They must identify what they know, what they do not know, make a decision, and defend it.`,

    facilitatorScript: [
      `CASE: "There is not one answer printed on the page. Your team must make the strongest decision with the information available."`,
      ...activity.facilitatorScript,
    ],

    stepByStepInstructions: [
      "1. Present the case without explaining the preferred solution.",
      "2. Teams identify facts, assumptions, missing information, and people affected.",
      "3. Teams choose a response.",
      "4. Introduce the complication or new information.",
      "5. Teams decide whether to keep or change their original response.",
      "6. Each team gives a 30–60 second defense of its final decision.",
      "7. Debrief the tradeoffs rather than declaring one automatic winner.",
    ],
  };
}

function buildOtherActivity(
  request: AILessonRequest,
  activity: AIGeneratedActivity,
): AIGeneratedActivity {
  const directions: Partial<
    Record<AIActivityType, string[]>
  > = {
    "Team Building": [
      "Give the team a realistic shared problem.",
      "Assign a time limit and one constraint.",
      "Require every student to contribute.",
      "Introduce one change halfway through.",
      "Debrief teamwork, communication, and ownership.",
    ],

    "Pop Quiz": [
      "Use fast application questions rather than vocabulary recall.",
      "Students must explain why an answer works.",
      "Include at least one ambiguous professional judgment question.",
      "Debrief the reasoning.",
    ],

    "Reflection": [
      "Give one concrete situation from today's learning.",
      "Students identify what they would do.",
      "Students explain what skill they would rely on.",
      "Close with one real next action.",
    ],

    "Career Connection": [
      "Identify 2–3 roles connected to today's skill.",
      "Compare what those roles actually do.",
      "Identify one unknown role or pathway.",
      "Connect the discovery back to the student's interests or strengths.",
    ],

    "Media Practice": [
      "Give students a realistic camera or interview prompt.",
      "Allow one short attempt.",
      "Give one specific piece of feedback.",
      "Repeat immediately with an improved second attempt.",
    ],

    "Capstone Workshop": [
      "Connect today's learning to a piece of student evidence.",
      "Students identify the story or artifact worth keeping.",
      "Students explain why it matters.",
      "Capture one usable capstone note.",
    ],

    "Guest Speaker Preparation": [
      "Identify what students already know.",
      "Create thoughtful questions that cannot be answered by a simple website search.",
      "Practice asking one question professionally.",
      "Identify what students should observe or listen for during the experience.",
    ],
  };

  return {
    ...activity,

    title:
      `Week ${request.week} · ${request.day} · ${request.activityType}`,

    stepByStepInstructions:
      directions[request.activityType] ??
      activity.stepByStepInstructions,
  };
}

function generateBaseActivityOptions(
  request: AILessonRequest,
): AIGeneratedActivity[] {
  const lesson = curriculum.find(
    (item) => item.week === request.week,
  );

  const source = asRecord(lesson);

  const lessonTitle =
    readString(source, "title") ||
    request.topic ||
    `Week ${request.week}`;

  const objective =
    readString(source, "objective") ||
    readString(source, "focus") ||
    request.objective ||
    "Apply the current BUILD6 skill in a realistic situation.";

  const workplaceConnection =
    readString(source, "workplaceConnection") ||
    "Students apply the current BUILD6 skill to realistic professional, community, career, or life situations.";

  const skills =
    readStrings(source, "skillsEarned").length > 0
      ? readStrings(source, "skillsEarned")
      : readStrings(source, "skills");

  const discussionQuestions =
    readStrings(source, "discussionQuestions");

  const studentActivity =
    readString(source, "studentActivity") ||
    readString(source, "activity") ||
    "";

  const portfolioEvidence =
    readString(source, "portfolioEvidence");

  const existingTitles =
    request.existingTaskTitles ?? [];

  let variation = request.variation ?? 1;

  let activity = baseActivity(
    request,
    lessonTitle,
    objective,
    workplaceConnection,
    skills,
    discussionQuestions,
    studentActivity,
    portfolioEvidence,
  );

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const title = normalize(activity.title);

    const duplicate = existingTitles.some(
      (existing) => {
        const other = normalize(existing);

        return (
          other === title ||
          other.includes(title) ||
          title.includes(other)
        );
      },
    );

    if (!duplicate) break;

    variation += 1;

    activity = baseActivity(
      {
        ...request,
        variation,
      },
      lessonTitle,
      objective,
      workplaceConnection,
      skills,
      discussionQuestions,
      studentActivity,
      portfolioEvidence,
    );
  }

  switch (request.activityType) {
    case "Role Play":
      activity = buildRolePlay(request, activity);
      break;

    case "Improv":
      activity = buildImprov(request, activity);
      break;

    case "Case Scenario":
      activity = buildCaseScenario(
        request,
        activity,
      );
      break;

    default:
      activity = buildOtherActivity(
        request,
        activity,
      );
      break;
  }

  // Detailed, prewritten classroom cases replace generic workplace placeholders.
  // A shared local usage ledger prevents repeated case IDs across teaching days.
  const presentationCases = selectBuild6Cases(
    request.week,
    request.day,
    request.variation ?? 1,
    request.excludedCaseIds ?? [],
  );
  if (presentationCases.length < 3) {
    throw new Error("The unique case library is exhausted. Add approved new cases before generating another presentation; previous cases will not be silently recycled.");
  }
  const firstCase = presentationCases[0];
  activity = {
    ...activity,
    title: `Week ${request.week} · ${request.day} · ${request.activityType}`,
    facilitatorBackground: `Teach: ${objective} Use three different workplace cases. Teams must first identify the risk, then tell the right person, choose a defensible action, and adapt to the twist. Success means a decision supported by evidence and professional communication.`,
    classroomSetup: `Time: ${clampDuration(request.availableMinutes)} minutes. Split the class into 3 groups and assign Team Lead, Colleague, and Observer roles. Allow 2 minutes to read the case, 6–8 minutes to solve it, and the remaining time to defend decisions. Display the presentation or use printed prompts.`,
    materials: ["Classroom presentation (preview or editable PowerPoint)", "Timer", "Optional scratch paper"],
    openingConversation: presentationCases.map(c => `At ${c.workplace}, what specific fact must the team verify before acting?`),
    facilitatorQuestions: presentationCases.map(c => c.question),
    discussionQuestions: presentationCases.map(c => `How did the twist at ${c.workplace} affect your first three actions?`),
    reflectionPrompts: presentationCases.map(c => `If you held the decision-making role at ${c.workplace}, what exact first sentence would you say and to whom?`),
    facilitatorScript: [
      `CASE 1 (${firstCase.workplace}): ${firstCase.situation}`,
      `YOUR JOB: ${firstCase.tasks.join("; ")}`,
      `TWIST: ${firstCase.twist}`,
      `CHALLENGE: ${firstCase.question}`,
      `CASE 2 (${presentationCases[1].workplace}): ${presentationCases[1].situation}`,
      `CASE 3 (${presentationCases[2].workplace}): ${presentationCases[2].situation}`,
      "DEBRIEF: Identify a concrete next action, the person responsible, and the reason it is professional.",
    ],
    teachingPoints: [
      `Core skill: ${objective}`,
      "Identify the real risk, not just the deadline.",
      "Name the responsible person and what you will tell them.",
      "Defend the decision using facts rather than guesses.",
    ],
    stepByStepInstructions: [
      "1. Give every team its assigned workplace case and roles.",
      "2. Each team identifies the risk and verifies available facts.",
      "3. Agree on the first three actions and the person to notify.",
      "4. Reveal the twist shown on the case card halfway through.",
      "5. Adjust the response and prepare a 30-second defense.",
      "6. Observers report evidence of communication, safety, and judgment.",
    ],
    observationGuide: [
      "Identified the specific risk and people affected",
      "Communicated clearly and respectfully",
      "Escalated to the correct responsible person",
      "Proposed a realistic, authorized response",
      "Protected safety, privacy, accuracy, or trust",
      "Adapted professionally when the twist appeared",
    ],
    presentationCases,
  };

  return [
    {
      ...activity,
      durationMinutes: clampDuration(
        request.availableMinutes,
      ),
    },
  ];
}


// BUILD6_AI_GAME_ENGINE_WRAPPER_V1
export function generateActivityOptions(request: AILessonRequest): AIGeneratedActivity[] {
  const alignment = getBuild6Week09To12AIContext(request.week, request.day);
  const alignedRequest: AILessonRequest = alignment
    ? { ...request, topic: alignment.topic, objective: alignment.objective }
    : request;
  return generateBaseActivityOptions(alignedRequest).map((activity) =>
    alignGeneratedWeek0912Activity(
      applyBuild6GameEngine(activity, alignedRequest),
      alignedRequest,
    ),
  );
}
