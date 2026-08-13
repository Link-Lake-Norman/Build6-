"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ReflectionItem = {
  lessonId: string;
  week: number;
  lessonTitle: string;
  reflection: {
    id: string;
    prompt: string;
    response: string;
    status: string;
    submittedAt: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

type ReflectionResponse = {
  reflections: ReflectionItem[];
};

export default function ReflectionJournalPage() {
  const params = useParams<{ id: string }>();
  const studentId = params.id;

  const [items, setItems] =
    useState<ReflectionItem[]>([]);

  const [selectedWeek, setSelectedWeek] =
    useState(1);

  const [response, setResponse] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [savedAt, setSavedAt] =
    useState<string | null>(null);

  const selectedItem = useMemo(
    () =>
      items.find(
        (item) =>
          item.week === selectedWeek
      ) ?? null,
    [items, selectedWeek]
  );

  useEffect(() => {
    async function loadReflections() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetch(
          `/api/student/reflections?studentId=${encodeURIComponent(
            studentId
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data =
          (await result.json()) as
            | ReflectionResponse
            | { error?: string };

        if (!result.ok) {
          throw new Error(
            "error" in data && data.error
              ? data.error
              : "Unable to load reflections."
          );
        }

        const reflectionData =
          (data as ReflectionResponse)
            .reflections ?? [];

        setItems(reflectionData);

        const firstAvailable =
          reflectionData[0]?.week ?? 1;

        setSelectedWeek((current) =>
          reflectionData.some(
            (item) =>
              item.week === current
          )
            ? current
            : firstAvailable
        );
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load reflections."
        );
      } finally {
        setLoading(false);
      }
    }

    loadReflections();
  }, [studentId]);

  useEffect(() => {
    setResponse(
      selectedItem?.reflection
        ?.response ?? ""
    );

    setSavedAt(
      selectedItem?.reflection
        ?.updatedAt ?? null
    );
  }, [selectedItem]);

  async function saveReflection(
    submit = false
  ) {
    if (!selectedItem) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const prompt =
        `Reflection for Week ${selectedItem.week}: ${selectedItem.lessonTitle}`;

      const result = await fetch(
        "/api/student/reflections",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            studentId,
            week: selectedItem.week,
            prompt,
            response,
            submit,
          }),
        }
      );

      const data = await result.json();

      if (!result.ok) {
        throw new Error(
          data.error ??
            "Unable to save reflection."
        );
      }

      const updatedAt =
        data.reflection.updatedAt;

      setSavedAt(updatedAt);

      setItems((current) =>
        current.map((item) =>
          item.week ===
          selectedItem.week
            ? {
                ...item,
                reflection:
                  data.reflection,
              }
            : item
        )
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to save reflection."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-8">
        Loading Reflection Journal...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="rounded-3xl bg-[#0D1B3D] px-8 py-10 text-white">
        <Link
          href={`/ambassador/student-passport/${studentId}`}
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
          Reflect on lessons, experiences,
          skills, goals, and progress
          throughout your Future Ready™
          journey.
        </p>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 font-bold text-red-800">
          {error}
        </div>
      )}

      <section className="grid gap-8 xl:grid-cols-[0.35fr_0.65fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-[#0D1B3D]">
            Select Week
          </h2>

          <div className="mt-6 grid grid-cols-4 gap-2 xl:grid-cols-3">
            {items.map((item) => (
              <button
                key={item.lessonId}
                type="button"
                onClick={() =>
                  setSelectedWeek(
                    item.week
                  )
                }
                className={`rounded-xl border-2 px-3 py-3 font-black ${
                  selectedWeek ===
                  item.week
                    ? "border-[#F2B705] bg-[#FFF3C4] text-[#0D1B3D]"
                    : item.reflection
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                {item.reflection
                  ? `✓ ${item.week}`
                  : item.week}
              </button>
            ))}
          </div>
        </aside>

        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          {selectedItem ? (
            <>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
                Week {selectedItem.week}
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                {selectedItem.lessonTitle}
              </h2>

              <p className="mt-4 text-lg leading-8 text-slate-600">
                What did you learn,
                practice, notice, or improve
                during this lesson? How will
                you use it moving forward?
              </p>

              <textarea
                value={response}
                onChange={(event) => {
                  setResponse(
                    event.target.value
                  );
                  setSavedAt(null);
                }}
                placeholder="Write your reflection here..."
                className="mt-7 min-h-72 w-full rounded-2xl border border-slate-300 p-5 text-lg leading-8 outline-none transition focus:border-[#F2B705] focus:ring-4 focus:ring-[#F2B705]/20"
              />

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    saveReflection(false)
                  }
                  disabled={saving}
                  className="rounded-xl bg-[#F2B705] px-7 py-4 font-black text-[#0D1B3D] disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Reflection"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    saveReflection(true)
                  }
                  disabled={
                    saving ||
                    !response.trim()
                  }
                  className="rounded-xl bg-[#0D1B3D] px-7 py-4 font-black text-white disabled:opacity-50"
                >
                  Submit Reflection
                </button>

                {savedAt && (
                  <p className="font-black text-emerald-700">
                    ✓ Saved ·{" "}
                    {new Date(
                      savedAt
                    ).toLocaleTimeString(
                      [],
                      {
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="text-slate-600">
              No Ambassador lessons are
              available.
            </p>
          )}
        </article>
      </section>
    </div>
  );
}
