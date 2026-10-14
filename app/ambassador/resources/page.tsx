"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type TeachingHubResponse = {
  lesson?: {
    id?: string;
    weekNumber?: number;
    title?: string;
  };
};

type Asset = {
  label: string;
  fileName: string;
  type: string;
  category: string;
};

const DAYS = [1, 2, 3, 4, 5];

const ASSETS: Asset[] = [
  {
    label: "Student Workbook",
    fileName: "Future-Ready-Week-XX-Student-Workbook.pdf",
    type: "pdf",
    category: "Student Workbook",
  },
  {
    label: "Student Workbook — Editable",
    fileName: "Future-Ready-Week-XX-Student-Workbook.docx",
    type: "docx",
    category: "Student Workbook",
  },
  {
    label: "Facilitator Guide",
    fileName: "Future-Ready-Week-XX-Facilitator-Guide.pdf",
    type: "pdf",
    category: "Facilitator Guide",
  },
  {
    label: "Facilitator Guide — Editable",
    fileName: "Future-Ready-Week-XX-Facilitator-Guide.docx",
    type: "docx",
    category: "Facilitator Guide",
  },
  {
    label: "Activity Kit",
    fileName: "Future-Ready-Week-XX-Activity-Kit.pdf",
    type: "pdf",
    category: "Activity Kit",
  },
  {
    label: "Activity Kit — Editable",
    fileName: "Future-Ready-Week-XX-Activity-Kit.docx",
    type: "docx",
    category: "Activity Kit",
  },
  {
    label: "Assessment Rubric",
    fileName: "Future-Ready-Week-XX-Assessment-Rubric.pdf",
    type: "pdf",
    category: "Assessment",
  },
  {
    label: "Assessment Rubric — Editable",
    fileName: "Future-Ready-Week-XX-Assessment-Rubric.docx",
    type: "docx",
    category: "Assessment",
  },
  {
    label: "Portfolio Artifact",
    fileName: "Future-Ready-Week-XX-Portfolio-Artifact.pdf",
    type: "pdf",
    category: "Portfolio",
  },
  {
    label: "Portfolio Artifact — Editable",
    fileName: "Future-Ready-Week-XX-Portfolio-Artifact.docx",
    type: "docx",
    category: "Portfolio",
  },
  {
    label: "Teaching Slides",
    fileName: "Future-Ready-Week-XX-Slides.pptx",
    type: "pptx",
    category: "Slides",
  },
  {
    label: "Week Badge",
    fileName: "Future-Ready-Week-XX-Badge.svg",
    type: "svg",
    category: "Badge",
  },
];

function weekCode(week: number) {
  return String(week).padStart(2, "0");
}

function assetForWeek(asset: Asset, week: number) {
  return {
    ...asset,
    fileName: asset.fileName.replace("XX", weekCode(week)),
  };
}

export default function TeachingResourcesPage() {
  const [week, setWeek] = useState(1);
  const [day, setDay] = useState(2);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const packaged = week <= 4 || (week >= 9 && week <= 12);

  const assets = useMemo(
    () => ASSETS.map((asset) => assetForWeek(asset, week)),
    [week],
  );

  useEffect(() => {
    async function loadLesson() {
      setLoadingLesson(true);
      setError("");
      setMessage("");

      try {
        const response = await fetch(
          `/api/ambassador/teaching-hub?week=${week}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const raw = await response.text();
        const result = raw ? JSON.parse(raw) : {};

        if (!response.ok) {
          throw new Error(result.error ?? "Unable to load this week.");
        }

        const typed = result as TeachingHubResponse;

        setLessonId(typed.lesson?.id ?? null);
        setLessonTitle(typed.lesson?.title ?? `Week ${week}`);
      } catch (caught) {
        setLessonId(null);
        setLessonTitle("");
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to load this week.",
        );
      } finally {
        setLoadingLesson(false);
      }
    }

    loadLesson();
  }, [week]);

  function openUrl(fileName: string) {
    return `/api/ambassador/download/${weekCode(week)}/${encodeURIComponent(
      fileName,
    )}`;
  }

  function previewUrl(asset: Asset) {
    const src = openUrl(asset.fileName);

    if (asset.type === "svg") {
      return src;
    }

    return `/ambassador/resource-preview?src=${encodeURIComponent(
      src,
    )}&name=${encodeURIComponent(asset.label)}&type=${encodeURIComponent(
      asset.type,
    )}`;
  }

  async function addToLesson(asset: Asset) {
    if (!lessonId) {
      setError("This week's lesson is not available.");
      return;
    }

    const key = asset.fileName;

    setAdding(key);
    setError("");
    setMessage("");

    try {
      const resourceUrl = openUrl(asset.fileName);

      const response = await fetch("/api/ambassador/teaching-hub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "attachResourceToLesson",
          lessonId,
          dayNumber: day,
          packagedAsset: {
            title: asset.label,
            fileName: asset.fileName,
            url: resourceUrl,
          },
        }),
      });

      const raw = await response.text();
      const result = raw ? JSON.parse(raw) : {};

      if (!response.ok) {
        throw new Error(
          result.error ?? "Unable to add this resource to the lesson.",
        );
      }

      setMessage(
        `${asset.label} saved to Week ${week}, Day ${day}.`,
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to add this resource.",
      );
    } finally {
      setAdding(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-[#0D1B3D] p-6 text-white md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
          TEACHING RESOURCES
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Resource Library
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Preview classroom materials before using them, download what you
          need, or attach a resource directly to a specific BUILD6™
          lesson day. The core lesson plan remains the curriculum spine.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-end">
          <div>
            <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
              Curriculum Week
            </label>

            <select
              value={week}
              onChange={(event) => setWeek(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-bold text-[#0D1B3D]"
            >
              {Array.from({ length: 16 }, (_, index) => index + 1).map(
                (number) => (
                  <option key={number} value={number}>
                    Week {number}
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
              Add To Day
            </label>

            <div className="mt-2 flex flex-wrap gap-2">
              {DAYS.map((number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => setDay(number)}
                  className={`rounded-xl px-4 py-3 text-sm font-black ${
                    day === number
                      ? "bg-[#0D1B3D] text-white"
                      : "border border-slate-200 bg-slate-50 text-[#0D1B3D]"
                  }`}
                >
                  Day {number}
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/ambassador/curriculum"
            className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-black text-[#0D1B3D]"
          >
            Open Lesson Plan →
          </Link>
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">
            SELECTED LESSON
          </p>
          <p className="mt-1 font-black text-[#0D1B3D]">
            {loadingLesson
              ? "Loading lesson…"
              : lessonTitle || `Week ${week}`}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Resources added below save directly to Day {day}.
          </p>
        </div>
      </section>

      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800">
          ✓ {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-800">
          {error}
        </div>
      ) : null}

      {!packaged ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="font-black text-amber-950">
            Week {week} curriculum is built.
          </p>

          <p className="mt-2 text-sm leading-6 text-amber-900">
            The 16-week Ambassador curriculum remains available in Lesson
            Plans. Packaged PDF, DOCX, PPTX and printable resources are
            currently complete for Weeks 1–4. Week {week} materials will
            appear here when its packaged resource set is added.
          </p>

          <Link
            href="/ambassador/curriculum"
            className="mt-4 inline-block rounded-xl bg-[#0D1B3D] px-4 py-3 text-sm font-black text-white"
          >
            Open Week {week} Lesson Plan →
          </Link>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => {
            const download = `${openUrl(asset.fileName)}?download=1`;

            return (
              <article
                key={asset.fileName}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#4B2265]">
                      {asset.category}
                    </p>

                    <h2 className="mt-1 text-lg font-black text-[#0D1B3D]">
                      {asset.label}
                    </h2>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase text-slate-500">
                    {asset.type}
                  </span>
                </div>

                <p className="mt-3 break-all text-xs leading-5 text-slate-400">
                  {asset.fileName}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Link
                    href={previewUrl(asset)}
                    target="_blank"
                    className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-black text-[#0D1B3D]"
                  >
                    Preview
                  </Link>

                  <Link
                    href={download}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-black text-[#0D1B3D]"
                  >
                    Download
                  </Link>
                </div>

                <button
                  type="button"
                  disabled={
                    adding === asset.fileName ||
                    loadingLesson ||
                    !lessonId
                  }
                  onClick={() => addToLesson(asset)}
                  className="mt-2 w-full rounded-xl bg-[#0D1B3D] px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {adding === asset.fileName
                    ? "Saving…"
                    : `+ Add to Week ${week} · Day ${day}`}
                </button>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
