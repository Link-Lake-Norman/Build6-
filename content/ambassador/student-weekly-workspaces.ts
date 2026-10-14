export type StudentWorkspaceFieldType =
  | "textarea"
  | "text"
  | "single-select"
  | "multi-select";

export type StudentWorkspaceField = {
  id: string;
  label: string;
  type?: StudentWorkspaceFieldType;
  options?: string[];
  helperText?: string;
};

export type StudentWorkspaceSection = {
  id: string;
  title: string;
  description?: string;
  fields: StudentWorkspaceField[];
};

export type StudentWeeklyWorkspaceDefinition = {
  week: number;
  title: string;
  subtitle: string;
  essentialQuestion: string;
  sections: StudentWorkspaceSection[];
};

const WEEK_5: StudentWeeklyWorkspaceDefinition = {
  week: 5,
  title: "FROM POSSIBILITY TO OPPORTUNITY",
  subtitle:
    "Career Exploration · Pathways · Relationships · Taking Initiative",
  essentialQuestion:
    "How do I move from wondering what is possible to actually learning about and creating opportunities?",
  sections: [
    {
      id: "look-back",
      title: "PART 1 · LOOK BACK TO MOVE FORWARD",
      fields: [
        {
          id: "last-week-stayed",
          label: "Something from last week that stayed with me:",
          type: "textarea",
        },
        {
          id: "role-person-project-skill",
          label:
            "A role, person, project, skill or part of the workplace that caught my attention:",
          type: "textarea",
        },
        {
          id: "work-different",
          label:
            "Something about work or careers that I understand differently now:",
          type: "textarea",
        },
        {
          id: "curious-because",
          label: "Something I am curious about because of the experience:",
          type: "textarea",
        },
        {
          id: "career-assumption",
          label: "One career assumption I am beginning to question:",
          type: "textarea",
        },
      ],
    },
    {
      id: "curiosity",
      title: "PART 2 · START WITH CURIOSITY",
      description:
        "Instead of asking, “What job am I going to have for the rest of my life?” ask better questions.",
      fields: [
        {
          id: "problems",
          label: "What kinds of problems do I like solving?",
          type: "textarea",
        },
        {
          id: "environments",
          label: "What kinds of environments might I enjoy?",
          type: "multi-select",
          options: [
            "Working with people",
            "Building or making things",
            "Technology",
            "Business",
            "Healthcare",
            "Sports",
            "Design / creativity",
            "Engineering",
            "Skilled trades",
            "Finance",
            "Sales / marketing",
            "Public service",
            "Entrepreneurship",
            "Working outdoors",
            "Leading teams",
            "Helping others",
            "Solving technical problems",
            "Other",
          ],
        },
        {
          id: "investigate-further",
          label: "What am I curious enough to investigate further?",
          type: "textarea",
        },
      ],
    },
    {
      id: "opportunity-map",
      title: "PART 3 · THE OPPORTUNITY MAP",
      description: "ONE INDUSTRY. MANY POSSIBILITIES.",
      fields: [
        {
          id: "industry",
          label: "Industry:",
          type: "text",
        },
        {
          id: "industry-why",
          label: "Why did I choose it?",
          type: "textarea",
        },
        ...Array.from({ length: 5 }, (_, index) => {
          const number = index + 1;
          return [
            {
              id: `role-${number}`,
              label: `Role ${number}:`,
              type: "text" as const,
            },
            {
              id: `role-${number}-does`,
              label: `What does Role ${number} actually do?`,
              type: "textarea" as const,
            },
            {
              id: `role-${number}-path`,
              label: `Possible education / training / experience for Role ${number}:`,
              type: "textarea" as const,
            },
          ];
        }).flat(),
      ],
    },
    {
      id: "pathways",
      title: "PART 4 · THERE IS MORE THAN ONE PATH",
      fields: [
        {
          id: "non-four-year-path",
          label:
            "One pathway on my map that DOES NOT require starting with a four-year degree:",
          type: "textarea",
        },
        {
          id: "specialized-path",
          label:
            "One pathway that requires specialized education, certification or training:",
          type: "textarea",
        },
        {
          id: "entry-opportunity",
          label:
            "One entry-level opportunity that could help someone begin learning this industry:",
          type: "textarea",
        },
        {
          id: "growth-path",
          label:
            "One way a person could grow or advance after entering this field:",
          type: "textarea",
        },
        {
          id: "path-surprise",
          label:
            "What surprised me about the different ways someone could enter this industry?",
          type: "textarea",
        },
      ],
    },
    {
      id: "changing-work",
      title: "PART 5 · WORK IS CHANGING",
      fields: [
        {
          id: "technology-role",
          label: "Role:",
          type: "text",
        },
        {
          id: "technology-changing",
          label: "How is technology changing or helping this work?",
          type: "textarea",
        },
        {
          id: "technology-automate",
          label: "What could technology automate or make faster?",
          type: "textarea",
        },
        {
          id: "human-required",
          label:
            "What still requires a person to think, communicate, create, decide, adapt, lead or solve problems?",
          type: "textarea",
        },
        {
          id: "more-valuable-skills",
          label:
            "What skills might become MORE valuable as technology changes this field?",
          type: "textarea",
        },
      ],
    },
    {
      id: "speaker-prep",
      title: "PART 6 · PREPARE FOR THE FORMER-ATHLETE CONVERSATION",
      description:
        "Prepare to learn from a former NFL player and a former Notre Dame lacrosse player about life before, during and beyond an athletic chapter.",
      fields: [
        {
          id: "pre-future",
          label:
            "PRE · What did you believe your future would look like when you were our age?",
          type: "textarea",
        },
        {
          id: "pre-sacrifices",
          label: "PRE · What sacrifices did you make?",
          type: "textarea",
        },
        {
          id: "pre-influence",
          label: "PRE · Who influenced your decisions?",
          type: "textarea",
        },
        {
          id: "pre-plan",
          label: "PRE · Did you have a plan outside your sport?",
          type: "textarea",
        },
        {
          id: "pre-sooner",
          label: "PRE · What do you wish you had started building sooner?",
          type: "textarea",
        },
        {
          id: "my-pre-question",
          label: "My PRE question:",
          type: "textarea",
        },
        {
          id: "during-identity",
          label:
            "DURING · How much did your identity become connected to your sport?",
          type: "textarea",
        },
        {
          id: "during-skills",
          label:
            "DURING · What skills did athletics give you that became valuable outside sports?",
          type: "textarea",
        },
        {
          id: "during-not-prepare",
          label: "DURING · What did athletics NOT prepare you for?",
          type: "textarea",
        },
        {
          id: "during-pressure",
          label:
            "DURING · How did you handle pressure, failure, injuries, competition or uncertainty?",
          type: "textarea",
        },
        {
          id: "during-team",
          label: "DURING · Who was on your decision team?",
          type: "textarea",
        },
        {
          id: "my-during-question",
          label: "My DURING question:",
          type: "textarea",
        },
        {
          id: "post-changing",
          label:
            "POST · When did you realize your athletic chapter was changing?",
          type: "textarea",
        },
        {
          id: "post-hardest",
          label: "POST · What was hardest about the transition?",
          type: "textarea",
        },
        {
          id: "post-identity",
          label:
            "POST · Who were you when you were no longer introduced primarily as an athlete?",
          type: "textarea",
        },
        {
          id: "post-transfer",
          label:
            "POST · Which athletic skills transferred into your next chapter?",
          type: "textarea",
        },
        {
          id: "post-learn",
          label: "POST · What did you have to learn from scratch?",
          type: "textarea",
        },
        {
          id: "post-network",
          label:
            "POST · How did relationships or networking affect your next opportunity?",
          type: "textarea",
        },
        {
          id: "post-advice",
          label:
            "POST · What would you tell an athlete who thinks there is plenty of time to figure this out later?",
          type: "textarea",
        },
        {
          id: "my-post-question",
          label: "My POST question:",
          type: "textarea",
        },
        {
          id: "future-self-build",
          label:
            "What is something I should start building now, while I am still an athlete, that my future self will be grateful I built?",
          type: "textarea",
        },
      ],
    },
    {
      id: "speaker-conversation",
      title: "PART 7 · FORMER-ATHLETE CONVERSATION",
      description:
        "PRE → DURING → POST → WHAT I KNOW NOW. Listen. Watch. Ask. Capture what matters during a natural pause or immediately afterward.",
      fields: [
        {
          id: "speaker-surprise",
          label: "Something I heard that surprised me:",
          type: "textarea",
        },
        {
          id: "speaker-challenge",
          label: "A mistake, setback or challenge I can learn from:",
          type: "textarea",
        },
        {
          id: "speaker-transferable",
          label: "A skill athletics built that transfers beyond sport:",
          type: "textarea",
        },
        {
          id: "speaker-sooner",
          label:
            "Something one speaker wished they had understood or built sooner:",
          type: "textarea",
        },
        {
          id: "speaker-relationships",
          label:
            "Something I heard about relationships, mentors or networking:",
          type: "textarea",
        },
        {
          id: "speaker-identity",
          label: "Something I heard about identity beyond athletics:",
          type: "textarea",
        },
        {
          id: "speaker-remember",
          label: "One statement I want to remember:",
          type: "textarea",
        },
        {
          id: "speaker-question",
          label: "One question I still have:",
          type: "textarea",
        },
      ],
    },
    {
      id: "speaker-evidence",
      title: "PART 8 · TURN THE CONVERSATION INTO EVIDENCE",
      fields: [
        {
          id: "before-conversation",
          label:
            "BEFORE THE CONVERSATION · Something I assumed about life during or after athletics:",
          type: "textarea",
        },
        {
          id: "after-conversation",
          label:
            "AFTER THE CONVERSATION · Something I understand differently:",
          type: "textarea",
        },
        {
          id: "athletic-transfer",
          label:
            "One athletic skill I already have that can transfer beyond sports:",
          type: "textarea",
        },
        {
          id: "athletic-transfer-evidence",
          label: "Evidence that I have used this skill:",
          type: "textarea",
        },
        {
          id: "build-now",
          label:
            "One skill, relationship, habit or part of myself I need to start building now:",
          type: "textarea",
        },
        {
          id: "build-why",
          label: "Why will this matter later?",
          type: "textarea",
        },
        {
          id: "athlete-action",
          label: "One action I can take while I am still an athlete:",
          type: "textarea",
        },
        {
          id: "athlete-person",
          label: "One person I could learn from as I build it:",
          type: "textarea",
        },
      ],
    },
    {
      id: "relationships",
      title: "PART 9 · RELATIONSHIPS CREATE ACCESS",
      fields: [
        {
          id: "person-learn",
          label: "One PERSON I could learn from:",
          type: "text",
        },
        {
          id: "person-why",
          label: "Why this person?",
          type: "textarea",
        },
        {
          id: "organization-learn",
          label: "One ORGANIZATION I could learn from:",
          type: "text",
        },
        {
          id: "organization-why",
          label: "Why this organization?",
          type: "textarea",
        },
        {
          id: "conversation-learn",
          label: "What could I learn by having one conversation with them?",
          type: "textarea",
        },
      ],
    },
    {
      id: "opportunity-ask",
      title: "PART 10 · ASK FOR THE CONVERSATION",
      description: "THE 30-SECOND OPPORTUNITY ASK",
      fields: [
        {
          id: "ask-introduce",
          label: "1 · INTRODUCE YOURSELF · Who are you?",
          type: "textarea",
        },
        {
          id: "ask-connection",
          label:
            "2 · MAKE THE CONNECTION · Why are you interested in this person, organization or field?",
          type: "textarea",
        },
        {
          id: "ask-specific",
          label: "3 · MAKE ONE SMALL, SPECIFIC ASK · My ask:",
          type: "textarea",
        },
        {
          id: "ask-close",
          label:
            "4 · CLOSE PROFESSIONALLY · How will you thank them and make it easy for them to respond?",
          type: "textarea",
        },
        {
          id: "complete-ask",
          label:
            "MY COMPLETE 30-SECOND ASK · Write it the way you would actually say it.",
          type: "textarea",
        },
        {
          id: "practice-clear",
          label: "Was the introduction clear?",
          type: "single-select",
          options: ["Yes", "Almost", "Needs work"],
        },
        {
          id: "practice-why",
          label: "Did I explain WHY I was interested?",
          type: "single-select",
          options: ["Yes", "Almost", "Needs work"],
        },
        {
          id: "practice-specific",
          label: "Was my ask specific and reasonable?",
          type: "single-select",
          options: ["Yes", "Almost", "Needs work"],
        },
        {
          id: "practice-confidence",
          label: "Did I sound confident without sounding entitled?",
          type: "single-select",
          options: ["Yes", "Almost", "Needs work"],
        },
        {
          id: "practice-close",
          label: "Did I close professionally?",
          type: "single-select",
          options: ["Yes", "Almost", "Needs work"],
        },
        {
          id: "practice-improve",
          label: "One thing I will improve:",
          type: "textarea",
        },
      ],
    },
    {
      id: "next-move",
      title: "PART 11 · MY NEXT CAREER-EXPLORATION MOVE",
      fields: [
        {
          id: "new-role",
          label: "One role I discovered that I did not know much about before:",
          type: "textarea",
        },
        {
          id: "path-investigate",
          label: "One pathway I want to investigate further:",
          type: "textarea",
        },
        {
          id: "reach-person",
          label: "One person I could professionally reach out to:",
          type: "textarea",
        },
        {
          id: "investigate-organization",
          label: "One organization I could investigate:",
          type: "textarea",
        },
        {
          id: "still-question",
          label: "One question I still need answered:",
          type: "textarea",
        },
        {
          id: "next-career-move",
          label: "My next career-exploration move is:",
          type: "textarea",
        },
        {
          id: "next-career-by",
          label: "I will do it by:",
          type: "textarea",
        },
      ],
    },
    {
      id: "reflection",
      title: "WEEK 5 REFLECTION",
      fields: [
        {
          id: "before-week",
          label: "BEFORE THIS WEEK · I thought career exploration was:",
          type: "textarea",
        },
        {
          id: "now-week",
          label: "NOW · I think career exploration is:",
          type: "textarea",
        },
        {
          id: "possibility-better",
          label: "A possibility I understand better:",
          type: "textarea",
        },
        {
          id: "week-surprised",
          label: "Something that surprised me:",
          type: "textarea",
        },
        {
          id: "learned-self",
          label: "Something I learned about myself:",
          type: "textarea",
        },
        {
          id: "learned-opportunity",
          label: "Something I learned about opportunity:",
          type: "textarea",
        },
        {
          id: "learned-relationships",
          label: "Something I learned about relationships:",
          type: "textarea",
        },
      ],
    },
    {
      id: "passport",
      title: "FUTURE READY™ PASSPORT EVIDENCE",
      fields: [
        { id: "passport-industry", label: "MY INDUSTRY", type: "textarea" },
        {
          id: "passport-role",
          label: "ONE NEW ROLE I DISCOVERED",
          type: "textarea",
        },
        {
          id: "passport-pathway",
          label: "ONE POSSIBLE PATHWAY",
          type: "textarea",
        },
        {
          id: "passport-person",
          label: "ONE PERSON OR ORGANIZATION I COULD LEARN FROM",
          type: "textarea",
        },
        {
          id: "passport-ask",
          label: "MY PROFESSIONAL OPPORTUNITY ASK",
          type: "textarea",
        },
        { id: "passport-next", label: "MY NEXT MOVE", type: "textarea" },
        {
          id: "passport-speaker",
          label: "ONE LESSON FROM THE FORMER-ATHLETE CONVERSATION",
          type: "textarea",
        },
        {
          id: "passport-transfer",
          label: "ONE ATHLETIC SKILL THAT TRANSFERS BEYOND SPORT",
          type: "textarea",
        },
        {
          id: "passport-future",
          label: "ONE THING I WILL START BUILDING NOW FOR FUTURE ME",
          type: "textarea",
        },
      ],
    },
    {
      id: "close",
      title: "WEEK 5 CLOSE",
      fields: [
        { id: "close-discovered", label: "I DISCOVERED...", type: "textarea" },
        { id: "close-questioned", label: "I QUESTIONED...", type: "textarea" },
        { id: "close-connected", label: "I CONNECTED...", type: "textarea" },
        { id: "close-practiced", label: "I PRACTICED...", type: "textarea" },
        {
          id: "close-explore",
          label: "I WANT TO EXPLORE...",
          type: "textarea",
        },
        { id: "close-next", label: "MY NEXT MOVE IS...", type: "textarea" },
      ],
    },
  ],
};

const WEEK_9: StudentWeeklyWorkspaceDefinition={week:9,title:"AI AT WORK",subtitle:"Think Better · Work Smarter · Stay Human",essentialQuestion:"How do I use AI without giving up my own thinking?",sections:[
{id:"monday",title:"MONDAY · CATCH-UP + DISCUSSION",fields:[{id:"catch-up",label:"What do I need to finish or organize this week?",type:"textarea"},{id:"ai-now",label:"Where am I already using AI?",type:"textarea"},{id:"trust",label:"What do I trust AI to do well — and what still requires my judgment?",type:"textarea"}]},
{id:"tuesday",title:"TUESDAY · PROMPTING + PROBLEM SOLVING",fields:[{id:"weak-prompt",label:"Weak prompt:",type:"textarea"},{id:"strong-prompt",label:"Improved prompt using role + context + goal + audience + constraints + format:",type:"textarea"},{id:"human-decision",label:"What should the human still decide?",type:"textarea"}]},
{id:"wednesday",title:"WEDNESDAY · AI JUDGMENT + VERIFICATION",fields:[{id:"stop",label:"STOP · What do I need to understand before using this?",type:"textarea"},{id:"check",label:"CHECK · What facts, dates, sources, assumptions, bias, privacy, or missing information must I verify?",type:"textarea"},{id:"decide",label:"DECIDE · Use, revise, verify, reject, or ask a better question — and why?",type:"textarea"},{id:"checklist",label:"MY AI VERIFICATION CHECKLIST · Write at least 5 rules:",type:"textarea"}]},
{id:"thursday",title:"THURSDAY · AI PROJECT STUDIO",fields:[{id:"asked",label:"What I asked AI:",type:"textarea"},{id:"gave",label:"What AI gave me:",type:"textarea"},{id:"changed",label:"What I changed, rejected, corrected, or added:",type:"textarea"},{id:"verified",label:"What I verified and how:",type:"textarea"},{id:"human",label:"What I contributed that AI could not replace:",type:"textarea"}]},
{id:"friday",title:"FRIDAY · HUMAN ADVANTAGE + PROFESSIONAL AI RULES",fields:[{id:"rules",label:"My Professional AI Rules · Write at least 7:",type:"textarea"},{id:"advantage",label:"The human advantage I want to strengthen is ___ because ___:",type:"textarea"},{id:"artifact",label:"What evidence from this week belongs in my portfolio/capstone?",type:"textarea"}]}]};
const WEEK_10:StudentWeeklyWorkspaceDefinition={week:10,title:"PROFESSIONAL CURIOSITY + BUSINESS LITERACY",subtitle:"Julie + Eric · Ask Better · Listen Better · Connect Better",essentialQuestion:"What can I learn from a professional conversation that I cannot learn from a website?",sections:[
{id:"monday",title:"MONDAY · RESET + CURIOSITY",fields:[{id:"catch-up",label:"What unfinished work/project responsibility needs attention?",type:"textarea"},{id:"curiosity",label:"What do I genuinely want to understand better about work, business, or career paths?",type:"textarea"}]},
{id:"tuesday",title:"TUESDAY · CURIOSITY LAB",fields:[{id:"intro",label:"My 20-second professional introduction:",type:"textarea"},{id:"strong",label:"A strong open-ended question + two follow-ups:",type:"textarea"}]},
{id:"wednesday",title:"WEDNESDAY · JULIE + ERIC RESEARCH + QUESTIONS",fields:[{id:"confirmed",label:"Confirmed/public information about their work:",type:"textarea"},{id:"problems",label:"Problems they/their organizations solve:",type:"textarea"},{id:"stakeholders",label:"Customers/clients/members/partners/stakeholders:",type:"textarea"},{id:"questions",label:"My 3–5 thoughtful questions:",type:"textarea"}]},
{id:"thursday",title:"THURSDAY · LIVE PROFESSIONAL CONVERSATION",fields:[{id:"surprise",label:"Something that surprised me:",type:"textarea"},{id:"business",label:"How professionals/businesses create value:",type:"textarea"},{id:"opportunity",label:"A role, idea, person, or opportunity I want to explore:",type:"textarea"}]},
{id:"friday",title:"FRIDAY · THANK-YOU + CONNECTION RECORD",fields:[{id:"thankyou",label:"My thank-you/follow-up message:",type:"textarea"},{id:"next",label:"Who/what should I stay connected to or explore next?",type:"textarea"},{id:"artifact",label:"Portfolio/capstone evidence:",type:"textarea"}]}]};
const WEEK_11:StudentWeeklyWorkspaceDefinition={week:11,title:"HOW A BUSINESS ACTUALLY WORKS",subtitle:"Champion Tire & Wheel · Operations · Customers · Quality · Careers",essentialQuestion:"How do people, process, technology, quality, safety, and customer needs connect inside a real business?",sections:[
{id:"monday",title:"MONDAY · RESET + BUSINESS SYSTEMS",fields:[{id:"catch-up",label:"What unfinished work/project responsibility needs attention?",type:"textarea"},{id:"behind-scenes",label:"What must happen behind the scenes for a customer to receive a finished outcome?",type:"textarea"}]},
{id:"tuesday",title:"TUESDAY · BUSINESS SYSTEMS LAB",fields:[{id:"customer-need",label:"Customer need:",type:"textarea"},{id:"workflow",label:"Workflow from first contact to finished outcome:",type:"textarea"},{id:"roles",label:"Roles / responsibilities involved:",type:"textarea"},{id:"risk",label:"Where could quality, safety, time, money, or reputation be affected?",type:"textarea"}]},
{id:"wednesday",title:"WEDNESDAY · CHAMPION RESEARCH",fields:[{id:"products",label:"Products/services:",type:"textarea"},{id:"customers",label:"Customers and problems they need solved:",type:"textarea"},{id:"workflow-hypothesis",label:"My workflow hypothesis:",type:"textarea"},{id:"careers",label:"Expected + hidden careers/roles:",type:"textarea"},{id:"questions",label:"Questions for the tour:",type:"textarea"}]},
{id:"thursday",title:"THURSDAY · OPERATIONS DETECTIVE TOUR",description:"Closed-toe shoes.",fields:[{id:"workflow",label:"One workflow observed:",type:"textarea"},{id:"quality",label:"One quality-control point:",type:"textarea"},{id:"customer",label:"One customer-service moment:",type:"textarea"},{id:"technology",label:"One technology use:",type:"textarea"},{id:"safety",label:"One safety practice:",type:"textarea"},{id:"career",label:"One unexpected career:",type:"textarea"},{id:"improvement",label:"One improvement question/opportunity:",type:"textarea"}]},
{id:"friday",title:"FRIDAY · THANK-YOU + OPERATIONS DEBRIEF",fields:[{id:"thankyou",label:"My thank-you message:",type:"textarea"},{id:"money",label:"Where could one mistake cost time, money, or reputation?",type:"textarea"},{id:"transferable",label:"One transferable skill I saw in action:",type:"textarea"},{id:"artifact",label:"Portfolio/capstone evidence:",type:"textarea"}]}]};
const WEEK_12:StudentWeeklyWorkspaceDefinition={week:12,title:"COMMUNICATION UNDER PRESSURE",subtitle:"Michelle Boudin · Camera · Interview · Panel · Conflict · Presentation",essentialQuestion:"How do I think, respond, recover, and remain credible when the pressure is real?",sections:[
{id:"monday",title:"MONDAY · RESET + PRESSURE AWARENESS",fields:[{id:"catch-up",label:"What unfinished work/project responsibility needs attention?",type:"textarea"},{id:"reaction",label:"What happens to my communication when I feel pressure?",type:"textarea"},{id:"goal",label:"One communication habit I want to improve:",type:"textarea"}]},
{id:"tuesday",title:"TUESDAY · CAMERA LAB",fields:[{id:"intro",label:"My 30-second professional introduction:",type:"textarea"},{id:"first",label:"First-attempt observation:",type:"textarea"},{id:"coach",label:"Coaching point:",type:"textarea"},{id:"second",label:"What changed on my second attempt?",type:"textarea"}]},
{id:"wednesday",title:"WEDNESDAY · PRESSURE + CONFLICT + PANEL LAB",fields:[{id:"hard-question",label:"A difficult question I practiced answering:",type:"textarea"},{id:"conflict",label:"How I disagreed/corrected information without becoming defensive:",type:"textarea"},{id:"dont-know",label:"How I handled a question I could not answer:",type:"textarea"},{id:"panel",label:"What I learned as panelist/interviewer/moderator/observer:",type:"textarea"},{id:"recovery",label:"My best recovery phrase or technique:",type:"textarea"}]},
{id:"thursday",title:"THURSDAY · MICHELLE BOUDIN LIVE APPLICATION",fields:[{id:"goal",label:"My specific goal for Michelle's session:",type:"textarea"},{id:"feedback",label:"Professional feedback I received:",type:"textarea"},{id:"retry",label:"What changed when I retried?",type:"textarea"},{id:"transfer",label:"How this transfers to interviews, presentations, panels, conflict, meetings, or leadership:",type:"textarea"}]},
{id:"friday",title:"FRIDAY · BEFORE / AFTER COMMUNICATION ARTIFACT",fields:[{id:"before",label:"Before: what pressure did to my communication:",type:"textarea"},{id:"after",label:"After: what I now do differently:",type:"textarea"},{id:"strongest",label:"My strongest communication moment:",type:"textarea"},{id:"improve",label:"What I still need to practice:",type:"textarea"},{id:"thankyou",label:"Thank-you message for Michelle:",type:"textarea"}]}]};

const WORKSPACES: Record<number, StudentWeeklyWorkspaceDefinition> = {
  12: WEEK_12,
  11: WEEK_11,
  10: WEEK_10,
  9: WEEK_9,
  5: WEEK_5,
};

export function getStudentWeeklyWorkspace(
  week: number,
): StudentWeeklyWorkspaceDefinition | undefined {
  return WORKSPACES[week];
}
