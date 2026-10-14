"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

type LessonCompletionProps = {
  week: number;
  title: string;
  badgeEarned: string;
  portfolioEvidence: string;
};

type ProgressResponse = {
  studentId: string;

  program: {
    id: string;
    name: string;
    totalWeeks: number;
  };

  lesson: {
    id: string;
    title: string;
    week: number;
  };

  progress: {
    isComplete: boolean;
    percent: number;
    completedAt: string | null;
    updatedAt: string | null;
  };

  programProgress: {
    completed: number;
    progress: number;
  };
};

export default function LessonCompletion({
  week,
  title,
  badgeEarned,
  portfolioEvidence,
}: LessonCompletionProps) {
  const [data, setData] =
    useState<ProgressResponse | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  async function loadProgress() {
    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          `/api/student/lesson-progress?week=${week}`,
          {
            cache: "no-store",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to load lesson progress."
        );
      }

      setData(result);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load lesson progress."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProgress();
  }, [week]);

  async function saveCompletion(
    complete: boolean
  ) {
    setSaving(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/student/lesson-progress",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              week,
              complete,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to save lesson progress."
        );
      }

      setData(result);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to save lesson progress."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="font-bold text-slate-500">
          Loading lesson progress…
        </p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-8 shadow-sm">
        <p className="font-black text-red-800">
          {error ||
            "Lesson progress is unavailable."}
        </p>
      </section>
    );
  }

  const isComplete =
    data.progress.isComplete;

  return (
    <section
      className={`rounded-3xl border p-8 shadow-sm ${
        isComplete
          ? "border-emerald-200 bg-emerald-50"
          : "border-[#F2B705] bg-[#FFF9DF]"
      }`}
    >
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-800">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#725500]">
            Student Progress
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
            {isComplete
              ? "Week completed"
              : "Ready to complete this lesson?"}
          </h2>

          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-700">
            {isComplete
              ? `${title} is permanently saved as complete in your BUILD6™ record.`
              : `Complete the discussion, activity, reflection, and portfolio evidence before marking Week ${week} complete.`}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#0D1B3D] shadow-sm">
              {
                data.programProgress
                  .completed
              }{" "}
              of{" "}
              {
                data.program.totalWeeks
              }{" "}
              weeks complete
            </span>

            <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#0D1B3D] shadow-sm">
              {
                data.programProgress
                  .progress
              }
              % program progress
            </span>

            {data.progress.updatedAt && (
              <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-emerald-700 shadow-sm">
                ✓ Saved ·{" "}
                {new Date(
                  data.progress.updatedAt
                ).toLocaleTimeString(
                  [],
                  {
                    hour: "numeric",
                    minute: "2-digit",
                  }
                )}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          {isComplete ? (
            <>
              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  saveCompletion(false)
                }
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-black text-slate-700 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Mark incomplete"}
              </button>

              <Link
                href={`/ambassador/student-portal/${data.studentId}`}
                className="rounded-xl bg-[#0D1B3D] px-6 py-3 text-center font-black text-white"
              >
                View dashboard
              </Link>
            </>
          ) : (
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                saveCompletion(true)
              }
              className="rounded-xl bg-[#0D1B3D] px-7 py-4 font-black text-white shadow-lg disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : `Complete Week ${week}`}
            </button>
          )}
        </div>
      </div>

      {isComplete ? (
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Badge milestone
            </p>

            <p className="mt-2 text-lg font-black text-[#0D1B3D]">
              {badgeEarned}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Badge awards are managed
              separately from lesson
              completion.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              Portfolio evidence target
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
