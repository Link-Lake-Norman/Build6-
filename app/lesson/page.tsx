"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { lessons } from "../../content/lessons";

export default function LessonPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const lessonNumber =
    Number(searchParams.get("lesson")) || 1;

  const lesson = lessons.find(
    (item) => item.week === lessonNumber
  );

  const [reflection, setReflection] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const savedReflection =
      localStorage.getItem("future-ready-reflections");

    if (savedReflection) {
      const reflections = JSON.parse(savedReflection);

      if (reflections[lessonNumber]) {
        setReflection(reflections[lessonNumber]);
      }
    }

    const savedProgress =
      localStorage.getItem("future-ready-progress");

    if (savedProgress) {
      const progress = JSON.parse(savedProgress);

      if (progress.includes(lessonNumber)) {
        setCompleted(true);
      }
    }
  }, [lessonNumber]);


  if (!lesson) {
    return (
      <main>
        <h1>Lesson Not Found</h1>
      </main>
    );
  }


  function saveReflection() {
    const saved =
      localStorage.getItem(
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

    const saved =
      localStorage.getItem(
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
    <main>

      <section className="hero">
        <h1>
          Future Ready™ Academy
        </h1>

        <p>
          {lesson.phase}
        </p>

        <h2>
          Week {lesson.week}: {lesson.title}
        </h2>
      </section>


      <section className="journey-card">

        <h3>
          Objective
        </h3>

        <p>
          {lesson.objective}
        </p>


        <h3>
          Activity
        </h3>

        <p>
          {lesson.activity}
        </p>


        <h3>
          Reflection
        </h3>

        <p>
          {lesson.reflection}
        </p>


        <textarea
          value={reflection}
          onChange={(e) =>
            setReflection(e.target.value)
          }
          placeholder="Write your reflection here..."
          rows={6}
          style={{
            width: "100%",
            marginTop: "20px",
          }}
        />


        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "12px",
          }}
        >

          <button onClick={saveReflection}>
            Save Reflection
          </button>


          <button onClick={completeLesson}>
            {completed
              ? "✅ Lesson Completed"
              : "Complete Lesson →"}
          </button>


          <button
            onClick={() =>
              router.push("/dashboard")
            }
          >
            Dashboard
          </button>

        </div>

      </section>

    </main>
  );
}