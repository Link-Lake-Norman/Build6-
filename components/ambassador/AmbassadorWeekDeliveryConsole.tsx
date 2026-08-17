"use client";

import { useEffect, useMemo, useState } from "react";
import type { DragEvent, ReactNode } from "react";

import {
  ambassadorWeeklyRhythm,
  getAmbassadorWeekDelivery,
} from "@/content/ambassador";

import { getAppliedLearningForWeek } from "@/content/applied-learning";

type Props = {
  week: number;
};

type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

type ZoneKey = "open" | "connect" | "practice" | "debrief" | "reflect";

type ActivityOption = {
  id: string;
  label: string;
  type: string;
  minutes: number;
  detail: string;
};

type PlannerItem = ActivityOption & {
  instanceId: string;
};

type LessonPlan = Record<ZoneKey, PlannerItem[]>;

const DAY_LABELS: Record<
  DayKey,
  {
    day: string;
    title: string;
    shortTitle: string;
  }
> = {
  monday: {
    day: "Monday",
    title: "Reflect + Reset",
    shortTitle: "Reflect",
  },

  tuesday: {
    day: "Tuesday",
    title: "Core Future Ready™ Lesson",
    shortTitle: "Lesson",
  },

  wednesday: {
    day: "Wednesday",
    title: "Applied Learning Lab",
    shortTitle: "Apply",
  },

  thursday: {
    day: "Thursday",
    title: "Experience + Flex Day",
    shortTitle: "Experience",
  },

  friday: {
    day: "Friday",
    title: "Future Ready Friday™",
    shortTitle: "Friday",
  },
};

const ZONE_META: Record<
  ZoneKey,
  {
    label: string;
    description: string;
  }
> = {
  open: {
    label: "OPEN",
    description: "Get students in the room and thinking.",
  },

  connect: {
    label: "CONNECT / TEACH",
    description: "Connect today's work to the Future Ready™ skill.",
  },

  practice: {
    label: "PRACTICE",
    description: "Students do the skill — not just hear about it.",
  },

  debrief: {
    label: "DEBRIEF",
    description: "Discuss what happened, why it mattered and what changed.",
  },

  reflect: {
    label: "REFLECT / PROVE IT",
    description: "Capture the learning, evidence or next action.",
  },
};

function getTodayDayKey(): DayKey | null {
  const day = new Date().getDay();

  const weekdayMap: Partial<Record<number, DayKey>> = {
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
  };

  return weekdayMap[day] ?? null;
}

function createPlannerItem(option: ActivityOption): PlannerItem {
  return {
    ...option,

    instanceId: `${option.id}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
  };
}

function emptyPlan(): LessonPlan {
  return {
    open: [],
    connect: [],
    practice: [],
    debrief: [],
    reflect: [],
  };
}

export default function AmbassadorWeekDeliveryConsole({ week }: Props) {
  const delivery = getAmbassadorWeekDelivery(week);

  const appliedLearningAssets = useMemo(
    () => getAppliedLearningForWeek(week),
    [week],
  );

  const [activeDay, setActiveDay] = useState<DayKey>("monday");

  const [todayDay, setTodayDay] = useState<DayKey | null>(null);

  const [thursdayMode, setThursdayMode] = useState<"experience" | "classroom">(
    "experience",
  );

  const [customPlans, setCustomPlans] = useState<
    Partial<Record<DayKey, LessonPlan>>
  >({});

  useEffect(() => {
    const localToday = getTodayDayKey();

    setTodayDay(localToday);

    if (localToday) {
      setActiveDay(localToday);
    }
  }, []);

  if (!delivery) {
    return null;
  }

  const rhythm = ambassadorWeeklyRhythm.find(
    (item) => item.day.toLowerCase() === activeDay,
  );

  const activityBank = buildActivityBank({
    day: activeDay,
    week,
    delivery,
    appliedLearningAssets,
    thursdayMode,
  });

  const recommendedPlan = buildRecommendedPlan({
    day: activeDay,
    week,
    delivery,
    appliedLearningAssets,
    thursdayMode,
  });

  const currentPlan = customPlans[activeDay] ?? recommendedPlan;

  const totalMinutes = getPlanMinutes(currentPlan);

  const remainingMinutes = 50 - totalMinutes;

  function updatePlan(next: LessonPlan) {
    setCustomPlans((current) => ({
      ...current,
      [activeDay]: next,
    }));
  }

  function resetPlan() {
    setCustomPlans((current) => {
      const next = {
        ...current,
      };

      delete next[activeDay];

      return next;
    });
  }

  function addToZone(optionId: string, zone: ZoneKey) {
    const option = activityBank.find((item) => item.id === optionId);

    if (!option) {
      return;
    }

    const next = clonePlan(currentPlan);

    next[zone].push(createPlannerItem(option));

    updatePlan(next);
  }

  function removeItem(zone: ZoneKey, instanceId: string) {
    const next = clonePlan(currentPlan);

    next[zone] = next[zone].filter((item) => item.instanceId !== instanceId);

    updatePlan(next);
  }

  function movePlannerItem(
    sourceZone: ZoneKey,
    targetZone: ZoneKey,
    instanceId: string,
  ) {
    const next = clonePlan(currentPlan);

    const item = next[sourceZone].find(
      (candidate) => candidate.instanceId === instanceId,
    );

    if (!item) {
      return;
    }

    next[sourceZone] = next[sourceZone].filter(
      (candidate) => candidate.instanceId !== instanceId,
    );

    next[targetZone].push(item);

    updatePlan(next);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, targetZone: ZoneKey) {
    event.preventDefault();

    const source = event.dataTransfer.getData("future-ready-source");

    const optionId = event.dataTransfer.getData("future-ready-option");

    const instanceId = event.dataTransfer.getData("future-ready-instance");

    const sourceZone = event.dataTransfer.getData(
      "future-ready-zone",
    ) as ZoneKey;

    if (source === "bank" && optionId) {
      addToZone(optionId, targetZone);

      return;
    }

    if (source === "planner" && sourceZone && instanceId) {
      movePlannerItem(sourceZone, targetZone, instanceId);
    }
  }

  return (
    <section className="space-y-6">
      {/* WEEK HEADER */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
              Ambassador Teaching Workspace
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
              Week {week}
            </h2>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
              Start with the week. Choose the day. Run one focused 50-minute
              Future Ready™ experience.
            </p>
          </div>

          <div className="rounded-2xl bg-[#0D1B3D] px-5 py-4 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#F2B705]">
              Daily Maximum
            </p>

            <p className="mt-1 text-2xl font-black">50 Minutes</p>

            <p className="mt-1 text-xs text-slate-300">
              Cut volume, not the learning loop.
            </p>
          </div>
        </div>

        {/* M-F AGENDA */}

        <div className="mt-7">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Monday–Friday Agenda
          </p>

          <div className="grid gap-2 md:grid-cols-5">
            {(Object.keys(DAY_LABELS) as DayKey[]).map((key) => {
              const item = DAY_LABELS[key];

              const active = activeDay === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveDay(key)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-[#0D1B3D] bg-[#0D1B3D] text-white shadow-md"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#F2B705]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-[10px] font-black uppercase tracking-[0.14em] ${
                        active ? "text-[#F2B705]" : "text-[#725500]"
                      }`}
                    >
                      {item.day}
                    </p>

                    {todayDay === key ? (
                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-black ${
                          active
                            ? "bg-white/15 text-white"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        TODAY
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-2 font-black">{item.shortTitle}</p>

                  <p
                    className={`mt-1 text-xs font-semibold ${
                      active ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {item.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TODAY'S CLASS */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#725500]">
                Today&apos;s Class
              </p>

              {todayDay === activeDay ? (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black text-emerald-800">
                  TODAY
                </span>
              ) : null}
            </div>

            <h3 className="mt-2 text-2xl font-black text-[#0D1B3D]">
              {DAY_LABELS[activeDay].day} · {DAY_LABELS[activeDay].title}
            </h3>

            {rhythm ? (
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
                {rhythm.purpose}
              </p>
            ) : null}

            {todayDay && activeDay !== todayDay ? (
              <button
                type="button"
                onClick={() => setActiveDay(todayDay)}
                className="mt-3 text-xs font-black text-[#24569B]"
              >
                ← BACK TO TODAY
              </button>
            ) : null}
          </div>

          <TimeStatus totalMinutes={totalMinutes} />
        </div>

        {activeDay === "thursday" ? (
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setThursdayMode("experience")}
              className={`rounded-full px-4 py-2 text-xs font-black ${
                thursdayMode === "experience"
                  ? "bg-[#0D1B3D] text-white"
                  : "border border-slate-200 bg-white text-slate-600"
              }`}
            >
              A · SPEAKER / FIELD EXPERIENCE
            </button>

            <button
              type="button"
              onClick={() => setThursdayMode("classroom")}
              className={`rounded-full px-4 py-2 text-xs font-black ${
                thursdayMode === "classroom"
                  ? "bg-[#0D1B3D] text-white"
                  : "border border-slate-200 bg-white text-slate-600"
              }`}
            >
              B · CLASSROOM FLEX
            </button>
          </div>
        ) : null}
      </div>

      {/* BUILD THIS CLASS */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#725500]">
              Build This Class
            </p>

            <h3 className="mt-2 text-2xl font-black text-[#0D1B3D]">
              Drag an option into the lesson
            </h3>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
              The recommended plan is already loaded. Customize only when you
              need to.
            </p>
          </div>

          <button
            type="button"
            onClick={resetPlan}
            className="w-fit rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-black text-slate-700"
          >
            ↻ RESET TO RECOMMENDED PLAN
          </button>
        </div>

        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {activityBank.map((option) => (
            <div
              key={option.id}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("future-ready-source", "bank");

                event.dataTransfer.setData("future-ready-option", option.id);
              }}
              className="min-w-[190px] cursor-grab rounded-2xl border border-slate-200 bg-slate-50 p-4 active:cursor-grabbing"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#725500]">
                {option.type}
              </p>

              <p className="mt-2 font-black text-[#0D1B3D]">{option.label}</p>

              <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
                {option.detail}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-slate-600">
                  {option.minutes} MIN
                </span>

                <span className="text-lg text-slate-400">⋮⋮</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {(Object.keys(ZONE_META) as ZoneKey[]).map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => addToZone(option.id, zone)}
                    className="rounded-lg bg-white px-2 py-1 text-[9px] font-black text-slate-500 hover:text-[#0D1B3D]"
                  >
                    + {ZONE_META[zone].label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 50 MINUTE CANVAS */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#725500]">
              50-Minute Lesson Canvas
            </p>

            <h3 className="mt-2 text-2xl font-black text-[#0D1B3D]">
              {DAY_LABELS[activeDay].title}
            </h3>
          </div>

          <div
            className={`rounded-2xl px-5 py-3 text-sm font-black ${
              totalMinutes === 50
                ? "bg-emerald-100 text-emerald-900"
                : totalMinutes > 50
                  ? "bg-red-100 text-red-900"
                  : "bg-[#FFF7D6] text-[#725500]"
            }`}
          >
            {totalMinutes} / 50 MINUTES
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {(Object.keys(ZONE_META) as ZoneKey[]).map((zone) => (
            <LessonZone
              key={zone}
              zone={zone}
              items={currentPlan[zone]}
              onDrop={(event) => handleDrop(event, zone)}
              onRemove={(instanceId) => removeItem(zone, instanceId)}
            />
          ))}
        </div>

        <div
          className={`mt-5 rounded-2xl border p-4 ${
            totalMinutes === 50
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : totalMinutes > 50
                ? "border-red-200 bg-red-50 text-red-900"
                : "border-amber-200 bg-amber-50 text-amber-950"
          }`}
        >
          {totalMinutes === 50 ? (
            <p className="text-sm font-black">
              ✓ This class fits the 50-minute Ambassador period.
            </p>
          ) : totalMinutes > 50 ? (
            <>
              <p className="text-sm font-black">
                ⚠ You are {Math.abs(remainingMinutes)} minutes over.
              </p>

              <p className="mt-1 text-sm font-semibold">
                Shorten or remove an activity. Do not extend the class.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-black">
                {remainingMinutes} minutes available.
              </p>

              <p className="mt-1 text-sm font-semibold">
                You may add an activity, allow more discussion or keep the
                breathing room.
              </p>
            </>
          )}
        </div>
      </div>

      {/* FACILITATOR RESOURCES */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#725500]">
          Facilitator Resources
        </p>

        <h3 className="mt-2 text-xl font-black text-[#0D1B3D]">
          Open only what you need
        </h3>

        <div className="mt-5 space-y-3">
          <DayResources
            day={activeDay}
            delivery={delivery}
            assets={appliedLearningAssets}
            thursdayMode={thursdayMode}
          />
        </div>
      </div>
    </section>
  );
}

function LessonZone({
  zone,
  items,
  onDrop,
  onRemove,
}: {
  zone: ZoneKey;
  items: PlannerItem[];
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onRemove: (instanceId: string) => void;
}) {
  const minutes = items.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
      className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.15em] text-[#725500]">
            {ZONE_META[zone].label}
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-500">
            {ZONE_META[zone].description}
          </p>
        </div>

        <span className="w-fit rounded-full bg-white px-3 py-1 text-[10px] font-black text-slate-600">
          {minutes} MIN
        </span>
      </div>

      {items.length ? (
        <div className="mt-4 space-y-2">
          {items.map((item) => (
            <div
              key={item.instanceId}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("future-ready-source", "planner");

                event.dataTransfer.setData("future-ready-zone", zone);

                event.dataTransfer.setData(
                  "future-ready-instance",
                  item.instanceId,
                );
              }}
              className="flex cursor-grab items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm active:cursor-grabbing"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-black text-[#0D1B3D]">{item.label}</p>

                  <span className="rounded-full bg-[#EAF2FF] px-2 py-1 text-[9px] font-black text-[#24569B]">
                    {item.minutes} MIN
                  </span>
                </div>

                <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                  {item.detail}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemove(item.instanceId)}
                className="shrink-0 rounded-lg px-2 py-1 text-xs font-black text-slate-400 hover:bg-red-50 hover:text-red-700"
              >
                REMOVE
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl bg-white p-4 text-center text-xs font-bold text-slate-400">
          Drag an activity here
        </div>
      )}
    </div>
  );
}

function TimeStatus({ totalMinutes }: { totalMinutes: number }) {
  if (totalMinutes === 50) {
    return (
      <div className="rounded-2xl bg-emerald-100 px-5 py-4 text-emerald-900">
        <p className="text-[10px] font-black uppercase tracking-[0.14em]">
          Class Fit
        </p>

        <p className="mt-1 text-xl font-black">50 / 50 ✓</p>
      </div>
    );
  }

  if (totalMinutes > 50) {
    return (
      <div className="rounded-2xl bg-red-100 px-5 py-4 text-red-900">
        <p className="text-[10px] font-black uppercase tracking-[0.14em]">
          Over Time
        </p>

        <p className="mt-1 text-xl font-black">{totalMinutes} / 50</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#FFF7D6] px-5 py-4 text-[#725500]">
      <p className="text-[10px] font-black uppercase tracking-[0.14em]">
        Time Remaining
      </p>

      <p className="mt-1 text-xl font-black">{50 - totalMinutes} MIN</p>
    </div>
  );
}

function DayResources({
  day,
  delivery,
  assets,
  thursdayMode,
}: {
  day: DayKey;

  delivery: NonNullable<ReturnType<typeof getAmbassadorWeekDelivery>>;

  assets: ReturnType<typeof getAppliedLearningForWeek>;

  thursdayMode: "experience" | "classroom";
}) {
  if (day === "monday") {
    return (
      <>
        <ResourceSection title="Reflection Prompts">
          <List items={delivery.monday.reflectionPrompt} />
        </ResourceSection>

        <ResourceSection title="Organization + Follow Through">
          <List items={delivery.monday.organizationTasks} />
        </ResourceSection>

        {delivery.monday.projectWork?.length ? (
          <ResourceSection title="Project Work">
            <List items={delivery.monday.projectWork} />
          </ResourceSection>
        ) : null}

        {delivery.monday.capstoneWork?.length ? (
          <ResourceSection title="Showcase / Capstone">
            <List items={delivery.monday.capstoneWork} />
          </ResourceSection>
        ) : null}
      </>
    );
  }

  if (day === "tuesday") {
    return (
      <>
        <ResourceSection title="Tuesday Teaching Guide">
          <p className="text-sm font-semibold leading-6 text-slate-700">
            Teach the existing Future Ready™ lesson, guide discussion and
            complete the student activity. Keep the lesson active and prepare
            students for Wednesday&apos;s Applied Learning Lab.
          </p>
        </ResourceSection>

        <AppliedLearningResources assets={assets} />
      </>
    );
  }

  if (day === "wednesday") {
    return <AppliedLearningResources assets={assets} />;
  }

  if (day === "thursday") {
    if (thursdayMode === "experience") {
      return (
        <>
          <ResourceSection title="Before the Experience">
            <List items={delivery.thursday.experience.preparationQuestions} />
          </ResourceSection>

          <ResourceSection title="During the Experience">
            <List items={delivery.thursday.experience.duringExperience} />
          </ResourceSection>

          <ResourceSection title="Debrief">
            <List items={delivery.thursday.experience.debriefQuestions} />
          </ResourceSection>

          <ResourceSection title="Portfolio Evidence">
            <p className="text-sm font-semibold leading-6 text-slate-700">
              {delivery.thursday.experience.portfolioEvidence}
            </p>
          </ResourceSection>
        </>
      );
    }

    return (
      <>
        <ResourceSection title={delivery.thursday.classroom.title}>
          <p className="text-sm font-semibold leading-6 text-slate-700">
            {delivery.thursday.classroom.description}
          </p>
        </ResourceSection>

        <AppliedLearningResources assets={assets} />
      </>
    );
  }

  return (
    <>
      <ResourceSection title="Friday Closing Questions">
        <List items={delivery.friday.closingQuestions} />
      </ResourceSection>

      <ResourceSection title="Future Ready Friday™ Reminder">
        <p className="text-sm font-semibold leading-6 text-slate-700">
          Friday closes the loop: Life Economy, money decisions, accountability,
          reflection and the student&apos;s next-week commitment.
        </p>
      </ResourceSection>
    </>
  );
}

function AppliedLearningResources({
  assets,
}: {
  assets: ReturnType<typeof getAppliedLearningForWeek>;
}) {
  if (!assets.length) {
    return (
      <ResourceSection title="Applied Learning">
        <p className="text-sm font-semibold text-slate-500">
          No Applied Learning asset is assigned to this week.
        </p>
      </ResourceSection>
    );
  }

  return (
    <>
      {assets.map((asset) => (
        <details
          key={asset.id}
          className="rounded-2xl border border-slate-200 bg-slate-50"
        >
          <summary className="cursor-pointer px-5 py-4 font-black text-[#0D1B3D]">
            {asset.title} · {asset.format}
          </summary>

          <div className="space-y-4 border-t border-slate-200 p-5">
            <ResourceBlock title="Scenario" text={asset.scenario} />

            <ResourceBlock title="Student Challenge">
              <List items={asset.studentChallenge} />
            </ResourceBlock>

            {asset.curveballs?.length ? (
              <ResourceBlock title="Curveballs">
                <List items={asset.curveballs} />
              </ResourceBlock>
            ) : null}

            {asset.retryPrompt ? (
              <ResourceBlock title="Retry" text={asset.retryPrompt} />
            ) : null}

            <ResourceBlock title="Discussion Questions">
              <List items={asset.discussionQuestions} />
            </ResourceBlock>

            <details className="rounded-xl border border-[#F2B705]/50 bg-[#FFFBEA]">
              <summary className="cursor-pointer px-4 py-3 text-sm font-black text-[#725500]">
                🔐 Facilitator Answer + Reasoning Guide
              </summary>

              <div className="space-y-4 border-t border-[#F2B705]/30 p-4">
                <ResourceBlock title="Strong Responses">
                  <List items={asset.facilitatorAnswerGuide.strongResponses} />
                </ResourceBlock>

                <ResourceBlock title="Why">
                  <List items={asset.facilitatorAnswerGuide.reasoning} />
                </ResourceBlock>

                <ResourceBlock title="Coaching Points">
                  <List items={asset.facilitatorAnswerGuide.coachingPoints} />
                </ResourceBlock>
              </div>
            </details>

            {asset.athleteExtension ? (
              <ResourceBlock
                title={`🏅 Athlete Pathway · ${asset.athleteExtension.title}`}
              >
                <p className="text-sm font-semibold leading-6 text-slate-700">
                  {asset.athleteExtension.scenario}
                </p>

                <div className="mt-3">
                  <List items={asset.athleteExtension.considerations} />
                </div>
              </ResourceBlock>
            ) : null}

            {asset.portfolioEvidence ? (
              <ResourceBlock
                title="Portfolio Evidence"
                text={asset.portfolioEvidence}
              />
            ) : null}
          </div>
        </details>
      ))}
    </>
  );
}

function ResourceSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="rounded-2xl border border-slate-200 bg-slate-50">
      <summary className="cursor-pointer px-5 py-4 font-black text-[#0D1B3D]">
        {title}
      </summary>

      <div className="border-t border-slate-200 p-5">{children}</div>
    </details>
  );
}

function ResourceBlock({
  title,
  text,
  children,
}: {
  title: string;
  text?: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#725500]">
        {title}
      </p>

      {text ? (
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
          {text}
        </p>
      ) : null}

      {children ? <div className="mt-2">{children}</div> : null}
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex gap-2 text-sm font-semibold leading-6 text-slate-700"
        >
          <span className="font-black text-[#725500]">→</span>

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function clonePlan(plan: LessonPlan): LessonPlan {
  return {
    open: [...plan.open],
    connect: [...plan.connect],
    practice: [...plan.practice],
    debrief: [...plan.debrief],
    reflect: [...plan.reflect],
  };
}

function getPlanMinutes(plan: LessonPlan) {
  return (Object.values(plan) as PlannerItem[][])
    .flat()
    .reduce((total, item) => total + item.minutes, 0);
}

function option(
  id: string,
  label: string,
  type: string,
  minutes: number,
  detail: string,
): ActivityOption {
  return {
    id,
    label,
    type,
    minutes,
    detail,
  };
}

function buildActivityBank({
  day,
  week,
  delivery,
  appliedLearningAssets,
  thursdayMode,
}: {
  day: DayKey;
  week: number;

  delivery: NonNullable<ReturnType<typeof getAmbassadorWeekDelivery>>;

  appliedLearningAssets: ReturnType<typeof getAppliedLearningForWeek>;

  thursdayMode: "experience" | "classroom";
}): ActivityOption[] {
  const bank: ActivityOption[] = [];

  if (day === "monday") {
    bank.push(
      option(
        "monday-checkin",
        "Weekly Check-In",
        "OPEN",
        5,
        "Reconnect and set the tone.",
      ),

      option(
        "monday-reflection",
        "Reflection",
        "REFLECT",
        15,
        "Look back before moving forward.",
      ),

      option(
        "monday-organization",
        "Organization + Follow Through",
        "ORGANIZATION",
        20,
        "Finish work, organize evidence and plan next actions.",
      ),

      option(
        "monday-close",
        "Next Action",
        "CLOSE",
        10,
        "Leave with one clear commitment.",
      ),
    );

    if (delivery.monday.projectWork?.length) {
      bank.push(
        option(
          "monday-project",
          "Project Work",
          "PROJECT",
          20,
          delivery.monday.projectWork[0],
        ),
      );
    }

    if (delivery.monday.capstoneWork?.length) {
      bank.push(
        option(
          "monday-capstone",
          "Showcase / Capstone",
          "CAPSTONE",
          20,
          delivery.monday.capstoneWork[0],
        ),
      );
    }
  }

  if (day === "tuesday") {
    bank.push(
      option(
        `week-${week}-opener`,
        "Lesson Opener",
        "OPEN",
        5,
        "Activate prior knowledge and attention.",
      ),

      option(
        `week-${week}-core`,
        "Core Future Ready™ Lesson",
        "CORE LESSON",
        12,
        `Teach the Week ${week} skill.`,
      ),

      option(
        `week-${week}-student-activity`,
        "Student Activity",
        "PRACTICE",
        20,
        "Students use the skill during the lesson.",
      ),

      option(
        `week-${week}-discussion`,
        "Discussion",
        "DISCUSSION",
        8,
        "Connect the lesson to real life and work.",
      ),

      option(
        `week-${week}-exit`,
        "Exit Reflection",
        "REFLECTION",
        5,
        "Capture the learning before students leave.",
      ),
    );
  }

  if (
    day === "wednesday" ||
    (day === "thursday" && thursdayMode === "classroom")
  ) {
    bank.push(
      option(
        `week-${week}-setup`,
        "Set the Room",
        "OPEN",
        5,
        "Explain the scenario, roles and rules.",
      ),
    );

    appliedLearningAssets.forEach((asset) => {
      bank.push(
        option(asset.id, asset.title, asset.format, 25, asset.whyItMatters),
      );

      if (asset.curveballs?.length) {
        bank.push(
          option(
            `${asset.id}-curveball`,
            `${asset.title} · Curveball`,
            "CURVEBALL",
            7,
            "Change the situation and force a new decision.",
          ),
        );
      }

      if (asset.retryPrompt) {
        bank.push(
          option(
            `${asset.id}-retry`,
            `${asset.title} · Retry`,
            "RETRY",
            5,
            asset.retryPrompt,
          ),
        );
      }

      if (asset.athleteExtension) {
        bank.push(
          option(
            `${asset.id}-athlete`,
            asset.athleteExtension.title,
            "ATHLETE PATHWAY",
            10,
            asset.athleteExtension.scenario,
          ),
        );
      }
    });

    bank.push(
      option(
        `week-${week}-debrief`,
        "Applied Learning Debrief",
        "DEBRIEF",
        8,
        "Discuss the decision, consequence and learning.",
      ),
    );
  }

  if (day === "thursday" && thursdayMode === "experience") {
    bank.push(
      option(
        `week-${week}-experience-prep`,
        "Experience Preparation",
        "OPEN",
        5,
        delivery.thursday.experience.preparationQuestions[0] ??
          "Prepare students for the experience.",
      ),

      option(
        `week-${week}-experience`,
        "Speaker / Field Experience",
        "EXPERIENCE",
        30,
        "Guest speaker, field trip, employer or community experience.",
      ),

      option(
        `week-${week}-experience-debrief`,
        "Experience Debrief",
        "DEBRIEF",
        10,
        delivery.thursday.experience.debriefQuestions[0] ??
          "Connect the experience to Future Ready™ learning.",
      ),

      option(
        `week-${week}-experience-evidence`,
        "Portfolio Evidence",
        "EVIDENCE",
        5,
        delivery.thursday.experience.portfolioEvidence ??
          "Capture one piece of evidence from today's experience.",
      ),
    );
  }

  if (day === "friday") {
    bank.push(
      option(
        `week-${week}-heartbeat`,
        "Life Economy Heartbeat",
        "MONEY LAB",
        10,
        "Review what happened in the student economy this week.",
      ),

      option(
        `week-${week}-money`,
        "Money + Decision Review",
        "MONEY LAB",
        10,
        "Connect choices, consequences and recovery.",
      ),

      option(
        `week-${week}-friday-reflection`,
        "Friday Reflection",
        "REFLECTION",
        20,
        delivery.friday.closingQuestions[0] ?? "What did this week teach you?",
      ),

      option(
        `week-${week}-commitment`,
        "Next-Week Commitment",
        "CLOSE",
        10,
        "Students identify what they will do differently next week.",
      ),
    );
  }

  return bank;
}

function buildRecommendedPlan({
  day,
  week,
  delivery,
  appliedLearningAssets,
  thursdayMode,
}: {
  day: DayKey;
  week: number;

  delivery: NonNullable<ReturnType<typeof getAmbassadorWeekDelivery>>;

  appliedLearningAssets: ReturnType<typeof getAppliedLearningForWeek>;

  thursdayMode: "experience" | "classroom";
}): LessonPlan {
  const bank = buildActivityBank({
    day,
    week,
    delivery,
    appliedLearningAssets,
    thursdayMode,
  });

  const find = (id: string) => bank.find((item) => item.id === id);

  const plan = emptyPlan();

  function put(zone: ZoneKey, id: string) {
    const found = find(id);

    if (found) {
      plan[zone].push(createPlannerItem(found));
    }
  }

  if (day === "monday") {
    put("open", "monday-checkin");

    put("connect", "monday-reflection");

    put(
      "practice",
      delivery.monday.projectWork?.length
        ? "monday-project"
        : "monday-organization",
    );

    put("reflect", "monday-close");

    return plan;
  }

  if (day === "tuesday") {
    put("open", `week-${week}-opener`);

    put("connect", `week-${week}-core`);

    put("practice", `week-${week}-student-activity`);

    put("debrief", `week-${week}-discussion`);

    put("reflect", `week-${week}-exit`);

    return plan;
  }

  if (day === "wednesday") {
    put("open", `week-${week}-setup`);

    const primary = appliedLearningAssets[0];

    if (primary) {
      put("practice", primary.id);

      if (primary.curveballs?.length) {
        put("debrief", `${primary.id}-curveball`);
      }

      if (primary.retryPrompt) {
        put("debrief", `${primary.id}-retry`);
      }
    }

    put("reflect", `week-${week}-debrief`);

    return plan;
  }

  if (day === "thursday") {
    if (thursdayMode === "experience") {
      put("open", `week-${week}-experience-prep`);

      put("practice", `week-${week}-experience`);

      put("debrief", `week-${week}-experience-debrief`);

      put("reflect", `week-${week}-experience-evidence`);

      return plan;
    }

    put("open", `week-${week}-setup`);

    const primary = appliedLearningAssets[0];

    if (primary) {
      put("practice", primary.id);
    }

    put("debrief", `week-${week}-debrief`);

    const reflectionOption = option(
      `week-${week}-thursday-reflection`,
      "Evidence + Close",
      "REFLECTION",
      5,
      "Capture the learning and close the class.",
    );

    plan.reflect.push(createPlannerItem(reflectionOption));

    return plan;
  }

  put("open", `week-${week}-heartbeat`);

  put("connect", `week-${week}-money`);

  put("practice", `week-${week}-friday-reflection`);

  put("reflect", `week-${week}-commitment`);

  return plan;
}
