"use client";

import { useEffect, useMemo, useState } from "react";

type LessonCompletionProps = {
  week: number;
  title: string;
  badgeEarned: string;
  portfolioEvidence: string;
};

const STUDENT_ID = "ambassador-student-001";
const STORAGE_KEY = `future-ready:${STUDENT_ID}:completed-weeks`;

function readCompletedWeeks(): number[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((value): value is number => typeof value === "number")
      .filter((value) => Number.isInteger(value) && value >= 1 && value <= 36)
      .sort((a, b) => a - b);
  } catch {
    return [];
  }
}

export default function LessonCompletion({
  week,
  title,
  badgeEarned,
  portfolioEvidence,
}: LessonCompletionProps) {
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCompletedWeeks(readCompletedWeeks());
    setHydrated(true);
  }, []);

  const isComplete = completedWeeks.includes(week);

  const progress = useMemo(
    () => Math.round((completedWeeks.length / 36) * 100),
    [completedWeeks.length],
  );

  function markComplete() {
    const next = Array.from(new Set([...completedWeeks, week])).sort(
      (a, b) => a - b,
    );

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.localStorage.setItem(
      `future-ready:${STUDENT_ID}:last-completed`,
      JSON.stringify({
        week,
        title,
        badgeEarned,
        portfolioEvidence,
        completedAt: new Date().toISOString(),
      }),
    );

    setCompletedWeeks(next);
  }

  function markIncomplete() {
    const next = completedWeeks.filter((value) => value !== week);

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCompletedWeeks(next);
  }

  if (!hydrated) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="font-bold text-slate-500">Loading lesson progress…</p>
      </section>
    );
  }

  return (
    <section
      className={`rounded-3xl border p-8 shadow-sm ${
        isComplete
          ? "border-emerald-200 bg-emerald-50"
          : "border-[#F2B705] bg-[#FFF9DF]"
      }`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#725500]">
            Student Progress
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
            {isComplete ? "Week completed" : "Ready to complete this lesson?"}
          </h2>

          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-700">
            {isComplete
              ? `${title} is saved as complete. Your badge and portfolio evidence are now recorded in this browser.`
              : `Complete the discussion, activity, reflection, and portfolio evidence before marking Week ${week} complete.`}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#0D1B3D] shadow-sm">
              {completedWeeks.length} of 36 weeks complete
            </span>

            <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#0D1B3D] shadow-sm">
              {progress}% program progress
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          {isComplete ? (
            <>
              <button
                type="button"
                onClick={markIncomplete}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-black text-slate-700"
              >
                Mark incomplete
              </button>

              <a
                href={`/ambassador/student-dashboard/${STUDENT_ID}`}
                className="rounded-xl bg-[#0D1B3D] px-6 py-3 text-center font-black text-white"
              >
                View dashboard
              </a>
            </>
          ) : (
            <button
              type="button"
              onClick={markComplete}
              className="rounded-xl bg-[#0D1B3D] px-7 py-4 font-black text-white shadow-lg"
            >
              Complete Week {week}
            </button>
          )}
        </div>
      </div>

      {isComplete ? (
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Badge unlocked
            </p>
            <p className="mt-2 text-lg font-black text-[#0D1B3D]">
              {badgeEarned}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Portfolio evidence
            </p>
            <p className="mt-2 text-lg font-black text-[#0D1B3D]">
              {portfolioEvidence}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
