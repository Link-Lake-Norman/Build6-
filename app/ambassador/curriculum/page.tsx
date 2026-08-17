"use client";

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
  dayNumber: number | null;
  enabled: boolean;
  required: boolean;
  visibleToStudent: boolean;
  visibleToFacilitator: boolean;
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
};

const tabs: { key: HubTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "lesson", label: "Lesson Plan" },
  { key: "activities", label: "Activities + AI" },
  { key: "assignments", label: "Assignments" },
  { key: "resources", label: "Resources" },
  { key: "calendar", label: "Calendar" },
  { key: "release", label: "Release" },
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
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeTab, setActiveTab] = useState<HubTab>("overview");
  const [showFullTools, setShowFullTools] = useState(false);

  const [data, setData] = useState<TeachingHubResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [facilitatorNotes, setFacilitatorNotes] = useState("");

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
      setFacilitatorNotes(typedResult.delivery?.facilitatorNotes ?? "");
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

      setFacilitatorNotes(result.delivery?.facilitatorNotes ?? "");

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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function openResourceHub() {
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

  const phase = richLesson?.phase ?? lesson.module.phase ?? "Launch Ready";

  const objective =
    richLesson?.objective ?? sourceContent?.focus ?? lesson.summary ?? "";

  const studentActivity =
    richLesson?.studentActivity ?? sourceContent?.activity ?? "";

  const reflection = sourceContent?.reflection ?? "";

  const workplaceConnection =
    richLesson?.workplaceConnection ??
    "Connect this lesson to professional expectations, career readiness, and real workplace experiences.";

  const skillsEarned = richLesson?.skillsEarned ?? [];

  const portfolioEvidence =
    richLesson?.portfolioEvidence ?? "Future Ready™ Portfolio Evidence";

  const badgeEarned = richLesson?.badgeEarned ?? "Future Ready™ Skill Badge";

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
  }[] = [];

  const homework: string | null = null;

  return (
    <main className="space-y-6">
      <section className="rounded-3xl bg-[#0D1B3D] p-7 text-white shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">
              Future Ready™ Curriculum & Teaching Hub
            </p>

            <h1 className="mt-3 text-3xl font-black md:text-4xl">
              Plan. Teach. Release. Track.
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200">
              One teaching workspace for curriculum, classroom planning,
              activities, assignments, resources, scheduling, and student
              release controls.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#F2B705]">
              Current Implementation
            </p>

            <p className="mt-2 font-black">Ambassador Christian School</p>

            <p className="mt-1 text-sm text-slate-300">{data.cohort.name}</p>
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

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard
          label="Program Format"
          value={`${data.program.totalWeeks} Week`}
        />

        <SummaryCard label="Current Week" value={`Week ${selectedWeek}`} />

        <SummaryCard label="Phase" value={phase} />

        <SummaryCard
          label="Student Release"
          value={delivery?.releasedToStudents ? "Released" : "Not Released"}
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
              Curriculum Navigator
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
              Choose a Week
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={previousWeek}
              disabled={selectedWeek === 1 || loading}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-[#0D1B3D] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous Week
            </button>

            <button
              type="button"
              onClick={nextWeek}
              disabled={selectedWeek === 16 || loading}
              className="rounded-xl bg-[#0D1B3D] px-4 py-2 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next Week →
            </button>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
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
      </section>


      <section className="overflow-hidden rounded-[28px] border-2 border-[#0D1B3D] bg-white shadow-sm">
        <div className="bg-[#0D1B3D] px-6 py-6 text-white md:px-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">
            THIS WEEK
          </p>

          <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-black md:text-3xl">
                Week {lesson.weekNumber}: {lesson.title}
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-200">
                Your teaching essentials first. Open the deeper sections only
                when you need additional guidance, activities, resources, or
                customization.
              </p>
            </div>

            <span className="w-fit rounded-full bg-[#F2B705] px-4 py-2 text-xs font-black text-[#0D1B3D]">
              TEACHING VIEW
            </span>
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3 md:p-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4B2265]">
              TEACH
            </p>
            <h3 className="mt-2 font-black text-[#0D1B3D]">
              {lesson.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {workplaceConnection ||
                "Use this week's lesson objective and facilitator guidance to lead the session."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#007C7C]">
              DO
            </p>
            <h3 className="mt-2 font-black text-[#0D1B3D]">
              Primary Student Activity
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {studentActivity || "Open the lesson plan for this week's activity."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#725500]">
              COMPLETE
            </p>
            <h3 className="mt-2 font-black text-[#0D1B3D]">
              Assessment / Student Evidence
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {lesson.weekNumber === 1
                ? "Day 1 Future Ready™ Assessment"
                : "Complete the assessment, reflection, or evidence connected to this week's lesson."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4B2265]">
              HOMEWORK / CAPSTONE
            </p>
            <h3 className="mt-2 font-black text-[#0D1B3D]">
              {lesson.weekNumber === 1
                ? "Capstone Brainstorm — My Story Brain Map"
                : "Weekly Follow-Up"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {lesson.weekNumber === 1
                ? "Students begin Chapter Zero by brainstorming the story they want their Future Ready™ Capstone to tell."
                : homework || "Use the lesson follow-up or Capstone connection assigned for this week."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#007C7C]">
              EVIDENCE
            </p>
            <h3 className="mt-2 font-black text-[#0D1B3D]">
              Student Record / Portfolio
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {portfolioEvidence}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#725500]">
              MATERIALS
            </p>
            <h3 className="mt-2 font-black text-[#0D1B3D]">
              Prepare Before Class
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Open Resources for slides, workbook pages, handouts, videos,
              downloads, and supplemental materials connected to this week.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-[#F8FAFC] px-6 py-4 md:px-8">
          <p className="text-sm font-bold text-[#0D1B3D]">
            Need more? Your complete Future Ready™ teaching system is preserved
            below. Expand only the section you need.
          </p>
        </div>
      </section>


      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
              PILOT DAILY WORKSPACE
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#0D1B3D] md:text-3xl">
              Daily Map
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Choose the class day. Future Ready™ pulls the lesson flow,
              discussion, student work, follow-up, Capstone connection, and
              available resources into one teaching view.
            </p>
          </div>

          <Link
            href="/ambassador/planner"
            className="w-fit rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white"
          >
            Customize Daily Plan →
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
                    {totalMinutes || lesson.estimatedMinutes} MIN
                  </span>
                </div>
              </div>

              <div className="grid gap-5 bg-[#F8FAFC] p-6 lg:grid-cols-2 md:p-8">

                {/* AGENDA */}
                <DailyPilotCard
                  eyebrow="1 · AGENDA"
                  title="Today's Flow"
                >
                  {dayTasks.length > 0 ? (
                    <div className="space-y-3">
                      {dayTasks.map((task) => (
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

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {task.instructions}
                          </p>
                        </div>
                      ))}
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
                  eyebrow="2 · DISCUSS"
                  title="Questions & Conversation"
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
                  eyebrow="3 · STUDENT ACTION"
                  title="What Students Do"
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
                  eyebrow="4 · FOLLOW-UP"
                  title="Reflection / Homework"
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
                  eyebrow="5 · CAPSTONE"
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
                  eyebrow="6 · MATERIALS"
                  title="Worksheets, Printables & Media"
                >

                  {selectedWeek <= 4 && (
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

                      <div className="mt-4 space-y-3">
                        {[
                          {
                            label: "Student Workbook",
                            file: "Student-Workbook.pdf",
                            format: "PDF",
                            use: "Student pages / printable workbook",
                          },
                          {
                            label: "Student Workbook",
                            file: "Student-Workbook.docx",
                            format: "DOCX",
                            use: "Editable student workbook",
                          },
                          {
                            label: "Slides",
                            file: "Slides.pptx",
                            format: "PPTX",
                            use: "Class presentation",
                          },
                          {
                            label: "Activity Kit",
                            file: "Activity-Kit.pdf",
                            format: "PDF",
                            use: "Activities / role plays / classroom work",
                          },
                          {
                            label: "Activity Kit",
                            file: "Activity-Kit.docx",
                            format: "DOCX",
                            use: "Editable activity materials",
                          },
                          {
                            label: "Assessment Rubric",
                            file: "Assessment-Rubric.pdf",
                            format: "PDF",
                            use: "Assessment / facilitator reference",
                          },
                          {
                            label: "Assessment Rubric",
                            file: "Assessment-Rubric.docx",
                            format: "DOCX",
                            use: "Editable assessment rubric",
                          },
                          {
                            label: "Portfolio Artifact",
                            file: "Portfolio-Artifact.pdf",
                            format: "PDF",
                            use: "Portfolio / evidence printable",
                          },
                          {
                            label: "Portfolio Artifact",
                            file: "Portfolio-Artifact.docx",
                            format: "DOCX",
                            use: "Editable portfolio evidence",
                          },
                          {
                            label: "Facilitator Guide",
                            file: "Facilitator-Guide.pdf",
                            format: "PDF",
                            use: "Teacher guide / facilitation notes",
                          },
                          {
                            label: "Facilitator Guide",
                            file: "Facilitator-Guide.docx",
                            format: "DOCX",
                            use: "Editable facilitator guide",
                          },
                        ].map((asset) => {
                          const weekCode = String(selectedWeek).padStart(2, "0");

                          const fileName =
                            `Future-Ready-Week-${weekCode}-${asset.file}`;

                          const openUrl =
                            `/api/ambassador/download/${weekCode}/${encodeURIComponent(
                              fileName
                            )}`;

                          const downloadUrl = `${openUrl}?download=1`;

                          return (
                            <div
                              key={fileName}
                              className="rounded-xl border border-slate-200 bg-white p-3"
                            >
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-sm font-black text-[#0D1B3D]">
                                      {asset.label}
                                    </p>

                                    <span className="rounded-full bg-[#EAFBFB] px-2 py-1 text-[9px] font-black text-[#007C7C]">
                                      {asset.format}
                                    </span>
                                  </div>

                                  <p className="mt-1 text-xs text-slate-500">
                                    {asset.use}
                                  </p>
                                </div>

                                <div className="flex shrink-0 flex-wrap gap-2">
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
                                    className="rounded-lg bg-[#0D1B3D] px-3 py-2 text-[11px] font-black text-white"
                                  >
                                    Download
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedWeek > 4 && (
                    <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm font-black text-amber-900">
                        Core packaged downloads for Week {selectedWeek} have not
                        been added to the protected resource library yet.
                      </p>
                    </div>
                  )}

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
                            className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3"
                          >
                            <div>
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
                                <span className="mt-2 inline-flex rounded-full bg-amber-100 px-2 py-1 text-[10px] font-black text-amber-800">
                                  REQUIRED
                                </span>
                              )}
                              </div>
                            </div>

                            {resource.url && (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noreferrer"
                                className="shrink-0 text-xs font-black text-[#24569B]"
                              >
                                OPEN →
                              </a>
                            )}
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
                  eyebrow="7 · ASSIGNMENTS"
                  title="Assignments & Evidence"
                >
                  {data.assignments.filter(
                    (assignment) =>
                      assignment.dayNumber === null ||
                      assignment.dayNumber === selectedDay
                  ).length > 0 ? (
                    <div className="space-y-3">
                      {data.assignments
                        .filter(
                          (assignment) =>
                            assignment.dayNumber === null ||
                            assignment.dayNumber === selectedDay
                        )
                        .map((assignment) => (
                        <div
                          key={assignment.id}
                          className="rounded-xl border border-slate-200 bg-white p-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <p className="font-black text-[#0D1B3D]">
                              {assignment.title}
                            </p>

                            <span className="rounded-full bg-[#EAFBFB] px-2 py-1 text-[10px] font-black text-[#007C7C]">
                              {assignment.dayNumber
                                ? `DAY ${assignment.dayNumber}`
                                : "SHARED"}
                            </span>
                          </div>

                          <p className="mt-1 text-sm">
                            {assignment.instructions}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-black text-slate-500">
                            <span>{assignment.requirement}</span>
                            <span>• {assignment.estimatedMinutes} min</span>

                            {assignment.portfolioEligible && (
                              <span>• PORTFOLIO</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>
                      No additional lesson assignments have been created for
                      this week.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setShowFullTools(true);
                      setActiveTab("assignments");

                      window.setTimeout(() => {
                        document
                          .getElementById("future-ready-assignments")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }, 200);
                    }}
                    className="mt-4 rounded-xl border border-[#0D1B3D] px-4 py-2 text-xs font-black text-[#0D1B3D]"
                  >
                    Manage Assignments →
                  </button>
                </DailyPilotCard>

                {/* SPEAKER/TRIP */}
                <DailyPilotCard
                  eyebrow="8 · REAL WORLD"
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
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
              MORE TEACHING TOOLS
            </p>

            <h2 className="mt-1 text-xl font-black text-[#0D1B3D]">
              Need More Than the Daily Map?
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              The Daily Map is the primary pilot teaching view. Open the full
              system only when you need deeper lesson guidance, assignments,
              resources, calendar tools, release controls, or customization.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowFullTools((current) => !current)}
            className="w-fit rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white"
          >
            {showFullTools
              ? "Hide Full Teaching Tools"
              : "Open Full Teaching Tools"}
          </button>
        </div>
      </section>

      {showFullTools && (
        <TeacherGuideSection
          title="Weekly Delivery Map"
          description="Open the full delivery rhythm, daily flow, and teaching sequence."
        >
          <AmbassadorWeekDeliveryConsole week={lesson.weekNumber} />
        </TeacherGuideSection>
      )}

      {showFullTools && (
        <AppliedLearningTeachingHub week={lesson.weekNumber} />
      )}

      <section
        className={`${
          showFullTools ? "" : "hidden"
        } rounded-3xl border border-slate-200 bg-white p-6 shadow-sm`}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
              Ambassador Weekly Rhythm
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
          showFullTools ? "" : "hidden"
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
                  {delivery?.releasedToStudents ? "RELEASED" : "NOT RELEASED"}
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
                  onClick={() =>
                    patchDelivery(
                      {
                        facilitatorNotes,
                      },
                      "Facilitator notes saved.",
                    )
                  }
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
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-black text-[#0D1B3D]">
                    + Add Assignment
                  </h3>
                  <p className="text-sm text-slate-600">
                    Create the assignment students will complete for this
                    lesson.
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
                  onClick={createAssignment}
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
                    {delivery?.releasedToStudents ? "Released" : "Not Released"}
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
                              ? `Week ${lesson.weekNumber} removed from student release.`
                              : `Week ${lesson.weekNumber} released to students.`,
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
                            ? "Unrelease Lesson"
                            : "Release Lesson"}
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

      <section className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
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
          className="rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white disabled:opacity-40"
        >
          Next Week →
        </button>
      </section>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-black text-[#0D1B3D]">{value}</p>
    </div>
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
