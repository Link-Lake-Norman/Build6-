"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  curriculum,
  students,
} from "@/content/platform";

type ReflectionRecord = {
  week: number;
  response: string;
  updatedAt: string;
};

export default function ReflectionJournalPage() {
  const params = useParams<{ id: string }>();
  const studentId = params.id;

  const student = useMemo(
    () =>
      students.find(
        (item) => item.id === studentId
      ),
    [studentId]
  );

  const [selectedWeek, setSelectedWeek] =
    useState(1);

  const [response, setResponse] =
    useState("");

  const [saved, setSaved] = useState(false);

  const storageKey =
    `future-ready-v2-reflections-${studentId}`;

  const lesson = curriculum.find(
    (item) => item.week === selectedWeek
  );

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      setResponse("");
      return;
    }

    try {
      const records =
        JSON.parse(stored) as ReflectionRecord[];

      const current = records.find(
        (item) =>
          item.week === selectedWeek
      );

      setResponse(current?.response ?? "");
    } catch {
      localStorage.removeItem(storageKey);
      setResponse("");
    }
  }, [selectedWeek, storageKey]);

  function saveReflection() {
    const stored = localStorage.getItem(storageKey);

    let records: ReflectionRecord[] = [];

    if (stored) {
      try {
        records = JSON.parse(stored);
      } catch {
        records = [];
      }
    }

    const nextRecord: ReflectionRecord = {
      week: selectedWeek,
      response,
      updatedAt: new Date().toISOString(),
    };

    const filtered = records.filter(
      (item) =>
        item.week !== selectedWeek
    );

    localStorage.setItem(
      storageKey,
      JSON.stringify([
        ...filtered,
        nextRecord,
      ])
    );

    setSaved(true);
  }

  if (!student) {
    return (
      <div className="rounded-3xl bg-white p-8">
        Student not found.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="rounded-3xl bg-[#0D1B3D] px-8 py-10 text-white">
        <Link
          href={`/ambassador/student-passport/${student.id}`}
          className="font-bold text-[#F2B705]"
        >
          ← Back to Student Passport
        </Link>

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-[#F2B705]">
          Future Ready™ Reflection Journal
        </p>

        <h1 className="mt-3 text-4xl font-black">
          My Growth Journal
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
          Reflect on lessons, experiences, skills, goals,
          and progress throughout the 36-week journey.
        </p>
      </header>

      <section className="grid gap-8 xl:grid-cols-[0.35fr_0.65fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-[#0D1B3D]">
            Select Week
          </h2>

          <div className="mt-6 grid grid-cols-4 gap-2 xl:grid-cols-3">
            {curriculum.map((week) => (
              <button
                key={week.week}
                type="button"
                onClick={() => {
                  setSelectedWeek(week.week);
                  setSaved(false);
                }}
                className={`rounded-xl border-2 px-3 py-3 font-black ${
                  selectedWeek === week.week
                    ? "border-[#F2B705] bg-[#FFF3C4] text-[#0D1B3D]"
                    : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                {week.week}
              </button>
            ))}
          </div>
        </aside>

        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
            Week {selectedWeek}
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
            {lesson?.title}
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            {lesson?.discussionQuestions[0]}
          </p>

          <textarea
            value={response}
            onChange={(event) => {
              setResponse(event.target.value);
              setSaved(false);
            }}
            placeholder="Write your reflection here..."
            className="mt-7 min-h-72 w-full rounded-2xl border border-slate-300 p-5 text-lg leading-8 outline-none transition focus:border-[#F2B705] focus:ring-4 focus:ring-[#F2B705]/20"
          />

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={saveReflection}
              className="rounded-xl bg-[#F2B705] px-7 py-4 font-black text-[#0D1B3D]"
            >
              Save Reflection
            </button>

            {saved ? (
              <p className="font-black text-emerald-700">
                Reflection saved.
              </p>
            ) : null}
          </div>
        </article>
      </section>
    </div>
  );
}
