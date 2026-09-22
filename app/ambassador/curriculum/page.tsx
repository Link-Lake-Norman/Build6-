"use client";

import { packagedResources } from "@/lib/ambassador/packaged-resources";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppliedLearningTeachingHub from "@/components/ambassador/AppliedLearningTeachingHub";
import AmbassadorWeekDeliveryConsole from "@/components/ambassador/AmbassadorWeekDeliveryConsole";
import { curriculum as richCurriculum } from "@/content/curriculum";
import { ambassadorWeeklyRhythm } from "@/content/ambassador";

type HubTab =
  | "overview"
  | "lesson"
  | "activities"
  | "assignments"
  | "resources"
  | "calendar"
  | "release";

type RequirementValue = "HIDDEN" | "OPTIONAL" | "REQUIRED";

type RequirementField =
  | "attendance"
  | "slides"
  | "workbook"
  | "activity"
  | "assessment"
  | "reflection"
  | "portfolioEvidence"
  | "homework"
  | "guestSpeakerTask";

type DatabaseLessonContent = {
  week?: number;
  program?: string;
  title?: string;
  focus?: string;
  activity?: string;
  reflection?: string;
};

type DatabaseLesson = {
  id: string;
  weekNumber: number;
  position: number;
  title: string;
  slug: string;
  summary: string | null;
  status: string;
  estimatedMinutes: number;
  content: DatabaseLessonContent | null;
  module: {
    id: string;
    title: string;
    phase: string;
    programId: string;
  };
};

type DeliverySetting = {
  id: string;
  lessonId: string;
  cohortId: string;
  attendance: RequirementValue;
  slides: RequirementValue;
  workbook: RequirementValue;
  activity: RequirementValue;
  assessment: RequirementValue;
  reflection: RequirementValue;
  portfolioEvidence: RequirementValue;
  homework: RequirementValue;
  guestSpeakerTask: RequirementValue;
  badgeEnabled: boolean;
  releasedToStudents: boolean;
  facilitatorNotes: string | null;
};

type Resource = {
  id: string;
  title: string;
  description: string | null;
  kind: string;
  url: string | null;
  fileName: string | null;
  filePath: string | null;
  dayNumber: number | null;
  enabled: boolean;
  required: boolean;
  visibleToStudent: boolean;
  visibleToFacilitator: boolean;
};

type PlanTaskResource = {
  id: string;
  sortOrder: number;
  resource: Resource;
};

type PlanTask = {
  id: string;
  taskType: string;
  title: string;
  instructions: string;
  dayNumber: number;
  durationMinutes: number;
  requirement: RequirementValue;
  visibleToStudent: boolean;
  visibleToFacilitator: boolean;
  resources: PlanTaskResource[];
};

type Assignment = {
  id: string;
  title: string;
  instructions: string;
  estimatedMinutes: number;
  requirement: RequirementValue;
  dayNumber: number | null;
  allowOnline: boolean;
  allowPrint: boolean;
  allowUpload: boolean;
  portfolioEligible: boolean;
  badgeName: string | null;
  dueAt: string | null;
  status: string;
};

type DailyTeachingNote = {
  id: string;
  lessonId: string;
  cohortId: string;
  dayNumber: number;
  content: string;
  createdById: string | null;
  createdAt: string;
};

type TeachingHubResponse = {
  program: {
    id: string;
    totalWeeks: number;
  };
  cohort: {
    id: string;
    name: string;
  };
  lesson: DatabaseLesson;
  delivery: DeliverySetting | null;
  resources: Resource[];
  planTasks: PlanTask[];
  assignments: Assignment[];
  dailyNotes: DailyTeachingNote[];
};

const tabs: { key: HubTab; label: string }[] = [
  { key: "overview", label: "Week Overview" },
  { key: "lesson", label: "Facilitator Notes" },
  { key: "activities", label: "Generate Activity" },
  { key: "assignments", label: "Student Work" },
  { key: "resources", label: "Asset Library" },
  { key: "calendar", label: "Schedule" },
  { key: "release", label: "Student Release" },
];

const requirementControls: {
  field: RequirementField;
  label: string;
}[] = [
  { field: "attendance", label: "Attendance" },
  { field: "slides", label: "Slides" },
  { field: "workbook", label: "Student Workbook" },
  { field: "activity", label: "Activity" },
  { field: "assessment", label: "Assessment" },
  { field: "reflection", label: "Reflection" },
  {
    field: "portfolioEvidence",
    label: "Portfolio Evidence",
  },
  { field: "homework", label: "Homework" },
  {
    field: "guestSpeakerTask",
    label: "Guest Speaker Task",
  },
];

const requirementOptions: RequirementValue[] = [
  "HIDDEN",
  "OPTIONAL",
  "REQUIRED",
];

export default function AmbassadorCurriculumPage() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  // Default to Day 1. A valid ?day=1..5 URL value overrides this on load.
  const [selectedDay, setSelectedDay] = useState(1);
  const [closingWeek, setClosingWeek] = useState(false);
  const [weekProgressError, setWeekProgressError] = useState<string | null>(null);
  const [weekStatuses, setWeekStatuses] = useState<
    Array<{
      week: number;
      completedDays: number[];
      closed: boolean;
    }>
  >([]);
  const [activeTab, setActiveTab] = useState<HubTab>("overview");
  const [showFullTools, setShowFullTools] = useState(false);
  const [assigningResourceId, setAssigningResourceId] =
    useState<string | null>(null);

  const [addingLessonResourceId, setAddingLessonResourceId] =
    useState<string | null>(null);

  const [data, setData] = useState<TeachingHubResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [facilitatorNotes, setFacilitatorNotes] = useState("");

  const [dailyDirections, setDailyDirections] = useState("");

  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    instructions: "",
    estimatedMinutes: 20,
    requirement: "REQUIRED" as RequirementValue,
    dueAt: "",
    dayNumber: null as number | null,
    allowOnline: true,
    allowPrint: true,
    allowUpload: true,
    portfolioEligible: true,
  });

  const [editingAssignmentId, setEditingAssignmentId] =
    useState<string | null>(null);

  const [resourceForm, setResourceForm] = useState({
    title: "",
    description: "",
    kind: "LINK",
    url: "",
    dayNumber: null as number | null,
    required: false,
    visibleToStudent: true,
  });

  const [taskForm, setTaskForm] = useState({
    taskType: "Class Task",
    title: "",
    instructions: "",
    dayNumber: 1,
    durationMinutes: 10,
    requirement: "OPTIONAL" as RequirementValue,
    visibleToStudent: true,
  });

  const richLesson = useMemo(
    () => richCurriculum.find((item) => item.week === selectedWeek),
    [selectedWeek],
  );

  async function readApiResponse(response: Response) {
    const raw = await response.text();

    try {
      return raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error(
        response.ok
          ? "Future Ready™ received an unexpected server response. Please refresh and try again."
          : `Server request failed (${response.status}). Please sign in again or refresh the page.`
      );
    }
  }

  async function loadWeek(week: number) {
    setLoading(true);
    setError(null);
    setSaveMessage(null);

    try {
      const response = await fetch(
        `/api/ambassador/teaching-hub?week=${week}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const result = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to load this lesson.");
      }

      const typedResult = result as TeachingHubResponse;

      setData(typedResult);
      setFacilitatorNotes("");
    } catch (caughtError) {
      setData(null);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load this lesson.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWeek(selectedWeek);
  }, [selectedWeek]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    const queryWeek = Number(params.get("week") || "0");
    const queryDay = Number(params.get("day") || "0");
    if (queryDay >= 1 && queryDay <= 5) {
      setSelectedDay(queryDay);
    }

    const storedWeek = Number(
      window.sessionStorage.getItem("future-ready-facilitator-week") || "0",
    );

    const restoredWeek =
      queryWeek >= 1 && queryWeek <= 16
        ? queryWeek
        : storedWeek >= 1 && storedWeek <= 16
          ? storedWeek
          : 1;

    setSelectedWeek(restoredWeek);
  }, []);

  useEffect(() => {
    loadFacilitatorWeekStatuses();
  }, []);

  useEffect(() => {
    const currentDirections = data?.planTasks.find(
      (task) =>
        task.dayNumber === selectedDay &&
        task.taskType === "DAILY_DIRECTIONS",
    );

    setDailyDirections(currentDirections?.instructions ?? "");
  }, [data, selectedDay]);

  async function loadFacilitatorWeekStatuses() {
    setWeekProgressError(null);

    try {
      const results = await Promise.all(
        Array.from({ length: 16 }, async (_, index) => {
          const week = index + 1;

          const response = await fetch(
            `/api/ambassador/day-completion?cohortCode=PILOT-2026-2027&week=${week}`,
          );

          const result = await response.json();

          if (!response.ok) {
            throw new Error(
              result.error || `Unable to load Week ${week} progress.`,
            );
          }

          const completedDays = Array.isArray(result.completions)
            ? result.completions
                .map((item: { dayNumber?: number }) => item.dayNumber)
                .filter(
                  (dayNumber: unknown): dayNumber is number =>
                    typeof dayNumber === "number" &&
                    dayNumber >= 1 &&
                    dayNumber <= 5,
                )
            : [];

          return {
            week,
            completedDays,
            closed: completedDays.length >= 5,
          };
        }),
      );

      setWeekStatuses(results);
    } catch (caughtError) {
      setWeekProgressError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load facilitator week status.",
      );
    }
  }

  async function closeCurrentWeek() {
    if (closingWeek || selectedWeek === 15) return;

    const currentStatus = weekStatuses.find(
      (item) => item.week === selectedWeek,
    );

    if (currentStatus?.closed) {
      if (selectedWeek < 16) {
        changeWeek(selectedWeek + 1);
      }
      return;
    }

    setClosingWeek(true);
    setWeekProgressError(null);

    try {
      const alreadyCompleted = new Set(
        currentStatus?.completedDays ?? [],
      );

      const missingDays = [1, 2, 3, 4, 5].filter(
        (dayNumber) => !alreadyCompleted.has(dayNumber),
      );

      for (const dayNumber of missingDays) {
        const response = await fetch(
          "/api/ambassador/day-completion",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cohortCode: "PILOT-2026-2027",
              week: selectedWeek,
              dayNumber,
              facilitatorNote:
                "Week closed by facilitator. Student access and existing student work remain unchanged.",
            }),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || `Unable to close Week ${selectedWeek}.`,
          );
        }
      }

      await loadFacilitatorWeekStatuses();

      if (selectedWeek < 16) {
        changeWeek(selectedWeek + 1);
      }
    } catch (caughtError) {
      setWeekProgressError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to close this week.",
      );
    } finally {
      setClosingWeek(false);
    }
  }

  async function patchDelivery(
    update: Record<string, unknown>,
    successMessage: string,
  ) {
    if (!data?.lesson?.id) return;

    setSaving(true);
    setError(null);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/ambassador/teaching-hub", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId: data.lesson.id,
          ...update,
        }),
      });

      const result = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to save this setting.");
      }

      setData((current) => {
        if (!current) return current;

        return {
          ...current,
          delivery: result.delivery,
        };
      });

      // Daily staff notes are append-only.

      setSaveMessage(successMessage);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to save this setting.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function createHubItem(
    payload: Record<string, unknown>,
    successMessage: string,
  ) {
    if (!data?.lesson?.id) return false;

    setSaving(true);
    setError(null);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/ambassador/teaching-hub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId: data.lesson.id,
          ...payload,
        }),
      });

      const result = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to save item.");
      }

      await loadWeek(selectedWeek);
      setSaveMessage(successMessage);

      return true;
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to save item.",
      );

      return false;
    } finally {
      setSaving(false);
    }
  }

  const PREBUILT_WEEK_ASSIGNMENTS: Record<
    number,
    {
      title: string;
      instructions: string;
      minutes: number;
      dayNumber: number;
    }
  > = {
    5: {
      title: "Life After Athlete — Transferable Skills + Identity",
      instructions: `WHAT YOU ARE DOING

You are identifying who you are beyond athletics and translating experiences from sports, school, work, family, and life into skills that matter in the real world.

WHY THIS MATTERS

Employers, mentors, colleges, and future teams do not only need to hear that you are hardworking, disciplined, coachable, resilient, or a leader. They need evidence that shows HOW you have demonstrated those qualities.

PART 1 · WHO AM I BEYOND THE ROLE?

Write at least 10 words or phrases that describe who you are.

These can include:
• strengths
• values
• personality
• habits
• roles
• interests
• qualities
• ways other people experience you

Then:

1. Circle five that would still be true if athletics disappeared tomorrow.
2. Choose the three that feel most important.
3. Explain why each one belongs in your story.

PART 2 · TRANSFERABLE SKILLS MAP

Choose at least five real situations you have experienced.

Examples:
• preparing for competition
• receiving difficult feedback
• losing
• winning
• being injured
• changing roles
• sitting on the bench
• earning a starting position
• balancing school and athletics
• resolving conflict
• helping a teammate
• practicing when nobody was watching
• performing under pressure
• recovering after a mistake

For each situation, write:

1. WHAT HAPPENED?
2. WHAT DID YOU DO?
3. WHAT SKILL DID IT REQUIRE?
4. WHAT WAS THE RESULT?
5. WHERE ELSE COULD THAT SKILL MATTER?

Possible transferable skills include:
communication, teamwork, leadership, discipline, adaptability, resilience, preparation, problem-solving, coachability, accountability, time management, confidence, and initiative.

PART 3 · PROVE ONE SKILL

Choose your strongest example.

Write the story using:

SITUATION
What was happening?

ACTION
What did YOU actually do?

RESULT
What happened because of your action?

LEARNING
What did the experience teach you about yourself?

PART 4 · HOW I WANT TO SHOW UP

Choose three behaviors you want people to consistently experience from you.

For each one, write one observable action that would prove it.

Example:
"I want to be dependable" is not enough.

Evidence might be:
"I arrive prepared, respond when people need me, and do what I said I would do."

WHAT TO SUBMIT

Submit:

• your 10 identity words/phrases
• your five transferable-skill examples
• your strongest evidence story
• your three How I Show Up commitments
• a short reflection answering:
  "Athletics is part of my story, but I am also..."

PORTFOLIO

Save your strongest evidence story and Transferable Skills Map as evidence of your professional skills.

CAPSTONE CONNECTION

Carry forward:

• five identity words
• one transferable skill
• one real evidence story
• one How I Show Up commitment

These belong in Identity, Strengths + Skills, and Experiences + Stories in your year-long Capstone.`,
      minutes: 45,
      dayNumber: 3,
    },
    6: {
      title: "Your First $45,000 Job — Life + Money Scenario",
      instructions: `WHAT YOU ARE DOING

You have accepted your first full-time job earning $45,000 per year.

Your job is to build a realistic monthly life, make financial decisions, respond when something unexpected happens, and decide what financial stability means to YOU.

WHY THIS MATTERS

A salary is only one part of a financial life.

Housing, transportation, food, insurance, saving, emergencies, relationships, lifestyle choices, debt, and unexpected events all compete for the same money.

This assignment is about decision-making — not finding one "perfect" budget.

PART 1 · START WITH THE JOB

Record:

Annual salary: $45,000

Use the monthly take-home amount provided by your facilitator for this scenario.

Do NOT assume $45,000 divided by 12 is the amount you can spend each month.

Write:

1. Your scenario monthly take-home amount.
2. Three expenses you think you will have every month.
3. Three expenses young adults may forget to plan for.

PART 2 · BUILD YOUR MONTHLY LIFE

Using the options or figures provided by your facilitator, make decisions for:

• housing
• utilities
• transportation
• gas
• auto insurance
• phone
• food
• health/personal expenses
• subscriptions
• entertainment
• clothing
• saving
• emergency fund
• other priorities

For every major choice, ask:

• Is this a NEED, WANT, or FLEXIBLE choice?
• What am I giving up by choosing this?
• Does this fit the life I say I want?

Calculate what remains after your monthly choices.

PART 3 · YOUR HARDEST TRADEOFFS

Choose the TWO decisions that were hardest.

For each:

1. What did you choose?
2. What did you give up?
3. Why was the choice worth it?
4. What could make you change your decision?

PART 4 · SOMETHING GOES WRONG

Use the unexpected life event given by your facilitator.

Examples may include:

• car repair
• medical expense
• reduced work hours
• required move
• family responsibility
• emergency travel
• new required expense

Write:

1. What happened?
2. How much does it affect your plan?
3. What changes immediately?
4. What do you cut, delay, reduce, or reconsider?
5. What would have helped you prepare?

Then revise your monthly plan.

PART 5 · FINANCIAL STABILITY

Finish these statements:

Financial stability means...

Money matters to me because...

One financial habit I want to build is...

One thing I never want money to control is...

One question I still have about money is...

WHAT TO SUBMIT

Submit:

• your original monthly plan
• your two hardest tradeoffs
• your unexpected-event response
• your revised plan
• your financial-stability statement
• one question for Brad McMillan

PORTFOLIO

Save the completed scenario and revised plan as evidence of financial decision-making and problem-solving.

CAPSTONE CONNECTION

Carry forward:

• one financial value
• one life priority
• one money habit
• one goal or realization about the life you want to build

Add these to Future Vision and Goals + Next Steps in your year-long Capstone.`,
      minutes: 50,
      dayNumber: 3,
    },
    7: {
      title: "Brad McMillan — Money Question Builder + Reflection",
      instructions: `WHAT YOU ARE DOING

You are preparing for and reflecting on the Brad McMillan financial-literacy conversation.

You will build stronger questions, listen for useful ideas instead of simply collecting advice, and decide what is relevant to YOUR life.

WHY THIS MATTERS

Professionals can give you information you cannot always get from a definition or search result.

Your responsibility is to arrive prepared, listen carefully, think critically, and decide what you want to use, investigate, question, or leave for later.

BEFORE THE EXPERIENCE · QUESTION BUILDER

Start with your Week 6 $45,000 Job scenario.

Write FIVE possible questions about topics such as:

• saving
• spending
• credit
• debt
• investing
• starting young
• financial mistakes
• lifestyle inflation
• career choices
• building stability
• preparing for emergencies
• money and relationships
• long-term planning

Then improve your questions.

Avoid questions that could be answered with a basic definition.

Choose questions that ask for:

• experience
• judgment
• lessons learned
• mistakes
• examples
• tradeoffs
• advice

Select your BEST THREE questions.

Mark the ONE you most want answered.

Write one possible follow-up question.

DURING THE EXPERIENCE

Listen for:

1. ONE important idea.
2. ONE real example or story.
3. ONE thing that surprises you.
4. ONE statement you want to remember.
5. ONE action you might consider.

Do not try to write every word.

POST-EXPERIENCE REFLECTION

Answer:

1. What challenged something you believed about money?
2. What advice felt most relevant to your life?
3. What advice needs more context before you use it?
4. What would you like to investigate further?
5. Did anything change how you think about the $45,000 Job scenario?
6. What financial habit or decision do you want to explore next?

PROFESSIONAL FOLLOW-UP

Draft a short thank-you message.

Include:

• appreciation for Brad's time
• one specific idea you learned
• why it mattered to you
• a professional closing

WHAT TO SUBMIT

Submit:

• your three final questions
• your possible follow-up
• your experience notes
• your post-experience reflection
• one financial action or habit you want to explore
• your professional thank-you message

PORTFOLIO

Save the reflection and your strongest financial-learning takeaway.

CAPSTONE CONNECTION

Carry forward:

• one belief that changed
• one quote, lesson, or idea
• one person who influenced your thinking
• one financial goal or future decision

These may belong in Values + Beliefs, People + Inspiration, Future Vision, or Goals + Next Steps.`,
      minutes: 40,
      dayNumber: 3,
    },
    8: {
      title: "Terracon Professional Visit Prep + Pathway Discovery",
      instructions: `WHAT YOU ARE DOING

You are preparing for, participating in, and reflecting on the Terracon professional visit.

This is not just a field trip.

You are going into a real workplace to investigate careers, pathways, professional behavior, workplace culture, skills, technology, communication, and the kinds of people required to operate an organization.

WHY THIS MATTERS

You will notice more when you know what you are looking for.

Research before an experience gives you context.
Observation during the experience gives you evidence.
Reflection afterward helps you decide what the experience means for YOUR future.

PART 1 · COMPANY RESEARCH

Research Terracon using facilitator-approved sources.

Answer:

1. What does Terracon do?
2. What problems does the organization help solve?
3. Who appears to use its services?
4. What industries or types of projects appear connected to its work?
5. Identify at least THREE different roles or careers that could exist within the organization.
6. What education, training, certification, or experience might those roles require?
7. Identify TWO skills that seem important across multiple roles.
8. What is ONE thing you still do not understand?

Do not copy and paste an About page.

Explain what you learned in your own words.

PART 2 · PROFESSIONAL EXPECTATIONS

Before the visit, confirm that you understand:

• required attire
• arrival/departure expectations
• phone expectations
• safety expectations
• introductions
• eye contact/body language
• listening
• appropriate questions
• respect for employees and workspaces
• professional gratitude

Write ONE behavior you will intentionally demonstrate during the visit.

PART 3 · QUESTION BUILDER

Write FIVE possible questions.

Your questions may explore:

• career pathways
• daily responsibilities
• technical skills
• teamwork
• communication
• education/training
• challenges
• mistakes
• company culture
• advancement
• advice for students

Choose your BEST THREE questions.

Prepare a short introduction:

"My name is ______. One thing I am interested in learning today is ______."

PART 4 · CAREER OBSERVATION

During the experience, pay attention to:

ROLES
What kinds of jobs or responsibilities do you see?

SKILLS
What skills appear to matter?

COMMUNICATION
How do people exchange information?

TEAMWORK
Where do people depend on each other?

TECHNOLOGY
What tools, equipment, software, or systems are being used?

ENVIRONMENT
What does the workplace feel like?

CULTURE
What clues show what the organization values?

PATHWAYS
What different ways could someone enter this kind of work?

Record:

• at least three roles/pathways
• at least three skills
• one workplace observation
• one surprise
• one question you still have

PART 5 · POST-EXPERIENCE REFLECTION

Answer:

1. What did you see that you could not have learned from company research alone?
2. What surprised you?
3. Which role or pathway would you like to understand better?
4. What skill did you see being used?
5. What did you notice about communication or teamwork?
6. Who might thrive in this environment?
7. What part of the work would fit you?
8. What part might not fit you?
9. What feels more possible after seeing the workplace?
10. What do you want to explore next?

PART 6 · THANK-YOU + FOLLOW-UP

Draft a professional thank-you.

Include:

• appreciation
• one specific thing you learned
• why it mattered
• a professional closing

WHAT TO SUBMIT

Submit:

• Company Research
• Professional Expectations confirmation
• three prepared questions
• Career Observation
• Post-Experience Reflection
• professional thank-you/follow-up

PORTFOLIO

Save the Career Observation and Post-Experience Reflection as professional-experience evidence.

CAPSTONE CONNECTION

Carry forward at least ONE:

• experience story
• career pathway
• professional skill
• person
• quote
• workplace observation
• realization
• question

Add it to Experiences + Stories, Career + Pathways, Strengths + Skills, or People + Inspiration in your year-long Capstone.`,
      minutes: 50,
      dayNumber: 3,
    },
    9: {
      title: "Resume Story Bank + Jennifer Miller Prep",
      instructions: `WHAT YOU ARE DOING

You are strengthening your resume and preparing for the Jennifer Miller professional session on interviewing, mock interviews, offers, and negotiation.

The goal is not to make your resume sound impressive with generic words.

The goal is to connect your real experiences to evidence that shows what you can actually do.

WHY THIS MATTERS

Anyone can write:

• hardworking
• leader
• team player
• dependable
• good communicator

Those words become meaningful only when you can prove them with real experiences.

Your resume and interview should tell the same story.

PART 1 · QUICK RESUME REVIEW

Look at your current resume.

Answer:

1. What does someone learn about you in the first 10 seconds?
2. What part of your story is missing?
3. What experience deserves more attention?
4. What skill do you claim but do not yet prove?
5. What would an employer probably ask you about?

PART 2 · BUILD YOUR RESUME STORY BANK

Choose FOUR real experiences.

They may come from:

• athletics
• school
• employment
• volunteering
• family responsibility
• clubs
• leadership
• projects
• community involvement
• conflict
• failure
• pressure
• recovery after a mistake

For each experience, write:

SITUATION
What was happening?

YOUR ACTION
What did YOU actually do?

SKILL
What skill did your action demonstrate?

RESULT
What happened?

WHAT IT SAYS ABOUT YOU
Why would this matter to an employer?

PART 3 · TURN EXPERIENCE INTO RESUME LANGUAGE

Choose TWO of your four experiences.

For each one, write a concise resume-style statement.

Avoid vague language.

Instead of:

"Helped the team."

Try to show:

• what you did
• what responsibility you had
• what skill you used
• what changed or was accomplished

PART 4 · INTERVIEW PREPARATION

Choose THREE stories from your Story Bank.

Match each one to a possible interview question.

Examples:

Tell me about a time you worked with a difficult person.

Tell me about a time you failed.

Tell me about a time you showed leadership.

Tell me about a time you solved a problem.

Tell me about a time you had to adapt.

Tell me about a time you received difficult feedback.

For each question, identify which story you could use.

PART 5 · QUESTIONS FOR JENNIFER MILLER

Write three professional questions about:

• resumes
• interviewing
• hiring decisions
• difficult interview questions
• evaluating an offer
• salary or offer negotiation
• mistakes candidates make
• what makes someone memorable

Choose the ONE question you most want answered.

PART 6 · AFTER THE EXPERIENCE

Answer:

1. What does your resume need to communicate more clearly?
2. What story became stronger?
3. What interview advice will you use?
4. What did you learn about evaluating an offer?
5. What should you understand before saying yes to a job?
6. What did Jennifer say that changed your thinking?

WHAT TO SUBMIT

Submit:

• quick resume review
• four Resume Story Bank entries
• two revised resume statements
• three interview-story matches
• three Jennifer Miller questions
• post-experience reflection

PORTFOLIO

Save your strongest Resume Story Bank example and revised resume evidence.

CAPSTONE CONNECTION

Answer:

What does your resume fail to communicate about who you really are?

Then choose ONE story that proves that part of you.

Carry that story into Experiences + Stories or Strengths + Skills in your year-long Capstone.`,
      minutes: 45,
      dayNumber: 3,
    },
    10: {
      title: "Interview Under Pressure",
      instructions: `WHAT YOU ARE DOING

You are practicing how to answer interview questions when you feel pressure, uncertainty, or surprise.

You will build flexible evidence stories, respond to unexpected questions, receive feedback, and improve a second attempt.

WHY THIS MATTERS

Strong interviewing is not memorizing perfect answers.

It is being able to:

• listen
• think
• choose a relevant example
• explain what you actually did
• recover when an answer is weak
• stay professional under pressure

PART 1 · BUILD FOUR FLEXIBLE STORIES

Choose FOUR real experiences.

For each one, write:

SITUATION
What was happening?

ACTION
What did you do?

RESULT
What happened?

LEARNING
What did you learn?

SKILLS
What skills does the story demonstrate?

Then list at least TWO interview questions the story could help answer.

PART 2 · PRESSURE QUESTIONS

Practice answering at least FIVE questions.

Examples:

1. Tell me about a time you failed.
2. Tell me about a time you disagreed with someone.
3. Tell me about a time you received feedback you did not like.
4. Tell me about a time you had to adapt quickly.
5. Tell me about a mistake you made.
6. Tell me about a time you led.
7. Tell me about a time you did not get the role or outcome you wanted.
8. Tell me about a difficult teammate or coworker.
9. Why should we choose you?
10. Tell me something that is not on your resume.

Do not memorize a script.

Choose the strongest real story for the question.

PART 3 · UNEXPECTED QUESTION

Your facilitator will give you at least one question you did not prepare for.

Before answering:

• listen fully
• take a moment
• identify what the question is really asking
• select a real example
• answer honestly

You may say:

"That's a good question. Let me think about that for a second."

PART 4 · FEEDBACK

After your first attempt, record feedback about:

• clarity
• evidence
• answer length
• body language
• pace
• eye contact
• confidence
• professional presence
• whether you actually answered the question

PART 5 · SECOND ATTEMPT

Choose ONE answer to repeat.

Before the second attempt, write:

1. What was weak about the first answer?
2. What will you change?
3. What will you keep?

Then answer again.

PART 6 · REFLECTION

Answer:

1. What happened to your communication under pressure?
2. Which story was easiest to use?
3. Which question was hardest?
4. What feedback was most useful?
5. What changed during your second attempt?
6. What will you do when you need time to think in a future interview?
7. What interview habit do you want to keep practicing?

WHAT TO SUBMIT

Submit:

• four flexible interview stories
• five practice responses or notes
• unexpected-question response
• feedback notes
• first-attempt / second-attempt comparison
• final reflection

PORTFOLIO

Save your strongest behavioral interview story and evidence of improvement.

CAPSTONE CONNECTION

Save one story about pressure, recovery, feedback, failure, or growth.

Ask yourself:

What does the way I respond when things are difficult reveal about who I am becoming?

Carry that into Challenges + Failures or Strengths + Skills.`,
      minutes: 45,
      dayNumber: 3,
    },
    11: {
      title: "Michelle Boudin Prep — Pitch, Panel + Rebuttal",
      instructions: `WHAT YOU ARE DOING

You are preparing for the Michelle Boudin on-camera communication experience.

You will practice speaking clearly, listening under pressure, answering follow-up questions, disagreeing professionally, and responding when someone challenges your point.

WHY THIS MATTERS

Communication becomes harder when:

• people are watching
• you are nervous
• someone disagrees
• you are interrupted
• you do not know the question in advance
• you have limited time
• you need to defend an idea

Strong communicators do not simply talk more.

They listen, think, respond, adjust, and stay composed.

PART 1 · YOUR 60-SECOND RESPONSE

Choose a topic you can speak about honestly.

Possible topics:

• something you believe
• a goal
• a lesson athletics taught you
• something you would change
• a career interest
• something young people misunderstand
• a challenge you overcame
• what success means to you

Build a 60-second response.

Use:

OPEN
What is your main point?

WHY
Why does it matter?

EVIDENCE
What experience, example, or reason supports it?

CLOSE
What do you want people to remember?

Do not write a speech you plan to memorize word-for-word.

PART 2 · LISTENING

Practice answering a question only after the other person finishes.

After each question, identify:

What was actually asked?

What is my strongest answer?

What evidence supports it?

PART 3 · PROFESSIONAL DISAGREEMENT

Practice these sentence starters:

"I see it differently because..."

"I understand that point. My concern is..."

"I agree with part of that, but..."

"The evidence that shapes my view is..."

"That makes me reconsider..."

Write one example of how you could disagree without becoming disrespectful or defensive.

PART 4 · REBUTTAL

A rebuttal is not repeating your original point louder.

It should respond to the other person's argument.

Write:

1. Their point.
2. The part you understand.
3. Your response.
4. Your reason or evidence.
5. A professional closing statement.

PART 5 · PANEL PRACTICE

Practice:

• your 60-second response
• one follow-up question
• one disagreement
• one rebuttal
• one unexpected question

Ask for feedback on:

• clarity
• pace
• tone
• body language
• listening
• composure
• confidence
• whether you answered the actual question

PART 6 · PRE-CAMERA REFLECTION

Answer:

1. What happens to your communication when you are nervous?
2. What do you tend to do too quickly?
3. What feedback matters most?
4. What do you want to improve before Michelle's session?
5. What will you intentionally do when the camera turns on?

WHAT TO SUBMIT

Submit:

• 60-second response outline
• professional disagreement example
• rebuttal exercise
• panel-practice feedback
• pre-camera reflection
• one specific goal for the Michelle Boudin experience

PORTFOLIO

Save the 60-second response and communication feedback.

CAPSTONE CONNECTION

What does this week reveal about:

• your voice
• confidence
• discomfort
• listening
• leadership
• ability to adjust

Carry one meaningful realization into My Voice, Strengths + Skills, or Challenges + Failures.`,
      minutes: 45,
      dayNumber: 3,
    },
    12: {
      title: "Michelle Boudin — On-Camera Reflection + Second Attempt",
      instructions: `WHAT YOU ARE DOING

You are participating in and reflecting on the Michelle Boudin on-camera communication experience.

You will compare how you communicated before feedback and after feedback.

WHY THIS MATTERS

Growth is easier to see when you have evidence.

The goal is not to look perfect on camera.

The goal is to notice:

• what happens under pressure
• how you receive feedback
• how quickly you adjust
• how clearly you communicate
• what confidence actually requires

BEFORE THE EXPERIENCE

Review your Week 11 work.

Write:

1. My communication goal is...
2. The feedback I most want to remember is...
3. When I get nervous, I tend to...
4. To stay composed, I will...
5. One thing I want the audience to understand about me is...

FIRST ATTEMPT

After your first on-camera response, record:

• What felt strong?
• What felt uncomfortable?
• Did you answer the actual question?
• What happened to your pace?
• What happened to your voice?
• What happened to your body language?
• What did you notice that you had not noticed before?

PROFESSIONAL FEEDBACK

Record the feedback you receive.

Separate it into:

KEEP
What should you continue?

CHANGE
What should you adjust?

TRY
What should you experiment with?

SECOND ATTEMPT

Before trying again, write your plan.

I will keep...

I will change...

I will focus on...

After the second attempt, answer:

1. What changed?
2. What improved?
3. What was still difficult?
4. Which piece of feedback made the biggest difference?
5. Did you feel different, sound different, or both?

UNEXPECTED QUESTION

If you receive an unexpected question, record:

1. What was asked?
2. What was your first reaction?
3. Did you slow down enough to think?
4. What would you change if you answered again?

FINAL REFLECTION

Answer:

1. What did being on camera reveal about your communication?
2. What feedback was hardest to hear?
3. What feedback was most useful?
4. What changed between attempts?
5. What did you learn about preparation and confidence?
6. Where else will this skill matter?
7. How do you want to communicate when you are uncomfortable in the future?

WHAT TO SUBMIT

Submit:

• pre-experience communication goal
• first-attempt reflection
• professional feedback notes
• second-attempt plan
• first/second comparison
• unexpected-question reflection, if used
• final reflection

PORTFOLIO

Save evidence of your first and second attempts when available, plus your communication-growth reflection.

CAPSTONE CONNECTION

Save one moment of:

• discomfort
• feedback
• adjustment
• courage
• composure
• confidence

Ask:

What does this moment show about who I am becoming as a communicator and leader?

Carry it into My Voice, Challenges + Failures, Strengths + Skills, or Experiences + Stories.`,
      minutes: 45,
      dayNumber: 3,
    },
    13: {
      title: "Brad McMillan — Life After Sports + Who Remains?",
      instructions: `WHAT YOU ARE DOING

You are exploring one of the most important questions in this program:

If athletics disappeared tomorrow, what parts of you would remain?

You will use the Brad McMillan mindset and life-after-sports conversation to examine identity, resilience, purpose, relationships, reputation, leadership, and what happens when an important chapter changes.

WHY THIS MATTERS

Being an athlete may have shaped you.

It may have taught you how to:

• compete
• prepare
• recover
• communicate
• lead
• accept coaching
• handle pressure
• persist
• sacrifice
• work with others

But athletics is something you DO.

It is not the only thing you ARE.

This assignment helps you separate the skills and values you carry forward from the role, uniform, position, statistics, or title.

PART 1 · IF ATHLETICS DISAPPEARED TOMORROW

Finish this statement:

If athletics disappeared tomorrow, I would still be...

Write at least TEN words or phrases.

Then choose FIVE that matter most.

For each one, explain:

1. Why is this part of you?
2. What experience proves it?
3. Where else could this quality matter?

PART 2 · A DIFFICULT CHAPTER

Choose one real experience involving:

• failure
• injury
• losing
• rejection
• being benched
• changing roles
• conflict
• disappointment
• a goal you did not reach
• a plan that changed
• another difficult transition

Answer:

1. What happened?
2. What did you initially think or feel?
3. What did you do next?
4. What helped you recover?
5. What did the experience teach you?
6. What would you do differently now?
7. What does the story say about you?

PART 3 · BRAD MCMILLAN QUESTION BUILDER

Write FIVE possible questions about:

• mindset
• life after sports
• identity
• success
• setbacks
• purpose
• relationships
• reputation
• leadership
• major transitions

Choose your BEST THREE.

Mark the ONE question you most want answered.

PART 4 · DURING THE EXPERIENCE

Listen for:

• one lesson about identity
• one lesson about resilience
• one lesson about relationships or reputation
• one lesson about purpose
• one quote or idea you want to remember
• one thing that challenges your thinking

PART 5 · AFTER THE EXPERIENCE

Answer:

1. What did Brad say that stayed with you?
2. What part of your athlete identity should you carry forward?
3. What part of your identity may need to change?
4. What does resilience look like when there is no next game?
5. What matters when nobody is keeping score?
6. What do you want people to remember about how you treated them?
7. Who do you want to be known as ten years from now?

PART 6 · PERSONAL MINDSET COMMITMENT

Finish:

When something important changes or ends, I want to remember...

When I fail, I want to...

When I receive feedback, I want to...

When I am unsure what comes next, I want to...

The kind of person I want to become is...

WHAT TO SUBMIT

Submit:

• 10 identity words/phrases
• five identity explanations
• one difficult-chapter story
• three Brad McMillan questions
• experience notes
• post-experience reflection
• personal mindset commitment

PORTFOLIO

Save your difficult-chapter story and personal mindset commitment as evidence of resilience, identity, and growth.

CAPSTONE CONNECTION

Carry forward:

• one setback or challenge
• one belief
• one Brad McMillan lesson or quote
• one identity statement
• one mindset commitment

These belong in Challenges + Failures, Identity, Values + Beliefs, People + Inspiration, or Final Story.

Ask yourself:

Who am I when the thing I have always been known for is no longer the center of my life?`,
      minutes: 45,
      dayNumber: 3,
    },
    14: {
      title: "Mentorship + Informational Conversation",
      instructions: `WHAT YOU ARE DOING

You are learning how to build professional relationships through preparation, curiosity, listening, gratitude, and follow-up.

You will identify someone you could learn from, prepare an informational conversation, practice asking thoughtful questions, and reflect on what you learn.

WHY THIS MATTERS

Networking is not collecting names.

Mentorship is not asking strangers to give you opportunities.

Strong professional relationships begin when you are:

• curious
• prepared
• respectful
• specific
• interested in learning
• willing to listen
• thoughtful about follow-up

You can learn something useful from people even when you do not want their exact job.

PART 1 · WHAT DO YOU WANT TO LEARN?

Choose ONE area you want to understand better.

Examples:

• a career
• an industry
• entrepreneurship
• skilled trades
• college
• technical training
• leadership
• management
• a specific professional skill
• work-life decisions
• a lifestyle or career path
• financial independence
• another future direction

Write:

I want to learn more about...

This matters to me because...

PART 2 · WHO COULD HELP YOU LEARN?

Identify the TYPE of person who could help.

You do not need to know the person personally yet.

Describe:

1. Their possible role or experience.
2. What you could learn from them.
3. Why their perspective could help.
4. What you should NOT ask them for in a first conversation.

PART 3 · YOUR INTRODUCTION

Write a short introduction.

Include:

• your name
• who you are
• what you are exploring
• why you are interested in speaking with them

Keep it brief.

Example structure:

"My name is ______. I am currently exploring ______. I am trying to learn more about ______, and I would really value hearing about your experience."

Do not turn the introduction into a long speech.

PART 4 · QUESTION BUILDER

Write at least EIGHT questions.

Include questions about:

PATH
How did you get where you are?

DECISIONS
What choices mattered most?

SKILLS
What skills matter in your work?

CHALLENGES
What is difficult about the path?

MISTAKES
What do you wish you had known earlier?

WORK
What does the day-to-day reality look like?

ADVICE
What should someone my age understand?

NEXT STEPS
What should I explore next if I am curious about this field?

Then choose your BEST FIVE.

PART 5 · LISTENING + FOLLOW-UP

For each of your five questions, leave space for notes.

During a real or practice conversation:

1. Ask the question.
2. Listen fully.
3. Write the important idea.
4. Ask at least ONE follow-up based on what the person actually said.

Do not simply rush to the next prepared question.

PART 6 · PROFESSIONAL CLOSE

Practice ending with:

• appreciation
• one specific thing you learned
• a professional goodbye

PART 7 · FOLLOW-UP MESSAGE

Draft a professional thank-you.

Include:

1. Thank you for their time.
2. One specific thing you learned.
3. Why it mattered to you.
4. A professional closing.

Do not immediately ask for a job, internship, favor, or introduction unless the conversation naturally led there.

PART 8 · REFLECTION

Answer:

1. What question produced the most useful answer?
2. What did you learn that surprised you?
3. What pathway became clearer?
4. What pathway became less interesting?
5. Did you listen well?
6. What follow-up question came from listening?
7. What should you investigate next?
8. Could this become an appropriate long-term professional relationship? Why or why not?

WHAT TO SUBMIT

Submit:

• learning goal
• description of the person you want to learn from
• short introduction
• eight-question builder
• best five questions
• conversation/practice notes
• professional thank-you
• final reflection

PORTFOLIO

Save your informational-conversation plan and final reflection as evidence of professional communication and career exploration.

CAPSTONE CONNECTION

Carry forward:

• one person
• one piece of advice
• one pathway
• one professional relationship
• one question
• one realization about your future

These may belong in People + Inspiration, Career + Pathways, Experiences + Stories, or Future Vision.`,
      minutes: 45,
      dayNumber: 3,
    },
    15: {
      title: "NO CLASS · THANKSGIVING BREAK",
      instructions: `NO REQUIRED WORK

There is no required Future Ready™ assignment this week.

You are not behind.

There is no make-up assignment for Thanksgiving Break.

If you independently choose to use this week to finish previously released work, you may do so, but it is optional.

NO SUBMISSION REQUIRED

NO PORTFOLIO EVIDENCE REQUIRED

NO NEW CAPSTONE ENTRY REQUIRED`,
      minutes: 0,
      dayNumber: 3,
    },
    16: {
      title: "Who I Am Becoming — Pre-Internship Statement",
      instructions: `WHAT YOU ARE DOING

You are creating a BEFORE snapshot of who you are as you prepare to move from the fall Future Ready™ experience into the January–April internship phase.

This is not the end of the program.

Your year-long Capstone continues.

Your internship will give you new experiences, mistakes, feedback, relationships, challenges, stories, skills, and evidence that you will add to what you have already built.

WHY THIS MATTERS

You have spent the fall:

• exploring identity
• identifying values
• developing professional skills
• visiting workplaces
• listening to professionals
• practicing communication
• learning about money
• building resume evidence
• interviewing
• receiving feedback
• practicing discomfort
• exploring careers and pathways
• thinking about life beyond athletics

Now you need to capture who you are BEFORE the internship so you can later see what changed.

PART 1 · FALL EVIDENCE REVIEW

Review your work from the fall.

Look through:

• reflections
• portfolio evidence
• Capstone entries
• Brain Map
• professional visits
• speaker notes
• financial work
• resume work
• interview practice
• communication feedback
• career/pathway work

Choose at least ONE example for each category:

IDENTITY
Something that helped you understand yourself.

SKILL
Evidence of a skill you developed.

CHALLENGE
A difficult moment or story.

EXPERIENCE
A speaker, visit, activity, or real-world experience that changed your thinking.

PERSON
Someone whose advice or example influenced you.

PATHWAY
A career, industry, role, or possibility worth exploring.

FUTURE
A goal, value, lifestyle idea, or priority you now understand more clearly.

PART 2 · WHO I AM BECOMING

Write a personal statement using your own voice.

Address:

Who am I?

What do I value?

What am I good at?

What am I still learning?

What experiences have shaped me?

How do I respond when things are difficult?

What kind of teammate, employee, leader, friend, or person do I want to be?

What do I want people to experience when they work with me?

What am I curious about?

What kind of future am I trying to build?

Do not write what you think an adult wants to hear.

Write what you actually believe today.

PART 3 · WHAT I BRING INTO A WORKPLACE

Identify FIVE qualities, skills, or behaviors you bring.

For each one:

1. Name it.
2. Give real evidence.
3. Explain how it could matter in a workplace.

PART 4 · WHAT I STILL NEED TO PRACTICE

Identify THREE areas where you still need growth.

For each:

1. What is the skill or behavior?
2. Why does it matter?
3. What usually gets in the way?
4. What can you practice during the internship?

PART 5 · THREE INTERNSHIP GOALS

Create THREE goals.

GOAL 1 · SKILL

What skill do you want to strengthen?

How will you know you are improving?

GOAL 2 · PROFESSIONAL BEHAVIOR

How do you want to show up consistently?

Examples:

• prepared
• curious
• reliable
• professional
• communicative
• coachable
• proactive
• organized

How will you prove it?

GOAL 3 · EXPLORATION

What do you want to learn about:

• a career
• industry
• role
• workplace
• culture
• lifestyle
• education/training pathway
• yourself

PART 6 · BEFORE THE INTERNSHIP

Answer honestly:

1. What are you excited about?
2. What are you nervous about?
3. What do you not know yet?
4. What is one mistake you are afraid of making?
5. What will you do when you make a mistake?
6. How do you want to respond to feedback?
7. What will you do when you do not understand something?
8. How do you want a supervisor or team to describe you?
9. What do you want this internship to teach you about yourself?

PART 7 · HOW I WILL SHOW UP

Complete:

When I do not know what to do, I will...

When I make a mistake, I will...

When I receive feedback, I will...

When I feel uncomfortable, I will...

When I am given a small task, I will...

When I see something I want to understand, I will...

When someone gives me their time, I will...

PART 8 · YOU KNOW WHO YOU ARE

Finish this statement:

"YOU KNOW WHO YOU ARE" means...

Then write:

At the beginning of this program, I thought...

Now I understand...

By the end of my internship, I hope I can say...

WHAT TO SUBMIT

Submit:

• Fall Evidence Review
• Who I Am Becoming statement
• five workplace strengths with evidence
• three growth areas
• three internship goals
• Before the Internship reflection
• How I Will Show Up commitments
• YOU KNOW WHO YOU ARE reflection

PORTFOLIO

Save the Who I Am Becoming statement and three internship goals.

This becomes your BEFORE evidence for the internship phase.

CAPSTONE CONNECTION

This is a major year-long Capstone checkpoint.

Preserve this work as the starting point for:

INTERNSHIP JOURNEY

During January–April you will continue collecting:

• stories
• problems
• mistakes
• feedback
• difficult conversations
• workplace observations
• people who influence you
• skills you use
• skills you need
• confidence changes
• career discoveries
• workplace culture observations
• moments that change your thinking

At the end of the internship, you will compare who you were BEFORE with who you became through real experience.

YOU KNOW WHO YOU ARE.`,
      minutes: 50,
      dayNumber: 3,
    },

  };

  function loadPrebuiltWeekAssignment(week: number) {
    const item = PREBUILT_WEEK_ASSIGNMENTS[week];

    if (!item) {
      setSaveMessage("No prebuilt assignment is configured for this week.");
      return;
    }

    setAssignmentForm({
      title: item.title,
      instructions: item.instructions,
      estimatedMinutes: item.minutes || 20,
      requirement: week === 15 ? "OPTIONAL" : "REQUIRED",
      dueAt: "",
      dayNumber: item.dayNumber,
      allowOnline: week !== 15,
      allowPrint: week !== 15,
      allowUpload: week !== 15,
      portfolioEligible: week !== 15,
    });

    setShowFullTools(true);
    setActiveTab("assignments");

    window.setTimeout(() => {
      document
        .getElementById("future-ready-resource-hub")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);

    setSaveMessage(
      week === 15
        ? "Thanksgiving break loaded. Do not save this as student work."
        : `${item.title} loaded. Review it, then click Save Assignment when you are ready to release it to students.`
    );
  }

  function loadWeek4SegAssignment() {
    setAssignmentForm({
      title: "SEG Professional Visit Prep + Career Observation",
      instructions: `PURPOSE

Prepare for the SEG Systems / Visual Images professional experience so you arrive ready to learn, communicate professionally, discover careers, and capture evidence about your own interests and future.

WHAT TO DO

1. COMPANY RESEARCH
- Explain what SEG Systems / Visual Images does.
- Record at least two facts about the company or its history.
- Identify the products, services, customers, industries, or work you believe connect to the company.

2. CAREER + PATHWAY DISCOVERY
- Identify at least three jobs, departments, roles, or career pathways that may exist inside the organization.
- Choose one and explain what education, training, certification, skills, or experience someone may need.

3. PROFESSIONAL EXPECTATIONS
Write at least five behaviors you will demonstrate during the visit.
Consider:
- introductions
- body language
- eye contact
- listening
- phone use
- professional language
- asking questions
- respect for the workplace
- representing yourself and the program well

4. QUESTION BUILDER
Write at least three thoughtful, open-ended questions.

Include:
- one question about skills
- one question about career pathway or preparation
- one question about what the work is really like

Improve weak questions so they cannot be answered with only yes or no.

5. DURING THE VISIT
Record:
- at least three jobs or functions you discover
- one example of communication
- one example of teamwork
- one example of problem-solving or adaptability
- one example involving technology, quality, production, or safety
- something that surprised you
- something that interested you
- something that may not fit you
- at least one useful answer or follow-up conversation

6. AFTER THE VISIT
Respond to:
- What did you see that you did not know existed?
- What career or pathway would you like to explore further?
- What professional skill did you observe?
- What did the work environment teach you about what may or may not fit you?
- Who or what influenced your thinking?
- What question do you still have?
- What should you explore next?

WHAT TO SUBMIT

Submit:
- company research
- three career/pathway discoveries
- five professional expectations
- at least three prepared questions
- workplace observations
- post-visit reflection

CAPSTONE CONNECTION

Save one story, person, quote, skill, observation, challenge, realization, or career discovery from this experience that says something about who you are becoming beyond athletics, school, or any single role.

Your capstone response must be your own thinking and experience.`,
      estimatedMinutes: 40,
      requirement: "REQUIRED",
      dueAt: "",
      dayNumber: 3,
      allowOnline: true,
      allowPrint: true,
      allowUpload: true,
      portfolioEligible: true,
    });

    setShowFullTools(true);
    setActiveTab("assignments");

    window.setTimeout(() => {
      document
        .getElementById("future-ready-resource-hub")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);

    setSaveMessage(
      "SEG assignment loaded. Review it, then click Save Assignment when you are ready to release it to students."
    );
  }

  async function createAssignment() {
    const saved = await createHubItem(
      {
        action: "createAssignment",
        ...assignmentForm,
        dueAt: assignmentForm.dueAt || null,
      },
      "Assignment saved to this lesson.",
    );

    if (saved) {
      setAssignmentForm({
        title: "",
        instructions: "",
        estimatedMinutes: 20,
        requirement: "REQUIRED",
        dueAt: "",
        dayNumber: null,
        allowOnline: true,
        allowPrint: true,
        allowUpload: true,
        portfolioEligible: true,
      });
    }
  }

  async function createResource() {
    const saved = await createHubItem(
      {
        action: "createResource",
        ...resourceForm,
      },
      "Resource saved to this lesson.",
    );

    if (saved) {
      setResourceForm({
        title: "",
        description: "",
        kind: "LINK",
        url: "",
        dayNumber: null,
        required: false,
        visibleToStudent: true,
      });
    }
  }

  async function createTask() {
    const saved = await createHubItem(
      {
        action: "createTask",
        ...taskForm,
      },
      "Calendar task saved to this lesson.",
    );

    if (saved) {
      setTaskForm({
        taskType: "Class Task",
        title: "",
        instructions: "",
        dayNumber: 1,
        durationMinutes: 10,
        requirement: "OPTIONAL",
        visibleToStudent: true,
      });
    }
  }

  function changeWeek(week: number) {
    if (week < 1 || week > 16) return;

    setSelectedDay(1);
    setSelectedWeek(week);
    setActiveTab("overview");

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "future-ready-facilitator-week",
        String(week),
      );

      const params = new URLSearchParams(window.location.search);
      params.set("week", String(week));
      params.set("day", "1");

      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${params.toString()}`,
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  async function addResourceToTodaysLesson(
    resource: Resource
  ) {
    try {
      setAddingLessonResourceId(resource.id);
      setError(null);
      setSaveMessage(null);

      if (!data?.lesson?.id) {
        throw new Error("Lesson information is unavailable.");
      }

      const response = await fetch(
        "/api/ambassador/teaching-hub",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "attachResourceToLesson",
            lessonId: data.lesson.id,
            resourceId: resource.id,
            dayNumber: selectedDay,
          }),
        }
      );

      const result = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to add resource to today's lesson."
        );
      }

      await loadWeek(selectedWeek);

      setSaveMessage(
        `${resource.title} is now in Day ${selectedDay}'s lesson.`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to add resource to today's lesson."
      );
    } finally {
      setAddingLessonResourceId(null);
    }
  }


  async function addPackagedAssetToTodaysLesson(
    asset: {
      label: string;
      fileName: string;
      openUrl: string;
    }
  ) {
    const key = `lesson-${asset.fileName}`;

    try {
      setAddingLessonResourceId(key);
      setError(null);
      setSaveMessage(null);

      if (!data?.lesson?.id) {
        throw new Error("Lesson information is unavailable.");
      }

      const response = await fetch(
        "/api/ambassador/teaching-hub",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "attachResourceToLesson",
            lessonId: data.lesson.id,
            dayNumber: selectedDay,
            packagedAsset: {
              title: asset.label,
              fileName: asset.fileName,
              url: asset.openUrl,
            },
          }),
        }
      );

      const result = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to add asset to today's lesson."
        );
      }

      await loadWeek(selectedWeek);

      setSaveMessage(
        `${asset.label} is now in Day ${selectedDay}'s lesson.`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to add asset to today's lesson."
      );
    } finally {
      setAddingLessonResourceId(null);
    }
  }


  function resourcePreviewType(resource: Resource) {
    const name = (
      resource.fileName ??
      resource.url ??
      resource.title
    ).toLowerCase();

    if (name.includes(".pdf")) return "pdf";
    if (name.includes(".docx")) return "docx";
    if (name.includes(".pptx")) return "pptx";

    return resource.kind.toLowerCase();
  }


  async function assignPackagedAssetToStudents(
    asset: {
      label: string;
      format: string;
      openUrl: string;
      portfolioEligible?: boolean;
    },
    mode: "ONLINE" | "PRINT" | "BOTH"
  ) {
    const assignmentKey = `packaged-${asset.label}-${asset.format}`;

    try {
      setAssigningResourceId(assignmentKey);
      setError(null);
      setSaveMessage(null);

      if (!data?.lesson?.id || !data?.cohort?.id) {
        throw new Error("Lesson information is unavailable.");
      }

      const response = await fetch(
        "/api/ambassador/resource-assignment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            packagedAsset: {
              lessonId: data.lesson.id,
              cohortId: data.cohort.id,
              title: asset.label,
              resourceKind: asset.format,
              resourceUrl: asset.openUrl,
            },
            mode,
            dayNumber: selectedDay,
            estimatedMinutes: 20,
            portfolioEligible:
              asset.portfolioEligible === true,
          }),
        }
      );

      const result = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          result.error ?? "Unable to assign this asset."
        );
      }

      await loadWeek(selectedWeek);

      setSaveMessage(
        `${asset.label} was assigned to students for Day ${selectedDay}.`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to assign this asset."
      );
    } finally {
      setAssigningResourceId(null);
    }
  }

  async function assignResourceToStudents(
    resource: Resource,
    mode: "ONLINE" | "PRINT" | "BOTH"
  ) {
    try {
      setAssigningResourceId(resource.id);
      setError(null);
      setSaveMessage(null);

      const response = await fetch(
        "/api/ambassador/resource-assignment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resourceId: resource.id,
            mode,
            dayNumber: resource.dayNumber ?? selectedDay,
            estimatedMinutes: 20,
            portfolioEligible: false,
          }),
        }
      );

      const result = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          result.error ?? "Unable to assign this resource."
        );
      }

      await loadWeek(selectedWeek);

      setSaveMessage(
        `${resource.title} was added to student assignments.`
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to assign this resource."
      );
    } finally {
      setAssigningResourceId(null);
    }
  }

  function openResourceHub() {
    setShowFullTools(true);
    setActiveTab("resources");

    window.setTimeout(() => {
      document
        .getElementById("future-ready-resource-hub")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  function openAssignments() {
    setShowFullTools(true);
    setActiveTab("assignments");

    window.setTimeout(() => {
      document
        .getElementById("future-ready-assignments")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  function previousWeek() {
    if (selectedWeek > 1) {
      changeWeek(selectedWeek - 1);
    }
  }

  function nextWeek() {
    if (selectedWeek < 16) {
      changeWeek(selectedWeek + 1);
    }
  }

  if (loading && !data) {
    return (
      <main className="rounded-3xl border border-slate-200 bg-white p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
          Future Ready™ Curriculum & Teaching Hub
        </p>

        <h1 className="mt-3 text-2xl font-black text-[#0D1B3D]">
          Loading Week {selectedWeek}...
        </h1>

        <p className="mt-2 text-slate-600">
          Connecting to the Ambassador 2026 production curriculum.
        </p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="rounded-3xl border border-red-200 bg-white p-8">
        <h1 className="text-2xl font-black text-[#0D1B3D]">
          Curriculum unavailable
        </h1>

        <p className="mt-3 text-red-700">
          {error ?? "The lesson could not be loaded."}
        </p>

        <button
          type="button"
          onClick={() => loadWeek(selectedWeek)}
          className="mt-5 rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white"
        >
          Try Again
        </button>
      </main>
    );
  }

  const lesson = data.lesson;
  const delivery = data.delivery;
  const sourceContent = lesson.content;
  const isWeekSix = selectedWeek === 6;

  const displayLessonTitle = isWeekSix ? "Professional Etiquette in Action" : lesson.title;
  const phase = richLesson?.phase ?? lesson.module.phase ?? "Launch Ready";

  const objective = isWeekSix
    ? "First impressions, professional communication, workplace judgment, meetings, networking, and accountability"
    : richLesson?.objective ?? sourceContent?.focus ?? lesson.summary ?? "";

  const studentActivity = isWeekSix
    ? "Professional Etiquette Challenge with role play, peer feedback, and immediate retry"
    : richLesson?.studentActivity ?? sourceContent?.activity ?? "";

  const reflection = isWeekSix
    ? "Which professional behavior will help other people trust and rely on me?"
    : sourceContent?.reflection ?? "";

  const workplaceConnection =
    richLesson?.workplaceConnection ??
    "Connect this lesson to professional expectations, career readiness, and real workplace experiences.";

  const skillsEarned = richLesson?.skillsEarned ?? [];

  const portfolioEvidence = isWeekSix
    ? "Professional Etiquette Evidence Story + Professional Etiquette Code"
    : richLesson?.portfolioEvidence ?? "Future Ready™ Portfolio Evidence";

  const badgeEarned = isWeekSix
    ? "BUILD6™ Professional Etiquette"
    : richLesson?.badgeEarned ?? "Future Ready™ Skill Badge";

  const facilitatorGuide =
    richLesson?.facilitatorGuide ??
    "Use the lesson focus, core activity, discussion, reflection, and available resources to facilitate this session. Add cohort-specific notes below as needed.";

  const discussionQuestions = richLesson?.discussionQuestions ?? [];

  const dailyLessons: {
    day: string;
    title: string;
    objective: string;
    activity: string;
    reflection: string;
  }[] = isWeekSix
    ? [
        { day: "Day 1", title: "First Impressions + Professional Readiness", objective: "Recognize the behaviors and choices that shape a professional first impression.", activity: "Practice arrival, introduction, readiness, body language, and professional-presence scenarios with immediate feedback and retry.", reflection: "What will I do differently before I enter my next professional setting?" },
        { day: "Day 2", title: "Professional Communication", objective: "Communicate clearly and appropriately across common professional situations.", activity: "Practice introductions, email/message judgment, listening, tone, questions, and professional responses through role play.", reflection: "What communication habit will make me easier to trust and work with?" },
        { day: "Day 3", title: "Workplace Judgment + Accountability", objective: "Use sound judgment, ownership, and accountability when workplace situations are imperfect.", activity: "Work through realistic scenarios involving mistakes, deadlines, unclear directions, feedback, conflict, and follow-through.", reflection: "How will I respond when I make a mistake or do not know what to do?" },
        { day: "Day 4", title: "Meetings, Networking + Guest Etiquette", objective: "Participate professionally in meetings, networking, visits, and conversations with guests.", activity: "Practice entering conversations, introductions, question building, meeting behavior, follow-up, and professional exits.", reflection: "What can I do to make a professional conversation valuable for both people?" },
        { day: "Day 5", title: "Professional Etiquette Challenge", objective: "Demonstrate Week 6 professional-etiquette skills under realistic pressure.", activity: "Complete a multi-scenario etiquette challenge using role play, peer feedback, reflection, and immediate retry.", reflection: "Which professional behavior will help other people trust and rely on me?" },
      ]
    : [];

  const homework: string | null = null;


  function openAssignmentManager(assignment?: Assignment) {
    if (assignment) {
      setEditingAssignmentId(assignment.id);
      setAssignmentForm({
        title: assignment.title,
        instructions: assignment.instructions,
        estimatedMinutes: assignment.estimatedMinutes,
        requirement: assignment.requirement,
        dueAt: assignment.dueAt
          ? new Date(assignment.dueAt).toISOString().slice(0, 16)
          : "",
        dayNumber: assignment.dayNumber,
        allowOnline: assignment.allowOnline,
        allowPrint: assignment.allowPrint,
        allowUpload: assignment.allowUpload,
        portfolioEligible: assignment.portfolioEligible,
      });
    } else {
      setEditingAssignmentId(null);
    }

    setShowFullTools(true);
    setActiveTab("assignments");

    window.setTimeout(() => {
      document
        .getElementById("future-ready-assignments")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  async function saveAssignment() {
    if (editingAssignmentId) {
      const saved = await createHubItem(
        {
          action: "updateAssignment",
          assignmentId: editingAssignmentId,
          ...assignmentForm,
          dueAt: assignmentForm.dueAt || null,
        },
        "Assignment updated.",
      );

      if (saved) {
        setEditingAssignmentId(null);
        setAssignmentForm({
          title: "",
          instructions: "",
          estimatedMinutes: 20,
          requirement: "REQUIRED",
          dueAt: "",
          dayNumber: null,
          allowOnline: true,
          allowPrint: true,
          allowUpload: true,
          portfolioEligible: true,
        });
      }

      return;
    }

    await createAssignment();
  }

  async function removeAssignmentFromWeek(
    assignmentId: string,
    title: string,
  ) {
    const confirmed = window.confirm(
      `Remove "${title}" from this week's assignments?\n\nThis removes the assignment from the facilitator/student lesson plan. This action cannot be undone from this screen.`
    );

    if (!confirmed) return;

    const removed = await createHubItem(
      {
        action: "deleteAssignment",
        assignmentId,
      },
      `"${title}" removed from this week.`,
    );

    if (removed && editingAssignmentId === assignmentId) {
      setEditingAssignmentId(null);
      setAssignmentForm({
        title: "",
        instructions: "",
        estimatedMinutes: 20,
        requirement: "REQUIRED",
        dueAt: "",
        dayNumber: null,
        allowOnline: true,
        allowPrint: true,
        allowUpload: true,
        portfolioEligible: true,
      });
    }
  }

  async function toggleStudentWeekAccess() {
    if (!delivery) return;

    const opening = !delivery.releasedToStudents;

    if (
      !opening &&
      !window.confirm(
        `Close Week ${selectedWeek} to students?\n\nStudents will no longer be able to start new work in this week until you reopen it.`
      )
    ) {
      return;
    }

    await patchDelivery(
      {
        releasedToStudents: opening,
      },
      opening
        ? `Week ${selectedWeek} opened to students.`
        : `Week ${selectedWeek} closed to students.`,
    );
  }

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-[#0D1B3D] bg-white shadow-sm">
        <div className="bg-[#0D1B3D] px-6 py-6 text-white md:px-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">
                FACILITATOR TEACHING WORKSPACE
              </p>

              <h1 className="mt-2 text-3xl font-black md:text-4xl">
                Week {selectedWeek}: {displayLessonTitle}
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200">
                One screen for the class you are teaching: outcome, agenda, student work,
                materials, reflection, and closeout. Customize only when something needs to change.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#F2B705] px-4 py-2 text-xs font-black text-[#0D1B3D]">
                DAY {selectedDay}
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-black text-white">
                {phase}
              </span>
              <span
                className={`rounded-full px-4 py-2 text-xs font-black ${
                  delivery?.releasedToStudents
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {delivery?.releasedToStudents ? "OPEN TO STUDENTS" : "CLOSED TO STUDENTS"}
              </span>

              <button
                type="button"
                onClick={toggleStudentWeekAccess}
                disabled={saving || !delivery}
                className={`rounded-xl px-4 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  delivery?.releasedToStudents
                    ? "border border-white/50 bg-transparent text-white hover:bg-white/10"
                    : "bg-[#F2B705] text-[#0D1B3D] hover:bg-[#FFD84D]"
                }`}
              >
                {saving
                  ? "SAVING..."
                  : delivery?.releasedToStudents
                    ? `CLOSE WEEK ${selectedWeek}`
                    : `OPEN WEEK ${selectedWeek}`}
              </button>
            </div>
          </div>
        </div>

      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">
          {error}
        </div>
      )}

      {saveMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
          ✓ {saveMessage}
        </div>
      )}

      <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4B2265]">
              WEEK NAVIGATOR
            </p>
            <p className="mt-1 font-black text-[#0D1B3D]">
              Week {selectedWeek} selected · Change week only when needed
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-[#0D1B3D] transition group-open:rotate-180">↓</span>
        </summary>

        <div className="border-t border-slate-200 p-5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={previousWeek}
              disabled={selectedWeek === 1 || loading}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-[#0D1B3D] disabled:opacity-40"
            >
              ← Previous Week
            </button>
            <button
              type="button"
              onClick={nextWeek}
              disabled={selectedWeek === 16 || loading}
              className="rounded-xl bg-[#0D1B3D] px-4 py-2 text-sm font-black text-white disabled:opacity-40"
            >
              Next Week →
            </button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 16 }, (_, index) => index + 1).map((week) => (
              <button
                key={week}
                type="button"
                disabled={loading}
                onClick={() => changeWeek(week)}
                className={`min-w-[82px] rounded-xl border px-4 py-3 text-sm font-black transition ${
                  selectedWeek === week
                    ? "border-[#F2B705] bg-[#FFF7D6] text-[#0D1B3D]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-[#F2B705]"
                }`}
              >
                Week {week}
              </button>
            ))}
          </div>
        </div>
      </details>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4B2265]">
              WEEK {lesson.weekNumber} AT A GLANCE
            </p>
            <h2 className="mt-1 text-xl font-black text-[#0D1B3D]">
              {displayLessonTitle}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            Keep the objective, student action, and evidence visible. Everything else is support.
          </p>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#4B2265]">GOAL</p>
            <p className="mt-2 text-sm leading-6 text-[#0D1B3D]">{objective}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#007C7C]">STUDENT ACTION</p>
            <p className="mt-2 text-sm leading-6 text-[#0D1B3D]">{studentActivity}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#725500]">EVIDENCE</p>
            <p className="mt-2 text-sm leading-6 text-[#0D1B3D]">{portfolioEvidence}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
              TEACH THIS CLASS
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#0D1B3D] md:text-3xl">
              Daily Teaching Plan
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Select the class day, then teach from this one view. The plan keeps the goal, execution, student work, evidence, materials, and optional enhancements together.
            </p>
          </div>

          <Link
            href="/ambassador/planner"
            className="w-fit rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white"
          >
            Plan + Build →
          </Link>
        </div>

        {/* DAY SELECTOR */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((day) => {
            const dailyLesson = dailyLessons[day - 1];
            const rhythm = ambassadorWeeklyRhythm[day - 1];

            const taskCount = data.planTasks.filter(
              (task) => task.dayNumber === day
            ).length;

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`rounded-2xl border p-4 text-left transition ${
                  selectedDay === day
                    ? "border-[#F2B705] bg-[#FFF7D6] shadow-sm"
                    : "border-slate-200 bg-slate-50 hover:border-[#F2B705]"
                }`}
              >
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#4B2265]">
                  Day {day}
                </p>

                <p className="mt-2 font-black text-[#0D1B3D]">
                  {dailyLesson?.title || rhythm?.title || `Class Day ${day}`}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {taskCount > 0
                    ? `${taskCount} planned ${taskCount === 1 ? "item" : "items"}`
                    : rhythm?.purpose || "Build this class day"}
                </p>
              </button>
            );
          })}
        </div>

        {/* SELECTED DAY */}
        {(() => {
          const dailyLesson = dailyLessons[selectedDay - 1];
          const rhythm = ambassadorWeeklyRhythm[selectedDay - 1];

          const dayTasks = data.planTasks.filter(
            (task) => task.dayNumber === selectedDay
          );

          const teachingTasks = dayTasks.filter((task) => {
            const type = task.taskType.toLowerCase();
            const title = task.title.toLowerCase();
            return !(
              type.includes("resource") ||
              title === "lesson resources" ||
              title === "resources"
            );
          });

          const attachedLessonResources = dayTasks.flatMap((task) =>
            task.resources?.map(({ id, resource }) => ({
              id: `${task.id}-${id}`,
              resource,
            })) ?? []
          );

          const uniqueLessonResources = Array.from(
            new Map(
              attachedLessonResources.map((item) => [
                item.resource.id || item.resource.fileName || item.resource.url || item.id,
                item,
              ])
            ).values()
          );

          const todayAssignments = data.assignments.filter(
            (assignment) => assignment.dayNumber === selectedDay
          );

          const sharedAssignments = data.assignments.filter(
            (assignment) => assignment.dayNumber === null
          );

          const discussions = dayTasks.filter((task) =>
            task.taskType.toLowerCase().includes("discussion")
          );

          const reflections = dayTasks.filter((task) =>
            task.taskType.toLowerCase().includes("reflection")
          );

          const followUps = dayTasks.filter((task) => {
            const type = task.taskType.toLowerCase();

            return (
              type.includes("assignment") ||
              type.includes("follow") ||
              type.includes("due")
            );
          });

          const experiences = dayTasks.filter((task) => {
            const type = task.taskType.toLowerCase();

            return (
              type.includes("guest") ||
              type.includes("field")
            );
          });

          const totalMinutes = dayTasks.reduce(
            (sum, task) => sum + task.durationMinutes,
            0
          );

          return (
            <div className="mt-7 overflow-hidden rounded-3xl border-2 border-[#0D1B3D]">
              <div className="bg-[#0D1B3D] p-6 text-white md:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
                      WEEK {selectedWeek} · DAY {selectedDay}
                    </p>

                    <h3 className="mt-2 text-3xl font-black">
                      {dailyLesson?.title ||
                        rhythm?.title ||
                        lesson.title}
                    </h3>

                    <p className="mt-3 max-w-3xl leading-7 text-slate-200">
                      {dailyLesson?.objective ||
                        rhythm?.purpose ||
                        objective}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-xs font-black">
                    {lesson.estimatedMinutes} MIN CLASS
                  </span>
                </div>
              </div>

              <div className="grid gap-5 bg-[#F8FAFC] p-6 lg:grid-cols-2 md:p-8">

                {/* AGENDA */}
                <DailyPilotCard
                  eyebrow="1 · TEACHING FLOW"
                  title="Run the Class"
                >
                  {teachingTasks.length > 0 ? (
                    <div className="space-y-3">
                      {teachingTasks.map((task) => (
                        <div
                          key={task.id}
                          className="rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-wider text-[#4B2265]">
                                {task.taskType}
                              </p>

                              <p className="mt-1 font-black text-[#0D1B3D]">
                                {task.title}
                              </p>
                            </div>

                            <span className="shrink-0 text-xs font-bold text-slate-500">
                              {task.durationMinutes} min
                            </span>
                          </div>

                          <div className="mt-3 whitespace-pre-line rounded-xl bg-slate-50 p-3 text-sm leading-7 text-slate-700">
                            {task.instructions}
                          </div>

                        </div>
                      ))}

                      {uniqueLessonResources.length > 0 && (
                        <div className="rounded-2xl border border-[#00A6A6]/30 bg-[#EAFBFB] p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#007C7C]">
                                READY FOR CLASS
                              </p>
                              <p className="mt-1 text-sm font-black text-[#0D1B3D]">
                                {uniqueLessonResources.length} lesson {uniqueLessonResources.length === 1 ? "resource" : "resources"} attached
                              </p>
                            </div>
                            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-[#007C7C]">
                              DAY {selectedDay}
                            </span>
                          </div>

                          <div className="mt-3 space-y-2">
                            {uniqueLessonResources.map(({ id, resource }) => {
                              const sourceUrl = resource.filePath
                                ? `/api/ambassador/resources/file?id=${resource.id}`
                                : resource.url;

                              if (!sourceUrl) return null;

                              const previewType = resourcePreviewType(resource);

                              return (
                                <div key={id} className="flex flex-col gap-3 rounded-xl border border-white bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="min-w-0">
                                    <p className="font-black text-[#0D1B3D]">{resource.title}</p>
                                    <p className="mt-1 text-xs text-slate-500">Attached to today’s teaching plan.</p>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <a
                                      href={`/ambassador/resource-preview?src=${encodeURIComponent(sourceUrl)}&name=${encodeURIComponent(resource.title)}&type=${encodeURIComponent(previewType)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="rounded-lg bg-[#00A6A6] px-3 py-2 text-[11px] font-black text-white"
                                    >
                                      Present / Preview
                                    </a>
                                    <a
                                      href={resource.filePath
                                        ? `/api/ambassador/resources/file?id=${resource.id}&download=1`
                                        : `${sourceUrl}${sourceUrl.includes("?") ? "&" : "?"}download=1`}
                                      className="rounded-lg border border-[#0D1B3D] px-3 py-2 text-[11px] font-black text-[#0D1B3D]"
                                    >
                                      Print / Download
                                    </a>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p>
                        <strong>Teach:</strong>{" "}
                        {dailyLesson?.objective || objective}
                      </p>

                      <p>
                        <strong>Do:</strong>{" "}
                        {dailyLesson?.activity || studentActivity}
                      </p>

                      {(dailyLesson?.reflection || reflection) && (
                        <p>
                          <strong>Reflect:</strong>{" "}
                          {dailyLesson?.reflection || reflection}
                        </p>
                      )}

                      <p className="rounded-xl bg-[#FFF7D6] p-3 text-xs font-bold text-[#725500]">
                        This is the Future Ready™ recommended flow. Use
                        Customize Daily Plan if Coach wants to adjust the day.
                      </p>
                    </div>
                  )}
                </DailyPilotCard>

                {/* DISCUSSION */}
                <DailyPilotCard
                  eyebrow="2 · FACILITATE"
                  title="Prompt + Coach"
                >
                  {discussions.length > 0 ? (
                    <div className="space-y-4">
                      {discussions.map((task) => (
                        <div key={task.id}>
                          <p className="font-black text-[#0D1B3D]">
                            {task.title}
                          </p>

                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {task.instructions}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : discussionQuestions.length > 0 ? (
                    <ul className="space-y-3">
                      {discussionQuestions
                        .slice(
                          Math.max(0, (selectedDay - 1) * 2),
                          selectedDay * 2
                        )
                        .map((question) => (
                          <li
                            key={question}
                            className="rounded-xl border border-slate-200 bg-white p-3"
                          >
                            {question}
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p>
                      Use the lesson objective to guide a short student
                      conversation.
                    </p>
                  )}
                </DailyPilotCard>

                {/* STUDENT ACTION */}
                <DailyPilotCard
                  eyebrow="3 · STUDENT WORK"
                  title="What Students Do + Produce"
                >
                  <p>
                    {dailyLesson?.activity || studentActivity}
                  </p>

                  {selectedWeek === 1 && selectedDay === 1 && (
                    <div className="mt-4 rounded-xl border border-[#00A6A6] bg-[#EAFBFB] p-4">
                      <p className="font-black text-[#0D1B3D]">
                        Future Ready™ Starting Assessment
                      </p>

                      <p className="mt-1 text-sm leading-6">
                        Students complete their readiness baseline. Results
                        automatically become part of their Future Ready™ record.
                      </p>
                    </div>
                  )}
                </DailyPilotCard>

                {/* FOLLOW UP */}
                <DailyPilotCard
                  eyebrow="4 · REFLECTION + EVIDENCE"
                  title="Capture Learning"
                >
                  {reflections.length > 0 || followUps.length > 0 ? (
                    <div className="space-y-4">
                      {[...reflections, ...followUps].map((task) => (
                        <div key={task.id}>
                          <p className="font-black text-[#0D1B3D]">
                            {task.title}
                          </p>

                          <p className="mt-1 text-sm leading-6">
                            {task.instructions}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {(dailyLesson?.reflection || reflection) && (
                        <p>
                          <strong>Reflection:</strong>{" "}
                          {dailyLesson?.reflection || reflection}
                        </p>
                      )}

                      {homework && (
                        <p className="mt-3">
                          <strong>Follow-Up:</strong> {homework}
                        </p>
                      )}
                    </>
                  )}

                  {selectedWeek === 1 && selectedDay === 1 && (
                    <div className="mt-4 rounded-xl border border-[#F2B705] bg-[#FFF9DF] p-4">
                      <p className="font-black text-[#0D1B3D]">
                        Homework · Capstone Brainstorm
                      </p>

                      <p className="mt-1 text-sm leading-6">
                        Begin My Story Brain Map. Students carry their
                        strongest thinking from class into Chapter Zero.
                      </p>
                    </div>
                  )}
                </DailyPilotCard>

                {/* CAPSTONE */}
                <DailyPilotCard
                  eyebrow="5 · CARRY FORWARD"
                  title="What Carries Forward?"
                >
                  {selectedWeek === 1 && selectedDay === 1 ? (
                    <>
                      <p className="font-black text-[#0D1B3D]">
                        Add to Capstone
                      </p>

                      <p className="mt-2">
                        My Story Brain Map: how the student wants their story
                        to feel, three words that belong in their story, and
                        visual ideas they want to explore.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-black text-[#0D1B3D]">
                        Carry Forward Only What Matters
                      </p>

                      <p className="mt-2">
                        A discussion does not automatically become Capstone
                        work. Save meaningful reflection, evidence, insight, or
                        student work only when it strengthens their Future
                        Ready™ story.
                      </p>
                    </>
                  )}

                  <p className="mt-4 rounded-xl bg-[#F4F3FF] p-3 text-sm font-bold text-[#4B2265]">
                    Portfolio Evidence: {portfolioEvidence}
                  </p>
                </DailyPilotCard>

                {/* MATERIALS */}
                <DailyPilotCard
                  eyebrow="6 · MATERIALS + ASSETS"
                  title="Worksheets, Printables & Media"
                >

                  {selectedWeek !== 15 && (
                    <div className="mb-5 rounded-2xl border-2 border-[#F2B705] bg-[#FFFDF5] p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#725500]">
                            CORE FUTURE READY™ DOWNLOADS
                          </p>

                          <p className="mt-1 text-sm font-black text-[#0D1B3D]">
                            Week {selectedWeek} Teaching & Student Materials
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-600">
                            These are the protected Future Ready™ materials already
                            built for this week. Open, print, or download only what
                            you need for today.
                          </p>
                        </div>

                        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-[#725500] shadow-sm">
                          SHARED WEEK ASSETS
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {[
                          {
                            label: "Student Workbook",
                            description: "Student workbook pages and activities.",
                            pdf: "Student-Workbook.pdf",
                            docx: "Student-Workbook.docx",
                            studentAssignable: true,
                            portfolioEligible: false,
                          },
                          {
                            label: "Slides",
                            description: "Class presentation for this week.",
                            pptx: "Slides.pptx",
                            studentAssignable: false,
                            portfolioEligible: false,
                          },
                          {
                            label: "Activity Kit",
                            description: "Activities, role plays, cases and classroom work.",
                            pdf: "Activity-Kit.pdf",
                            docx: "Activity-Kit.docx",
                            studentAssignable: true,
                            portfolioEligible: false,
                          },
                          {
                            label: "Assessment Rubric",
                            description: "Assessment criteria and facilitator rubric.",
                            pdf: "Assessment-Rubric.pdf",
                            docx: "Assessment-Rubric.docx",
                            studentAssignable: false,
                            portfolioEligible: false,
                          },
                          {
                            label: "Portfolio Artifact",
                            description: "Student portfolio and evidence template.",
                            pdf: "Portfolio-Artifact.pdf",
                            docx: "Portfolio-Artifact.docx",
                            studentAssignable: true,
                            portfolioEligible: true,
                          },
                          {
                            label: "Facilitator Guide",
                            description: "Weekly teaching guide and facilitation notes.",
                            pdf: "Facilitator-Guide.pdf",
                            docx: "Facilitator-Guide.docx",
                            studentAssignable: false,
                            portfolioEligible: false,
                          },
                        ].map((asset) => {
                          const weekCode = String(selectedWeek).padStart(2, "0");

                          const makeUrl = (file: string) => {
                            const fileName =
                              `Future-Ready-Week-${weekCode}-${file}`;

                            return `/api/ambassador/download/${weekCode}/${encodeURIComponent(
                              fileName
                            )}`;
                          };

                          const primaryFile =
                            asset.pdf ?? asset.pptx ?? asset.docx;

                          if (!primaryFile) return null;

                          const primaryFormat = asset.pptx
                            ? "PPTX"
                            : asset.pdf
                              ? "PDF"
                              : "DOCX";

                          const primaryUrl = makeUrl(primaryFile);

                          const editableUrl = asset.docx
                            ? makeUrl(asset.docx)
                            : null;

                          const printableUrl = asset.pdf
                            ? makeUrl(asset.pdf)
                            : null;

                          const assignKey =
                            `packaged-${asset.label}-${primaryFormat}`;

                          return (
                            <div
                              key={asset.label}
                              className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-black text-[#0D1B3D]">
                                    {asset.label}
                                  </p>

                                  <p className="mt-1 text-xs leading-5 text-slate-500">
                                    {asset.description}
                                  </p>
                                </div>

                                <span className="shrink-0 rounded-full bg-[#EAFBFB] px-2 py-1 text-[9px] font-black text-[#007C7C]">
                                  {asset.docx && asset.pdf
                                    ? "PDF + EDITABLE"
                                    : primaryFormat}
                                </span>
                              </div>

                              <details className="mt-3">
                                <summary className="cursor-pointer list-none rounded-lg bg-[#0D1B3D] px-3 py-2 text-center text-[11px] font-black text-white">
                                  Open Resource
                                </summary>

                                <div className="mt-2 flex flex-wrap gap-2">
                                  <a
                                    href={`/ambassador/resource-preview?src=${encodeURIComponent(
                                      primaryUrl
                                    )}&name=${encodeURIComponent(
                                      asset.label
                                    )}&type=${encodeURIComponent(
                                      primaryFormat.toLowerCase()
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-lg border border-[#0D1B3D] px-3 py-2 text-[11px] font-black text-[#0D1B3D]"
                                  >
                                    Preview
                                  </a>

                                  {editableUrl && (
                                    <a
                                      href={`${editableUrl}?download=1`}
                                      className="rounded-lg border border-[#00A6A6] px-3 py-2 text-[11px] font-black text-[#007C7C]"
                                    >
                                      Editable
                                    </a>
                                  )}

                                  {printableUrl && (
                                    <a
                                      href={`${printableUrl}?download=1`}
                                      className="rounded-lg border border-slate-300 px-3 py-2 text-[11px] font-black text-slate-700"
                                    >
                                      Print / Download
                                    </a>
                                  )}

                                  {asset.pptx && (
                                    <a
                                      href={`${primaryUrl}?download=1`}
                                      className="rounded-lg border border-slate-300 px-3 py-2 text-[11px] font-black text-slate-700"
                                    >
                                      Download Slides
                                    </a>
                                  )}

                                  {asset.studentAssignable && (
                                    <button
                                      type="button"
                                      disabled={
                                        assigningResourceId === assignKey
                                      }
                                      onClick={() =>
                                        assignPackagedAssetToStudents(
                                          {
                                            label: asset.label,
                                            format: primaryFormat,
                                            openUrl: primaryUrl,
                                            portfolioEligible:
                                              asset.portfolioEligible,
                                          },
                                          "BOTH"
                                        )
                                      }
                                      className="rounded-lg bg-[#00A6A6] px-3 py-2 text-[11px] font-black text-white disabled:opacity-50"
                                    >
                                      {assigningResourceId === assignKey
                                        ? "Assigning..."
                                        : "Assign to Students"}
                                    </button>
                                  )}
                                </div>
                              </details>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedWeek === 15 && (
                    <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm font-black text-amber-900">
                        Week 15 · Thanksgiving Break
                      </p>
                      <p className="mt-1 text-sm leading-6 text-amber-800">
                        No required student workbook or assignment is scheduled for Week 15.
                      </p>
                    </div>
                  )}

                  <div className="mb-5 rounded-2xl border-2 border-[#00A6A6]/30 bg-[#F7FFFF] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#007C7C]">
                          PROTECTED RESOURCE LIBRARY
                        </p>

                        <p className="mt-1 text-sm font-black text-[#0D1B3D]">
                          {selectedWeek === 4
                            ? "Week 4 · SEG Systems Student Work"
                            : selectedWeek === 15
                              ? "Professional Experience Toolkit"
                              : selectedWeek >= 5
                                ? `Week ${selectedWeek} Worksheet + Professional Experience Toolkit`
                                : "Professional Experience Toolkit"}
                        </p>

                        <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-600">
                          {selectedWeek === 4
                            ? "Use the Week 4 SEG Systems student work across preparation, the workplace experience and Friday reflection. The reusable experience toolkit remains preserved for other professional experiences."
                            : "Open or download the protected student materials you need. Assigning a resource uses the existing Future Ready™ assignment system and does not replace the weekly lesson."}
                        </p>
                      </div>

                      <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-[#007C7C] shadow-sm">
                        {selectedWeek === 15
                          ? "NO REQUIRED WEEKLY WORK"
                          : "FACILITATOR READY"}
                      </span>
                    </div>

                    {selectedWeek === 15 && (
                      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                        <p className="text-xs font-black text-amber-900">
                          WEEK 15 · THANKSGIVING BREAK
                        </p>
                        <p className="mt-1 text-xs leading-5 text-amber-800">
                          No required Week 15 worksheet or assignment. The reusable
                          toolkit remains available if the facilitator needs it.
                        </p>
                      </div>
                    )}

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {packagedResources
                        .filter(
                          (resource) =>
                            resource.visibleToFacilitator &&
                            (
                              (
                                selectedWeek !== 4 &&
                                resource.category ===
                                  "PROFESSIONAL_EXPERIENCE"
                              ) ||
                              (
                                resource.category === "WEEK_RESOURCE" &&
                                resource.week === selectedWeek
                              )
                            )
                        )
                        .map((resource) => {
                          const openUrl =
                            `/api/ambassador/packaged/${resource.relativePath}`;

                          const downloadUrl =
                            `${openUrl}?download=1`;

                          const assignmentKey =
                            `packaged-${resource.title}-${resource.format}`;

                          const isWeeklyResource =
                            resource.category === "WEEK_RESOURCE";

                          return (
                            <div
                              key={resource.id}
                              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#007C7C]">
                                    {isWeeklyResource
                                      ? `WEEK ${resource.week} STUDENT WORK`
                                      : "REUSABLE EXPERIENCE TOOL"}
                                  </p>

                                  <p className="mt-1 text-sm font-black text-[#0D1B3D]">
                                    {resource.shortTitle}
                                  </p>

                                  <p className="mt-1 text-xs leading-5 text-slate-500">
                                    {isWeeklyResource
                                      ? "Protected weekly worksheet with explicit directions, submission guidance, portfolio evidence and Capstone Connection."
                                      : "Protected reusable preparation, observation, reflection or follow-up resource for real-world experiences."}
                                  </p>
                                </div>

                                <span className="shrink-0 rounded-full bg-[#EAFBFB] px-2 py-1 text-[9px] font-black text-[#007C7C]">
                                  {resource.format}
                                </span>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-2">
                                <a
                                  href={openUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded-lg border border-[#0D1B3D] px-3 py-2 text-[11px] font-black text-[#0D1B3D]"
                                >
                                  Open
                                </a>

                                <a
                                  href={downloadUrl}
                                  className="rounded-lg border border-slate-300 px-3 py-2 text-[11px] font-black text-slate-700"
                                >
                                  Download / Print
                                </a>

                                <button
                                  type="button"
                                  disabled={
                                    assigningResourceId === assignmentKey
                                  }
                                  onClick={() =>
                                    assignPackagedAssetToStudents(
                                      {
                                        label: resource.title,
                                        format: resource.format,
                                        openUrl,
                                        portfolioEligible:
                                          isWeeklyResource,
                                      },
                                      "BOTH"
                                    )
                                  }
                                  className="rounded-lg bg-[#00A6A6] px-3 py-2 text-[11px] font-black text-white disabled:opacity-50"
                                >
                                  {assigningResourceId === assignmentKey
                                    ? "Assigning..."
                                    : "Assign to Students"}
                                </button>
                              </div>

                              {isWeeklyResource && (
                                <p className="mt-3 text-[10px] font-bold leading-4 text-slate-500">
                                  Suggested curriculum day: Day{" "}
                                  {resource.dayNumber ?? 3}. Assignment is added
                                  to the currently selected facilitator day so you
                                  remain in control of delivery.
                                </p>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {data.resources.filter(
                    (resource) =>
                      resource.enabled &&
                      resource.visibleToFacilitator &&
                      (resource.dayNumber === null ||
                        resource.dayNumber === selectedDay)
                  ).length > 0 ? (
                    <div className="space-y-3">
                      {data.resources
                        .filter(
                          (resource) =>
                            resource.enabled &&
                            resource.visibleToFacilitator &&
                            (resource.dayNumber === null ||
                              resource.dayNumber === selectedDay)
                        )
                        .slice(0, 6)
                        .map((resource) => (
                          <div
                            key={resource.id}
                            className="rounded-xl border border-slate-200 bg-white p-4"
                          >
                            <div className="flex min-w-0 flex-col gap-3">
                              <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase text-[#4B2265]">
                                  {resource.kind}
                                </p>

                                <p className="mt-1 font-black text-[#0D1B3D]">
                                  {resource.title}
                                </p>

                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span className="rounded-full bg-[#EAFBFB] px-2 py-1 text-[10px] font-black text-[#007C7C]">
                                    {resource.dayNumber
                                      ? `DAY ${resource.dayNumber}`
                                      : "SHARED"}
                                  </span>

                                  {resource.required && (
                                    <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-black text-amber-800">
                                      REQUIRED
                                    </span>
                                  )}

                                  {resource.visibleToStudent && (
                                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">
                                      STUDENT VISIBLE
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 border-t border-slate-100 pt-4">
                              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                                USE THIS RESOURCE
                              </p>

                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  disabled={
                                    addingLessonResourceId === resource.id
                                  }
                                  onClick={() =>
                                    addResourceToTodaysLesson(resource)
                                  }
                                  className="rounded-lg bg-[#4B2265] px-3 py-2 text-[11px] font-black text-white disabled:opacity-50"
                                >
                                  {addingLessonResourceId === resource.id
                                    ? "Adding..."
                                    : `Add to Day ${selectedDay} Lesson`}
                                </button>
                                {resource.filePath ? (
                                  <>
                                    <a
                                      href={`/ambassador/resource-preview?src=${encodeURIComponent(
                                        `/api/ambassador/resources/file?id=${resource.id}`
                                      )}&name=${encodeURIComponent(
                                        resource.title
                                      )}&type=${encodeURIComponent(
                                        resource.kind.toLowerCase()
                                      )}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="rounded-lg border border-[#0D1B3D] px-3 py-2 text-[11px] font-black text-[#0D1B3D]"
                                    >
                                      Preview
                                    </a>

                                    <a
                                      href={`/api/ambassador/resources/file?id=${resource.id}&download=1`}
                                      className="rounded-lg border border-slate-300 px-3 py-2 text-[11px] font-black text-slate-700"
                                    >
                                      Print / Download
                                    </a>
                                  </>
                                ) : resource.url ? (
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-lg border border-[#0D1B3D] px-3 py-2 text-[11px] font-black text-[#0D1B3D]"
                                  >
                                    Open Resource
                                  </a>
                                ) : null}

                                <button
                                  type="button"
                                  disabled={
                                    assigningResourceId === resource.id
                                  }
                                  onClick={() =>
                                    assignResourceToStudents(
                                      resource,
                                      "ONLINE"
                                    )
                                  }
                                  className="rounded-lg bg-[#00A6A6] px-3 py-2 text-[11px] font-black text-white disabled:opacity-50"
                                >
                                  {assigningResourceId === resource.id
                                    ? "Assigning..."
                                    : "Assign Online"}
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    assigningResourceId === resource.id
                                  }
                                  onClick={() =>
                                    assignResourceToStudents(
                                      resource,
                                      "PRINT"
                                    )
                                  }
                                  className="rounded-lg bg-[#F2B705] px-3 py-2 text-[11px] font-black text-[#0D1B3D] disabled:opacity-50"
                                >
                                  Assign Printable
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    assigningResourceId === resource.id
                                  }
                                  onClick={() =>
                                    assignResourceToStudents(
                                      resource,
                                      "BOTH"
                                    )
                                  }
                                  className="rounded-lg bg-[#0D1B3D] px-3 py-2 text-[11px] font-black text-white disabled:opacity-50"
                                >
                                  Assign Both
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p>
                      No additional database resources have been attached to
                      this week yet.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setShowFullTools(true);
                      setActiveTab("resources");

                      window.setTimeout(() => {
                        document
                          .getElementById("future-ready-resource-hub")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }, 200);
                    }}
                    className="mt-4 rounded-xl bg-[#0D1B3D] px-4 py-2 text-xs font-black text-white"
                  >
                    Browse Full Resource Hub
                  </button>
                </DailyPilotCard>

                {/* ASSIGNMENTS */}
                <DailyPilotCard
                  eyebrow="7 · ASSIGN / TURN IN"
                  title="Assignments & Evidence"
                >
                  {todayAssignments.length > 0 ? (
                    <div>
                      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.15em] text-[#007C7C]">
                        TODAY’S WORK · DAY {selectedDay}
                      </p>
                      <div className="space-y-3">
                        {todayAssignments.map((assignment) => (
                          <div key={assignment.id} className="rounded-xl border-2 border-[#00A6A6]/30 bg-[#F7FFFF] p-4">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <p className="font-black text-[#0D1B3D]">{assignment.title}</p>
                              <span className="rounded-full bg-[#00A6A6] px-2 py-1 text-[10px] font-black text-white">DAY {selectedDay}</span>
                            </div>
                            <p className="mt-2 text-sm leading-6">{assignment.instructions}</p>
                            <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-black text-slate-500">
                              <span>{assignment.requirement}</span>
                              <span>• {assignment.estimatedMinutes} min</span>
                              {assignment.portfolioEligible && <span>• PORTFOLIO</span>}
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => openAssignmentManager(assignment)}
                                className="rounded-lg border border-[#0D1B3D] px-3 py-2 text-[10px] font-black uppercase tracking-wide text-[#0D1B3D]"
                              >
                                Edit / Manage
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  removeAssignmentFromWeek(
                                    assignment.id,
                                    assignment.title,
                                  )
                                }
                                className="rounded-lg border border-red-300 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                      <p className="font-black text-[#0D1B3D]">No Day {selectedDay} assignment is required.</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">Shared weekly work is available below without cluttering today’s required actions.</p>
                    </div>
                  )}

                  {sharedAssignments.length > 0 && (
                    <details className="group mt-4 rounded-xl border border-slate-200 bg-white">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#4B2265]">WEEKLY / SHARED WORK</p>
                          <p className="mt-1 text-sm font-black text-[#0D1B3D]">{sharedAssignments.length} shared {sharedAssignments.length === 1 ? "assignment" : "assignments"}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-[#0D1B3D] transition group-open:rotate-180">↓</span>
                      </summary>
                      <div className="space-y-3 border-t border-slate-200 p-4">
                        {sharedAssignments.map((assignment) => (
                          <div key={assignment.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <p className="font-black text-[#0D1B3D]">{assignment.title}</p>
                            <p className="mt-1 text-sm leading-6">{assignment.instructions}</p>
                            <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-black text-slate-500">
                              <span>{assignment.requirement}</span>
                              <span>• {assignment.estimatedMinutes} min</span>
                              {assignment.portfolioEligible && <span>• PORTFOLIO</span>}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => openAssignmentManager(assignment)}
                                className="rounded-lg border border-[#0D1B3D] px-3 py-2 text-[10px] font-black uppercase tracking-wide text-[#0D1B3D]"
                              >
                                Edit / Manage
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  removeAssignmentFromWeek(
                                    assignment.id,
                                    assignment.title,
                                  )
                                }
                                className="rounded-lg border border-red-300 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}

                  <button
                    type="button"
                    onClick={() => openAssignmentManager()}
                    className="mt-4 rounded-xl border border-[#0D1B3D] px-4 py-2 text-xs font-black text-[#0D1B3D]"
                  >
                    Manage Assignments →
                  </button>
                </DailyPilotCard>

                {/* SPEAKER/TRIP */}
                <DailyPilotCard
                  eyebrow="8 · EXPERIENCE"
                  title="Speaker / Trip / Experience"
                >
                  {experiences.length > 0 ? (
                    <div className="space-y-3">
                      {experiences.map((task) => (
                        <div key={task.id}>
                          <p className="font-black text-[#0D1B3D]">
                            {task.title}
                          </p>
                          <p className="mt-1">
                            {task.instructions}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>
                      Nothing is required here today. Add a speaker, employer
                      connection, field trip, or applied-learning experience
                      only when it strengthens the lesson.
                    </p>
                  )}

                  <Link
                    href="/ambassador/planner"
                    className="mt-4 inline-flex rounded-xl border border-[#0D1B3D] px-4 py-2 text-xs font-black text-[#0D1B3D]"
                  >
                    Add / Manage Experience →
                  </Link>
                </DailyPilotCard>
              </div>

              <div className="border-t border-slate-200 bg-white p-5 md:p-6">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4B2265]">
                      DAILY ASSIGNMENT DIRECTIONS
                    </p>

                    <h4 className="mt-1 text-lg font-black text-[#0D1B3D]">
                      What students need to do after class
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Staff/admin editing only. Students see the saved directions
                      with their daily closeout work.
                    </p>

                    <textarea
                      value={dailyDirections}
                      onChange={(event) =>
                        setDailyDirections(event.target.value)
                      }
                      rows={3}
                      placeholder="Example: Finish the reflection, upload your evidence, then complete today's Capstone build before the next class."
                      className="mt-3 w-full rounded-xl border border-slate-300 bg-white p-4 text-sm text-[#0D1B3D] outline-none focus:border-[#4B2265]"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={async () => {
                      const saved = await createHubItem(
                        {
                          action: "upsertDailyDirections",
                          dayNumber: selectedDay,
                          instructions: dailyDirections,
                        },
                        `Day ${selectedDay} directions saved.`,
                      );

                      if (saved) {
                        await loadWeek(selectedWeek);
                      }
                    }}
                    className="rounded-xl bg-[#4B2265] px-5 py-3 text-sm font-black text-white disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Directions"}
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-200 bg-[#FFFDF5] p-6 md:p-8">
                <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#725500]">
                      FACILITATOR NOTES
                    </p>
                    <h4 className="mt-1 text-lg font-black text-[#0D1B3D]">
                      Close the class + capture what happened
                    </h4>
                    <textarea
                      value={facilitatorNotes}
                      onChange={(event) => setFacilitatorNotes(event.target.value)}
                      rows={3}
                      placeholder="What worked, what students needed, what to revisit, speaker notes, classroom observations, or follow-up..."
                      className="mt-3 w-full rounded-xl border border-slate-300 bg-white p-4 text-sm text-[#0D1B3D] outline-none focus:border-[#F2B705]"
                    />

                    <details className="mt-3 rounded-xl border border-slate-200 bg-white">
                      <summary className="cursor-pointer list-none px-4 py-3 text-xs font-black text-[#0D1B3D]">
                        PAST STAFF NOTES · {(data?.dailyNotes ?? []).length}
                      </summary>

                      <div className="max-h-72 space-y-3 overflow-y-auto border-t border-slate-200 p-4">
                        {(data?.dailyNotes ?? []).length === 0 ? (
                          <p className="text-xs text-slate-500">
                            No daily staff notes have been saved yet.
                          </p>
                        ) : (
                          (data?.dailyNotes ?? []).map((note) => (
                            <div
                              key={note.id}
                              className="rounded-lg bg-slate-50 p-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#725500]">
                                  Week {selectedWeek} · Day {note.dayNumber}
                                </p>

                                <p className="text-[10px] font-semibold text-slate-400">
                                  {new Date(note.createdAt).toLocaleString()}
                                </p>
                              </div>

                              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                {note.content}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </details>
                  </div>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={async () => {
                      if (!facilitatorNotes.trim()) return;

                      const saved = await createHubItem(
                        {
                          action: "saveDailyNote",
                          dayNumber: selectedDay,
                          content: facilitatorNotes,
                        },
                        `Day ${selectedDay} staff note saved.`,
                      );

                      if (saved) {
                        setFacilitatorNotes("");
                        await loadWeek(selectedWeek);
                      }
                    }}
                    className="rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Notes"}
                  </button>
                </div>
              </div>

              {/* CUSTOMIZE FOOTER */}
              <div className="border-t border-slate-200 bg-white p-6 md:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4B2265]">
                      FACILITATOR FLEXIBILITY
                    </p>

                    <h4 className="mt-1 text-xl font-black text-[#0D1B3D]">
                      Define the Day Without Losing the Curriculum
                    </h4>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                      Adjust timing, add activities, choose another discussion,
                      attach a worksheet or video, add a speaker, or create a
                      follow-up. The Future Ready™ objective and evidence
                      framework remain the curriculum spine.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/ambassador/planner"
                      className="rounded-xl bg-[#F2B705] px-5 py-3 text-xs font-black text-[#0D1B3D]"
                    >
                      Customize Day
                    </Link>

                    <Link
                      href={`/ambassador/lesson-builder?week=${selectedWeek}`}
                      className="rounded-xl bg-[#0D1B3D] px-5 py-3 text-xs font-black text-white"
                    >
                      Build Lesson Assets
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* EXISTING APPLIED LEARNING — SURFACED IN THE DAILY TEACHING VIEW */}
        {(selectedDay === 3 || selectedDay === 4) && (
          <div className="mt-7">
            <div className="mb-4 rounded-2xl border border-[#00A6A6]/30 bg-[#EAFBFB] p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#007C7C]">
                {selectedDay === 3
                  ? "WEDNESDAY · APPLIED LEARNING LAB"
                  : "THURSDAY · EXPERIENCE + FLEX"}
              </p>

              <p className="mt-2 text-sm font-semibold leading-6 text-[#0D1B3D]">
                {selectedDay === 3
                  ? "Run the existing Future Ready™ applied-learning experience for this week — scenario, public speaking, panel, role play, decision lab, or other assigned practice."
                  : "Use the scheduled experience when one is planned. The existing classroom applied-learning experience remains available as the flex-day option."}
              </p>
            </div>

            <AppliedLearningTeachingHub week={lesson.weekNumber} />
          </div>
        )}
      </section>

      <details className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <summary className="cursor-pointer list-none p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            MANAGE + CUSTOMIZE
          </p>
          <div className="mt-1 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[#0D1B3D]">
                Need to change today&apos;s plan?
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Open only the tool you need. The teaching screen stays focused.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-[#0D1B3D]">↓</span>
          </div>
        </summary>

        <div className="grid gap-3 border-t border-slate-200 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/ambassador/planner"
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-black text-[#0D1B3D]"
          >
            Edit / Customize Day →
          </Link>
          <Link
            href={`/ambassador/lesson-builder?week=${selectedWeek}`}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-black text-[#0D1B3D]"
          >
            Generate Activity →
          </Link>
          <button
            type="button"
            onClick={openAssignments}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm font-black text-[#0D1B3D]"
          >
            Manage Student Work →
          </button>
          <button
            type="button"
            onClick={openResourceHub}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm font-black text-[#0D1B3D]"
          >
            Open Asset Library →
          </button>
        </div>
      </details>

      {/* Legacy weekly delivery console preserved in codebase; not rendered in focused Teach view. */}

      <section
        className={`${
          "hidden"
        } rounded-3xl border border-slate-200 bg-white p-6 shadow-sm`}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
              Optional Weekly Rhythm
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
              Week {lesson.weekNumber} Delivery Map
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              The lesson is the curriculum spine. Each day gives students a
              different way to reflect, practice, communicate, experience and
              apply what they are learning.
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#FFF7D6] px-4 py-2 text-xs font-black text-[#725500]">
            MONDAY → FRIDAY
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {ambassadorWeeklyRhythm.map((day) => (
            <article
              key={day.day}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4B2265]">
                {day.day}
              </p>

              <h3 className="mt-2 text-lg font-black text-[#0D1B3D]">
                {day.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {day.purpose}
              </p>

              <div className="mt-4 border-t border-slate-200 pt-4">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  What Happens
                </p>

                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  {day.activities.map((activity) => (
                    <li key={activity} className="flex gap-2">
                      <span className="font-black text-[#F2B705]">•</span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className={`${
          "hidden"
        } overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm`}
      >
        <div className="border-b border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#0D1B3D] px-3 py-1 text-xs font-black text-white">
                  WEEK {lesson.weekNumber}
                </span>

                <span className="rounded-full bg-[#EDE4F3] px-3 py-1 text-xs font-black text-[#4B2265]">
                  {phase}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    delivery?.releasedToStudents
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {delivery?.releasedToStudents ? "OPEN" : "CLOSED"}
                </span>
              </div>

              <h2 className="mt-4 max-w-4xl text-3xl font-black text-[#0D1B3D]">
                {lesson.title}
              </h2>

              <p className="mt-3 max-w-4xl leading-7 text-slate-600">
                {objective}
              </p>
            </div>

            <div className="min-w-[220px] rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                Portfolio Evidence
              </p>

              <p className="mt-2 text-sm font-bold text-[#0D1B3D]">
                {portfolioEvidence}
              </p>

              <p className="mt-4 text-xs font-black uppercase tracking-wider text-slate-500">
                Badge
              </p>

              <p className="mt-2 text-sm font-bold text-[#0D1B3D]">
                {delivery?.badgeEnabled ? badgeEarned : "Badge Disabled"}
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200 px-5 pt-4">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap rounded-t-xl px-4 py-3 text-sm font-black ${
                  activeTab === tab.key
                    ? "bg-[#0D1B3D] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {activeTab === "overview" && (
            <div className="grid gap-5 lg:grid-cols-2">
              <ContentCard title="Theme / Focus">
                <p>{lesson.title}</p>
              </ContentCard>

              <ContentCard title="Why This Matters">
                <p>{workplaceConnection}</p>
              </ContentCard>

              <ContentCard title="Student Activity">
                <p>{studentActivity}</p>
              </ContentCard>

              <ContentCard title="Skills Developed">
                {skillsEarned.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skillsEarned.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-[#EAF2FF] px-3 py-1 text-sm font-bold text-[#24569B]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p>
                    Skills will be connected to this lesson through the Future
                    Ready™ skills framework.
                  </p>
                )}
              </ContentCard>

              {homework && (
                <ContentCard title="Homework / Follow-Up">
                  <p>{homework}</p>
                </ContentCard>
              )}

              {reflection && (
                <ContentCard title="Weekly Reflection">
                  <p>{reflection}</p>
                </ContentCard>
              )}
            </div>
          )}

          {activeTab === "lesson" && (
            <div className="space-y-5">
                <div className="rounded-2xl border-2 border-[#F2B705] bg-[#FFFDF5] p-6">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
                    Program / Lesson Builder
                  </p>

                  <h3 className="mt-2 text-xl font-black text-[#0D1B3D]">
                    Customize This Week&apos;s Lesson
                  </h3>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    Use the Future Ready™ lesson builder for Week {selectedWeek}
                    to customize activities, facilitation, classroom delivery,
                    and supplemental lesson materials.
                  </p>

                  <Link
                    href={`/ambassador/lesson-builder?week=${selectedWeek}`}
                    className="mt-5 inline-flex rounded-xl bg-[#F2B705] px-5 py-3 text-sm font-black text-[#0D1B3D]"
                  >
                    Open Program / Lesson Builder →
                  </Link>
                </div>
              <ContentCard title="Facilitator Guidance">
                <p>{facilitatorGuide}</p>
              </ContentCard>

              {discussionQuestions.length > 0 && (
                <ContentCard title="Discussion Prompts">
                  <ul className="list-disc space-y-2 pl-5">
                    {discussionQuestions.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ul>
                </ContentCard>
              )}

              {dailyLessons.length > 0 ? (
                <ContentCard title="Session Plan">
                  <div className="space-y-4">
                    {dailyLessons.map((day) => (
                      <div
                        key={`${day.day}-${day.title}`}
                        className="rounded-2xl border border-slate-200 p-5"
                      >
                        <p className="text-xs font-black uppercase tracking-wider text-[#4B2265]">
                          {day.day}
                        </p>

                        <h4 className="mt-2 font-black text-[#0D1B3D]">
                          {day.title}
                        </h4>

                        <p className="mt-2 text-sm text-slate-600">
                          <strong>Objective:</strong> {day.objective}
                        </p>

                        <p className="mt-2 text-sm text-slate-600">
                          <strong>Activity:</strong> {day.activity}
                        </p>

                        <p className="mt-2 text-sm text-slate-600">
                          <strong>Reflection:</strong> {day.reflection}
                        </p>
                      </div>
                    ))}
                  </div>
                </ContentCard>
              ) : (
                <ContentCard title="Core Session">
                  <p>
                    <strong>Focus:</strong> {objective}
                  </p>

                  <p className="mt-3">
                    <strong>Activity:</strong> {studentActivity}
                  </p>

                  {reflection && (
                    <p className="mt-3">
                      <strong>Reflection:</strong> {reflection}
                    </p>
                  )}
                </ContentCard>
              )}

              <ContentCard title="Facilitator Notes">
                <textarea
                  value={facilitatorNotes}
                  onChange={(event) => setFacilitatorNotes(event.target.value)}
                  rows={6}
                  placeholder="Add notes for this cohort, lesson adjustments, reminders, speaker notes, classroom observations, or follow-up items..."
                  className="w-full rounded-xl border border-slate-200 p-4 text-sm text-[#0D1B3D] outline-none focus:border-[#4B2265]"
                />

                <button
                  type="button"
                  disabled={saving}
                  onClick={async () => {
                    if (!facilitatorNotes.trim()) return;

                    const saved = await createHubItem(
                      {
                        action: "saveDailyNote",
                        dayNumber: selectedDay,
                        content: facilitatorNotes,
                      },
                      `Day ${selectedDay} staff note saved.`,
                    );

                    if (saved) {
                      setFacilitatorNotes("");
                      await loadWeek(selectedWeek);
                    }
                  }}
                  className="mt-4 rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Facilitator Notes"}
                </button>
              </ContentCard>
            </div>
          )}

          {activeTab === "activities" && (
            <div className="space-y-5">
              <ContentCard title="Core Activity">
                <p>{studentActivity}</p>
              </ContentCard>

              <div className="rounded-2xl border-2 border-[#F2B705] bg-[#FFFDF5] p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
                  Future Ready™ AI Teaching Assistant
                </p>

                <h3 className="mt-2 text-xl font-black text-[#0D1B3D]">
                  Build Supplemental Classroom Activities
                </h3>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  Generate lesson-specific role plays, case scenarios, improv,
                  team building, quizzes, facilitator prompts, scripts, and
                  printable classroom materials.
                </p>

                <Link
                  href={`/ambassador/lesson-builder?week=${selectedWeek}`}
                  className="mt-5 inline-flex rounded-xl bg-[#F2B705] px-5 py-3 text-sm font-black text-[#0D1B3D]"
                >
                  Open AI Activity Builder →
                </Link>
              </div>
            </div>
          )}

          {activeTab === "assignments" && (
            <div
              id="future-ready-assignments"
              className="scroll-mt-6 space-y-5"
            >
              <ContentCard title="Assignment / Evidence">
                <p className="font-bold text-[#0D1B3D]">{portfolioEvidence}</p>

                <p className="mt-2">
                  Student work connected to this lesson is managed by cohort
                  with due dates, submission requirements, facilitator review,
                  and portfolio eligibility.
                </p>
              </ContentCard>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  {selectedWeek === 4 && (
                    <div className="mb-5 rounded-2xl border border-[#00A6A6]/30 bg-[#F2FBFB] p-4">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#007B7B]">
                        Week 4 · Prebuilt Student Assignment
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        Load the complete SEG professional-visit assignment.
                        It includes research, professional expectations,
                        question building, workplace observations, reflection,
                        submission requirements, and the year-long Capstone
                        Connection.
                      </p>

                      <button
                        type="button"
                        onClick={loadWeek4SegAssignment}
                        className="mt-3 rounded-xl bg-[#00A6A6] px-4 py-2 text-sm font-black text-white"
                      >
                        Load SEG Assignment
                      </button>
                    </div>
                  )}

                  {selectedWeek >= 5 && selectedWeek <= 16 && (
                    <div className="mb-5 rounded-2xl border border-[#0D1B3D]/15 bg-white p-4 shadow-sm">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#0D1B3D]">
                        Week {selectedWeek} · Prebuilt Student Work
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {selectedWeek === 15
                          ? "Thanksgiving break. No student assignment should be released this week."
                          : "Load the prebuilt student assignment for this week's lesson, experience, reflection, and Capstone Connection."}
                      </p>

                      {selectedWeek !== 15 ? (
                        <>


                    <button
                          type="button"
                          onClick={() =>
                            loadPrebuiltWeekAssignment(selectedWeek)
                          }
                          className="mt-3 rounded-xl bg-[#0D1B3D] px-4 py-2 text-sm font-black text-white"
                        >
                          Load Week Assignment
                        </button>
</>
                      ) : (
                        <div className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
                          NO CLASS · NO ASSIGNMENT
                        </div>
                      )}
                    </div>
                  )}

                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-black text-[#0D1B3D]">
                    {editingAssignmentId ? "Edit Assignment" : "+ Add Assignment"}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {editingAssignmentId
                      ? "Update this assignment, then save your changes."
                      : "Create the assignment students will complete for this lesson."}
                  </p>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">
                      Assignment Title
                    </span>
                    <input
                      value={assignmentForm.title}
                      onChange={(event) =>
                        setAssignmentForm((current) => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                      placeholder="Example: Career Exploration Map"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">
                      Teaching Day
                    </span>

                    <select
                      value={assignmentForm.dayNumber ?? ""}
                      onChange={(event) =>
                        setAssignmentForm((current) => ({
                          ...current,
                          dayNumber: event.target.value
                            ? Number(event.target.value)
                            : null,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    >
                      <option value="">Whole Week / Shared</option>
                      <option value="1">Day 1</option>
                      <option value="2">Day 2</option>
                      <option value="3">Day 3</option>
                      <option value="4">Day 4</option>
                      <option value="5">Day 5</option>
                    </select>

                    <p className="text-xs leading-5 text-slate-500">
                      Choose a day to place this assignment directly into that
                      day&apos;s teaching view. Leave it shared if students may
                      complete it anytime during the week.
                    </p>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">
                      Due Date / Check-In
                    </span>
                    <input
                      type="datetime-local"
                      value={assignmentForm.dueAt}
                      onChange={(event) =>
                        setAssignmentForm((current) => ({
                          ...current,
                          dueAt: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    />
                  </label>
                </div>

                <label className="mt-4 block space-y-2">
                  <span className="text-sm font-bold text-slate-700">
                    Student Instructions
                  </span>
                  <textarea
                    value={assignmentForm.instructions}
                    onChange={(event) =>
                      setAssignmentForm((current) => ({
                        ...current,
                        instructions: event.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    placeholder="What should the student complete?"
                  />
                </label>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">
                      Requirement
                    </span>
                    <select
                      value={assignmentForm.requirement}
                      onChange={(event) =>
                        setAssignmentForm((current) => ({
                          ...current,
                          requirement: event.target.value as RequirementValue,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    >
                      <option value="REQUIRED">Required</option>
                      <option value="OPTIONAL">Optional</option>
                      <option value="HIDDEN">Hidden</option>
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">
                      Estimated Minutes
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={assignmentForm.estimatedMinutes}
                      onChange={(event) =>
                        setAssignmentForm((current) => ({
                          ...current,
                          estimatedMinutes: Number(event.target.value) || 20,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    />
                  </label>
                </div>

                <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-slate-700">
                  {[
                    ["allowOnline", "Online"],
                    ["allowPrint", "Printable"],
                    ["allowUpload", "File Upload"],
                    ["portfolioEligible", "Portfolio Eligible"],
                  ].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          assignmentForm[
                            key as keyof typeof assignmentForm
                          ] as boolean
                        }
                        onChange={(event) =>
                          setAssignmentForm((current) => ({
                            ...current,
                            [key]: event.target.checked,
                          }))
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={saveAssignment}
                  disabled={
                    saving ||
                    !assignmentForm.title.trim() ||
                    !assignmentForm.instructions.trim()
                  }
                  className="mt-5 rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Assignment"}
                </button>
              </div>

              {data.assignments.length > 0 ? (
                <div className="space-y-3">
                  {data.assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="rounded-2xl border border-slate-200 p-5"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="font-black text-[#0D1B3D]">
                            {assignment.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {assignment.instructions}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#EAFBFB] px-3 py-1 text-xs font-black text-[#007C7C]">
                            {assignment.dayNumber
                              ? `DAY ${assignment.dayNumber}`
                              : "WHOLE WEEK"}
                          </span>

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                            {assignment.requirement}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                        <span>{assignment.estimatedMinutes} min</span>

                        {assignment.dueAt && (
                          <span>
                            • Due{" "}
                            {new Date(assignment.dueAt).toLocaleDateString()}
                          </span>
                        )}

                        {assignment.portfolioEligible && (
                          <span>• Portfolio Eligible</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState text="No database assignments have been added to this lesson yet." />
              )}
            </div>
          )}

          {activeTab === "resources" && (
            <div
              id="future-ready-resource-hub"
              className="scroll-mt-6 space-y-5"
            >
              <ContentCard title="Lesson Materials">
                <p>
                  Facilitator guides, student workbooks, slides, handouts,
                  activities, role-play cards, case scenarios, videos, links,
                  and printable materials live with this lesson and cohort.
                </p>
              </ContentCard>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-black text-[#0D1B3D]">
                  + Add Lesson Resource
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Add a workbook, slide deck, handout, video, link, image, or
                  other lesson material.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">
                      Resource Title
                    </span>
                    <input
                      value={resourceForm.title}
                      onChange={(event) =>
                        setResourceForm((current) => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                      placeholder="Example: Week 1 Student Workbook"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">
                      Resource Type
                    </span>
                    <select
                      value={resourceForm.kind}
                      onChange={(event) =>
                        setResourceForm((current) => ({
                          ...current,
                          kind: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    >
                      <option value="PDF">PDF</option>
                      <option value="DOCX">Word / DOCX</option>
                      <option value="PPTX">Slides / PPTX</option>
                      <option value="VIDEO">Video</option>
                      <option value="LINK">Link</option>
                      <option value="IMAGE">Image</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </label>
                </div>

                <div className="mt-4">
                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-slate-700">
                      Teaching Day
                    </span>

                    <select
                      value={resourceForm.dayNumber ?? ""}
                      onChange={(event) =>
                        setResourceForm((current) => ({
                          ...current,
                          dayNumber: event.target.value
                            ? Number(event.target.value)
                            : null,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    >
                      <option value="">Whole Week / Shared</option>
                      <option value="1">Day 1</option>
                      <option value="2">Day 2</option>
                      <option value="3">Day 3</option>
                      <option value="4">Day 4</option>
                      <option value="5">Day 5</option>
                    </select>

                    <p className="text-xs leading-5 text-slate-500">
                      Assign this worksheet, printable, video, link, slide deck,
                      or other resource to a specific class day, or leave it
                      available for the entire week.
                    </p>
                  </label>
                </div>

                <label className="mt-4 block space-y-2">
                  <span className="text-sm font-bold text-slate-700">
                    Description
                  </span>
                  <textarea
                    value={resourceForm.description}
                    onChange={(event) =>
                      setResourceForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    placeholder="How should this material be used?"
                  />
                </label>

                <label className="mt-4 block space-y-2">
                  <span className="text-sm font-bold text-slate-700">
                    Resource URL
                  </span>
                  <input
                    value={resourceForm.url}
                    onChange={(event) =>
                      setResourceForm((current) => ({
                        ...current,
                        url: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    placeholder="https://..."
                  />
                </label>

                <div className="mt-5 flex flex-wrap gap-5 text-sm font-bold text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={resourceForm.required}
                      onChange={(event) =>
                        setResourceForm((current) => ({
                          ...current,
                          required: event.target.checked,
                        }))
                      }
                    />
                    Required
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={resourceForm.visibleToStudent}
                      onChange={(event) =>
                        setResourceForm((current) => ({
                          ...current,
                          visibleToStudent: event.target.checked,
                        }))
                      }
                    />
                    Visible to Students
                  </label>
                </div>

                <button
                  type="button"
                  onClick={createResource}
                  disabled={saving || !resourceForm.title.trim()}
                  className="mt-5 rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Resource"}
                </button>
              </div>

              {data.resources.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {data.resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="rounded-2xl border border-slate-200 p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-[#4B2265]">
                            {resource.kind}
                          </p>

                          <h3 className="mt-2 font-black text-[#0D1B3D]">
                            {resource.title}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#EAFBFB] px-3 py-1 text-xs font-black text-[#007C7C]">
                            {resource.dayNumber
                              ? `DAY ${resource.dayNumber}`
                              : "WHOLE WEEK"}
                          </span>

                          {resource.required && (
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                              REQUIRED
                            </span>
                          )}
                        </div>
                      </div>

                      {resource.description && (
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {resource.description}
                        </p>
                      )}

                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex text-sm font-black text-[#24569B]"
                        >
                          Open Resource →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState text="No cohort resources have been added to this lesson yet." />
              )}
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-black text-[#0D1B3D]">
                  + Add Calendar Task / Check-In
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Build the teaching week with class activities, due dates,
                  check-ins, guest speakers, field experiences, and follow-up
                  tasks.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">
                      Day
                    </span>
                    <select
                      value={taskForm.dayNumber}
                      onChange={(event) =>
                        setTaskForm((current) => ({
                          ...current,
                          dayNumber: Number(event.target.value),
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <option key={day} value={day}>
                          Day {day}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">
                      Task Type
                    </span>
                    <select
                      value={taskForm.taskType}
                      onChange={(event) =>
                        setTaskForm((current) => ({
                          ...current,
                          taskType: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    >
                      <option>Class Task</option>
                      <option>Assignment</option>
                      <option>Check-In</option>
                      <option>Discussion</option>
                      <option>Reflection</option>
                      <option>Guest Speaker</option>
                      <option>Field Experience</option>
                      <option>Project</option>
                      <option>Due Date</option>
                      <option>Follow-Up</option>
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">
                      Duration
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={taskForm.durationMinutes}
                      onChange={(event) =>
                        setTaskForm((current) => ({
                          ...current,
                          durationMinutes: Number(event.target.value) || 10,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    />
                  </label>
                </div>

                <label className="mt-4 block space-y-2">
                  <span className="text-sm font-bold text-slate-700">
                    Task / Check-In Title
                  </span>
                  <input
                    value={taskForm.title}
                    onChange={(event) =>
                      setTaskForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    placeholder="Example: Career Map Check-In"
                  />
                </label>

                <label className="mt-4 block space-y-2">
                  <span className="text-sm font-bold text-slate-700">
                    Instructions / Notes
                  </span>
                  <textarea
                    value={taskForm.instructions}
                    onChange={(event) =>
                      setTaskForm((current) => ({
                        ...current,
                        instructions: event.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    placeholder="What happens during this part of the week?"
                  />
                </label>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-slate-700">
                      Requirement
                    </span>
                    <select
                      value={taskForm.requirement}
                      onChange={(event) =>
                        setTaskForm((current) => ({
                          ...current,
                          requirement: event.target.value as RequirementValue,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    >
                      <option value="REQUIRED">Required</option>
                      <option value="OPTIONAL">Optional</option>
                      <option value="HIDDEN">Hidden</option>
                    </select>
                  </label>

                  <label className="flex items-center gap-2 pt-8 text-sm font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={taskForm.visibleToStudent}
                      onChange={(event) =>
                        setTaskForm((current) => ({
                          ...current,
                          visibleToStudent: event.target.checked,
                        }))
                      }
                    />
                    Visible to Students
                  </label>
                </div>

                <button
                  type="button"
                  onClick={createTask}
                  disabled={
                    saving ||
                    !taskForm.title.trim() ||
                    !taskForm.instructions.trim()
                  }
                  className="mt-5 rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Calendar Task"}
                </button>
              </div>

              <ContentCard
                title={`Week ${lesson.weekNumber} Teaching Calendar`}
              >
                {data.planTasks.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {data.planTasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-xl border border-slate-200 p-4"
                      >
                        <p className="text-xs font-black uppercase text-[#4B2265]">
                          Day {task.dayNumber} • {task.taskType}
                        </p>

                        <p className="mt-2 font-black text-[#0D1B3D]">
                          {task.title}
                        </p>

                        <p className="mt-2 text-sm text-slate-600">
                          {task.instructions}
                        </p>

                        <p className="mt-3 text-xs font-bold text-slate-500">
                          {task.durationMinutes} minutes • {task.requirement}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : dailyLessons.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {dailyLessons.map((day) => (
                      <div
                        key={`calendar-${day.day}-${day.title}`}
                        className="rounded-xl border border-slate-200 p-4"
                      >
                        <p className="text-xs font-black uppercase text-[#4B2265]">
                          {day.day}
                        </p>

                        <p className="mt-2 font-black text-[#0D1B3D]">
                          {day.title}
                        </p>

                        <p className="mt-2 text-sm text-slate-600">
                          {day.activity}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>
                    No scheduled cohort tasks have been added for this week yet.
                  </p>
                )}
              </ContentCard>
            </div>
          )}

          {activeTab === "release" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-[#4B2265]">
                      Student Release
                    </p>

                    <h3 className="mt-2 text-xl font-black text-[#0D1B3D]">
                      Week {lesson.weekNumber}: {lesson.title}
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm text-slate-600">
                      Facilitators and administrators control when this lesson
                      and its individual components become visible to students.
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-black ${
                      delivery?.releasedToStudents
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {delivery?.releasedToStudents ? "Open" : "Closed"}
                  </span>
                </div>
              </div>

              {!delivery ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-800">
                  This lesson does not have a delivery setting for Ambassador
                  2026. Release controls are unavailable until that record
                  exists.
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border-2 border-[#0D1B3D] p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-black text-[#0D1B3D]">
                          Master Lesson Release
                        </h3>

                        <p className="mt-1 text-sm text-slate-600">
                          This controls whether the lesson can appear to
                          students.
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          patchDelivery(
                            {
                              releasedToStudents: !delivery.releasedToStudents,
                            },
                            delivery.releasedToStudents
                              ? `Week ${lesson.weekNumber} closed to students.`
                              : `Week ${lesson.weekNumber} opened to students.`,
                          )
                        }
                        className={`rounded-xl px-5 py-3 text-sm font-black ${
                          delivery.releasedToStudents
                            ? "bg-red-100 text-red-800"
                            : "bg-emerald-600 text-white"
                        } disabled:opacity-50`}
                      >
                        {saving
                          ? "Saving..."
                          : delivery.releasedToStudents
                            ? "Close Week"
                            : "Open Week"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {requirementControls.map(({ field, label }) => (
                      <div
                        key={field}
                        className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <span className="font-bold text-[#0D1B3D]">
                            {label}
                          </span>

                          <p className="mt-1 text-xs text-slate-500">
                            Student-facing requirement for this cohort.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {requirementOptions.map((option) => (
                            <button
                              key={option}
                              type="button"
                              disabled={saving}
                              onClick={() =>
                                patchDelivery(
                                  {
                                    requirementField: field,
                                    requirementValue: option,
                                  },
                                  `${label} set to ${option.toLowerCase()}.`,
                                )
                              }
                              className={`rounded-lg border px-3 py-2 text-xs font-black ${
                                delivery[field] === option
                                  ? "border-[#F2B705] bg-[#FFF7D6] text-[#0D1B3D]"
                                  : "border-slate-200 bg-white text-slate-500"
                              } disabled:opacity-50`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <span className="font-bold text-[#0D1B3D]">Badge</span>

                      <p className="mt-1 text-xs text-slate-500">
                        Controls whether the lesson badge is enabled.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        patchDelivery(
                          {
                            badgeEnabled: !delivery.badgeEnabled,
                          },
                          delivery.badgeEnabled
                            ? "Lesson badge disabled."
                            : "Lesson badge enabled.",
                        )
                      }
                      className={`rounded-xl px-4 py-2 text-sm font-black ${
                        delivery.badgeEnabled
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      } disabled:opacity-50`}
                    >
                      {delivery.badgeEnabled ? "ON" : "OFF"}
                    </button>
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                    <strong>Release safeguard:</strong> Keep lessons unreleased
                    while we are testing the production student-view
                    permissions.
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={previousWeek}
            disabled={selectedWeek === 1 || loading}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-[#0D1B3D] disabled:opacity-40"
          >
            ← Previous Week
          </button>

          <p className="text-center text-sm font-bold text-slate-500">
            Week {selectedWeek} of 16
          </p>

          <button
            type="button"
            onClick={nextWeek}
            disabled={selectedWeek === 16 || loading}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-[#0D1B3D] disabled:opacity-40"
          >
            Next Week →
          </button>
        </div>

        <div className="mt-4 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={closeCurrentWeek}
            disabled={closingWeek || selectedWeek === 15}
            className="w-full rounded-xl bg-[#0D1B3D] px-5 py-4 text-sm font-black text-white shadow-sm transition hover:bg-[#162a58] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {selectedWeek === 15
              ? "THANKSGIVING · NO CLASS"
              : closingWeek
                ? "Closing Week..."
                : selectedWeek === 16
                  ? "Finish Week 16"
                  : `Finish Week ${selectedWeek} & Continue →`}
          </button>

          <p className="mt-2 text-center text-xs leading-5 text-slate-500">
            Finishing the week records facilitator progress only. Student access is controlled separately above. Assignments, reflections, uploads, portfolio evidence and prior work remain unchanged.
          </p>

          {weekProgressError ? (
            <p className="mt-2 text-center text-xs font-bold text-red-700">
              {weekProgressError}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}



function DailyWorkspaceCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#4B2265]">
        {eyebrow}
      </p>

      <h4 className="mt-2 text-lg font-black text-[#0D1B3D]">
        {title}
      </h4>

      <div className="mt-4 text-sm leading-6 text-slate-600">
        {children}
      </div>
    </article>
  );
}


function DailyPilotCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#4B2265]">
        {eyebrow}
      </p>

      <h4 className="mt-2 text-lg font-black text-[#0D1B3D]">
        {title}
      </h4>

      <div className="mt-4 text-sm leading-6 text-slate-600">
        {children}
      </div>
    </article>
  );
}

function TeacherGuideSection({
  title,
  description,
  children,
  defaultOpen = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <summary className="cursor-pointer list-none px-6 py-5 transition hover:bg-slate-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-[#0D1B3D]">
              {title}
            </h3>

            {description && (
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {description}
              </p>
            )}
          </div>

          <span className="shrink-0 rounded-full bg-[#F2B705] px-3 py-1 text-xs font-black text-[#0D1B3D]">
            OPEN
          </span>
        </div>
      </summary>

      <div className="border-t border-slate-200 bg-slate-50/40 p-6">
        {children}
      </div>
    </details>
  );
}

function ContentCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-black text-[#0D1B3D]">{title}</h3>

      <div className="mt-3 leading-7 text-slate-600">{children}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
      {text}
    </div>
  );
}
