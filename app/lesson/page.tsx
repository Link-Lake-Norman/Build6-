"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { lessons } from "../../content/lessons";

export default function LessonPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const lessonNumber = Number(searchParams.get("lesson")) || 1;
  const phase = searchParams.get("phase");

  const lesson = lessons.find(
    (item) =>
      item.week === lessonNumber &&
      (!phase || item.phase === phase)
  );

  const [reflection, setReflection] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const savedReflection = localStorage.getItem(
      "future-ready-reflections"
    );

    if (savedReflection) {
      const reflections = JSON.parse(savedReflection);

      if (reflections[lessonNumber]) {
        setReflection(reflections[lessonNumber]);
      }
    }

    const savedProgress = localStorage.getItem(
      "future-ready-progress"
    );

    if (savedProgress) {
      const progress = JSON.parse(savedProgress);

      if (progress.includes(lessonNumber)) {
        setCompleted(true);
      }
    }
  }, [lessonNumber]);


  if (!lesson) {
    return (
      <main className="p-8">
        <h1>Lesson Not Found</h1>
        <button onClick={() => router.push("/academy")}>
          Return to Academy
        </button>
      </main>
    );
  }


  function saveReflection() {
    const saved = localStorage.getItem(
      "future-ready-reflections"
    );

    const reflections = saved
      ? JSON.parse(saved)
      : {};

    reflections[lessonNumber] = reflection;

    localStorage.setItem(
      "future-ready-reflections",
      JSON.stringify(reflections)
    );
  }


  function completeLesson() {
    saveReflection();

    const saved = localStorage.getItem(
      "future-ready-progress"
    );

    const progress = saved
      ? JSON.parse(saved)
      : [];

    if (!progress.includes(lessonNumber)) {
      progress.push(lessonNumber);
    }

    localStorage.setItem(
      "future-ready-progress",
      JSON.stringify(progress)
    );

    setCompleted(true);
  }


  return (
    <main className="min-h-screen p-8">

      <section className="mx-auto max-w-4xl">

        <p className="text-sm font-semibold">
          {lesson.phase}
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Week {lesson.week}: {lesson.title}
        </h1>


        <div className="mt-8 rounded-xl border p-6">

          <h2 className="text-xl font-bold">
            Objective
          </h2>

          <p className="mt-2">
            {lesson.objective}
          </p>


          <h2 className="mt-6 text-xl font-bold">
            Activity
          </h2>

          <p className="mt-2">
            {lesson.activity}
          </p>


          <h2 className="mt-6 text-xl font-bold">
            Reflection
          </h2>

          <p className="mt-2">
            {lesson.reflection}
          </p>


          <textarea
            value={reflection}
            onChange={(e) =>
              setReflection(e.target.value)
            }
            placeholder="Write your reflection here..."
            rows={6}
            className="mt-6 w-full rounded-lg border p-3"
          />


          <div className="mt-6 flex gap-3">

            <button
              onClick={saveReflection}
              className="rounded-lg border px-4 py-2"
            >
              Save Reflection
            </button>


            <button
              onClick={completeLesson}
              className="rounded-lg border px-4 py-2"
            >
              {completed
                ? "✅ Lesson Completed"
                : "Complete Lesson →"}
            </button>


            <button
              onClick={() =>
                router.push("/dashboard")
              }
              className="rounded-lg border px-4 py-2"
            >
              Dashboard
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}