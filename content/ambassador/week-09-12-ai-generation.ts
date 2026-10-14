import type { AIGeneratedActivity } from "../ai-activity-types";
import type { AILessonRequest } from "../ai-lesson-generator";
import type { Build6Case } from "../build6-case-library";
import { getBuild6Week0912Content } from "./week-09-12-week-content";

type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

function dayKey(day: string): DayKey {
  const d = day.toLowerCase();
  if (d.includes("mon") || d.includes("day 1")) return "monday";
  if (d.includes("tue") || d.includes("day 2")) return "tuesday";
  if (d.includes("wed") || d.includes("day 3")) return "wednesday";
  if (d.includes("thu") || d.includes("day 4")) return "thursday";
  if (d.includes("fri") || d.includes("day 5")) return "friday";
  return "tuesday";
}

type DaySpec = {
  label: string;
  objective: string;
  steps: string[];
  questions: string[];
  observations: string[];
  debrief: string[];
  reflections: string[];
  artifact: string;
  capstone: string;
};

const DAY_SPECS: Record<number, Record<DayKey, DaySpec>> = {
  9: {
    monday: {
      label: "Catch-Up + AI Discussion",
      objective: "Complete unfinished work and surface current AI habits before new skill practice.",
      steps: ["Complete missing work first.", "Discuss where AI is already being used.", "Identify what AI is useful for and what still requires human judgment.", "Choose one real project task that AI could support responsibly."],
      questions: ["Where has AI helped you?", "When has AI been wrong or incomplete?", "What should never be outsourced to AI?"],
      observations: ["Student can distinguish assistance from ownership.", "Student identifies at least one verification need."],
      debrief: ["Name one useful AI use.", "Name one boundary.", "Name one human responsibility."],
      reflections: ["Where am I already using AI, and what do I need to verify more carefully?"],
      artifact: "AI Use + Judgment baseline note",
      capstone: "Capture how your thinking about responsible AI begins this week."
    },
    tuesday: {
      label: "Prompting + Workplace Problem-Solving Lab",
      objective: "Write stronger prompts using role, context, goal, audience, constraints, and format, then decide what the human still owns.",
      steps: ["Start with a weak prompt.", "Add role + context + goal + audience + constraints + format.", "Compare outputs.", "Identify what the human must still decide.", "Revise once based on the result."],
      questions: ["What context changed the answer most?", "What information should not be entered?", "What still requires your judgment?"],
      observations: ["Prompt is specific and purposeful.", "Student does not confuse polished output with a correct answer."],
      debrief: ["Compare weak vs. strong prompt.", "Name what improved.", "Name what still needs checking."],
      reflections: ["What prompt habit will I change after today?"],
      artifact: "Before/after professional prompt + explanation",
      capstone: "Preserve one prompt revision that shows how clearer thinking improved the result."
    },
    wednesday: {
      label: "AI Judgment + Verification Lab",
      objective: "Use STOP - CHECK - DECIDE to test AI output for accuracy, currency, evidence, bias, privacy, missing context, and professional usefulness.",
      steps: ["Run Would You Trust It?", "Teach STOP - CHECK - DECIDE.", "Complete AI Detective.", "Fix one weak AI response.", "Classify examples Trust / Verify / Reject.", "Create My AI Verification Checklist."],
      questions: ["What is the biggest mistake someone can make when using AI?", "When is AI useful but still not enough?", "What human skill becomes more important when everyone has AI?"],
      observations: ["Student challenges confident-sounding output.", "Student names a credible verification method.", "Student protects private/confidential data."],
      debrief: ["What did you reject?", "What did you verify?", "What changed after checking?"],
      reflections: ["What AI risk am I most likely to overlook, and what will I do differently?"],
      artifact: "My AI Verification Checklist",
      capstone: "Preserve evidence of a decision where verification changed what you accepted, rejected, or rewrote."
    },
    thursday: {
      label: "AI Project Studio",
      objective: "Use AI on a real BUILD6 project while documenting prompt, output, changes, rejected ideas, verification, and human contribution.",
      steps: ["Name the real project problem.", "Write the prompt.", "Capture the useful output.", "Mark what you changed, corrected, or rejected.", "Verify important claims.", "Explain what YOU contributed."],
      questions: ["What did AI make faster?", "What did AI miss?", "What did you change and why?", "Could you explain the final result without AI beside you?"],
      observations: ["Student documents human contribution.", "Student verifies before using factual claims.", "Final work is not a copy/paste artifact."],
      debrief: ["What was useful?", "What was wrong or weak?", "What improved because of human judgment?"],
      reflections: ["What did I contribute that AI could not replace?"],
      artifact: "Human + AI Project Evidence",
      capstone: "Save the original output, your edits, your verification, and the reasoning behind the final choice."
    },
    friday: {
      label: "Human Advantage + Professional AI Rules",
      objective: "Turn the week's practice into personal rules for responsible professional AI use and a portfolio/capstone artifact.",
      steps: ["Finish missing work.", "Classify skills as AI strong / Human strong / Best together.", "Complete Would You Let AI Do This?", "Write 7+ Professional AI Rules.", "Choose the strongest evidence for portfolio/capstone."],
      questions: ["What should never be outsourced?", "What human skill will matter more?", "What rule will you use immediately?"],
      observations: ["Rules are specific and actionable.", "Student can explain responsibility for final work."],
      debrief: ["Name one boundary.", "Name one human advantage.", "Name one artifact worth preserving."],
      reflections: ["What are my rules for using AI professionally, and which human skill do I want to strengthen because AI exists?"],
      artifact: "Professional AI Rules + Human Advantage reflection",
      capstone: "Preserve one example that proves you can use AI without surrendering judgment or ownership."
    }
  },
  10: {
    monday: {
      label: "Catch-Up + Curiosity Reset",
      objective: "Finish missing work and identify what you genuinely want to understand about professionals, organizations, industries, and career paths.",
      steps: ["Complete missing work.", "Identify one topic you want to understand better.", "Discuss what makes a professional conversation worth having.", "Choose one project/career question to carry into the week."],
      questions: ["What are you curious about?", "What can a person tell you that a website cannot?"],
      observations: ["Student identifies a real learning goal.", "Curiosity goes beyond basic facts."],
      debrief: ["Name one thing you want to learn from a professional.", "Name why it matters."],
      reflections: ["What do I genuinely want to understand better, and why?"],
      artifact: "Professional curiosity goal",
      capstone: "Capture the question you are carrying into the week."
    },
    tuesday: {
      label: "Curiosity Lab",
      objective: "Practice concise introductions, stronger open-ended questions, natural follow-ups, active listening, and professional closes.",
      steps: ["Give a 20-second introduction.", "Turn a weak question into a stronger one.", "Ask the question.", "Listen for a clue.", "Ask two natural follow-ups.", "Close professionally."],
      questions: ["What makes a question memorable?", "How do you show curiosity without interrogating someone?"],
      observations: ["Student listens before asking the next question.", "Question cannot be answered by a quick website search."],
      debrief: ["Which question produced the best answer?", "Which follow-up came from actual listening?"],
      reflections: ["Which question or follow-up showed my strongest curiosity today?"],
      artifact: "Professional question set",
      capstone: "Preserve one question that opened a deeper conversation."
    },
    wednesday: {
      label: "Julie + Eric Research + Question Design",
      objective: "Use only confirmed/public information available to the class to research Julie and Eric and prepare 3–5 thoughtful questions.",
      steps: ["Identify confirmed information.", "Identify the work/industry.", "Identify problems solved.", "Identify customers/stakeholders.", "Draft 3–5 questions.", "Remove any question that a website already answers."],
      questions: ["What decision, lesson, challenge, or career path would you like them to explain?", "What do you still not know?"],
      observations: ["Student separates confirmed facts from assumptions.", "Questions are specific and respectful."],
      debrief: ["Which question is strongest?", "What evidence informed it?"],
      reflections: ["What do I still want to understand before the live conversation?"],
      artifact: "Julie + Eric Research + Question Sheet",
      capstone: "Save the research-to-question trail that shows professional preparation."
    },
    thursday: {
      label: "Julie + Eric Live Professional Conversation",
      objective: "Listen for business problems, decisions, roles, career paths, and opportunity clues while practicing professional presence and thoughtful follow-up.",
      steps: ["Enter prepared.", "Listen for one problem, one decision, one role, and one unexpected path.", "Ask one thoughtful question or follow-up.", "Capture one opportunity clue.", "Close professionally."],
      questions: ["What surprised you?", "What did you learn about how they create value?", "What should you explore next?"],
      observations: ["Student listens actively.", "Follow-up is based on something actually said."],
      debrief: ["What did a website not tell you?", "What connection or idea is worth following?"],
      reflections: ["What did I hear that changed or expanded my thinking?"],
      artifact: "Professional Connection Record",
      capstone: "Preserve the conversation moment that changed what you want to explore next."
    },
    friday: {
      label: "Thank-You + Connection Record",
      objective: "Follow up professionally, complete missing work, and convert the live conversation into a usable career/business learning artifact.",
      steps: ["Finish missing work.", "Write a thank-you/follow-up.", "Record what surprised you.", "Identify who/what to explore next.", "Choose portfolio/capstone evidence."],
      questions: ["What will you say in the follow-up?", "What is an appropriate next step?"],
      observations: ["Thank-you is specific.", "Next step is realistic and professional."],
      debrief: ["What did you learn?", "What will you do with it?"],
      reflections: ["What did I learn from Julie and Eric that I could not have learned from a website, and what will I do with that information?"],
      artifact: "Thank-You + Professional Connection Record",
      capstone: "Preserve one professional connection story from preparation through follow-up."
    }
  },
  11: {
    monday: {
      label: "Catch-Up + Business Systems Discussion",
      objective: "Finish missing work and begin seeing a business as a connected system rather than a collection of job titles.",
      steps: ["Finish missing work.", "Choose a product or service.", "List what must happen behind the scenes.", "Identify where quality, safety, money, or reputation can be affected."],
      questions: ["What must happen before the customer receives the outcome?", "What jobs might the customer never see?"],
      observations: ["Student identifies multiple connected roles.", "Student sees downstream consequences."],
      debrief: ["Name one hidden role.", "Name one vulnerable handoff."],
      reflections: ["What part of a business system had I never thought about before?"],
      artifact: "Business systems baseline map",
      capstone: "Capture one system insight that changes how you think about work."
    },
    tuesday: {
      label: "Business Systems Lab",
      objective: "Map a customer need from first contact to finished outcome and identify roles, handoffs, quality checks, delays, waste, customer impact, and money impact.",
      steps: ["Name the customer need.", "Map the workflow.", "Assign roles.", "Mark handoffs.", "Add quality and safety checks.", "Identify delay/waste.", "Connect one failure to customer and financial impact."],
      questions: ["Where is the system most vulnerable?", "Who owns each handoff?", "Where can errors cost money or trust?"],
      observations: ["Workflow has a beginning, handoffs, checks and outcome.", "Student connects errors to consequences."],
      debrief: ["What breaks first?", "What protects the customer?", "What protects the business?"],
      reflections: ["Where is the most important handoff in our workflow and why?"],
      artifact: "Customer-to-Outcome Workflow Map",
      capstone: "Preserve one workflow insight showing how roles depend on one another."
    },
    wednesday: {
      label: "Champion Tire & Wheel Research",
      objective: "Research Champion Tire & Wheel's products/services, customers, problems solved, likely workflow, technology, safety, careers, and questions for the tour.",
      steps: ["Research products/services.", "Identify customers and problems solved.", "Draft a workflow hypothesis.", "List technology/safety you expect.", "List hidden careers.", "Prepare tour questions."],
      questions: ["What do they sell or deliver?", "Who buys it?", "Where could errors cost time or money?", "What roles might exist beyond what you expect?"],
      observations: ["Student distinguishes research from assumption.", "Questions are operational, not just career-title questions."],
      debrief: ["What will you look for tomorrow?", "What hypothesis do you want to test?"],
      reflections: ["What do I predict I will see in the workflow, and what would prove me wrong?"],
      artifact: "Champion Research + Tour Question Sheet",
      capstone: "Save your before-tour hypothesis so you can compare it with what you actually observe."
    },
    thursday: {
      label: "Champion Operations Detective Tour",
      objective: "Observe workflow, quality, customer service, technology, safety, teamwork, leadership, and hidden careers inside a live business.",
      steps: ["Wear closed-toe shoes.", "Identify one workflow.", "Find one quality-control point.", "Find one customer-service moment.", "Find one technology use.", "Find one safety practice.", "Notice one leadership/teamwork behavior.", "Name one unexpected career.", "Ask one improvement question."],
      questions: ["Where did quality show up?", "What could cost time, money, or reputation?", "What career surprised you?"],
      observations: ["Student cites specific observations.", "Student connects observations to business outcomes."],
      debrief: ["What did the real workflow confirm?", "What surprised you?", "What would you improve or ask next?"],
      reflections: ["What did the business do that I did not expect?"],
      artifact: "Operations Detective Tour Artifact",
      capstone: "Preserve one live observation that changed your understanding of business operations."
    },
    friday: {
      label: "Operations Debrief + Thank-You",
      objective: "Convert the tour into business literacy, transferable-skill evidence, career awareness, and a professional thank-you.",
      steps: ["Write a thank-you.", "Compare predicted vs. observed workflow.", "Identify one transferable skill.", "Identify one career path.", "Name one improvement insight.", "Choose portfolio/capstone evidence."],
      questions: ["Where did one person's work affect another person's outcome?", "What skill transferred across roles?"],
      observations: ["Student uses evidence from the tour.", "Artifact explains why the observation matters."],
      debrief: ["What did Champion teach you about business?", "What will you carry forward?"],
      reflections: ["What did Champion Tire & Wheel show me about how one person's work affects customers, quality, safety, time, money, and the rest of the team?"],
      artifact: "Workflow + Career/Skill Map + Thank-You",
      capstone: "Preserve one operations insight from observation to reflection."
    }
  },
  12: {
    monday: {
      label: "Catch-Up + Pressure Awareness",
      objective: "Finish missing work and identify personal pressure reactions, communication habits, and one improvement goal.",
      steps: ["Finish missing work.", "Identify what pressure does to your voice/body/thinking.", "Discuss prepared vs. scripted.", "Choose one communication habit to improve."],
      questions: ["What happens to your communication under pressure?", "What makes someone credible?"],
      observations: ["Student can name a real pressure reaction.", "Goal is specific and observable."],
      debrief: ["Name the reaction.", "Name the goal.", "Name one recovery strategy."],
      reflections: ["What pressure reaction do I notice in myself?"],
      artifact: "Pressure-awareness baseline",
      capstone: "Capture the communication habit you intend to improve."
    },
    tuesday: {
      label: "Camera Lab",
      objective: "Practice concise, natural communication through first take, one coaching point, and immediate second take.",
      steps: ["Deliver a 30-second introduction.", "Explain something complicated simply.", "Answer an unexpected question.", "Receive one coaching point.", "Retry immediately.", "Compare attempts."],
      questions: ["What changed on the second attempt?", "What did your body language communicate?"],
      observations: ["Student sounds natural rather than memorized.", "Student applies feedback immediately."],
      debrief: ["What changed?", "What coaching note helped most?"],
      reflections: ["What changed between my first and second attempt?"],
      artifact: "First Take / Second Take evidence",
      capstone: "Preserve before/after evidence showing a concrete communication improvement."
    },
    wednesday: {
      label: "Pressure + Conflict + Panel Lab",
      objective: "Practice difficult questions, disagreement, interruption, blanking, criticism, misinformation correction, uncertainty, and rotating panel roles.",
      steps: ["Rotate panelist/interviewer/moderator/observer.", "Answer a difficult question.", "Handle an interruption.", "Disagree without becoming defensive.", "Correct misinformation respectfully.", "Say 'I don't know' professionally.", "Freeze/coach/replay."],
      questions: ["What protected credibility?", "What sounded defensive?", "How can you stay composed without sounding robotic?"],
      observations: ["Student listens before responding.", "Tone/body language remain professional.", "Student recovers and continues."],
      debrief: ["What was hardest?", "What recovery language worked?", "What changed on replay?"],
      reflections: ["What pressure situation was hardest, and what recovery technique will I keep?"],
      artifact: "Pressure Response + Panel Feedback",
      capstone: "Preserve one freeze/coach/replay moment that shows communication growth."
    },
    thursday: {
      label: "Michelle Boudin Live Application",
      objective: "Apply camera, interview, panel, presentation, and pressure-response skills with professional coaching and immediate retry.",
      steps: ["Set one personal goal.", "Participate in a live communication challenge.", "Receive professional feedback.", "Retry immediately.", "Capture what changed."],
      questions: ["What feedback mattered most?", "What changed on retry?", "Where else will this skill matter?"],
      observations: ["Student accepts feedback professionally.", "Second attempt shows an intentional change."],
      debrief: ["What did Michelle help you notice?", "What will you practice next?"],
      reflections: ["What professional feedback changed my approach?"],
      artifact: "Michelle Boudin Coaching + Retry Evidence",
      capstone: "Preserve the feedback and the evidence of what you changed after receiving it."
    },
    friday: {
      label: "Before / After Communication Artifact",
      objective: "Complete missing work, write a thank-you, compare first and later attempts, and preserve evidence of communication growth.",
      steps: ["Finish missing work.", "Write thank-you.", "Describe the first attempt.", "Describe what changed.", "Name strongest answer/moment.", "Set next improvement goal.", "Save portfolio/capstone evidence."],
      questions: ["What changed?", "What still needs practice?", "How will this transfer to interviews, presentations, meetings, conflict, or leadership?"],
      observations: ["Reflection includes specific evidence.", "Student identifies a transferable communication skill."],
      debrief: ["Name the growth.", "Name the next practice target.", "Choose the artifact."],
      reflections: ["What changed between my first attempt and my later attempt, and what will I deliberately practice next?"],
      artifact: "Before/After Communication Evidence + Thank-You",
      capstone: "Preserve the before/after story: pressure, feedback, change, stronger second attempt, and next goal."
    }
  }
};

function alignedCases(week: number, key: DayKey, variation: number): Build6Case[] {
  const prefix = `w${week}-${key}`;
  const pools: Record<number, Record<DayKey, Build6Case[]>> = {
    9: {
      monday: [
        {id:`${prefix}-1`,industry:"Education",workplace:"Student Project Team",situation:"A teammate says they use AI for nearly every assignment but cannot explain how they check the answers.",tasks:["Identify what needs human ownership","Name what should be verified","Create one responsible-use rule"],reminder:"Using AI does not remove responsibility for the final work.",twist:"The teammate says the output sounds professional so it must be correct.",question:"What would you ask before trusting the output?"},
        {id:`${prefix}-2`,industry:"Marketing",workplace:"Community Campaign Team",situation:"A volunteer used AI to draft a social post that includes a statistic with no source.",tasks:["Locate or remove the unsupported claim","Check whether the number is current","Rewrite the post responsibly"],reminder:"Polished language is not evidence.",twist:"The post is scheduled to publish in ten minutes.",question:"What should happen before publication?"},
        {id:`${prefix}-3`,industry:"Career Readiness",workplace:"Internship Preparation",situation:"A student wants AI to answer every interview question for them.",tasks:["Identify where AI can help","Identify what must remain authentic","Create a practice plan"],reminder:"A response you cannot explain is not your professional story.",twist:"The student says memorizing the AI answer feels safer.",question:"How can AI support preparation without replacing the student's voice?"}
      ],
      tuesday: [
        {id:`${prefix}-1`,industry:"Customer Service",workplace:"Retail Support Team",situation:"The prompt 'write an email to an angry customer' produces a vague response that ignores the actual delay and refund policy.",tasks:["Add context","Add the goal and audience","Add policy constraints"],reminder:"A useful prompt includes the real situation and limits.",twist:"The customer has already contacted the company twice.",question:"What context must be added before asking AI to draft the response?"},
        {id:`${prefix}-2`,industry:"Project Management",workplace:"School Event Team",situation:"The prompt 'make a project plan' produces a generic checklist that does not include owners or deadlines.",tasks:["Define the event and deadline","Add roles and constraints","Request an actionable format"],reminder:"Generic inputs produce generic outputs.",twist:"The event is now one week earlier.",question:"What must the prompt include so the plan becomes usable?"},
        {id:`${prefix}-3`,industry:"Research",workplace:"Career Exploration Team",situation:"The prompt 'tell me about this company' returns a polished overview with no dates or sources.",tasks:["Define what information is needed","Require source/date awareness","Separate facts from assumptions"],reminder:"Company research must be current and verifiable.",twist:"The interview is tomorrow morning.",question:"How would you rewrite the prompt and verify the answer?"}
      ],
      wednesday: [
        {id:`${prefix}-1`,industry:"Career Research",workplace:"Company Research Desk",situation:"AI confidently states that a local company has 2,000 employees, but no source is provided.",tasks:["Pause before using the claim","Find a credible source","Revise or remove the statement"],reminder:"Confidence is not proof.",twist:"A classmate already added the number to a presentation.",question:"Trust, Verify, Revise, or Reject - and why?"},
        {id:`${prefix}-2`,industry:"Human Resources",workplace:"Hiring Team",situation:"AI recommends one candidate over another using assumptions based on the schools they attended.",tasks:["Identify the biased assumption","Return to job-related evidence","Rewrite the evaluation criteria"],reminder:"AI output can reproduce unfair assumptions.",twist:"The hiring manager says the recommendation sounds objective because a computer produced it.",question:"What evidence should actually drive the decision?"},
        {id:`${prefix}-3`,industry:"Operations",workplace:"Business Analysis Team",situation:"A student uploads a file containing customer names and phone numbers so AI can summarize it.",tasks:["Stop the upload/use","Identify the privacy risk","Create a safer analysis method"],reminder:"Do not share confidential or personal information without authorization.",twist:"The student says the file is only being used for class.",question:"What should happen before any AI analysis continues?"}
      ],
      thursday: [
        {id:`${prefix}-1`,industry:"Community",workplace:"BUILD6 Project Studio",situation:"AI creates a strong project outline but invents two community organizations that do not exist.",tasks:["Identify fabricated information","Verify organizations","Replace invented content"],reminder:"You own every fact in the final project.",twist:"The outline is otherwise excellent and the deadline is close.",question:"What gets kept, what gets changed, and what gets verified?"},
        {id:`${prefix}-2`,industry:"Business",workplace:"Student Business Project",situation:"AI suggests a marketing plan that asks for customer data the team does not have permission to collect.",tasks:["Identify the privacy issue","Remove the unsafe step","Design an ethical alternative"],reminder:"Efficiency does not override consent or privacy.",twist:"The unsafe idea would probably produce better targeting.",question:"What should the human decision-maker reject?"},
        {id:`${prefix}-3`,industry:"Presentation",workplace:"Project Presentation Team",situation:"AI generates a persuasive slide with a citation that cannot be found.",tasks:["Check the citation","Remove unsupported claims","Replace with verified evidence"],reminder:"Fabricated citations damage credibility.",twist:"The presentation starts in 30 minutes.",question:"How do you protect credibility under time pressure?"}
      ],
      friday: [
        {id:`${prefix}-1`,industry:"Professional Practice",workplace:"Team Decision Meeting",situation:"AI gives three reasonable options but cannot know which relationship or value matters most to the team.",tasks:["Name the human factors","Compare trade-offs","Make and explain the decision"],reminder:"Judgment includes context AI may not have.",twist:"All three options have similar costs.",question:"What human information should decide the final choice?"},
        {id:`${prefix}-2`,industry:"Communication",workplace:"Manager Email",situation:"AI drafts a perfect-sounding thank-you note that does not mention anything that actually happened.",tasks:["Add specific details","Use your own voice","Keep the message concise"],reminder:"Authenticity is part of professional communication.",twist:"The note must be sent today.",question:"What makes the final note yours?"},
        {id:`${prefix}-3`,industry:"Leadership",workplace:"Student Team",situation:"A teammate wants AI to make the final decision because the group disagrees.",tasks:["Clarify the decision criteria","Use AI only for analysis","Make the decision as a team"],reminder:"AI cannot be accountable for your leadership choice.",twist:"The deadline is in 15 minutes.",question:"What should the team own directly?"}
      ]
    },
    10: {
      monday: [
        {id:`${prefix}-1`,industry:"Career",workplace:"Networking Event",situation:"A student meets a professional but has no idea what to ask beyond 'What do you do?'.",tasks:["Identify a genuine curiosity","Ask an open question","Listen for a follow-up clue"],reminder:"Curiosity creates a better conversation than a memorized list.",twist:"The professional has only three minutes.",question:"What question would make the time useful?"},
        {id:`${prefix}-2`,industry:"Business",workplace:"Professional Panel",situation:"A panelist describes a career path the student has never heard of.",tasks:["Capture the unfamiliar role","Ask what problem the role solves","Identify one next research step"],reminder:"Unexpected paths are opportunities to explore.",twist:"The panel moves to the next speaker quickly.",question:"What follow-up can you ask without derailing the panel?"},
        {id:`${prefix}-3`,industry:"Community",workplace:"Partner Meeting",situation:"A student notices a speaker repeatedly mentioning the same community problem.",tasks:["Identify the recurring problem","Ask who is affected","Ask how the organization responds"],reminder:"Business literacy starts with understanding problems and stakeholders.",twist:"The speaker never uses business vocabulary.",question:"What can you still learn about how value is created?"}
      ],
      tuesday: [
        {id:`${prefix}-1`,industry:"Networking",workplace:"Career Fair",situation:"A student asks 'Do you like your job?' and gets a one-word answer.",tasks:["Rewrite the question","Ask a follow-up","Close professionally"],reminder:"Strong questions invite useful stories and decisions.",twist:"A line of students is waiting behind you.",question:"How do you ask a better question without taking too much time?"},
        {id:`${prefix}-2`,industry:"Business",workplace:"Employer Conversation",situation:"A professional says their biggest challenge is finding reliable people.",tasks:["Listen for the issue","Ask what reliability looks like","Connect the answer to student behavior"],reminder:"Follow-ups should come from what was actually said.",twist:"The professional gives a vague first answer.",question:"What follow-up gets to a concrete example?"},
        {id:`${prefix}-3`,industry:"Career",workplace:"Mentor Introduction",situation:"A student gives a 90-second introduction that includes every activity they have ever done.",tasks:["Cut to 20 seconds","Choose one relevant strength","Invite the other person into the conversation"],reminder:"A professional introduction opens a conversation; it is not a speech.",twist:"The mentor interrupts with a question.",question:"How should the student adapt?"}
      ],
      wednesday: [
        {id:`${prefix}-1`,industry:"Research",workplace:"Speaker Preparation Team",situation:"Students find several facts about Julie and Eric but cannot tell which are current or relevant.",tasks:["Keep only confirmed/public information","Identify what still needs clarification","Turn gaps into questions"],reminder:"Do not invent speaker details.",twist:"Two sources disagree.",question:"What belongs in research notes versus a live question?"},
        {id:`${prefix}-2`,industry:"Business Literacy",workplace:"Professional Research Desk",situation:"Students can describe an organization but cannot explain who it serves or what problem it solves.",tasks:["Identify stakeholders","Identify the problem/value exchange","Draft a question about impact"],reminder:"Business literacy is more than knowing a company name.",twist:"The organization serves more than one audience.",question:"How can a question reveal how value is created?"},
        {id:`${prefix}-3`,industry:"Communication",workplace:"Question Design Team",situation:"A student's best question can be answered with a quick website search.",tasks:["Identify what is already public","Add a decision/lesson/challenge angle","Create a follow-up"],reminder:"Use live access to learn what public pages cannot tell you.",twist:"The student is nervous about sounding too personal.",question:"How can the question stay professional and still go deeper?"}
      ],
      thursday: [
        {id:`${prefix}-1`,industry:"Professional Conversation",workplace:"Julie + Eric Session",situation:"A speaker answers your planned question before you are called on.",tasks:["Listen for a new clue","Adapt your question","Ask a follow-up based on what was said"],reminder:"Professional curiosity requires listening, not reading a list.",twist:"You are called on immediately.",question:"What do you ask now?"},
        {id:`${prefix}-2`,industry:"Career",workplace:"Julie + Eric Session",situation:"A speaker mentions a career path you did not know existed.",tasks:["Capture the role","Ask how people enter it","Identify one next research step"],reminder:"Opportunity recognition starts with curiosity.",twist:"The role is outside your current interests.",question:"Why might it still be worth understanding?"},
        {id:`${prefix}-3`,industry:"Relationship Building",workplace:"Julie + Eric Session",situation:"A speaker offers to connect students with someone in their network.",tasks:["Clarify the opportunity","Respond professionally","Plan appropriate follow-up"],reminder:"A connection is not valuable until you follow through.",twist:"You are not sure you are ready.",question:"How can you respond without overcommitting?"}
      ],
      friday: [
        {id:`${prefix}-1`,industry:"Professional Communication",workplace:"Follow-Up Desk",situation:"A student drafts a thank-you that says only 'Thanks for speaking to us.'",tasks:["Add one specific takeaway","Name why it mattered","Close professionally"],reminder:"Specific follow-up shows you actually listened.",twist:"The student wants to copy the same message to both speakers.",question:"What should be personalized?"},
        {id:`${prefix}-2`,industry:"Career Development",workplace:"Connection Record",situation:"A student learned about an interesting career but takes no next step.",tasks:["Name what was learned","Choose one realistic next action","Set a time to follow through"],reminder:"Curiosity becomes opportunity through action.",twist:"The student is not ready to contact anyone directly.",question:"What low-risk next step still moves the exploration forward?"},
        {id:`${prefix}-3`,industry:"Business Literacy",workplace:"Reflection Team",situation:"A student remembers interesting stories but cannot explain how the speakers or their organizations create value.",tasks:["Identify a problem solved","Identify stakeholders","Connect role to outcome"],reminder:"Stories become business literacy when you can explain the system.",twist:"The organization is mission-driven rather than for-profit.",question:"How is value still created and measured?"}
      ]
    },
    11: {
      monday: [
        {id:`${prefix}-1`,industry:"Operations",workplace:"Local Service Business",situation:"A customer sees only the final service, but six roles contribute behind the scenes.",tasks:["List the hidden roles","Map their handoffs","Identify one failure point"],reminder:"The customer experiences the result of the whole system.",twist:"One role is absent today.",question:"What changes downstream?"},
        {id:`${prefix}-2`,industry:"Quality",workplace:"Product Fulfillment Team",situation:"A small labeling mistake early in the process causes the wrong item to reach a customer.",tasks:["Find the origin","Identify missed checks","Design a prevention step"],reminder:"Small errors can become expensive when they move through a system.",twist:"The customer has already posted a complaint.",question:"Where should quality control have caught the problem?"},
        {id:`${prefix}-3`,industry:"Customer Experience",workplace:"Service Counter",situation:"The front-desk employee is blamed for a delay caused by an earlier supplier issue.",tasks:["Trace the real cause","Communicate accurately","Protect the customer relationship"],reminder:"Customer-facing roles often absorb system failures they did not create.",twist:"The customer demands an immediate answer.",question:"How should the team communicate while solving the root cause?"}
      ],
      tuesday: [
        {id:`${prefix}-1`,industry:"Operations",workplace:"Tire & Wheel Order Flow",situation:"A customer order moves through sales, inventory, scheduling, installation, quality check, and pickup.",tasks:["Map every handoff","Assign ownership","Add quality/safety checkpoints"],reminder:"A workflow is only reliable when ownership and checks are clear.",twist:"The requested item is not in stock.",question:"Where does the workflow change and who must communicate it?"},
        {id:`${prefix}-2`,industry:"Supply Chain",workplace:"Parts & Inventory Team",situation:"A shipment needed for tomorrow's work arrives incomplete.",tasks:["Verify what is missing","Identify affected jobs","Create a customer/operations response"],reminder:"Supply issues become customer issues if they are not managed early.",twist:"A substitute item is available but has not been approved.",question:"Who decides whether the substitute is acceptable?"},
        {id:`${prefix}-3`,industry:"Business Economics",workplace:"Service Operations",situation:"A rework error requires the team to repeat two hours of labor.",tasks:["Identify the original failure","Estimate time/customer impact","Design a prevention check"],reminder:"Waste affects margin, schedule, and customer trust.",twist:"The team is already fully booked.",question:"What does one quality mistake cost beyond materials?"}
      ],
      wednesday: [
        {id:`${prefix}-1`,industry:"Research",workplace:"Champion Tour Prep",situation:"Students know Champion sells tire/wheel-related products or services but have not mapped how a customer need becomes a finished outcome.",tasks:["Research products/services","Build a workflow hypothesis","Prepare an operations question"],reminder:"A hypothesis is something to test, not a fact.",twist:"Public information is incomplete.",question:"What should you observe on-site instead of assuming?"},
        {id:`${prefix}-2`,industry:"Career Exploration",workplace:"Champion Tour Prep",situation:"Students can name technician and sales roles but overlook logistics, finance, marketing, inventory, technology, leadership, and customer experience.",tasks:["Expand the role map","Connect each role to an outcome","Choose one hidden career to investigate"],reminder:"Every industry includes more roles than its most visible jobs.",twist:"One student says the industry is not for them.",question:"What transferable careers or skills could still be relevant?"},
        {id:`${prefix}-3`,industry:"Safety",workplace:"Champion Tour Prep",situation:"Students prepare for a live workplace with equipment, vehicles, inventory, and active work areas.",tasks:["Review closed-toe shoe requirement","Identify safe observation behavior","Prepare safety questions"],reminder:"Professional curiosity never overrides workplace safety.",twist:"A student wants to move closer for a better photo.",question:"What should happen before entering or photographing an active work area?"}
      ],
      thursday: [
        {id:`${prefix}-1`,industry:"Operations",workplace:"Champion Tire & Wheel",situation:"Students observe a customer request moving through multiple people, tools, checks, and handoffs.",tasks:["Trace the workflow","Identify ownership at each handoff","Find one quality-control point"],reminder:"Observe the system, not only the most visible job.",twist:"A step takes longer than expected.",question:"What might explain the delay without assuming poor performance?"},
        {id:`${prefix}-2`,industry:"Customer Experience",workplace:"Champion Tire & Wheel",situation:"A customer-facing employee has to explain a delay caused by an operational issue elsewhere.",tasks:["Observe the communication","Identify what information the employee needs","Connect service to operations"],reminder:"Customer trust depends on accurate internal information.",twist:"The customer is frustrated.",question:"What professional behavior protects trust?"},
        {id:`${prefix}-3`,industry:"Quality & Safety",workplace:"Champion Tire & Wheel",situation:"Students notice a check, tool, or process that appears to slow the work but may protect quality or safety.",tasks:["Ask what the check protects","Identify the risk of skipping it","Connect the check to customer/business outcomes"],reminder:"Efficiency is not the same as skipping controls.",twist:"The shop is busy.",question:"Why might the check become more important under pressure?"}
      ],
      friday: [
        {id:`${prefix}-1`,industry:"Operations Reflection",workplace:"BUILD6 Debrief",situation:"A student lists tour observations but cannot connect them to business outcomes.",tasks:["Choose one observation","Connect it to customer/quality/safety/money","Name the role involved"],reminder:"Observation becomes learning when you explain why it matters.",twist:"The observation seemed routine.",question:"What consequence would occur if that routine step failed?"},
        {id:`${prefix}-2`,industry:"Career",workplace:"BUILD6 Debrief",situation:"A student noticed an unexpected role but assumes it has nothing to do with their interests.",tasks:["Identify transferable skills","Research the pathway","Compare with another industry"],reminder:"Transferable skills travel across industries.",twist:"The student wants a career outside automotive.",question:"What did the role teach you about work anyway?"},
        {id:`${prefix}-3`,industry:"Professional Follow-Up",workplace:"Thank-You Note",situation:"A student writes a generic tour thank-you with no evidence of what they learned.",tasks:["Add one specific observation","Name why it mattered","Connect it to the host's effort"],reminder:"Specific thanks show attention and professionalism.",twist:"The note must stay concise.",question:"What one observation best proves you were engaged?"}
      ]
    },
    12: {
      monday: [
        {id:`${prefix}-1`,industry:"Communication",workplace:"Team Meeting",situation:"A student speaks quickly and overexplains whenever they are nervous.",tasks:["Notice the pressure signal","Choose a pause/structure technique","Set one measurable goal"],reminder:"Awareness comes before improvement.",twist:"The student says slowing down feels awkward.",question:"What would credible pacing sound like?"},
        {id:`${prefix}-2`,industry:"Presentation",workplace:"Class Discussion",situation:"A student memorizes every sentence and loses their place when interrupted.",tasks:["Separate key points from script","Practice recovery","Use natural language"],reminder:"Prepared is not the same as memorized.",twist:"The interruption happens during the first sentence.",question:"How can the student recover without starting over?"},
        {id:`${prefix}-3`,industry:"Leadership",workplace:"Project Update",situation:"A student avoids saying 'I don't know' and guesses instead.",tasks:["Acknowledge uncertainty","State what is known","Give a next step"],reminder:"Credibility grows when uncertainty is handled professionally.",twist:"A leader asks for an answer immediately.",question:"What exact sentence protects credibility?"}
      ],
      tuesday: [
        {id:`${prefix}-1`,industry:"Media",workplace:"Camera Lab",situation:"A student gives a 30-second introduction while looking away from the camera and filling pauses with 'um'.",tasks:["Keep one core message","Improve eye line and pacing","Retry immediately"],reminder:"Coach one behavior at a time.",twist:"The second attempt must be 20 seconds.",question:"What change matters most?"},
        {id:`${prefix}-2`,industry:"Interview",workplace:"Mock Interview",situation:"A student answers 'Tell me about yourself' with a long list of activities.",tasks:["Choose a concise structure","Connect to one strength","End with relevance"],reminder:"A strong answer creates direction, not a biography dump.",twist:"The interviewer interrupts with a follow-up.",question:"How should the student adapt without losing composure?"},
        {id:`${prefix}-3`,industry:"Presentation",workplace:"Explainer Challenge",situation:"A student must explain a complicated idea to someone unfamiliar with the topic.",tasks:["Remove jargon","Use one example","Check for understanding"],reminder:"Clarity is measured by the audience, not the speaker.",twist:"You have 25 seconds.",question:"What can be cut without losing the meaning?"}
      ],
      wednesday: [
        {id:`${prefix}-1`,industry:"Panel",workplace:"Panel Hot Seat",situation:"A panelist is asked a skeptical question that challenges something they just said.",tasks:["Pause and listen","Acknowledge the concern","Answer without becoming defensive"],reminder:"Credibility is protected by composure and clarity.",twist:"Another panelist disagrees publicly.",question:"What is the first sentence you should say?"},
        {id:`${prefix}-2`,industry:"Conflict",workplace:"Team Meeting",situation:"A teammate interrupts and says your information is wrong.",tasks:["Clarify the claim","Correct misinformation respectfully","Keep the conversation productive"],reminder:"Correct the information without attacking the person.",twist:"The teammate keeps interrupting.",question:"How can you set a boundary professionally?"},
        {id:`${prefix}-3`,industry:"Interview",workplace:"Employer Panel",situation:"A student is asked a question they genuinely cannot answer.",tasks:["Avoid guessing","Say what you do know","State how you would find the answer"],reminder:"'I don't know' can be professional when paired with a next step.",twist:"The interviewer waits silently.",question:"What exact response shows honesty and competence?"}
      ],
      thursday: [
        {id:`${prefix}-1`,industry:"Media",workplace:"Michelle Boudin Session",situation:"A student gives a first on-camera answer and receives feedback that their response is too long.",tasks:["Identify the core point","Apply the feedback","Retry immediately"],reminder:"Feedback only matters if you use it.",twist:"The retry gets a different question.",question:"How do you transfer the coaching instead of memorizing one answer?"},
        {id:`${prefix}-2`,industry:"Interview",workplace:"Michelle Boudin Session",situation:"A student is asked an unexpected question and blanks.",tasks:["Pause","Clarify if needed","Use a simple structure to restart"],reminder:"Recovery is a professional skill.",twist:"The camera is still rolling.",question:"What recovery technique helps you continue?"},
        {id:`${prefix}-3`,industry:"Panel",workplace:"Michelle Boudin Session",situation:"A student answers clearly but their body language communicates discomfort.",tasks:["Identify the nonverbal signal","Choose one physical adjustment","Retry"],reminder:"Credibility is verbal and nonverbal.",twist:"The student must remain seated.",question:"What can change without becoming unnatural?"}
      ],
      friday: [
        {id:`${prefix}-1`,industry:"Reflection",workplace:"Communication Review",situation:"A student says they 'did better' but cannot name what actually changed.",tasks:["Compare first and later attempts","Name a specific behavior","Connect it to feedback"],reminder:"Growth evidence must be specific.",twist:"The recordings are not available.",question:"What other evidence can support the reflection?"},
        {id:`${prefix}-2`,industry:"Professional Follow-Up",workplace:"Thank-You Note",situation:"A student wants to thank Michelle but writes a generic message.",tasks:["Name specific feedback","Explain what changed","Keep the note concise"],reminder:"Specific thanks demonstrate listening and application.",twist:"The note must fit in four sentences.",question:"What detail best proves the coaching mattered?"},
        {id:`${prefix}-3`,industry:"Career Readiness",workplace:"Next Interview Plan",situation:"A student improved on camera but still struggles when interrupted.",tasks:["Name the remaining gap","Choose a practice method","Set a next-use situation"],reminder:"A strong reflection includes the next practice target.",twist:"The student has an interview next week.",question:"What should they practice before then?"}
      ]
    }
  };
  const list = pools[week]?.[key] ?? [];
  if (!list.length) return [];
  const shift = Math.abs(variation) % list.length;
  return [...list.slice(shift), ...list.slice(0, shift)].slice(0, 3);
}

export function alignGeneratedWeek0912Activity(
  activity: AIGeneratedActivity,
  request: AILessonRequest,
): AIGeneratedActivity {
  if (request.week < 9 || request.week > 12) return activity;
  const content = getBuild6Week0912Content(request.week);
  if (!content) return activity;
  const key = dayKey(request.day);
  const spec = DAY_SPECS[request.week][key];
  const cases = alignedCases(request.week, key, request.variation ?? 1);

  return {
    ...activity,
    title: `${content.title} · ${spec.label} · ${request.activityType}`,
    lessonConnection: `${content.title} · ${spec.label}`,
    learningObjective: spec.objective,
    whyThisMatters: content.workplaceConnection,
    facilitatorBackground: `${content.facilitatorGuide} Today's specific objective: ${spec.objective}`,
    openingConversation: spec.questions.slice(0, 3),
    stepByStepInstructions: spec.steps,
    teachingPoints: [
      ...content.skillsEarned.slice(0, 6),
      `Today's focus: ${spec.label}`,
      "Practice first, coach one behavior, then retry.",
      "Students must explain their reasoning rather than only produce an answer."
    ],
    facilitatorQuestions: spec.questions,
    observationGuide: spec.observations,
    debriefGuide: spec.debrief,
    discussionQuestions: spec.questions,
    reflectionPrompts: spec.reflections,
    assessmentRubric: [
      "Participated actively and professionally.",
      "Applied the week-specific skill in a realistic situation.",
      "Explained reasoning, evidence, or professional judgment.",
      "Used feedback, verification, observation, or retry to improve.",
      "Created evidence suitable for reflection, portfolio, or capstone."
    ],
    portfolioEvidence: spec.artifact,
    capstoneConnection: spec.capstone,
    ...(cases.length === 3 ? { presentationCases: cases } : {}),
  };
}
