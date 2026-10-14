import type { AIGeneratedActivity, AIActivityType } from "./ai-activity-types";
import { curriculum } from "./curriculum";

export type AILessonRequest = {
  week: number;
  day: string;
  topic: string;
  objective: string;
  activityType: AIActivityType;
  audience: string;
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
  request: AILessonRequest
): AIGeneratedActivity[] {

  const lessonContext = curriculum.find(
    (lesson) => lesson.week === request.week
  );
  return [
    {
      title: `${request.topic}: ${request.activityType} Challenge`,
      activityType: request.activityType,

      lessonConnection:
        lessonContext?.title ?? request.topic,

      learningObjective:
        lessonContext?.objective ?? request.objective,

      whyThisMatters:
        lessonContext?.workplaceConnection ??
        "Students practice applying BUILD6 skills in realistic workplace situations.",

      facilitatorBackground:
        lessonContext?.facilitatorGuide ??
        "Help students understand the skill and how it connects to their future.",

      classroomSetup:
    "Arrange students in pairs or small groups with enough space for discussion, role play, collaboration, or presentation.",

  materials: [
    "BUILD6 student workbook or reflection journal",
    "Pens or pencils",
    "Activity instructions or scenario prompts",
    "Optional presentation materials",
  ],

  teachingPoints: [
        ...(lessonContext?.skillsEarned ?? []),
        "Connect personal experiences to transferable skills.",
        "Explain how this skill applies in education, careers, and life.",
      ],

      openingConversation: [
        "What experiences have helped you develop skills?",
        "What is something you are proud of learning or accomplishing?",
        "How could this skill help you in the future?",
      ],

      examplesToShare: [
        "Sports experiences can demonstrate teamwork and leadership.",
        "School projects can demonstrate communication and problem-solving.",
        "Personal challenges can demonstrate adaptability and growth.",
      ],

      facilitatorQuestions:
        lessonContext?.discussionQuestions ?? [
          "What did you learn about yourself?",
          "How can you apply this skill in the workplace?",
        ],

      observationGuide: [
        "Watch for student participation and confidence.",
        "Notice examples of communication, teamwork, and problem-solving.",
        "Identify students who need support connecting experiences to skills.",
      ],

      debriefGuide: [
        "Ask students what they discovered about their strengths.",
        "Connect the activity back to workplace expectations.",
        "Have students identify one skill they want to continue developing.",
      ],


      studentRoles: [
        {
          role: "Participant",
          responsibility:
            "Complete the activity while demonstrating communication, confidence, collaboration, and professionalism.",
        },
        {
          role: "Observer",
          responsibility:
            "Observe teamwork, communication, problem-solving, and provide feedback during the activity.",
        },
      ],

      facilitatorScript: [
        "Opening (5 minutes): Explain that today's activity develops BUILD6 skills connected to school, careers, and workplace success.",
        "Set expectations: Students should participate professionally, communicate clearly, support teammates, and demonstrate confidence.",
        "Activity launch: Review the challenge, explain success criteria, and assign student roles.",
        "During the activity: Observe communication, teamwork, problem-solving, and adaptability. Provide coaching questions when needed.",
        "Closing discussion: Connect student experiences to workplace expectations and future opportunities.",
      ],

      stepByStepInstructions: [
        "Facilitator introduces the skill focus and explains why this skill matters.",
        "Students review the activity challenge, scenario, or workplace situation.",
        "Students are assigned roles and review their responsibilities.",
        "Students prepare their approach and identify how they will demonstrate the target skill.",
        "Students complete the activity while practicing communication, collaboration, and problem-solving.",
        "Students receive feedback from peers or observers.",
        "Facilitator leads a debrief connecting the activity to real-world situations.",
        "Students complete reflection questions and identify personal growth areas.",
      ],

      discussionQuestions: [
        "What skill did you practice today?",
        "What actions helped your team succeed?",
        "What challenge did you experience and how did you respond?",
        "How would this skill apply in a workplace environment?",
        "What would you improve next time?",
      ],

      reflectionPrompts: [
        "The strongest skill I demonstrated today was ______ because ______.",
        "A challenge I faced was ______ and I responded by ______.",
        "A workplace situation where I can use this skill is ______.",
        "One BUILD6™ skill I want to continue developing is ______.",
      ],
      assessmentRubric: [
        "Communication",
        "Collaboration",
        "Professionalism",
        "Problem Solving",
      ],

      portfolioEvidence:
        "Completed activity reflection and feedback sheet.",

      capstoneConnection:
        "Student connects skill growth to their BUILD6™ portfolio.",
    },
  ];
}