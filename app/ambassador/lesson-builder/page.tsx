"use client";

import { useEffect, useMemo, useState } from "react";
import { curriculum } from "@/content/platform";
import {
  createLessonCustomization,
  LESSON_BUILDER_PERMISSION_KEY,
  LESSON_BUILDER_STORAGE_KEY,
  type LessonCustomization,
  type LessonResource,
  type LessonResourceType,
} from "@/content/lesson-builder";

import {
  generateActivityOptions,
} from "@/content/ai-lesson-generator";

import type {
  AIGeneratedActivity,
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

  const [week, setWeek] = useState(1);

  const [customizations, setCustomizations] =
    useState<LessonCustomization[]>([]);

  const [permissions, setPermissions] =
    useState<PermissionSnapshot>({});

  const [aiActivities, setAiActivities] =
    useState<AIGeneratedActivity[]>([]);

  const [generationVariation, setGenerationVariation] =
    useState(0);

  const [selectedAIType, setSelectedAIType] =
    useState<
      | "Role Play"
      | "Case Scenario"
      | "Improv"
      | "Team Building"
      | "Pop Quiz"
      | "Media Practice"
      | "Career Connection"
      | "Capstone Workshop"
      | "Guest Speaker Preparation"
    >("Role Play");


  useEffect(() => {

    setCustomizations(loadCustomizations());

    setPermissions(loadPermissions());

  }, []);



  const lesson = curriculum.find(
    (item) => item.week === week
  );


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

    const results = generateActivityOptions({
      week,
      day: "Class Session",
      topic: lesson.title,
      objective: lesson.objective,
      activityType: selectedAIType,
      audience:
        "Ambassador Christian School Future Ready Students",
      variation: nextVariation,
    });

    setGenerationVariation(nextVariation);

    setAiActivities(
      results.filter(
        (activity) =>
          activity.activityType === selectedAIType
      )
    );
  }



  return (

    <main className="space-y-8 p-8">


      <section className="rounded-3xl bg-[#0D1B3D] p-8 text-white">

        <p className="text-sm font-bold uppercase text-[#F2B705]">
          Future Ready™ Lesson Builder
        </p>

        <h1 className="mt-3 text-4xl font-black">
          AI Powered Classroom Planning
        </h1>

        <p className="mt-3 text-slate-200">
          Create activities, discussions, assessments,
          and classroom experiences connected to each lesson.
        </p>

      </section>



      <section className="rounded-3xl border bg-white p-6 shadow-sm">

        <h2 className="text-2xl font-black text-[#0D1B3D]">
          AI Activity Generator
        </h2>


        <p className="mt-2 text-slate-600">
          Generate supplemental activities based on the
          current Future Ready™ lesson.
        </p>


        <div className="mt-5 flex flex-wrap gap-3">

          {[
            "Role Play",
            "Case Scenario",
            "Improv",
            "Team Building",
            "Pop Quiz",
          ].map((type) => (

            <button

              key={type}

              onClick={() =>
                setSelectedAIType(
                  type as
                  | "Role Play"
                  | "Case Scenario"
                  | "Improv"
                  | "Team Building"
                  | "Pop Quiz"
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
