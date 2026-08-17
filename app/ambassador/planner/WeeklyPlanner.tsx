"use client";


import { useEffect, useMemo, useState } from "react";

import { curriculum } from "@/content/curriculum";

import {
  AI_ACTIVITY_OPTIONS,
  generateActivityOptions,
} from "@/content/ai-lesson-generator";

import type {
  AIActivityType,
  AIGeneratedActivity,
} from "@/content/ai-activity-types";

import {
  FUTURE_READY_CULTURE_PROMISE,
  FUTURE_READY_TAKEAWAYS,
  FUTURE_READY_TRADITIONS,
} from "@/content/future-ready-culture";

type WeekResource = {
  title: string;
  audience: "Facilitator" | "Student";
  format: "PDF" | "DOCX" | "PPTX";
  fileSuffix: string;
  description: string;
};

const WEEK_RESOURCES: WeekResource[] = [
  {
    title: "Facilitator Guide",
    audience: "Facilitator",
    format: "PDF",
    fileSuffix: "Facilitator-Guide.pdf",
    description:
      "Print-ready weekly lesson plan with objectives, scripts, timing, activities, reflection, and assessment guidance.",
  },
  {
    title: "Editable Facilitator Guide",
    audience: "Facilitator",
    format: "DOCX",
    fileSuffix: "Facilitator-Guide.docx",
    description:
      "Editable licensed facilitator copy for preparation and approved delivery notes.",
  },
  {
    title: "Classroom Slides",
    audience: "Facilitator",
    format: "PPTX",
    fileSuffix: "Slides.pptx",
    description:
      "Classroom presentation for the week's Future Ready™ learning experience.",
  },
  {
    title: "Activity / Role Play / Improv / Case Kit",
    audience: "Facilitator",
    format: "PDF",
    fileSuffix: "Activity-Kit.pdf",
    description:
      "Print-ready active-learning exercises, role plays, improv activities, case scenarios, and evidence pages.",
  },
  {
    title: "Editable Activity Kit",
    audience: "Facilitator",
    format: "DOCX",
    fileSuffix: "Activity-Kit.docx",
    description:
      "Editable licensed activity kit for approved classroom delivery.",
  },
  {
    title: "Assessment & Rubric",
    audience: "Facilitator",
    format: "PDF",
    fileSuffix: "Assessment-Rubric.pdf",
    description:
      "Print-ready performance rubric and weekly assessment criteria.",
  },
  {
    title: "Editable Assessment & Rubric",
    audience: "Facilitator",
    format: "DOCX",
    fileSuffix: "Assessment-Rubric.docx",
    description: "Editable licensed assessment and rubric copy.",
  },
  {
    title: "Student Workbook",
    audience: "Student",
    format: "PDF",
    fileSuffix: "Student-Workbook.pdf",
    description:
      "Print-ready student workbook with activities, reflections, and portfolio work.",
  },
  {
    title: "Editable Student Workbook",
    audience: "Student",
    format: "DOCX",
    fileSuffix: "Student-Workbook.docx",
    description: "Editable student workbook for approved digital completion.",
  },
  {
    title: "Portfolio Artifact",
    audience: "Student",
    format: "PDF",
    fileSuffix: "Portfolio-Artifact.pdf",
    description:
      "Print-ready weekly evidence template for the Future Ready™ Passport and portfolio.",
  },
  {
    title: "Editable Portfolio Artifact",
    audience: "Student",
    format: "DOCX",
    fileSuffix: "Portfolio-Artifact.docx",
    description: "Editable weekly portfolio evidence template.",
  },
];

type PlannerTask = {
  id: string;
  taskType: string;
  title: string;
  instructions: string;
  dayNumber: number;
  durationMinutes: number;
  requirement: "REQUIRED" | "OPTIONAL" | "HIDDEN";
  visibleToStudent: boolean;
  visibleToFacilitator: boolean;
  sortOrder: number;
  createdById: string | null;
};

type CohortExperience = {
  id: string;
  cohortId: string;
  lessonId: string | null;
  weekNumber: number;
  dayNumber: number;

  experienceType: string;
  title: string;
  description: string | null;

  eventDate: string | null;
  startTime: string | null;
  endTime: string | null;
  departureTime: string | null;
  returnTime: string | null;

  siteName: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;

  contactName: string | null;
  contactTitle: string | null;
  contactEmail: string | null;
  contactPhone: string | null;

  transportationNotes: string | null;
  parkingNotes: string | null;

  requiredAttire: string | null;
  accommodations: string | null;
  foodNotes: string | null;

  waiverRequired: boolean;
  waiverNotes: string | null;

  capacity: number | null;
  chaperoneNotes: string | null;

  learningObjective: string | null;
  careerConnection: string | null;

  preTripPreparation: string | null;
  studentQuestions: string | null;
  postTripReflection: string | null;

  studentVisibleNotes: string | null;
  facilitatorNotes: string | null;

  visibleToStudent: boolean;
  status: string;
};

type ExperienceDraft = {
  experienceType: string;
  title: string;
  description: string;

  eventDate: string;
  startTime: string;
  endTime: string;
  departureTime: string;
  returnTime: string;

  siteName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;

  contactName: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;

  transportationNotes: string;
  parkingNotes: string;

  requiredAttire: string;
  accommodations: string;
  foodNotes: string;

  waiverRequired: boolean;
  waiverNotes: string;

  capacity: string;
  chaperoneNotes: string;

  learningObjective: string;
  careerConnection: string;

  preTripPreparation: string;
  studentQuestions: string;
  postTripReflection: string;

  studentVisibleNotes: string;
  facilitatorNotes: string;

  visibleToStudent: boolean;
};

function createEmptyExperience(): ExperienceDraft {
  return {
    experienceType: "FIELD_TRIP",
    title: "",
    description: "",

    eventDate: "",
    startTime: "",
    endTime: "",
    departureTime: "",
    returnTime: "",

    siteName: "",
    address1: "",
    address2: "",
    city: "",
    state: "NC",
    postalCode: "",

    contactName: "",
    contactTitle: "",
    contactEmail: "",
    contactPhone: "",

    transportationNotes: "",
    parkingNotes: "",

    requiredAttire: "",
    accommodations: "",
    foodNotes: "",

    waiverRequired: false,
    waiverNotes: "",

    capacity: "",
    chaperoneNotes: "",

    learningObjective: "",
    careerConnection: "",

    preTripPreparation: "",
    studentQuestions: "",
    postTripReflection: "",

    studentVisibleNotes: "",
    facilitatorNotes: "",

    visibleToStudent: true,
  };
}

type PlannerData = {
  cohort: {
    id: string;
    code: string;
    name: string;
  };
  lesson: {
    id: string;
    title: string;
    summary: string | null;
    weekNumber: number;
    estimatedMinutes: number;
  };
  tasks: PlannerTask[];
};

type Props = {
  defaultCohortCode: string;
  role: string;
};

const days = [1, 2, 3, 4, 5];

const dayLabels: Record<number, string> = {
  1: "Day 1",
  2: "Day 2",
  3: "Day 3",
  4: "Day 4",
  5: "Day 5",
};

export default function WeeklyPlanner({ defaultCohortCode, role }: Props) {
  const [cohortCode, setCohortCode] = useState(defaultCohortCode);

  const [week, setWeek] = useState(1);
  const [dayNumber, setDayNumber] = useState(1);

  const [data, setData] = useState<PlannerData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [customTitle, setCustomTitle] = useState("");

  const [customInstructions, setCustomInstructions] = useState("");

  const [customMinutes, setCustomMinutes] = useState(10);

  const [selectedAIType, setSelectedAIType] =
    useState<AIActivityType>("Role Play");

  const [generatedActivity, setGeneratedActivity] =
    useState<AIGeneratedActivity | null>(null);

  const [generationVariation, setGenerationVariation] = useState(0);

  const [selectedTakeaway, setSelectedTakeaway] = useState<string>(
    FUTURE_READY_TAKEAWAYS[0],
  );

  const [experiences, setExperiences] = useState<CohortExperience[]>([]);

  const [experienceDraft, setExperienceDraft] = useState<ExperienceDraft>(
    createEmptyExperience(),
  );

  const [experienceSaving, setExperienceSaving] = useState(false);

  const [showExperienceForm, setShowExperienceForm] = useState(false);

  async function loadExperiences() {
    try {
      const response = await fetch(
        `/api/ambassador/experiences?cohortCode=${encodeURIComponent(
          cohortCode,
        )}&week=${week}`,
        {
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to load experiences.");
      }

      setExperiences(
        Array.isArray(result.experiences) ? result.experiences : [],
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load experiences.",
      );
    }
  }

  async function loadPlanner() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/ambassador/planner?cohortCode=${encodeURIComponent(
          cohortCode,
        )}&week=${week}`,
        {
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to load planner.");
      }

      setData(result);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load planner.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlanner();
    loadExperiences();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week, cohortCode]);

  const dayTasks = useMemo(() => {
    if (!data) return [];

    return data.tasks
      .filter((task) => task.dayNumber === dayNumber)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [data, dayNumber]);

  const dayExperiences = useMemo(() => {
    return experiences.filter(
      (experience) => experience.dayNumber === dayNumber,
    );
  }, [experiences, dayNumber]);

  const totalMinutes = dayTasks.reduce(
    (sum, task) => sum + task.durationMinutes,
    0,
  );

  const hasTakeaway = dayTasks.some((task) => task.taskType === "TAKEAWAY");

  const lesson = curriculum.find((item) => item.week === week) ?? null;

  const weekCode = String(week).padStart(2, "0");

  const materialsAvailable = week >= 1 && week <= 4;

  function resourceHref(resource: WeekResource) {
    const filename = `Future-Ready-Week-${weekCode}-${resource.fileSuffix}`;

    return `/api/ambassador/download/${weekCode}/${filename}`;
  }

  const facilitatorResources = WEEK_RESOURCES.filter(
    (resource) => resource.audience === "Facilitator",
  );

  const studentResources = WEEK_RESOURCES.filter(
    (resource) => resource.audience === "Student",
  );

  async function createTask(input: {
    taskType: string;
    title: string;
    instructions: string;
    durationMinutes: number;
    requirement?: "REQUIRED" | "OPTIONAL";
  }) {
    setError(null);

    const response = await fetch("/api/ambassador/planner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cohortCode,
        week,
        dayNumber,
        taskType: input.taskType,
        title: input.title,
        instructions: input.instructions,
        durationMinutes: input.durationMinutes,
        requirement: input.requirement ?? "OPTIONAL",
        visibleToStudent: true,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error ?? "Unable to add task.");
    }

    await loadPlanner();
  }

  async function addCustomTask() {
    if (!customTitle.trim()) return;

    try {
      await createTask({
        taskType: "CUSTOM",
        title: customTitle,
        instructions: customInstructions,
        durationMinutes: customMinutes,
      });

      setCustomTitle("");
      setCustomInstructions("");
      setCustomMinutes(10);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to add task.",
      );
    }
  }

  async function addTradition(traditionId: string) {
    const tradition = FUTURE_READY_TRADITIONS.find(
      (item) => item.id === traditionId,
    );

    if (!tradition) return;

    try {
      await createTask({
        taskType: `TRADITION:${tradition.id}`,
        title: `${tradition.emoji} ${tradition.title}`,
        instructions: tradition.description,
        durationMinutes: tradition.defaultMinutes,
        requirement: "OPTIONAL",
      });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to add tradition.",
      );
    }
  }

  function generateAI() {
    if (!lesson) return;

    const variation = generationVariation + 1;

    const result = generateActivityOptions({
      week,
      day: dayLabels[dayNumber],
      topic: lesson.title,
      objective: lesson.objective,
      activityType: selectedAIType,
      audience: "Future Ready™ students",
      variation,

      existingTaskTitles: dayTasks.map((task) => task.title),

      availableMinutes: Math.max(15, Math.min(35, 50 - totalMinutes)),

      classSize: 20,
    });

    setGenerationVariation(variation);

    setGeneratedActivity(result[0] ?? null);
  }

  async function addAIToPlan() {
    if (!generatedActivity) return;

    const list = (items: string[]) =>
      items.map((item, index) => `${index + 1}. ${item}`).join("\n");

    const bullets = (items: string[]) =>
      items.map((item) => `• ${item}`).join("\n");

    const roles = generatedActivity.studentRoles
      .map((role) => `• ${role.role}: ${role.responsibility}`)
      .join("\n");

    const instructions = [
      "FUTURE READY™ CLASSROOM ACTIVITY",
      "",
      `Objective: ${generatedActivity.learningObjective}`,
      "",
      `Why This Matters: ${generatedActivity.whyThisMatters}`,
      "",
      "FACILITATOR BACKGROUND",
      generatedActivity.facilitatorBackground,
      "",
      "CLASSROOM SETUP",
      generatedActivity.classroomSetup,
      "",
      "MATERIALS",
      bullets(generatedActivity.materials),
      "",
      "STUDENT ROLES",
      roles,
      "",
      "TEACHING POINTS",
      bullets(generatedActivity.teachingPoints),
      "",
      "OPENING CONVERSATION",
      bullets(generatedActivity.openingConversation),
      "",
      "FACILITATOR SCRIPT",
      list(generatedActivity.facilitatorScript),
      "",
      "STEP-BY-STEP ACTIVITY",
      list(generatedActivity.stepByStepInstructions),
      "",
      "QUESTIONS TO ASK",
      bullets(generatedActivity.facilitatorQuestions),
      "",
      "WHAT TO WATCH FOR",
      bullets(generatedActivity.observationGuide),
      "",
      "DEBRIEF",
      list(generatedActivity.debriefGuide),
      "",
      "STUDENT REFLECTION",
      bullets(generatedActivity.reflectionPrompts),
      "",
      "ASSESSMENT / RUBRIC",
      bullets(generatedActivity.assessmentRubric),
      "",
      `Portfolio Evidence: ${generatedActivity.portfolioEvidence}`,
      "",
      `Capstone Connection: ${generatedActivity.capstoneConnection}`,
    ].join("\n");

    try {
      await createTask({
        taskType: `AI:${generatedActivity.activityType}`,
        title: generatedActivity.title,
        instructions,
        durationMinutes: 15,
        requirement: "OPTIONAL",
      });

      setGeneratedActivity(null);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to add AI activity.",
      );
    }
  }

  async function addTakeaway() {
    try {
      await createTask({
        taskType: "TAKEAWAY",
        title: "🎯 Today's Tangible Takeaway",
        instructions: selectedTakeaway,
        durationMinutes: 5,
        requirement: "REQUIRED",
      });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to add takeaway.",
      );
    }
  }

  function updateExperienceField<K extends keyof ExperienceDraft>(
    field: K,
    value: ExperienceDraft[K],
  ) {
    setExperienceDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveExperience() {
    if (!experienceDraft.title.trim()) {
      setError("Give the field trip or experience a title.");
      return;
    }

    setExperienceSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/ambassador/experiences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cohortCode,
          weekNumber: week,
          dayNumber,
          ...experienceDraft,
          capacity: experienceDraft.capacity
            ? Number(experienceDraft.capacity)
            : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to save experience.");
      }

      setExperienceDraft(createEmptyExperience());

      setShowExperienceForm(false);

      await loadExperiences();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to save experience.",
      );
    } finally {
      setExperienceSaving(false);
    }
  }

  async function removeExperience(experienceId: string) {
    if (
      !window.confirm(
        "Remove this field trip or experience from the delivery plan?",
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/ambassador/experiences", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cohortCode,
          experienceId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to remove experience.");
      }

      await loadExperiences();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to remove experience.",
      );
    }
  }

  async function removeTask(taskId: string) {
    if (!window.confirm("Remove this item from this week's agenda?")) {
      return;
    }

    const response = await fetch("/api/ambassador/planner", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cohortCode,
        taskId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? "Unable to remove task.");
      return;
    }

    await loadPlanner();
  }

  async function reorderTask(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= dayTasks.length) {
      return;
    }

    const reordered = [...dayTasks];

    const current = reordered[index];

    reordered[index] = reordered[nextIndex];

    reordered[nextIndex] = current;

    const response = await fetch("/api/ambassador/planner", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cohortCode,
        action: "reorder",
        orderedIds: reordered.map((task) => task.id),
      }),
    });

    if (!response.ok) {
      const result = await response.json();

      setError(result.error ?? "Unable to reorder agenda.");

      return;
    }

    await loadPlanner();
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-5 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <section className="rounded-[32px] bg-[#0D1B3D] p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F2B705]">
                Future Ready™ Weekly Planning Studio
              </p>

              <h1 className="mt-3 text-4xl font-black md:text-5xl">
                Plan the experience, not just the lesson.
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
                {FUTURE_READY_CULTURE_PROMISE}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 text-sm font-bold">
              Access: {role}
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-3">
          <label>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Cohort
            </span>

            <input
              value={cohortCode}
              onChange={(event) => setCohortCode(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-bold"
            />
          </label>

          <label>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Week
            </span>

            <select
              value={week}
              onChange={(event) => setWeek(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-bold"
            >
              {Array.from({ length: 16 }, (_, index) => index + 1).map(
                (item) => (
                  <option key={item} value={item}>
                    Week {item}
                  </option>
                ),
              )}
            </select>
          </label>

          <label>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Class Day
            </span>

            <select
              value={dayNumber}
              onChange={(event) => setDayNumber(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-bold"
            >
              {days.map((day) => (
                <option key={day} value={day}>
                  {dayLabels[day]}
                </option>
              ))}
            </select>
          </label>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <section className="rounded-3xl bg-white p-8 shadow-sm">
            Loading weekly plan...
          </section>
        ) : data ? (
          <>
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
                Week {week}
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                {data.lesson.title}
              </h2>

              <p className="mt-3 text-slate-600">
                {data.lesson.summary ?? lesson?.objective}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">
                  {dayLabels[dayNumber]}
                </span>

                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">
                  {totalMinutes} planned minutes
                </span>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-black ${
                    hasTakeaway
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {hasTakeaway
                    ? "✓ Tangible takeaway included"
                    : "⚠ Tangible takeaway missing"}
                </span>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
                    Protected Core Curriculum
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
                    Core Future Ready™ Lesson
                  </h2>

                  <p className="mt-2 text-sm font-bold text-slate-500">
                    This is the master lesson foundation. Your delivery plan
                    below can be customized without changing it.
                  </p>
                </div>

                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-800">
                  CORE • PROTECTED
                </span>
              </div>

              {lesson ? (
                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                  <article className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Objective
                    </p>
                    <p className="mt-2 leading-7 text-slate-700">
                      {lesson.objective}
                    </p>
                  </article>

                  <article className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Workplace Connection
                    </p>
                    <p className="mt-2 leading-7 text-slate-700">
                      {lesson.workplaceConnection}
                    </p>
                  </article>

                  <article className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Core Student Activity
                    </p>
                    <p className="mt-2 leading-7 text-slate-700">
                      {lesson.studentActivity}
                    </p>
                  </article>

                  <article className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Facilitator Guide
                    </p>
                    <p className="mt-2 leading-7 text-slate-700">
                      {lesson.facilitatorGuide}
                    </p>
                  </article>

                  <article className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Discussion Questions
                    </p>

                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                      {lesson.discussionQuestions.map((question) => (
                        <li key={question}>{question}</li>
                      ))}
                    </ul>
                  </article>

                  <article className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Skills + Evidence
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {lesson.skillsEarned.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#0D1B3D]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 text-sm text-slate-700">
                      <strong>Portfolio:</strong> {lesson.portfolioEvidence}
                    </p>

                    <p className="mt-2 text-sm text-slate-700">
                      <strong>Badge:</strong> {lesson.badgeEarned}
                    </p>
                  </article>
                </div>
              ) : (
                <p className="mt-5 text-slate-500">
                  No master curriculum lesson is currently mapped to Week {week}
                  .
                </p>
              )}
            </section>

            <section className="rounded-3xl border-2 border-[#0D1B3D] bg-white p-7 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
                Cohort Delivery Layer
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                Today's Delivery Plan
              </h2>

              <p className="mt-3 max-w-4xl leading-7 text-slate-600">
                Customize {dayLabels[dayNumber]} for this cohort. Add
                traditions, AI activities, field experiences, guest
                professionals, tangible takeaways, and your own agenda items
                without changing the protected Future Ready™ curriculum above.
              </p>
            </section>

            <div className="grid gap-7 xl:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-[#725500]">
                      Student Experience
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
                      {dayLabels[dayNumber]} Agenda
                    </h2>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {dayTasks.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-500">
                      This day is open. Add a tradition, AI activity, takeaway,
                      or custom task.
                    </div>
                  ) : null}

                  {dayTasks.map((task, index) => (
                    <article
                      key={task.id}
                      className="rounded-2xl border border-slate-200 p-5"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">
                              {task.taskType}
                            </span>

                            <span className="rounded-full bg-[#FFF9DF] px-3 py-1 text-xs font-black text-[#725500]">
                              {task.durationMinutes} min
                            </span>
                          </div>

                          <h3 className="mt-3 text-xl font-black text-[#0D1B3D]">
                            {task.title}
                          </h3>

                          {task.instructions ? (
                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                              {task.instructions}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => reorderTask(index, -1)}
                            disabled={index === 0}
                            className="rounded-lg border px-3 py-2 font-black disabled:opacity-30"
                          >
                            ↑
                          </button>

                          <button
                            type="button"
                            onClick={() => reorderTask(index, 1)}
                            disabled={index === dayTasks.length - 1}
                            className="rounded-lg border px-3 py-2 font-black disabled:opacity-30"
                          >
                            ↓
                          </button>

                          <button
                            type="button"
                            onClick={() => removeTask(task.id)}
                            className="rounded-lg border border-red-200 px-3 py-2 font-black text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <div className="space-y-7">
                <section className="rounded-3xl border-2 border-[#F2B705] bg-[#FFF9DF] p-6">
                  <p className="text-xs font-black uppercase tracking-wider text-[#725500]">
                    Future Ready™ Signature
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
                    Tangible Takeaway
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    Every student leaves every session with something they can
                    use.
                  </p>

                  <select
                    value={selectedTakeaway}
                    onChange={(event) =>
                      setSelectedTakeaway(event.target.value)
                    }
                    className="mt-4 w-full rounded-xl border border-[#F2B705] bg-white px-4 py-3 font-bold"
                  >
                    {FUTURE_READY_TAKEAWAYS.map((takeaway) => (
                      <option key={takeaway} value={takeaway}>
                        {takeaway}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={addTakeaway}
                    className="mt-4 w-full rounded-xl bg-[#0D1B3D] px-5 py-3 font-black text-white"
                  >
                    + Add Takeaway to Agenda
                  </button>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-black text-[#0D1B3D]">
                    + Add Your Own
                  </h2>

                  <input
                    value={customTitle}
                    onChange={(event) => setCustomTitle(event.target.value)}
                    placeholder="Agenda item"
                    className="mt-4 w-full rounded-xl border px-4 py-3"
                  />

                  <textarea
                    value={customInstructions}
                    onChange={(event) =>
                      setCustomInstructions(event.target.value)
                    }
                    placeholder="Notes or instructions"
                    rows={4}
                    className="mt-3 w-full rounded-xl border px-4 py-3"
                  />

                  <label className="mt-3 block text-sm font-bold">
                    Minutes
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={customMinutes}
                      onChange={(event) =>
                        setCustomMinutes(Number(event.target.value))
                      }
                      className="mt-2 w-full rounded-xl border px-4 py-3"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={addCustomTask}
                    className="mt-4 w-full rounded-xl bg-[#4B2265] px-5 py-3 font-black text-white"
                  >
                    + Add to Agenda
                  </button>
                </section>
              </div>
            </div>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
                    Real-World Experience
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                    Field Trips, Site Visits & Guest Experiences
                  </h2>

                  <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                    Add the operational details once. The experience stays
                    connected to Week {week}, {dayLabels[dayNumber]}, and this
                    cohort's delivery plan.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowExperienceForm((current) => !current)}
                  className="shrink-0 rounded-xl bg-[#0D1B3D] px-6 py-3 font-black text-white"
                >
                  {showExperienceForm
                    ? "Close Experience Form"
                    : "+ Add Field Trip / Experience"}
                </button>
              </div>

              {dayExperiences.length > 0 ? (
                <div className="mt-7 space-y-5">
                  {dayExperiences.map((experience) => (
                    <article
                      key={experience.id}
                      className="rounded-3xl border-2 border-[#F2B705] bg-[#FFFDF2] p-6"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-[#0D1B3D] px-3 py-1 text-xs font-black text-white">
                              {experience.experienceType.replaceAll("_", " ")}
                            </span>

                            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">
                              {experience.status}
                            </span>

                            {experience.visibleToStudent ? (
                              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                                Student Visible
                              </span>
                            ) : (
                              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-black text-slate-600">
                                Facilitator Only
                              </span>
                            )}
                          </div>

                          <h3 className="mt-3 text-2xl font-black text-[#0D1B3D]">
                            {experience.title}
                          </h3>

                          {experience.siteName ? (
                            <p className="mt-2 font-bold text-[#4B2265]">
                              📍 {experience.siteName}
                            </p>
                          ) : null}

                          {experience.eventDate ? (
                            <p className="mt-2 text-sm font-bold text-slate-600">
                              📅{" "}
                              {new Date(
                                experience.eventDate,
                              ).toLocaleDateString()}
                              {experience.startTime
                                ? ` • ${experience.startTime}`
                                : ""}
                              {experience.endTime
                                ? `–${experience.endTime}`
                                : ""}
                            </p>
                          ) : null}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeExperience(experience.id)}
                          className="shrink-0 rounded-lg border border-red-200 bg-white px-4 py-2 font-black text-red-600"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {experience.departureTime || experience.returnTime ? (
                          <ExperienceDetail
                            label="Transportation Time"
                            value={`${experience.departureTime ?? "TBD"} departure • ${experience.returnTime ?? "TBD"} return`}
                          />
                        ) : null}

                        {experience.address1 ? (
                          <ExperienceDetail
                            label="Address"
                            value={[
                              experience.address1,
                              experience.address2,
                              [
                                experience.city,
                                experience.state,
                                experience.postalCode,
                              ]
                                .filter(Boolean)
                                .join(" "),
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          />
                        ) : null}

                        {experience.contactName ? (
                          <ExperienceDetail
                            label="Contact"
                            value={[
                              experience.contactName,
                              experience.contactTitle,
                              experience.contactPhone,
                              experience.contactEmail,
                            ]
                              .filter(Boolean)
                              .join(" • ")}
                          />
                        ) : null}

                        {experience.requiredAttire ? (
                          <ExperienceDetail
                            label="What Students Must Wear"
                            value={experience.requiredAttire}
                            important
                          />
                        ) : null}

                        {experience.accommodations ? (
                          <ExperienceDetail
                            label="Accommodations / Accessibility"
                            value={experience.accommodations}
                          />
                        ) : null}

                        {experience.foodNotes ? (
                          <ExperienceDetail
                            label="Food / Lunch"
                            value={experience.foodNotes}
                          />
                        ) : null}

                        {experience.transportationNotes ? (
                          <ExperienceDetail
                            label="Transportation"
                            value={experience.transportationNotes}
                          />
                        ) : null}

                        {experience.parkingNotes ? (
                          <ExperienceDetail
                            label="Parking / Drop-Off"
                            value={experience.parkingNotes}
                          />
                        ) : null}

                        {experience.waiverRequired ? (
                          <ExperienceDetail
                            label="Permission / Waiver"
                            value={experience.waiverNotes ?? "Waiver required"}
                            important
                          />
                        ) : null}

                        {experience.learningObjective ? (
                          <ExperienceDetail
                            label="Learning Objective"
                            value={experience.learningObjective}
                          />
                        ) : null}

                        {experience.careerConnection ? (
                          <ExperienceDetail
                            label="Career / Industry Connection"
                            value={experience.careerConnection}
                          />
                        ) : null}

                        {experience.preTripPreparation ? (
                          <ExperienceDetail
                            label="Pre-Trip Preparation"
                            value={experience.preTripPreparation}
                          />
                        ) : null}
                      </div>

                      {experience.studentQuestions ? (
                        <div className="mt-5 rounded-2xl bg-white p-5">
                          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                            Questions Students Should Prepare
                          </p>
                          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                            {experience.studentQuestions}
                          </p>
                        </div>
                      ) : null}

                      {experience.postTripReflection ? (
                        <div className="mt-4 rounded-2xl bg-white p-5">
                          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                            Post-Experience Reflection
                          </p>
                          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                            {experience.postTripReflection}
                          </p>
                        </div>
                      ) : null}

                      {experience.facilitatorNotes ? (
                        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-5">
                          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                            Facilitator-Only Notes
                          </p>
                          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                            {experience.facilitatorNotes}
                          </p>
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center text-slate-500">
                  No field trip, employer visit, or guest experience is
                  scheduled for {dayLabels[dayNumber]}.
                </div>
              )}

              {showExperienceForm ? (
                <div className="mt-8 rounded-3xl bg-slate-50 p-6">
                  <h3 className="text-2xl font-black text-[#0D1B3D]">
                    Build the Experience
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Week {week} • {dayLabels[dayNumber]} • {cohortCode}
                  </p>

                  <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <ExperienceField label="Experience Type">
                      <select
                        value={experienceDraft.experienceType}
                        onChange={(event) =>
                          updateExperienceField(
                            "experienceType",
                            event.target.value,
                          )
                        }
                        className={inputClass}
                      >
                        <option value="FIELD_TRIP">Field Trip</option>
                        <option value="SITE_VISIT">
                          Employer / Site Visit
                        </option>
                        <option value="GUEST_SPEAKER">
                          Guest Professional
                        </option>
                        <option value="COFFEE_CHAT">Coffee Chat</option>
                        <option value="CAREER_EVENT">Career Event</option>
                        <option value="EMPLOYER_TOUR">Employer Tour</option>
                        <option value="COMMUNITY_EXPERIENCE">
                          Community Experience
                        </option>
                      </select>
                    </ExperienceField>

                    <ExperienceField label="Experience Title" wide>
                      <input
                        value={experienceDraft.title}
                        onChange={(event) =>
                          updateExperienceField("title", event.target.value)
                        }
                        placeholder="Example: Trane Technologies Advanced Manufacturing Tour"
                        className={inputClass}
                      />
                    </ExperienceField>

                    <ExperienceField label="Date">
                      <input
                        type="date"
                        value={experienceDraft.eventDate}
                        onChange={(event) =>
                          updateExperienceField("eventDate", event.target.value)
                        }
                        className={inputClass}
                      />
                    </ExperienceField>

                    <ExperienceField label="Start Time">
                      <input
                        type="time"
                        value={experienceDraft.startTime}
                        onChange={(event) =>
                          updateExperienceField("startTime", event.target.value)
                        }
                        className={inputClass}
                      />
                    </ExperienceField>

                    <ExperienceField label="End Time">
                      <input
                        type="time"
                        value={experienceDraft.endTime}
                        onChange={(event) =>
                          updateExperienceField("endTime", event.target.value)
                        }
                        className={inputClass}
                      />
                    </ExperienceField>

                    <ExperienceField label="Departure Time">
                      <input
                        type="time"
                        value={experienceDraft.departureTime}
                        onChange={(event) =>
                          updateExperienceField(
                            "departureTime",
                            event.target.value,
                          )
                        }
                        className={inputClass}
                      />
                    </ExperienceField>

                    <ExperienceField label="Return Time">
                      <input
                        type="time"
                        value={experienceDraft.returnTime}
                        onChange={(event) =>
                          updateExperienceField(
                            "returnTime",
                            event.target.value,
                          )
                        }
                        className={inputClass}
                      />
                    </ExperienceField>
                  </div>

                  <PlannerSectionTitle>Location</PlannerSectionTitle>

                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <ExperienceInput
                      label="Site / Company Name"
                      value={experienceDraft.siteName}
                      onChange={(value) =>
                        updateExperienceField("siteName", value)
                      }
                    />

                    <ExperienceInput
                      label="Address"
                      value={experienceDraft.address1}
                      onChange={(value) =>
                        updateExperienceField("address1", value)
                      }
                    />

                    <ExperienceInput
                      label="Address Line 2"
                      value={experienceDraft.address2}
                      onChange={(value) =>
                        updateExperienceField("address2", value)
                      }
                    />

                    <ExperienceInput
                      label="City"
                      value={experienceDraft.city}
                      onChange={(value) => updateExperienceField("city", value)}
                    />

                    <ExperienceInput
                      label="State"
                      value={experienceDraft.state}
                      onChange={(value) =>
                        updateExperienceField("state", value)
                      }
                    />

                    <ExperienceInput
                      label="ZIP"
                      value={experienceDraft.postalCode}
                      onChange={(value) =>
                        updateExperienceField("postalCode", value)
                      }
                    />
                  </div>

                  <PlannerSectionTitle>Contact</PlannerSectionTitle>

                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <ExperienceInput
                      label="Contact Name"
                      value={experienceDraft.contactName}
                      onChange={(value) =>
                        updateExperienceField("contactName", value)
                      }
                    />

                    <ExperienceInput
                      label="Contact Title"
                      value={experienceDraft.contactTitle}
                      onChange={(value) =>
                        updateExperienceField("contactTitle", value)
                      }
                    />

                    <ExperienceInput
                      label="Phone"
                      value={experienceDraft.contactPhone}
                      onChange={(value) =>
                        updateExperienceField("contactPhone", value)
                      }
                    />

                    <ExperienceInput
                      label="Email"
                      value={experienceDraft.contactEmail}
                      onChange={(value) =>
                        updateExperienceField("contactEmail", value)
                      }
                    />
                  </div>

                  <PlannerSectionTitle>
                    Student Logistics & Safety
                  </PlannerSectionTitle>

                  <div className="grid gap-5 md:grid-cols-2">
                    <ExperienceTextarea
                      label="Transportation Notes"
                      value={experienceDraft.transportationNotes}
                      onChange={(value) =>
                        updateExperienceField("transportationNotes", value)
                      }
                      placeholder="Bus departure location, transportation plan, arrival instructions..."
                    />

                    <ExperienceTextarea
                      label="Parking / Drop-Off"
                      value={experienceDraft.parkingNotes}
                      onChange={(value) =>
                        updateExperienceField("parkingNotes", value)
                      }
                    />

                    <ExperienceTextarea
                      label="Required Attire / PPE"
                      value={experienceDraft.requiredAttire}
                      onChange={(value) =>
                        updateExperienceField("requiredAttire", value)
                      }
                      placeholder="Example: Long pants, steel-toed shoes, safety glasses..."
                    />

                    <ExperienceTextarea
                      label="Accommodations / Accessibility"
                      value={experienceDraft.accommodations}
                      onChange={(value) =>
                        updateExperienceField("accommodations", value)
                      }
                      placeholder="Mobility, sensory, medical, accessibility, or other accommodations..."
                    />

                    <ExperienceTextarea
                      label="Food / Lunch"
                      value={experienceDraft.foodNotes}
                      onChange={(value) =>
                        updateExperienceField("foodNotes", value)
                      }
                    />

                    <div className="rounded-2xl border bg-white p-5">
                      <label className="flex items-center gap-3 font-black text-[#0D1B3D]">
                        <input
                          type="checkbox"
                          checked={experienceDraft.waiverRequired}
                          onChange={(event) =>
                            updateExperienceField(
                              "waiverRequired",
                              event.target.checked,
                            )
                          }
                        />
                        Permission / waiver required
                      </label>

                      <textarea
                        value={experienceDraft.waiverNotes}
                        onChange={(event) =>
                          updateExperienceField(
                            "waiverNotes",
                            event.target.value,
                          )
                        }
                        placeholder="Waiver deadline, permission form instructions..."
                        rows={3}
                        className={`${inputClass} mt-4`}
                      />
                    </div>

                    <ExperienceInput
                      label="Maximum Capacity"
                      value={experienceDraft.capacity}
                      onChange={(value) =>
                        updateExperienceField("capacity", value)
                      }
                      type="number"
                    />

                    <ExperienceTextarea
                      label="Chaperone Notes"
                      value={experienceDraft.chaperoneNotes}
                      onChange={(value) =>
                        updateExperienceField("chaperoneNotes", value)
                      }
                    />
                  </div>

                  <PlannerSectionTitle>Learning Connection</PlannerSectionTitle>

                  <div className="grid gap-5 md:grid-cols-2">
                    <ExperienceTextarea
                      label="Learning Objective"
                      value={experienceDraft.learningObjective}
                      onChange={(value) =>
                        updateExperienceField("learningObjective", value)
                      }
                      placeholder={
                        lesson?.objective ??
                        "What should students understand or practice?"
                      }
                    />

                    <ExperienceTextarea
                      label="Career / Industry Connection"
                      value={experienceDraft.careerConnection}
                      onChange={(value) =>
                        updateExperienceField("careerConnection", value)
                      }
                      placeholder={lesson?.workplaceConnection ?? ""}
                    />

                    <ExperienceTextarea
                      label="Pre-Trip Preparation"
                      value={experienceDraft.preTripPreparation}
                      onChange={(value) =>
                        updateExperienceField("preTripPreparation", value)
                      }
                      placeholder="Research, vocabulary, company background, professional expectations..."
                    />

                    <ExperienceTextarea
                      label="Questions Students Should Prepare"
                      value={experienceDraft.studentQuestions}
                      onChange={(value) =>
                        updateExperienceField("studentQuestions", value)
                      }
                      placeholder="What should students ask the employer or professional?"
                    />

                    <ExperienceTextarea
                      label="Post-Experience Reflection / Takeaway"
                      value={experienceDraft.postTripReflection}
                      onChange={(value) =>
                        updateExperienceField("postTripReflection", value)
                      }
                      placeholder="What will students create, reflect on, or add to their Passport?"
                    />

                    <ExperienceTextarea
                      label="Student-Visible Notes"
                      value={experienceDraft.studentVisibleNotes}
                      onChange={(value) =>
                        updateExperienceField("studentVisibleNotes", value)
                      }
                      placeholder="What students need to know on their dashboard."
                    />

                    <ExperienceTextarea
                      label="Facilitator-Only Notes"
                      value={experienceDraft.facilitatorNotes}
                      onChange={(value) =>
                        updateExperienceField("facilitatorNotes", value)
                      }
                      placeholder="Internal coordination notes students should not see."
                    />
                  </div>

                  <label className="mt-6 flex items-center gap-3 rounded-2xl border bg-white p-5 font-black text-[#0D1B3D]">
                    <input
                      type="checkbox"
                      checked={experienceDraft.visibleToStudent}
                      onChange={(event) =>
                        updateExperienceField(
                          "visibleToStudent",
                          event.target.checked,
                        )
                      }
                    />
                    Show student-safe details on the student experience
                  </label>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={saveExperience}
                      disabled={experienceSaving}
                      className="rounded-xl bg-[#0D1B3D] px-7 py-4 font-black text-white disabled:opacity-50"
                    >
                      {experienceSaving
                        ? "Saving Experience..."
                        : "Save to Weekly Delivery Plan →"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setExperienceDraft(createEmptyExperience());
                        setShowExperienceForm(false);
                      }}
                      className="rounded-xl border border-slate-300 bg-white px-7 py-4 font-black text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
                    Teaching Materials
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                    Week {week} Materials & Downloads
                  </h2>

                  <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                    Everything needed to prepare, teach, print, distribute,
                    assess, and capture student evidence for this Future Ready™
                    week.
                  </p>
                </div>

                {materialsAvailable ? (
                  <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-800">
                    ✓ MATERIALS READY
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-800">
                    RECOVERY IN PROGRESS
                  </span>
                )}
              </div>

              {materialsAvailable ? (
                <div className="mt-7 grid gap-7 xl:grid-cols-2">
                  <div>
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-[#725500]">
                          Facilitator
                        </p>

                        <h3 className="mt-1 text-xl font-black text-[#0D1B3D]">
                          Teach the Week
                        </h3>
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        {facilitatorResources.length} resources
                      </span>
                    </div>

                    <div className="space-y-3">
                      {facilitatorResources.map((resource) => (
                        <a
                          key={`${resource.title}-${resource.format}`}
                          href={resourceHref(resource)}
                          className="block rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-[#F2B705] hover:bg-[#FFFDF2]"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-black text-[#0D1B3D]">
                                {resource.title}
                              </p>

                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {resource.description}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-black text-[#4B2265]">
                              {resource.format}
                            </span>
                          </div>

                          <p className="mt-3 text-xs font-black text-[#725500]">
                            Download / Print →
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-[#4B2265]">
                          Student
                        </p>

                        <h3 className="mt-1 text-xl font-black text-[#0D1B3D]">
                          Student Work & Evidence
                        </h3>
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        {studentResources.length} resources
                      </span>
                    </div>

                    <div className="space-y-3">
                      {studentResources.map((resource) => (
                        <a
                          key={`${resource.title}-${resource.format}`}
                          href={resourceHref(resource)}
                          className="block rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-[#4B2265] hover:bg-purple-50"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-black text-[#0D1B3D]">
                                {resource.title}
                              </p>

                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {resource.description}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-black text-[#4B2265]">
                              {resource.format}
                            </span>
                          </div>

                          <p className="mt-3 text-xs font-black text-[#4B2265]">
                            Download / Print →
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-7 rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50 p-6">
                  <p className="font-black text-[#0D1B3D]">
                    Week {week} materials are not yet installed in this
                    production build.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    The curriculum remains available and teachable. We are
                    reconnecting the previously completed print and editable
                    files before exposing download buttons for this week.
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
                Future Ready™ Culture
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                Recurring Traditions
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                Students should recognize the experience before they recognize
                the class period.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {FUTURE_READY_TRADITIONS.map((tradition) => (
                  <article
                    key={tradition.id}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="text-3xl">{tradition.emoji}</div>

                    <h3 className="mt-3 text-xl font-black text-[#0D1B3D]">
                      {tradition.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {tradition.description}
                    </p>

                    <p className="mt-3 text-xs font-bold text-slate-500">
                      {tradition.defaultMinutes} minutes
                    </p>

                    <button
                      type="button"
                      onClick={() => addTradition(tradition.id)}
                      className="mt-4 w-full rounded-xl border-2 border-[#0D1B3D] px-4 py-3 font-black text-[#0D1B3D]"
                    >
                      + Add to {dayLabels[dayNumber]}
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
                AI Builder Lab
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                Generate for Week {week}, {dayLabels[dayNumber]}
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Generate an activity tied to this week's Future Ready™ skill,
                then add it directly to the agenda.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {AI_ACTIVITY_OPTIONS.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedAIType(type)}
                    className={`rounded-xl border px-4 py-2 text-sm font-black ${
                      selectedAIType === type
                        ? "border-[#F2B705] bg-[#F2B705] text-[#0D1B3D]"
                        : "border-slate-300 bg-white text-slate-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={generateAI}
                className="mt-5 rounded-xl bg-[#4B2265] px-6 py-3 font-black text-white"
              >
                {generatedActivity
                  ? "Generate Another Option"
                  : "Generate AI Class Activity"}
              </button>

              {generatedActivity ? (
                <article className="mt-6 rounded-3xl border-2 border-[#4B2265] p-6">
                  <p className="text-xs font-black uppercase tracking-wider text-[#4B2265]">
                    Generated for Week {week} • {dayLabels[dayNumber]}
                  </p>

                  <h3 className="mt-3 text-2xl font-black text-[#0D1B3D]">
                    {generatedActivity.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-700">
                    {generatedActivity.learningObjective}
                  </p>

                  <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                    <p className="font-black text-[#0D1B3D]">
                      Why this matters
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {generatedActivity.whyThisMatters}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="font-black text-[#0D1B3D]">
                      Skills / teaching points
                    </p>

                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                      {generatedActivity.teachingPoints
                        .slice(0, 6)
                        .map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={addAIToPlan}
                    className="mt-6 rounded-xl bg-[#0D1B3D] px-6 py-4 font-black text-white"
                  >
                    + Add This to the Lesson Plan →
                  </button>
                </article>
              ) : null}
            </section>
          </>
        ) : null}
      </div>

    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#0D1B3D]";

function PlannerSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-4 mt-8 border-b border-slate-200 pb-3 text-lg font-black text-[#0D1B3D]">
      {children}
    </h4>
  );
}

function ExperienceField({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <div className="mt-2">{children}</div>
    </label>
  );
}

function ExperienceInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <ExperienceField label={label}>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </ExperienceField>
  );
}

function ExperienceTextarea({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <ExperienceField label={label}>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className={inputClass}
      />
    </ExperienceField>
  );
}

function ExperienceDetail({
  label,
  value,
  important = false,
}: {
  label: string;
  value: string;
  important?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        important ? "border border-[#F2B705] bg-[#FFF9DF]" : "bg-white"
      }`}
    >
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 whitespace-pre-line text-sm font-bold leading-6 text-slate-700">
        {value}
      </p>
    </div>
  );
}
