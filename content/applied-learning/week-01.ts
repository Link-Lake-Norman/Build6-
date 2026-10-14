import type { AppliedLearningAsset } from "./types";

export const week01AppliedLearning: AppliedLearningAsset[] = [
  {
    id: "week-01-identity-under-pressure",
    week: 1,
    title: "Tell Me About Yourself — But Make It Real",
    format: "Role Play",
    audience: "Both",

    skills: [
      "Self Awareness",
      "Communication",
      "Public Speaking",
      "Confidence",
      "Professional Presence",
    ],

    lessonConnection: "BUILD6 Identity: Who Am I Beyond My Role?",

    whyItMatters:
      "Students often know their activities, titles, positions, sports, or responsibilities but struggle to explain what those experiences reveal about them. This challenge helps students turn everyday experiences into evidence of transferable skills.",

    scenario:
      "You meet an employer, mentor, coach, community leader, or professional connection. They ask: 'Tell me about yourself.' You have 30 seconds and cannot answer using only your name, school, sport, or job title.",

    studentChallenge: [
      "Take 30 seconds to think instead of writing a perfect script.",
      "Use at least one experience from school, athletics, work, volunteering, family responsibility, or life.",
      "Connect that experience to at least one strength or skill.",
      "End with something you are interested in learning, building, or doing next.",
      "Deliver the response out loud.",
      "Receive feedback and try it again.",
    ],

    curveballs: [
      "The professional asks: 'What makes you different from other students?'",
      "You lose your train of thought halfway through.",
      "The professional asks what you want to do after athletics or school.",
    ],

    consequenceReveal: [
      "Listing activities tells people what you did. Explaining what those experiences required tells people what you can do.",
      "Professional confidence includes knowing how to restart when you lose your place.",
    ],

    retryPrompt:
      "Try your introduction again. This time, make one experience prove something about you.",

    roles: [
      {
        role: "Student",
        responsibility:
          "Give a 30-second professional introduction that communicates more than a title or role.",
      },
      {
        role: "Professional Connection",
        responsibility:
          "Listen for something memorable, specific, and relevant. Ask one natural follow-up question.",
      },
      {
        role: "Skill Spotter",
        responsibility:
          "Identify strengths or transferable skills demonstrated in the student's story.",
      },
    ],

    watchFor: [
      "Students listing activities without explaining what they learned.",
      "Students believing they have no experience because they have not held a formal job.",
      "Overly memorized responses.",
      "Speaking too quickly or quietly.",
      "Treating a sport, job, or title as the entire identity.",
    ],

    professionalLanguage: [
      {
        situation:
          "You are asked to tell someone about yourself and do not know where to start.",
        insteadOf: "I play basketball. That's pretty much it.",
        tryThis:
          "I'm a student-athlete, and basketball has taught me a lot about discipline, teamwork, and handling pressure. I've also learned that I enjoy working with people and taking responsibility when a group needs direction. I'm interested in exploring where those strengths could take me professionally.",
      },
      {
        situation: "You become nervous and lose your train of thought.",
        insteadOf: "Uh...I don't know. Never mind.",
        tryThis: "Let me restart that. One experience that has shaped me is...",
      },
    ],

    discussionQuestions: [
      "What made some introductions more memorable than others?",
      "What is the difference between naming an activity and explaining what it taught you?",
      "What experiences outside a paid job can prove workplace skills?",
      "How does knowing yourself make professional communication easier?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "The student communicates at least one specific experience.",
        "The student connects the experience to a strength, behavior, value, or transferable skill.",
        "The student gives the listener something meaningful to ask about next.",
        "The student communicates clearly enough to be understood.",
        "The student improves something during the retry.",
      ],

      reasoning: [
        "There is no single correct introduction. The goal is translating experience into evidence.",
        "Employers and professional connections cannot infer every skill from a title.",
        "A strong introduction is conversational rather than a memorized biography.",
        "Retrying teaches that confidence develops through repetition.",
      ],

      coachingPoints: [
        "If a student says they have no experience, ask about athletics, family responsibilities, volunteering, clubs, projects, hobbies, challenges, or something they taught themselves.",
        "Ask: 'What did that require from you?'",
        "Coach for clarity before polish.",
        "Do not reward only extroverted students.",
        "Let students restart. Professional recovery is part of the skill.",
      ],
    },

    reflectionPrompts: [
      "One experience that says something important about me is...",
      "That experience demonstrates...",
      "Something I changed during my second attempt was...",
      "One thing I want people to understand about me beyond my role or title is...",
    ],

    portfolioEvidence:
      "30-second BUILD6™ introduction and experience-to-skill evidence.",

    athleteExtension: {
      title: "Beyond the Jersey",
      scenario:
        "Someone at a networking event knows you only as an athlete and says, 'So basketball is your whole thing, right?' Respond in a way that honors athletics while helping them understand who you are beyond your sport.",
      considerations: [
        "Do not minimize what athletics has taught you.",
        "Translate athletic experiences into accountability, resilience, teamwork, communication, leadership, preparation, and performance under pressure.",
        "Add interests, values, goals, or experiences outside athletics.",
        "Expand your identity without rejecting an important part of it.",
      ],
    },
  },

  {
    id: "week-01-read-the-room",
    week: 1,
    title: "Read the Room",
    format: "Team Challenge",
    audience: "Both",

    skills: [
      "Empathy",
      "Compassion",
      "Active Listening",
      "Communication",
      "Leadership",
      "Social Awareness",
    ],

    lessonConnection: "BUILD6 Identity: Who Am I Beyond My Role?",

    whyItMatters:
      "BUILD6 identity is also about how other people experience you. Empathy, listening, and awareness affect trust, relationships, teamwork, and leadership.",

    scenario:
      "Your group is preparing for a presentation. One teammate who normally contributes has become quiet, missed part of the preparation, and gives short answers. Another teammate says, 'They're being lazy. We should just do their part.'",

    studentChallenge: [
      "Identify what you know for certain and what you are assuming.",
      "Decide whether and how you would approach the teammate.",
      "Practice the first 30 seconds of the conversation.",
      "Balance empathy with the team's responsibility to finish.",
      "Respond to a facilitator curveball.",
    ],

    curveballs: [
      "The teammate says there is a serious issue happening at home.",
      "The teammate says they are fine and tells you to stop asking.",
      "Another teammate begins criticizing them publicly.",
    ],

    consequenceReveal: [
      "Assumptions can damage relationships before the facts are known.",
      "Empathy does not require removing all accountability.",
      "Strong leaders protect dignity while still addressing what needs to happen.",
    ],

    retryPrompt:
      "Try the conversation again using observation instead of accusation.",

    roles: [
      {
        role: "Team Leader",
        responsibility:
          "Address the situation without embarrassing, attacking, or ignoring the teammate.",
      },
      {
        role: "Teammate",
        responsibility:
          "Respond using the curveball supplied by the facilitator.",
      },
      {
        role: "Observer",
        responsibility:
          "Listen for empathy, assumptions, accountability, tone, and a clear next step.",
      },
    ],

    watchFor: [
      "Assuming someone is lazy without information.",
      "Using empathy to eliminate accountability.",
      "Public confrontation.",
      "Trying to solve a personal problem the student is not equipped to solve.",
      "Talking more than listening.",
    ],

    professionalLanguage: [
      {
        situation:
          "A teammate's behavior has changed and you need to check in.",
        insteadOf: "Why are you being lazy? You're messing everything up.",
        tryThis:
          "Hey, I noticed you've been quieter than usual and we still need to finish the presentation. Is everything okay? What can we figure out so we can get the work completed?",
      },
      {
        situation:
          "The teammate shares something personal that you cannot fix.",
        insteadOf: "Don't worry. I'll handle everything for you.",
        tryThis:
          "I'm sorry you're dealing with that. I may not be able to fix it, but I can listen. We should also figure out what you need from the team and what still needs to get done.",
      },
    ],

    discussionQuestions: [
      "What is the difference between empathy and making excuses?",
      "Why can assumptions damage a team?",
      "How can a leader show compassion while maintaining expectations?",
      "When should another trusted adult or leader become involved?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "The student separates observable facts from assumptions.",
        "The student checks in privately and respectfully.",
        "The student gives the teammate an opportunity to speak.",
        "The student shows compassion without abandoning responsibilities.",
        "The student establishes a realistic next step.",
      ],

      reasoning: [
        "Empathy means trying to understand another person's experience before deciding what their behavior means.",
        "Compassion does not require ignoring expectations.",
        "Strong leaders can care about a person and still address accountability.",
        "Students are not responsible for diagnosing or solving every problem someone shares.",
      ],

      coachingPoints: [
        "Replace judgmental language with observation.",
        "Ask what information students actually know.",
        "Reinforce privacy and dignity.",
        "If students immediately offer to do all the work, ask whether that actually builds responsibility.",
      ],
    },

    reflectionPrompts: [
      "One assumption people sometimes make too quickly is...",
      "Empathy does not mean...",
      "A compassionate leader can still...",
      "One phrase I could use to check in on someone professionally is...",
    ],

    portfolioEvidence:
      "Read the Room leadership response and empathy/accountability reflection.",

    athleteExtension: {
      title: "The Teammate Who Isn't Himself",
      scenario:
        "A teammate who is usually energetic becomes withdrawn after several difficult practices and starts making mistakes. Other players are frustrated and talking about them behind their back.",
      considerations: [
        "Notice changes without pretending you know the reason.",
        "Protect the teammate's dignity.",
        "Do not participate in gossip.",
        "Check in directly.",
        "Know when a coach, counselor, parent, or trusted adult should become involved.",
        "Support the person while maintaining team accountability.",
      ],
    },
  },

  {
    id: "week-01-who-are-you-without-the-title",
    week: 1,
    title: "Who Are You Without the Title?",
    format: "Public Speaking",
    audience: "Both",

    skills: [
      "Public Speaking",
      "Self Awareness",
      "Confidence",
      "Storytelling",
      "Communication",
    ],

    lessonConnection: "BUILD6 Identity: Who Am I Beyond My Role?",

    whyItMatters:
      "Students need repeated low-risk speaking practice before interviews, panels, employer conversations, and major presentations.",

    scenario:
      "You have 60 seconds to introduce one part of yourself that cannot be described using your school, grade, sport, job title, GPA, or position on a team.",

    studentChallenge: [
      "Choose one experience, value, interest, responsibility, challenge, or goal.",
      "Prepare only three keywords.",
      "Speak for 45 to 60 seconds.",
      "Make eye contact with at least two people.",
      "Finish by explaining why this part of you matters.",
      "Answer one audience follow-up question.",
    ],

    curveballs: [
      "Someone asks a question you did not expect.",
      "You forget the second point you planned to make.",
    ],

    consequenceReveal: [
      "Public-speaking confidence grows through repeated practice.",
      "Recovery is part of communication, not evidence that the speaker failed.",
    ],

    retryPrompt:
      "Try the same talk again using only three keywords and one clear message.",

    watchFor: [
      "Reading instead of speaking.",
      "Apologizing before beginning.",
      "Starting with 'I'm bad at this.'",
      "Speaking too quickly.",
      "Believing confidence means not feeling nervous.",
    ],

    professionalLanguage: [
      {
        situation: "You are nervous before speaking.",
        insteadOf: "I'm terrible at public speaking.",
        tryThis: "I'm a little nervous, but something important about me is...",
      },
      {
        situation: "You need a second to answer a question.",
        insteadOf: "I don't know.",
        tryThis: "That's a good question. Give me a second to think about it.",
      },
    ],

    discussionQuestions: [
      "What makes a speaker believable?",
      "How can nervousness and confidence exist together?",
      "Why is speaking from keywords different from reading a script?",
      "What did you learn about someone else?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "The student communicates one clear idea.",
        "The student speaks from experience rather than reading.",
        "The student attempts to connect with the audience.",
        "The student handles a follow-up question professionally.",
        "The student completes the attempt even if nervous.",
      ],

      reasoning: [
        "Public speaking improves through repeated exposure.",
        "The purpose is communication, not performance perfection.",
        "Keywords encourage understanding instead of memorization.",
        "Follow-up questions build adaptability and listening.",
      ],

      coachingPoints: [
        "Do not equate extroversion with leadership.",
        "Praise specific improvements.",
        "If a student freezes, allow a restart.",
        "Do not allow classmates to mock nervousness.",
      ],
    },

    reflectionPrompts: [
      "The hardest part of speaking today was...",
      "One thing I did better than expected was...",
      "One thing I will practice next time is...",
      "One thing I learned about someone else was...",
    ],

    portfolioEvidence:
      "60-second identity talk and public-speaking self-assessment.",

    athleteExtension: {
      title: "More Than an Athlete",
      scenario:
        "At an event, the moderator introduces you only by your sport and statistics. You have 60 seconds to introduce the person behind the athlete.",
      considerations: [
        "Athletics can be part of the story without being the whole story.",
        "Share a value, interest, responsibility, future goal, or experience.",
        "Speak to the audience rather than reciting an athletic bio.",
        "Connect who you are now with who you are becoming.",
      ],
    },
  },
];
