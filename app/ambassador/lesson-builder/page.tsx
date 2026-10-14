"use client";

import { useSearchParams } from "next/navigation";

import { useEffect, useMemo, useState } from "react";
import { curriculum } from "@/content/platform";
import { lessons as sourceLessons } from "@/content/lessons";
import {
  createLessonCustomization,
  LESSON_BUILDER_PERMISSION_KEY,
  LESSON_BUILDER_STORAGE_KEY,
  type LessonCustomization,
  type LessonResource,
  type LessonResourceType,
} from "@/content/lesson-builder";

import { generateActivityOptions, AI_ACTIVITY_OPTIONS } from "@/content/ai-lesson-generator";
import { BUILD6_GAME_MODES, gameModeToActivityType, type Build6GameMode, type Build6GameModifier } from "@/content/build6-game-engine";
import { readBuild6UsedCaseIds, rememberBuild6Cases } from "@/content/build6-case-ledger";
import Build6ActivityPresentation from "@/components/ambassador/Build6ActivityPresentation";

import type {
  AIGeneratedActivity,
  AIActivityType,
} from "@/content/ai-activity-types";


type PermissionSnapshot = {
  facilitatorLessonBuilder?: boolean;
  facilitatorAddActivities?: boolean;
  facilitatorUploadLessonResources?: boolean;
  facilitatorPublishLessonChanges?: boolean;
  facilitatorEditCoreCurriculum?: boolean;
};


const resourceTypes: LessonResourceType[] = [
  "Facilitator Guide",
  "Student Workbook",
  "Slides",
  "Activity",
  "Role Play",
  "Improv",
  "Case Scenario",
  "Video",
  "Handout",
  "Link",
];


function loadCustomizations(): LessonCustomization[] {
  try {
    const saved = window.localStorage.getItem(
      LESSON_BUILDER_STORAGE_KEY
    );

    return saved
      ? (JSON.parse(saved) as LessonCustomization[])
      : [];
  } catch {
    return [];
  }
}


function loadPermissions(): PermissionSnapshot {
  try {
    const saved = window.localStorage.getItem(
      LESSON_BUILDER_PERMISSION_KEY
    );

    return saved
      ? (JSON.parse(saved) as PermissionSnapshot)
      : {};
  } catch {
    return {};
  }
}


export default function LessonBuilderPage() {

  const searchParams = useSearchParams();
  const initialWeek = Math.min(
    16,
    Math.max(1, Number(searchParams.get("week") ?? "1") || 1),
  );
  const [week, setWeek] = useState(initialWeek);

  const [customizations, setCustomizations] =
    useState<LessonCustomization[]>([]);

  const [permissions, setPermissions] =
    useState<PermissionSnapshot>({});

  const [aiActivities, setAiActivities] =
    useState<AIGeneratedActivity[]>([]);
  const [presentationError, setPresentationError] = useState("");

  const [generationVariation, setGenerationVariation] =
    useState(0);

  const [selectedAIType, setSelectedAIType] =
    useState<AIActivityType>("Role Play");

  const [selectedGameMode, setSelectedGameMode] =
    useState<Build6GameMode>("Improv Game");

  const [gameModifiers, setGameModifiers] =
    useState<Build6GameModifier[]>(["MORE_FUN"]);


  useEffect(() => {

    setCustomizations(loadCustomizations());

    setPermissions(loadPermissions());

  }, []);



  const richLesson = curriculum.find(
    (item) => item.week === week
  );
  const canonicalLesson = sourceLessons.find(
    (item) => item.week === week
  );
  const lesson = richLesson ?? canonicalLesson;


  const customization = useMemo(() => {

    return (
      customizations.find(
        (item) => item.week === week
      ) ??
      createLessonCustomization(week)
    );

  }, [customizations, week]);



  function generateAIActivity() {
    if (!lesson) return;
    const nextVariation = generationVariation + 1;
    try {
      const results = generateActivityOptions({
        week,
        day: searchParams.get("day") ?? "Current Teaching Day",
        topic: lesson.title,
        objective: "objective" in lesson ? String(lesson.objective) : lesson.focus,
        activityType: gameModeToActivityType(selectedGameMode),
        audience: "Ambassador Christian School BUILD6™ Students",
        gameMode: selectedGameMode,
        gameModifiers,
        variation: nextVariation,
        availableMinutes: 12,
        excludedCaseIds: readBuild6UsedCaseIds(),
      });
      const next = results;
      next.forEach(rememberBuild6Cases);
      setGenerationVariation(nextVariation);
      setAiActivities(next);
      setPresentationError("");
    } catch (error) {
      setPresentationError(error instanceof Error ? error.message : "Activity generation failed.");
    }
  }

  return (

    <main className="space-y-8 p-8">


      <section className="rounded-3xl bg-[#0D1B3D] p-8 text-white">

        <p className="text-sm font-bold uppercase text-[#F2B705]">
          BUILD6™ Lesson Builder
        </p>

        <h1 className="mt-3 text-4xl font-black">
          AI Powered Classroom Planning
        </h1>

        <p className="mt-3 text-slate-200">
          Create BUILD6™ games, improv, role plays, team challenges and applied experiences connected to each lesson.
        </p>

      </section>



      <section className="rounded-3xl border bg-white p-6 shadow-sm">

        <h2 className="text-2xl font-black text-[#0D1B3D]">
          AI Activity Generator
        </h2>


        <p className="mt-2 text-slate-600">
          Generate active, low-screen BUILD6™ experiences tied to the current lesson. Students should move, speak, decide, react and practice real skills.
        </p>


        <div className="mt-5 rounded-2xl border border-[#E2B93B]/50 bg-[#FFFDF5] p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8A6300]">BUILD6™ GAME MODE</p>
          <p className="mt-1 text-sm text-slate-600">Generate something students do — improv, movement, role play, competition, professional scenarios and real decisions — not another worksheet or lecture.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {BUILD6_GAME_MODES.map((mode) => (
              <button key={mode} type="button" onClick={() => { setSelectedGameMode(mode); setSelectedAIType(gameModeToActivityType(mode)); }} className={`rounded-xl border px-3 py-2 text-sm font-black ${selectedGameMode === mode ? "border-[#0D1B3D] bg-[#0D1B3D] text-white" : "bg-white text-[#0D1B3D]"}`}>{mode}</button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {([
              ["MORE_FUN", "🎉 Make It More Fun"], ["MORE_IMPROV", "🎭 Make It Improv"], ["MORE_COMPETITIVE", "🏁 Make It Competitive"],
              ["FIVE_MINUTES", "⚡ Make It 5 Minutes"], ["TEAM_BASED", "👥 Make It Team-Based"], ["CHALLENGE_READY", "🎯 Turn Into I Challenge You"],
            ] as [Build6GameModifier, string][]).map(([modifier, label]) => { const active = gameModifiers.includes(modifier); return (
              <button key={modifier} type="button" onClick={() => setGameModifiers((current) => active ? current.filter((item) => item !== modifier) : [...current, modifier])} className={`rounded-xl border px-3 py-2 text-sm font-bold ${active ? "border-[#F2B705] bg-[#FFF2B8] text-[#0D1B3D]" : "bg-white text-slate-700"}`}>{label}</button>
            ); })}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">

          {AI_ACTIVITY_OPTIONS.map((type) => (

            <button

              key={type}

              onClick={() =>
                setSelectedAIType(
                  type
                )
              }

              className={`rounded-xl border px-4 py-2 font-bold ${
            selectedAIType === type
              ? "bg-[#F2B705] text-[#0D1B3D]"
              : "bg-white"
          }`}

            >

              {type}

            </button>

          ))}


          <button

            onClick={generateAIActivity}

            className="rounded-xl bg-[#F2B705] px-5 py-2 font-black text-[#0D1B3D]"

          >

            {aiActivities.length > 0
              ? "Regenerate Activity"
              : "Generate Activity"}

          </button>


        </div>



          {presentationError && <p role="alert" className="mt-3 text-red-700">{presentationError}</p>}

        <div className="mt-6 space-y-5">


          {aiActivities.map(
            (activity, index) => (

            <div
              key={index}
              className="rounded-2xl border p-5 space-y-5"
            >

              <h3 className="text-xl font-black">
                {activity.title}
              </h3>

              <p>
                {activity.learningObjective}
              </p>

              <Build6ActivityPresentation activity={activity} week={week} day={searchParams.get("day") ?? "Current Teaching Day"} />

              <h4 className="mt-4 font-bold">
                Why This Matters
              </h4>

              <p>
                {activity.whyThisMatters}
              </p>

              <h4 className="mt-4 font-bold">
                Classroom Setup
              </h4>

              <p>
                {activity.classroomSetup}
              </p>

              <h4 className="mt-4 font-bold">
                Student Roles
              </h4>

              <ul className="list-disc pl-5">
                {activity.studentRoles.map((role) => (
                  <li key={role.role}>
                    {role.role}: {role.responsibility}
                  </li>
                ))}
              </ul>

              <h4 className="mt-4 font-bold">
                Facilitator Script
              </h4>

              <ul className="list-disc pl-5">
                {activity.facilitatorScript.map((line) => (
                  <li key={line}>
                    {line}
                  </li>
                ))}
              </ul>

              <h4 className="mt-4 font-bold">
                Materials
              </h4>

              <ul className="list-disc pl-5">
                {activity.materials.map((item) => (
                  <li key={item}>
                    {item}
                  </li>
                ))}
              </ul>

              <h4 className="mt-4 font-bold">
                Directions
              </h4>

              <ol className="list-decimal pl-5">
                {activity.stepByStepInstructions.map((step) => (
                  <li key={step}>
                    {step}
                  </li>
                ))}
              </ol>

              <h4 className="mt-4 font-bold">
                Reflection Prompts
              </h4>

              <ul className="list-disc pl-5">
                {activity.reflectionPrompts.map((prompt) => (
                  <li key={prompt}>
                    {prompt}
                  </li>
                ))}
              </ul>

              <h4 className="mt-4 font-bold">
                Portfolio Evidence
              </h4>

              <p>
                {activity.portfolioEvidence}
              </p>

              <h4 className="mt-4 font-bold">
                Capstone Connection
              </h4>

              <p>
                {activity.capstoneConnection}
              </p>

            </div>

          ))}


        </div>


      </section>



      <section className="rounded-3xl border bg-white p-6">

        <h2 className="text-2xl font-black">
          Lesson Customization
        </h2>


        <p className="mt-3 text-slate-600">
          Week {week}: {lesson?.title}
        </p>


      </section>



    </main>

  );

}
