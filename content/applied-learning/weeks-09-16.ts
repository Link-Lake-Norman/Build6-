import type { AppliedLearningAsset } from "./types";

export const weeks09To16AppliedLearning: AppliedLearningAsset[] = [
  {
    id: "week-09-ai-trust-but-verify",
    week: 9,
    title: "AI Said It. Now What?",
    format: "Decision Lab",
    audience: "Both",

    skills: [
      "AI Literacy",
      "Critical Thinking",
      "Verification",
      "Professional Judgment",
      "Communication",
    ],

    lessonConnection: "AI Literacy",

    whyItMatters:
      "Future Ready™ students need to know how to use AI without surrendering judgment. A polished answer can still be incomplete, inaccurate, biased, inappropriate, or unsafe to submit.",

    scenario:
      "You use AI to prepare information for an important school, workplace, or career task. The response sounds confident and professional, but one detail feels questionable.",

    studentChallenge: [
      "Decide what you would verify before using the response.",
      "Identify which parts require human judgment.",
      "Explain what information should never be blindly copied.",
      "Decide whether AI should be used, revised, cited, verified, or rejected.",
      "Defend your decision out loud.",
    ],

    curveballs: [
      "The AI provides a source that does not exist.",
      "A teammate says, 'It sounds right. Just turn it in.'",
      "The response includes private information someone entered earlier.",
      "The deadline is in ten minutes.",
    ],

    consequenceReveal: [
      "Speed without verification can create confident mistakes.",
      "The person submitting AI-assisted work remains responsible for the final result.",
      "AI literacy includes knowing when human expertise or verification is required.",
    ],

    retryPrompt:
      "Try again using the rule: AI can assist the work, but you still own the judgment.",

    professionalLanguage: [
      {
        situation: "Someone wants to use an AI answer without checking it.",
        insteadOf: "AI is wrong all the time.",
        tryThis:
          "This looks useful, but we should verify the facts and sources before we rely on it.",
      },
    ],

    discussionQuestions: [
      "Why can a confident answer still be wrong?",
      "What kinds of AI output require the most verification?",
      "Who is responsible when AI-assisted work contains an error?",
      "Where should humans stay in the decision?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "Student verifies claims rather than judging only by how polished the answer sounds.",
        "Student identifies human judgment as part of responsible AI use.",
        "Student recognizes privacy and confidentiality concerns.",
        "Student can explain when AI is useful and when another source is needed.",
      ],
      reasoning: [
        "AI literacy is not simply learning prompts.",
        "Professional users remain accountable for information they submit or act upon.",
        "Verification, privacy, context, and judgment are transferable workplace skills.",
      ],
      coachingPoints: [
        "Do not frame AI as automatically good or bad.",
        "Ask students what they would verify and why.",
        "Distinguish brainstorming from factual authority.",
        "Reinforce that confidential information should not be entered casually into tools.",
      ],
    },

    reflectionPrompts: [
      "Before I trust an AI response, I should...",
      "One task where AI could help me is...",
      "One task where human judgment still matters is...",
    ],

    portfolioEvidence: "AI verification decision + responsible-use reasoning.",

    athleteExtension: {
      title: "AI Advice About Your Future",
      scenario:
        "An AI tool gives you confident advice about recruiting, eligibility, money, training, or a career decision. Decide what you can use as a starting point and what requires verification from an appropriate human source.",
      considerations: [
        "Rules and eligibility can change.",
        "Medical, legal, contractual, and financial decisions require appropriate expertise.",
        "AI can help organize questions before a professional conversation.",
        "You remain responsible for the decision.",
      ],
    },
  },

  {
    id: "week-09-ai-professional-partner",
    week: 9,
    title: "Make AI Make You Better — Not Invisible",
    format: "Team Challenge",
    audience: "Both",

    skills: [
      "AI Literacy",
      "Communication",
      "Creativity",
      "Professional Writing",
      "Self Awareness",
    ],

    lessonConnection: "AI Literacy",

    whyItMatters:
      "AI should strengthen student thinking and communication rather than erase their voice or create work they cannot explain.",

    scenario:
      "Two students use AI for the same professional email. One copies the response exactly. The other uses AI to organize ideas, then rewrites the message in their own voice.",

    studentChallenge: [
      "Compare the two approaches.",
      "Identify what still sounds human and specific.",
      "Improve an AI-generated message.",
      "Remove generic or exaggerated language.",
      "Explain every sentence you choose to keep.",
    ],

    retryPrompt:
      "Rewrite the message so it sounds like a prepared young professional rather than an AI template.",

    discussionQuestions: [
      "How can AI improve communication without replacing your voice?",
      "Why should you understand anything you submit?",
      "What makes professional communication sound authentic?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "Student uses AI as an assistant rather than an unquestioned author.",
        "Student can explain and defend the final communication.",
        "Student revises generic wording for audience and purpose.",
      ],
      reasoning: [
        "Workplace AI adoption requires both tool fluency and human communication.",
        "Students should learn to improve output rather than merely generate it.",
      ],
      coachingPoints: [
        "Ask students to read messages out loud.",
        "Remove claims they could not comfortably say in person.",
        "Reward specificity and clarity.",
      ],
    },

    reflectionPrompts: [
      "AI helps my communication when...",
      "AI hurts my communication when...",
    ],

    portfolioEvidence:
      "Before-and-after AI-assisted professional communication.",
  },

  {
    id: "week-10-you-said-you-would",
    week: 10,
    title: "You Said You Would",
    format: "Case Scenario",
    audience: "Both",

    skills: [
      "Accountability",
      "Reliability",
      "Professional Communication",
      "Organization",
      "Trust",
    ],

    lessonConnection: "Workplace Expectations",

    whyItMatters:
      "Professional trust grows when people communicate early, follow through, and take responsibility when commitments change.",

    scenario:
      "You agreed to complete something by 3:00 PM. At 2:40 PM you realize you are not going to finish.",

    studentChallenge: [
      "Decide what you do immediately.",
      "Communicate the delay professionally.",
      "Explain what happened without making excuses.",
      "Give a realistic revised timeline.",
      "Identify what you will change next time.",
    ],

    curveballs: [
      "Your supervisor has already asked someone else where the work is.",
      "The delay happened because you underestimated the task.",
      "A teammate contributed to the delay but is not present.",
    ],

    consequenceReveal: [
      "Silence often damages trust more than a reasonable delay communicated early.",
      "Blaming others does not restore confidence.",
      "Professional recovery requires ownership plus a next step.",
    ],

    retryPrompt: "Try again with three pieces: ownership, update, solution.",

    professionalLanguage: [
      {
        situation: "You know you will miss a commitment.",
        insteadOf: "I didn't get to it.",
        tryThis:
          "I need to update you on the 3:00 deadline. I underestimated the time required and I am not going to have it complete by then. I can have the finished version to you by 4:30. Going forward, I'll flag the timing earlier.",
      },
    ],

    discussionQuestions: [
      "Why does early communication matter?",
      "What is the difference between an explanation and an excuse?",
      "How is reliability connected to trust?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "Student communicates before disappearing or being chased.",
        "Student owns their role.",
        "Student gives a realistic next step.",
        "Student identifies a prevention strategy.",
      ],
      reasoning: [
        "Professionalism is not never making mistakes.",
        "Reliability includes how a person handles problems when they occur.",
      ],
      coachingPoints: [
        "Listen for blame shifting.",
        "Require a specific revised timeline.",
        "Ask what could have been communicated earlier.",
      ],
    },

    reflectionPrompts: [
      "One thing that makes someone reliable is...",
      "When I make a mistake professionally, I should...",
    ],

    portfolioEvidence: "Professional accountability recovery response.",

    athleteExtension: {
      title: "Schedule Collision",
      scenario:
        "Practice, travel, class, and a work commitment collide. You cannot physically meet every expectation exactly as planned.",
      considerations: [
        "Communicate before the conflict becomes someone else's emergency.",
        "Do not assume athletics automatically excuses missing commitments.",
        "Ask about options professionally.",
        "Use calendars and planning systems.",
      ],
    },
  },

  {
    id: "week-10-first-week-work",
    week: 10,
    title: "First Week on the Job",
    format: "Improv",
    audience: "Both",

    skills: [
      "Workplace Readiness",
      "Listening",
      "Adaptability",
      "Professional Presence",
      "Initiative",
    ],

    lessonConnection: "Workplace Expectations",

    whyItMatters:
      "Students need practice reading unwritten workplace expectations without pretending they already know everything.",

    scenario:
      "It is your first week. You finish your assigned task early and nobody immediately gives you another one.",

    studentChallenge: [
      "Decide what you do next.",
      "Practice asking for direction professionally.",
      "Respond to three facilitator improv prompts.",
      "Demonstrate initiative without overstepping.",
    ],

    curveballs: [
      "Your supervisor looks busy.",
      "A coworker tells you to just sit down and wait.",
      "You notice something that needs to be done but have never been trained on it.",
    ],

    retryPrompt:
      "Try again. Show initiative without assuming authority you do not have.",

    discussionQuestions: [
      "What does initiative look like for a new employee?",
      "When should you ask rather than assume?",
      "How can observation help you learn workplace culture?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "Student checks for additional priorities.",
        "Student avoids unsafe or unauthorized work.",
        "Student demonstrates willingness to help.",
      ],
      reasoning: [
        "Initiative and judgment must work together.",
        "Students should not confuse confidence with pretending to know procedures they have not learned.",
      ],
      coachingPoints: [
        "Reward thoughtful questions.",
        "Discuss when safety or authorization changes the answer.",
      ],
    },

    reflectionPrompts: [
      "Professional initiative means...",
      "One question a new employee should be comfortable asking is...",
    ],

    portfolioEvidence: "First-week workplace judgment reflection.",
  },

  {
    id: "week-11-dont-ask-for-a-job",
    week: 11,
    title: "Don't Ask for a Job — Build the Relationship",
    format: "Role Play",
    audience: "Both",

    skills: [
      "Networking",
      "Relationship Building",
      "Professional Communication",
      "Curiosity",
      "Listening",
    ],

    lessonConnection: "Networking & Mentors",

    whyItMatters:
      "Students need to experience networking as relationship building rather than immediately asking strangers for employment.",

    scenario:
      "You meet someone whose career interests you. You have three minutes with them.",

    studentChallenge: [
      "Introduce yourself.",
      "Ask one thoughtful question.",
      "Listen and ask a genuine follow-up.",
      "Find one point of connection.",
      "Ask for an appropriate next step.",
      "Close with appreciation.",
    ],

    curveballs: [
      "The person says they are not currently hiring.",
      "The person gives a very short first answer.",
      "They offer to introduce you to someone else.",
    ],

    retryPrompt:
      "Try again without asking them to solve your career. Build the next conversation.",

    professionalLanguage: [
      {
        situation: "You want to stay connected.",
        insteadOf: "Can you get me a job?",
        tryThis:
          "I appreciate your advice. Would it be okay if I connected with you and followed up after I research the field a little more?",
      },
    ],

    discussionQuestions: [
      "Why can networking feel transactional?",
      "What makes someone memorable for the right reason?",
      "What should happen after the first conversation?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "Student demonstrates curiosity before asking for help.",
        "Student listens.",
        "Student makes a reasonable next-step request.",
        "Student shows appreciation.",
      ],
      reasoning: [
        "Strong professional networks are built over time.",
        "Students need to learn relationship maintenance, not just introductions.",
      ],
      coachingPoints: [
        "Stop students from firing questions without listening.",
        "Have them practice a genuine follow-up question.",
      ],
    },

    reflectionPrompts: [
      "Someone I could learn from is...",
      "A professional follow-up I could make is...",
    ],

    portfolioEvidence: "Professional networking conversation + follow-up plan.",
  },

  {
    id: "week-11-mentor-moment",
    week: 11,
    title: "Ask for Advice You Can Actually Use",
    format: "Panel Simulation",
    audience: "Both",

    skills: [
      "Mentorship",
      "Self Advocacy",
      "Listening",
      "Communication",
      "Growth Mindset",
    ],

    lessonConnection: "Networking & Mentors",

    whyItMatters:
      "Mentorship becomes useful when students arrive with thoughtful questions and then act on what they learn.",

    scenario:
      "A panel of professionals agrees to give you advice. You can ask only two questions.",

    studentChallenge: [
      "Choose the two questions that would create the most useful information.",
      "Ask them clearly.",
      "Take notes.",
      "Summarize the advice back.",
      "Identify one action you will take.",
    ],

    discussionQuestions: [
      "What makes advice actionable?",
      "Why should a mentee prepare?",
      "What responsibility does the student have after receiving guidance?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "Questions are specific.",
        "Student listens rather than preparing the next question.",
        "Student identifies a concrete next action.",
      ],
      reasoning: [
        "Mentorship is more valuable when students participate actively rather than waiting to be directed.",
      ],
      coachingPoints: [
        "Push vague questions toward specifics.",
        "Ask students what they will do with the answer.",
      ],
    },

    reflectionPrompts: [
      "The advice I want to act on is...",
      "My next step is...",
    ],

    portfolioEvidence: "Mentor question set + action commitment.",

    athleteExtension: {
      title: "Build a Decision Team",
      scenario:
        "Different adults in your life give different advice about athletics, education, work, money, and your future.",
      considerations: [
        "One person does not need to know everything.",
        "Different decisions may require different expertise.",
        "Ask who benefits from the decision.",
        "Seek people willing to tell you the truth, not only what you want to hear.",
      ],
    },
  },

  {
    id: "week-12-fix-the-real-problem",
    week: 12,
    title: "Fix the Problem — Not the Symptom",
    format: "Team Challenge",
    audience: "Both",

    skills: [
      "Problem Solving",
      "Critical Thinking",
      "Collaboration",
      "Communication",
      "Decision Making",
    ],

    lessonConnection: "Problem Solving",

    whyItMatters:
      "Teams often jump to solutions before understanding what is actually causing the problem.",

    scenario:
      "A student-run event has low attendance. The team immediately decides the solution is 'post more on social media.'",

    studentChallenge: [
      "Separate the symptom from possible causes.",
      "Ask five questions before proposing a solution.",
      "Identify at least three possible root causes.",
      "Choose one solution to test.",
      "Explain how you would know whether it worked.",
    ],

    curveballs: [
      "Students report they never knew the event existed.",
      "Others knew about it but did not understand why they should attend.",
      "The event time conflicts with another major activity.",
    ],

    consequenceReveal: [
      "A solution aimed at the wrong cause can create activity without improvement.",
      "Good problem solving includes diagnosis, testing, and learning.",
    ],

    retryPrompt:
      "Update the solution after the new information. Do not defend the original idea just because it was yours.",

    discussionQuestions: [
      "Why do teams jump to solutions?",
      "What questions reveal root causes?",
      "How can you test a solution before investing heavily?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "Student gathers information first.",
        "Student identifies more than one possible cause.",
        "Student proposes a measurable test.",
        "Student adapts when evidence changes.",
      ],
      reasoning: [
        "Critical thinking requires separating assumptions from evidence.",
        "Changing your mind after receiving better information is a strength.",
      ],
      coachingPoints: [
        "Do not let the loudest person end diagnosis early.",
        "Ask 'How do we know?' repeatedly.",
      ],
    },

    reflectionPrompts: [
      "A problem I sometimes solve too quickly is...",
      "One question that improves problem solving is...",
    ],

    portfolioEvidence: "Root-cause problem-solving map.",
  },

  {
    id: "week-12-under-pressure",
    week: 12,
    title: "Decision Under Pressure",
    format: "Decision Lab",
    audience: "Both",

    skills: [
      "Decision Making",
      "Adaptability",
      "Leadership",
      "Communication",
      "Prioritization",
    ],

    lessonConnection: "Problem Solving",

    whyItMatters:
      "Students need practice making reasonable decisions before they have perfect information.",

    scenario:
      "You are leading a project. Two people are absent, technology fails, and presentation time is in twenty minutes.",

    studentChallenge: [
      "Identify what absolutely must happen.",
      "Identify what can be dropped.",
      "Assign responsibilities.",
      "Communicate the revised plan.",
      "Explain the tradeoff you accepted.",
    ],

    curveballs: [
      "One teammate disagrees with your priorities.",
      "The missing file suddenly becomes available with five minutes left.",
    ],

    retryPrompt:
      "Run the final five minutes again. Decide whether new information is worth changing the plan.",

    discussionQuestions: [
      "What makes a decision 'good enough' under pressure?",
      "When can changing plans create more risk?",
      "How should leaders communicate priorities?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "Student prioritizes essential outcomes.",
        "Student communicates clearly.",
        "Student avoids trying to save every element.",
        "Student can defend the tradeoff.",
      ],
      reasoning: [
        "Problem solving under pressure includes prioritization and communication, not merely ideas.",
      ],
      coachingPoints: [
        "Force students to choose.",
        "Ask what they intentionally stopped doing.",
      ],
    },

    reflectionPrompts: [
      "Under pressure, I tend to...",
      "A better way to prioritize is...",
    ],

    portfolioEvidence: "Pressure decision + prioritization rationale.",

    athleteExtension: {
      title: "Next Play",
      scenario:
        "A mistake has already happened during competition. You cannot undo it, but your response affects what happens next.",
      considerations: [
        "Recovery speed matters.",
        "Separate learning from self-criticism.",
        "Communicate what the team needs now.",
        "The same recovery skill transfers to work.",
      ],
    },
  },

  {
    id: "week-13-internship-first-day",
    week: 13,
    title: "Your First Day — Nobody Told You Everything",
    format: "Improv",
    audience: "Both",

    skills: [
      "Internship Readiness",
      "Professional Communication",
      "Observation",
      "Initiative",
      "Adaptability",
    ],

    lessonConnection: "Internship Readiness",

    whyItMatters:
      "Students need to know how to ask questions, observe, take notes, and recover from uncertainty during workplace experiences.",

    scenario:
      "You arrive at an internship. Your supervisor gives you a quick introduction and then gets pulled into another meeting.",

    studentChallenge: [
      "Decide what you can do independently.",
      "Identify what requires clarification.",
      "Practice asking a useful question.",
      "Take notes on expectations.",
      "Respond to improv workplace situations.",
    ],

    curveballs: [
      "You forget someone's name.",
      "You do not understand an acronym everyone else seems to know.",
      "You are asked to complete something you have never done.",
      "You finish early.",
    ],

    retryPrompt:
      "Try the situation again without pretending you understand something you do not.",

    professionalLanguage: [
      {
        situation: "You do not understand an instruction.",
        insteadOf: "Yeah, I got it.",
        tryThis:
          "I want to make sure I do this correctly. Can I confirm what you mean by...?",
      },
    ],

    discussionQuestions: [
      "Why do students sometimes pretend they understand?",
      "What makes a good workplace question?",
      "How can note-taking improve reliability?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "Student asks concise clarifying questions.",
        "Student avoids unsafe guessing.",
        "Student takes responsibility for learning.",
        "Student shows initiative appropriately.",
      ],
      reasoning: [
        "Workplace readiness includes managing uncertainty professionally.",
        "Good questions can demonstrate responsibility rather than weakness.",
      ],
      coachingPoints: [
        "Reward clarification.",
        "Discuss which questions can be answered by observation first.",
      ],
    },

    reflectionPrompts: [
      "One question I should be comfortable asking at an internship is...",
      "One habit that will make me easier to supervise is...",
    ],

    portfolioEvidence: "First-Day Internship Readiness checklist.",

    athleteExtension: {
      title: "Rookie Mindset",
      scenario:
        "Use the same mindset you would use entering a new team: learn the system, observe the culture, ask smart questions, earn trust, and do not assume your previous success automatically transfers.",
      considerations: [
        "Be coachable.",
        "Learn names and roles.",
        "Understand expectations.",
        "Earn responsibility before demanding it.",
      ],
    },
  },

  {
    id: "week-13-workplace-boundary",
    week: 13,
    title: "Something Doesn't Feel Right",
    format: "Case Scenario",
    audience: "Both",

    skills: [
      "Self Advocacy",
      "Professional Judgment",
      "Communication",
      "Safety",
      "Leadership",
    ],

    lessonConnection: "Internship Readiness",

    whyItMatters:
      "Students need language for asking questions or getting help when a workplace situation feels unsafe, inappropriate, unclear, or outside their training.",

    scenario:
      "During an internship, someone asks you to perform a task you have never been trained to do and you are unsure whether it is safe.",

    studentChallenge: [
      "Pause before acting.",
      "Identify what information is missing.",
      "Respond professionally.",
      "Identify who should be involved if the concern continues.",
    ],

    professionalLanguage: [
      {
        situation: "You are uncertain whether you are trained or authorized.",
        insteadOf: "I'm not doing that.",
        tryThis:
          "I haven't been trained on that task yet, and I want to make sure I handle it correctly. Can someone walk me through the process first?",
      },
    ],

    discussionQuestions: [
      "Why can young employees be afraid to ask?",
      "What is the difference between refusing responsibility and raising a legitimate concern?",
      "Who can students go to for help?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "Student does not bluff competence.",
        "Student communicates the concern clearly.",
        "Student seeks appropriate supervision.",
      ],
      reasoning: [
        "Professional confidence includes knowing when to stop and ask.",
        "Safety and boundaries are part of workplace readiness.",
      ],
      coachingPoints: [
        "Do not teach students to silently comply with unsafe situations.",
        "Also avoid framing every unfamiliar task as inappropriate.",
        "Emphasize clarification and escalation when necessary.",
      ],
    },

    reflectionPrompts: [
      "A professional way to ask for clarification is...",
      "If something feels unsafe or inappropriate, I can...",
    ],

    portfolioEvidence: "Workplace boundary communication response.",
  },

  {
    id: "week-14-own-the-room",
    week: 14,
    title: "Own the Room",
    format: "Public Speaking",
    audience: "Both",

    skills: [
      "Public Speaking",
      "Professional Presence",
      "Storytelling",
      "Audience Awareness",
      "Confidence",
    ],

    lessonConnection: "Professional Presentation",

    whyItMatters:
      "Presentation confidence develops from repeated speaking, feedback, adjustment, and recovery—not memorizing every word.",

    scenario:
      "You have two minutes to explain something you learned during Future Ready™ to a panel of adults who have never met you.",

    studentChallenge: [
      "Open with a clear point.",
      "Use one specific example.",
      "Explain why it matters.",
      "Make eye contact.",
      "Finish with a clear takeaway.",
      "Answer one follow-up question.",
    ],

    curveballs: [
      "You lose your place.",
      "A panelist looks confused.",
      "Someone asks a question you did not prepare for.",
    ],

    consequenceReveal: [
      "Strong speakers recover instead of apologizing repeatedly.",
      "Audience understanding matters more than memorized wording.",
    ],

    retryPrompt:
      "Deliver it again. This time focus on one message, one example, and one takeaway.",

    professionalLanguage: [
      {
        situation: "You lose your place.",
        insteadOf: "Sorry, I'm terrible at this.",
        tryThis: "Let me come back to the main point...",
      },
    ],

    discussionQuestions: [
      "What makes a presentation memorable?",
      "What does the audience need from the speaker?",
      "How can you recover without drawing more attention to the mistake?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "Student has a clear message.",
        "Student uses specific evidence.",
        "Student speaks to the audience rather than only reading.",
        "Student recovers professionally.",
      ],
      reasoning: [
        "Presentation skill combines content, structure, audience awareness, and delivery.",
        "Recovery is part of professional presence.",
      ],
      coachingPoints: [
        "Coach one improvement at a time.",
        "Do not overload students with ten presentation corrections at once.",
        "Prioritize clarity and audience connection.",
      ],
    },

    reflectionPrompts: [
      "The strongest part of my presentation was...",
      "My next speaking adjustment is...",
    ],

    portfolioEvidence: "Two-minute Future Ready™ professional presentation.",

    athleteExtension: {
      title: "Post-Game to Boardroom",
      scenario:
        "Practice answering questions with the same composure expected in interviews, media situations, employer meetings, or presentations.",
      considerations: [
        "Listen to the entire question.",
        "Do not react defensively.",
        "Bridge back to your key message.",
        "Represent yourself professionally under pressure.",
      ],
    },
  },

  {
    id: "week-14-panel-hot-seat",
    week: 14,
    title: "Panel Hot Seat",
    format: "Panel Simulation",
    audience: "Both",

    skills: [
      "Public Speaking",
      "Listening",
      "Critical Thinking",
      "Professional Communication",
      "Adaptability",
    ],

    lessonConnection: "Professional Presentation",

    whyItMatters:
      "Prepared remarks are only one part of professional communication. Students also need to respond thoughtfully in real time.",

    scenario:
      "Students sit on a simulated professional panel and receive unscripted questions about leadership, career decisions, teamwork, AI, money, and growth.",

    studentChallenge: [
      "Listen fully.",
      "Take a moment before answering.",
      "Give a specific example.",
      "Keep the answer concise.",
      "Build on another panelist's response when appropriate.",
    ],

    retryPrompt:
      "Answer again in 45 seconds or less without losing the meaning.",

    discussionQuestions: [
      "What made an answer feel authentic?",
      "How did listening improve responses?",
      "When should a panelist build on someone else's answer?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "Student answers the actual question.",
        "Student provides relevant evidence.",
        "Student does not dominate the panel.",
        "Student responds to others respectfully.",
      ],
      reasoning: [
        "Panel communication measures listening and judgment as much as speaking.",
      ],
      coachingPoints: [
        "Time responses.",
        "Coach students away from rambling.",
        "Include questions with no perfect answer.",
      ],
    },

    reflectionPrompts: [
      "The unscripted question I handled best was...",
      "One answer I would improve is...",
    ],

    portfolioEvidence: "Panel response feedback + speaking reflection.",
  },

  {
    id: "week-15-future-you-board-meeting",
    week: 15,
    title: "Future You Board Meeting",
    format: "Panel Simulation",
    audience: "Both",

    skills: [
      "Future Planning",
      "Goal Setting",
      "Decision Making",
      "Self Advocacy",
      "Communication",
    ],

    lessonConnection: "Future Planning",

    whyItMatters:
      "Plans become stronger when students can explain their next steps, obstacles, resources, and alternatives to other people.",

    scenario:
      "You are presenting your next-step plan to a small 'board' of peers or adults. They are allowed to respectfully challenge the assumptions in your plan.",

    studentChallenge: [
      "State your next major goal.",
      "Explain why it matters.",
      "Identify your next three actions.",
      "Identify one obstacle.",
      "Identify one person or resource that can help.",
      "Explain your backup plan if circumstances change.",
    ],

    curveballs: [
      "Your first-choice opportunity does not happen.",
      "Transportation becomes a problem.",
      "The cost is higher than expected.",
      "Your timeline changes.",
    ],

    consequenceReveal: [
      "A strong future plan includes alternatives.",
      "Changing the route does not require abandoning the goal.",
    ],

    retryPrompt:
      "Revise your plan after the curveball. Keep the goal if it still matters, but change the route.",

    discussionQuestions: [
      "What makes a plan realistic?",
      "Why should plans include people and resources?",
      "What is the difference between flexibility and giving up?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "Student identifies actionable next steps.",
        "Student recognizes likely obstacles.",
        "Student knows where help or information can come from.",
        "Student can adapt the plan.",
      ],
      reasoning: [
        "Future readiness is not predicting life perfectly.",
        "It is building decision-making capacity and next-step discipline.",
      ],
      coachingPoints: [
        "Push vague goals into concrete actions.",
        "Ask who, what, and when.",
        "Do not require every student to have one permanent career answer.",
      ],
    },

    reflectionPrompts: [
      "My next meaningful step is...",
      "Someone who can help me is...",
      "If Plan A changes, I can...",
    ],

    portfolioEvidence: "Future Ready™ next-step action plan.",

    athleteExtension: {
      title: "What If the Sport Changes?",
      scenario:
        "Build a plan that respects athletic goals while also preparing for injury, roster changes, eligibility changes, transfer decisions, or the natural end of competitive sports.",
      considerations: [
        "Athletics can remain part of your identity without being your only plan.",
        "Build relationships outside sport.",
        "Develop transferable skills.",
        "Understand education, employment, and financial options.",
      ],
    },
  },

  {
    id: "week-15-calendar-your-future",
    week: 15,
    title: "Put the Plan on the Calendar",
    format: "Decision Lab",
    audience: "Both",

    skills: [
      "Organization",
      "Goal Setting",
      "Time Management",
      "Follow Through",
      "Prioritization",
    ],

    lessonConnection: "Future Planning",

    whyItMatters: "A goal without scheduled action often stays an intention.",

    scenario:
      "You have five important future goals but only limited time and attention during the next thirty days.",

    studentChallenge: [
      "Choose the three actions with the highest impact.",
      "Put them in sequence.",
      "Assign realistic dates.",
      "Identify what you will stop, delay, or delegate.",
      "Choose one accountability check.",
    ],

    retryPrompt:
      "Cut one low-value activity and protect the time for the action that matters most.",

    discussionQuestions: [
      "Why does everything feel urgent?",
      "How do calendars reveal priorities?",
      "What should happen when a plan slips?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "Student prioritizes rather than scheduling everything.",
        "Student assigns realistic dates.",
        "Student creates an accountability mechanism.",
      ],
      reasoning: [
        "Organization is a workforce competency because plans only create value when people execute them.",
      ],
      coachingPoints: [
        "Make students choose.",
        "Avoid unrealistic overloaded schedules.",
      ],
    },

    reflectionPrompts: [
      "The most important action on my calendar is...",
      "One thing I need to stop or reduce is...",
    ],

    portfolioEvidence: "30-day Future Ready™ action calendar.",
  },

  {
    id: "week-16-showcase-story",
    week: 16,
    title: "My Future Ready™ Story",
    format: "Public Speaking",
    audience: "Both",

    skills: [
      "Public Speaking",
      "Reflection",
      "Professional Presence",
      "Storytelling",
      "Self Advocacy",
      "Leadership",
    ],

    lessonConnection: "Launch Ready Showcase",

    whyItMatters:
      "The showcase should demonstrate growth rather than simply announce that students completed a program.",

    scenario:
      "You have three minutes to show an audience how you changed, what you can now demonstrate, and what you are doing next.",

    studentChallenge: [
      "Start with who you were entering the experience.",
      "Choose two pieces of evidence.",
      "Explain one challenge or mistake.",
      "Explain what changed.",
      "Name your next step.",
      "Close with a message you want the audience to remember.",
    ],

    curveballs: [
      "A panelist asks what skill still needs work.",
      "Someone asks which experience changed you most.",
      "Someone asks what you will do if your current plan does not work.",
    ],

    consequenceReveal: [
      "Credibility grows when students can discuss growth without pretending to be finished products.",
      "Evidence makes the story stronger than generic claims.",
    ],

    retryPrompt:
      "Deliver the final minute again. Remove anything generic and end with something only you could say.",

    professionalLanguage: [
      {
        situation: "You are asked about an area that still needs improvement.",
        insteadOf: "I don't really have one.",
        tryThis:
          "One area I'm still working on is ____. I've improved by ____, and my next step is ____.",
      },
    ],

    discussionQuestions: [
      "What makes a growth story credible?",
      "Why should a showcase include mistakes or challenges?",
      "What evidence proves readiness?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "Student demonstrates specific growth.",
        "Student uses portfolio evidence.",
        "Student owns an area still in development.",
        "Student communicates a concrete next step.",
      ],
      reasoning: [
        "Future Ready™ is demonstrated through evidence and self-awareness, not participation alone.",
        "A strong final presentation connects learning to future behavior.",
      ],
      coachingPoints: [
        "Do not let showcases become lists of assignments.",
        "Ask: 'What changed because of this?'",
        "Keep the student's authentic voice.",
      ],
    },

    reflectionPrompts: [
      "The Future Ready skill I am most proud of is...",
      "The evidence that proves it is...",
      "My next chapter begins with...",
    ],

    portfolioEvidence: "Final Future Ready™ Showcase presentation + evidence.",

    athleteExtension: {
      title: "More Than the Jersey — Final Reflection",
      scenario:
        "Return to the Week 1 question: Who are you beyond your role as an athlete? Use sixteen weeks of evidence to answer it now.",
      considerations: [
        "Communication",
        "Leadership",
        "Financial judgment",
        "Professional presence",
        "Career readiness",
        "Relationships",
        "Self awareness",
        "Future planning",
      ],
    },
  },

  {
    id: "week-16-youre-on-the-panel",
    week: 16,
    title: "You're on the Panel Now",
    format: "Panel Simulation",
    audience: "Both",

    skills: [
      "Leadership",
      "Empathy",
      "Public Speaking",
      "Listening",
      "Mentorship",
      "Reflection",
    ],

    lessonConnection: "Launch Ready Showcase",

    whyItMatters:
      "Students demonstrate maturity when they can turn their own learning into useful guidance for someone coming behind them.",

    scenario:
      "Imagine next year's Future Ready™ students are sitting in front of you. They ask what they should know before starting.",

    studentChallenge: [
      "Answer one question about communication.",
      "Answer one question about money or decision making.",
      "Answer one question about career readiness.",
      "Share one mistake you would help another student avoid.",
      "Give one piece of advice you genuinely believe.",
    ],

    discussionQuestions: [
      "What lesson would you teach differently now that you experienced it?",
      "What mistake taught you something useful?",
      "What should the next group know?",
    ],

    facilitatorAnswerGuide: {
      strongResponses: [
        "Student gives specific advice.",
        "Student uses personal evidence.",
        "Student demonstrates empathy rather than superiority.",
        "Student can articulate meaningful learning.",
      ],
      reasoning: [
        "Teaching another person is powerful evidence that a student has internalized learning.",
        "Leadership includes helping others succeed.",
      ],
      coachingPoints: [
        "Push past generic 'work hard' advice.",
        "Ask what they wish someone had told them.",
      ],
    },

    reflectionPrompts: [
      "One lesson I would pass forward is...",
      "One thing I understand differently now is...",
    ],

    portfolioEvidence: "Future Ready™ Pass-It-Forward leadership reflection.",
  },
];
