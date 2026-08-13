"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

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

type PlannerTask = {
  id: string;
  taskType: string;
  title: string;
  instructions: string;
  dayNumber: number;
  durationMinutes: number;
  requirement:
    | "REQUIRED"
    | "OPTIONAL"
    | "HIDDEN";
  visibleToStudent: boolean;
  visibleToFacilitator: boolean;
  sortOrder: number;
  createdById: string | null;
};

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

export default function WeeklyPlanner({
  defaultCohortCode,
  role,
}: Props) {
  const [cohortCode, setCohortCode] =
    useState(defaultCohortCode);

  const [week, setWeek] = useState(1);
  const [dayNumber, setDayNumber] =
    useState(1);

  const [data, setData] =
    useState<PlannerData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [customTitle, setCustomTitle] =
    useState("");

  const [
    customInstructions,
    setCustomInstructions,
  ] = useState("");

  const [
    customMinutes,
    setCustomMinutes,
  ] = useState(10);

  const [
    selectedAIType,
    setSelectedAIType,
  ] = useState<AIActivityType>(
    "Role Play"
  );

  const [
    generatedActivity,
    setGeneratedActivity,
  ] =
    useState<AIGeneratedActivity | null>(
      null
    );

  const [
    generationVariation,
    setGenerationVariation,
  ] = useState(0);

  const [
    selectedTakeaway,
    setSelectedTakeaway,
  ] = useState<string>(
    FUTURE_READY_TAKEAWAYS[0]
  );

  async function loadPlanner() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/ambassador/planner?cohortCode=${encodeURIComponent(
          cohortCode
        )}&week=${week}`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to load planner."
        );
      }

      setData(result);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load planner."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week, cohortCode]);

  const dayTasks = useMemo(() => {
    if (!data) return [];

    return data.tasks
      .filter(
        (task) =>
          task.dayNumber === dayNumber
      )
      .sort(
        (a, b) =>
          a.sortOrder - b.sortOrder
      );
  }, [data, dayNumber]);

  const totalMinutes = dayTasks.reduce(
    (sum, task) =>
      sum + task.durationMinutes,
    0
  );

  const hasTakeaway = dayTasks.some(
    (task) =>
      task.taskType === "TAKEAWAY"
  );

  const lesson =
    curriculum.find(
      (item) => item.week === week
    ) ?? null;

  async function createTask(input: {
    taskType: string;
    title: string;
    instructions: string;
    durationMinutes: number;
    requirement?: "REQUIRED" | "OPTIONAL";
  }) {
    setError(null);

    const response = await fetch(
      "/api/ambassador/planner",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          cohortCode,
          week,
          dayNumber,
          taskType: input.taskType,
          title: input.title,
          instructions:
            input.instructions,
          durationMinutes:
            input.durationMinutes,
          requirement:
            input.requirement ??
            "OPTIONAL",
          visibleToStudent: true,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ??
          "Unable to add task."
      );
    }

    await loadPlanner();
  }

  async function addCustomTask() {
    if (!customTitle.trim()) return;

    try {
      await createTask({
        taskType: "CUSTOM",
        title: customTitle,
        instructions:
          customInstructions,
        durationMinutes:
          customMinutes,
      });

      setCustomTitle("");
      setCustomInstructions("");
      setCustomMinutes(10);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to add task."
      );
    }
  }

  async function addTradition(
    traditionId: string
  ) {
    const tradition =
      FUTURE_READY_TRADITIONS.find(
        (item) =>
          item.id === traditionId
      );

    if (!tradition) return;

    try {
      await createTask({
        taskType: `TRADITION:${tradition.id}`,
        title: `${tradition.emoji} ${tradition.title}`,
        instructions:
          tradition.description,
        durationMinutes:
          tradition.defaultMinutes,
        requirement: "OPTIONAL",
      });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to add tradition."
      );
    }
  }

  function generateAI() {
    if (!lesson) return;

    const variation =
      generationVariation + 1;

    const result =
      generateActivityOptions({
        week,
        day: dayLabels[dayNumber],
        topic: lesson.title,
        objective: lesson.objective,
        activityType: selectedAIType,
        audience:
          "Future Ready™ students",
        variation,
      });

    setGenerationVariation(
      variation
    );

    setGeneratedActivity(
      result[0] ?? null
    );
  }

  async function addAIToPlan() {
    if (!generatedActivity) return;

    const steps =
      generatedActivity
        .stepByStepInstructions
        .map(
          (step, index) =>
            `${index + 1}. ${step}`
        )
        .join("\n");

    const skills =
      generatedActivity.teachingPoints
        .slice(0, 5)
        .join(" • ");

    const instructions = [
      `Objective: ${generatedActivity.learningObjective}`,
      "",
      `Why this matters: ${generatedActivity.whyThisMatters}`,
      "",
      `Classroom setup: ${generatedActivity.classroomSetup}`,
      "",
      `Skills / teaching points: ${skills}`,
      "",
      "Steps:",
      steps,
      "",
      `Portfolio connection: ${generatedActivity.portfolioEvidence}`,
    ].join("\n");

    try {
      await createTask({
        taskType: `AI:${generatedActivity.activityType}`,
        title:
          generatedActivity.title,
        instructions,
        durationMinutes: 15,
        requirement: "OPTIONAL",
      });

      setGeneratedActivity(null);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to add AI activity."
      );
    }
  }

  async function addTakeaway() {
    try {
      await createTask({
        taskType: "TAKEAWAY",
        title:
          "🎯 Today's Tangible Takeaway",
        instructions:
          selectedTakeaway,
        durationMinutes: 5,
        requirement: "REQUIRED",
      });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to add takeaway."
      );
    }
  }

  async function removeTask(
    taskId: string
  ) {
    if (
      !window.confirm(
        "Remove this item from this week's agenda?"
      )
    ) {
      return;
    }

    const response = await fetch(
      "/api/ambassador/planner",
      {
        method: "DELETE",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          cohortCode,
          taskId,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      setError(
        result.error ??
          "Unable to remove task."
      );
      return;
    }

    await loadPlanner();
  }

  async function reorderTask(
    index: number,
    direction: -1 | 1
  ) {
    const nextIndex =
      index + direction;

    if (
      nextIndex < 0 ||
      nextIndex >= dayTasks.length
    ) {
      return;
    }

    const reordered = [
      ...dayTasks,
    ];

    const current =
      reordered[index];

    reordered[index] =
      reordered[nextIndex];

    reordered[nextIndex] =
      current;

    const response = await fetch(
      "/api/ambassador/planner",
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          cohortCode,
          action: "reorder",
          orderedIds:
            reordered.map(
              (task) => task.id
            ),
        }),
      }
    );

    if (!response.ok) {
      const result =
        await response.json();

      setError(
        result.error ??
          "Unable to reorder agenda."
      );

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
                Plan the experience,
                not just the lesson.
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
              onChange={(event) =>
                setCohortCode(
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-bold"
            />
          </label>

          <label>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Week
            </span>

            <select
              value={week}
              onChange={(event) =>
                setWeek(
                  Number(
                    event.target.value
                  )
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-bold"
            >
              {Array.from(
                { length: 16 },
                (_, index) =>
                  index + 1
              ).map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  Week {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Class Day
            </span>

            <select
              value={dayNumber}
              onChange={(event) =>
                setDayNumber(
                  Number(
                    event.target.value
                  )
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-bold"
            >
              {days.map((day) => (
                <option
                  key={day}
                  value={day}
                >
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
                {data.lesson.summary ??
                  lesson?.objective}
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
                      This day is open. Add a tradition,
                      AI activity, takeaway, or custom task.
                    </div>
                  ) : null}

                  {dayTasks.map(
                    (task, index) => (
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
                              onClick={() =>
                                reorderTask(
                                  index,
                                  -1
                                )
                              }
                              disabled={
                                index === 0
                              }
                              className="rounded-lg border px-3 py-2 font-black disabled:opacity-30"
                            >
                              ↑
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                reorderTask(
                                  index,
                                  1
                                )
                              }
                              disabled={
                                index ===
                                dayTasks.length -
                                  1
                              }
                              className="rounded-lg border px-3 py-2 font-black disabled:opacity-30"
                            >
                              ↓
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                removeTask(
                                  task.id
                                )
                              }
                              className="rounded-lg border border-red-200 px-3 py-2 font-black text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </article>
                    )
                  )}
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
                    Every student leaves every session
                    with something they can use.
                  </p>

                  <select
                    value={selectedTakeaway}
                    onChange={(event) =>
                      setSelectedTakeaway(
                        event.target.value
                      )
                    }
                    className="mt-4 w-full rounded-xl border border-[#F2B705] bg-white px-4 py-3 font-bold"
                  >
                    {FUTURE_READY_TAKEAWAYS.map(
                      (takeaway) => (
                        <option
                          key={takeaway}
                          value={takeaway}
                        >
                          {takeaway}
                        </option>
                      )
                    )}
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
                    onChange={(event) =>
                      setCustomTitle(
                        event.target.value
                      )
                    }
                    placeholder="Agenda item"
                    className="mt-4 w-full rounded-xl border px-4 py-3"
                  />

                  <textarea
                    value={customInstructions}
                    onChange={(event) =>
                      setCustomInstructions(
                        event.target.value
                      )
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
                        setCustomMinutes(
                          Number(
                            event.target
                              .value
                          )
                        )
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
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
                Future Ready™ Culture
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                Recurring Traditions
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                Students should recognize the experience
                before they recognize the class period.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {FUTURE_READY_TRADITIONS.map(
                  (tradition) => (
                    <article
                      key={tradition.id}
                      className="rounded-2xl border border-slate-200 p-5"
                    >
                      <div className="text-3xl">
                        {tradition.emoji}
                      </div>

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
                        onClick={() =>
                          addTradition(
                            tradition.id
                          )
                        }
                        className="mt-4 w-full rounded-xl border-2 border-[#0D1B3D] px-4 py-3 font-black text-[#0D1B3D]"
                      >
                        + Add to {dayLabels[dayNumber]}
                      </button>
                    </article>
                  )
                )}
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
                Generate an activity tied to this week's
                Future Ready™ skill, then add it directly
                to the agenda.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {AI_ACTIVITY_OPTIONS.map(
                  (type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setSelectedAIType(
                          type
                        )
                      }
                      className={`rounded-xl border px-4 py-2 text-sm font-black ${
                        selectedAIType ===
                        type
                          ? "border-[#F2B705] bg-[#F2B705] text-[#0D1B3D]"
                          : "border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      {type}
                    </button>
                  )
                )}
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
                        .map(
                          (point) => (
                            <li key={point}>
                              {point}
                            </li>
                          )
                        )}
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
