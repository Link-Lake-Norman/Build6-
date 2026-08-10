"use client";

import { useState } from "react";
import { lessons } from "@/content/lessons";

export default function LessonPage() {
  const [lessonNumber, setLessonNumber] = useState(1);
  const [reflection, setReflection] = useState("");

  const lesson =
    lessons.find((item) => item.week === lessonNumber) ??
    lessons[0];

  if (!lesson) {
    return (
      <main className="max-w-5xl mx-auto p-10">
        <h1 className="text-3xl font-bold">Lesson Not Found</h1>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-8 space-y-8">
      <div className="rounded-3xl bg-[#0D1B3D] text-white p-10">
        <p className="text-sm uppercase tracking-[0.2em] text-[#F2B705] font-bold">
          Future Ready™ Academy
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Week {lesson.week}
        </h1>

        <h2 className="mt-2 text-2xl">
          {lesson.title}
        </h2>

        <p className="mt-4 text-lg text-slate-200">
          {lesson.focus}
        </p>
      </div>

      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-[#0D1B3D]">
          Student Activity
        </h2>

        <p className="mt-4 leading-8">
          {lesson.activity}
        </p>
      </section>

      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-[#0D1B3D]">
          Reflection
        </h2>

        <p className="mt-4 text-slate-600">
          {lesson.reflection}
        </p>

        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          className="mt-6 w-full rounded-xl border p-4 min-h-[180px]"
          placeholder="Write your reflection..."
        />

        <button
          className="mt-6 rounded-xl bg-[#0D1B3D] px-6 py-3 font-bold text-white"
        >
          Save Reflection
        </button>
      </section>

      <section className="flex justify-between">
        <button
          disabled={lesson.week === 1}
          onClick={() =>
            setLessonNumber((current) => Math.max(1, current - 1))
          }
          className="rounded-xl border px-6 py-3 font-bold"
        >
          Previous
        </button>

        <button
          disabled={lesson.week === lessons.length}
          onClick={() =>
            setLessonNumber((current) =>
              Math.min(lessons.length, current + 1)
            )
          }
          className="rounded-xl bg-[#F2B705] px-6 py-3 font-bold text-[#0D1B3D]"
        >
          Next
        </button>
      </section>
    </main>
  );
}

