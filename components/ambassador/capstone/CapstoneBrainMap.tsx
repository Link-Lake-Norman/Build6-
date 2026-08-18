"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import { futureReadyCapstone } from "@/content/ambassador/capstone";

type Props = {
  studentId: string;
  readOnly?: boolean;
};

type SavedResponse = {
  feel?: string;
  words?: string;
  style?: string;
};

export default function CapstoneBrainMap({
  studentId,
  readOnly = false,
}: Props) {
  const [feel, setFeel] = useState("");
  const [words, setWords] = useState("");
  const [style, setStyle] = useState("");

  const [loaded, setLoaded] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch(
          `/api/ambassador/capstone-brainstorm?studentId=${encodeURIComponent(
            studentId
          )}`,
          {
            cache: "no-store",
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ??
              "Unable to load brainstorm."
          );
        }

        if (!active) {
          return;
        }

        const answers =
          (result.submission
            ?.onlineResponse ??
            {}) as SavedResponse;

        setFeel(answers.feel ?? "");
        setWords(answers.words ?? "");
        setStyle(answers.style ?? "");

        setSaved(
          Boolean(result.submission)
        );
      } catch (caughtError) {
        if (!active) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load brainstorm."
        );
      } finally {
        if (active) {
          setLoaded(true);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [studentId]);

  async function saveBrainstorm() {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/ambassador/capstone-brainstorm",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            studentId,
            feel,
            words,
            style,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to save brainstorm."
        );
      }

      setSaved(true);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to save brainstorm."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border-2 border-[#F2B705] bg-[#FFF9DF] p-6 md:p-8">
      <p className="text-xs font-black tracking-[0.18em] text-[#725500]">
        {futureReadyCapstone.weekOne.label} ·
        START IT
      </p>

      <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
        {futureReadyCapstone.weekOne.title}
      </h2>

      <p className="mt-4 max-w-4xl text-lg font-bold leading-8 text-slate-800">
        {futureReadyCapstone.weekOne.prompt}
      </p>

      <p className="mt-3 max-w-4xl leading-7 text-slate-700">
        {futureReadyCapstone.weekOne.instruction}
      </p>

      <div className="mt-7 grid gap-3 md:grid-cols-2">
        {futureReadyCapstone.weekOne.categories.map(
          (item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-amber-200 bg-white p-5"
            >
              <div className="text-xs font-black tracking-[0.12em] text-[#4B2265]">
                {item.title}
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                {item.prompt}
              </p>
            </div>
          )
        )}
      </div>

      <div className="mt-7 rounded-2xl border border-amber-300 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-black text-[#0D1B3D]">
            Start With Three Decisions
          </h3>

          {saved ? (
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
              ✓ Brainstorm Saved
            </span>
          ) : null}
        </div>

        {!loaded ? (
          <p className="mt-4 text-sm text-slate-500">
            Loading brainstorm...
          </p>
        ) : (
          <div className="mt-5 space-y-5">
            <label className="block">
              <span className="text-sm font-black text-[#0D1B3D]">
                1. I want someone to feel...
              </span>

              <textarea
                value={feel}
                onChange={(event) => {
                  setFeel(
                    event.target.value
                  );
                  setSaved(false);
                }}
                readOnly={readOnly}
                rows={3}
                placeholder="What do you want someone to feel when they experience your story?"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800 outline-none focus:border-[#F2B705]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-black text-[#0D1B3D]">
                2. Three words that belong in my
                story...
              </span>

              <textarea
                value={words}
                onChange={(event) => {
                  setWords(
                    event.target.value
                  );
                  setSaved(false);
                }}
                readOnly={readOnly}
                rows={3}
                placeholder="Choose three words and explain why they belong in your story."
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800 outline-none focus:border-[#F2B705]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-black text-[#0D1B3D]">
                3. Colors, images, textures, or
                styles I want to explore...
              </span>

              <textarea
                value={style}
                onChange={(event) => {
                  setStyle(
                    event.target.value
                  );
                  setSaved(false);
                }}
                readOnly={readOnly}
                rows={3}
                placeholder="Describe the look, mood, images, or style you want to explore."
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800 outline-none focus:border-[#F2B705]"
              />
            </label>

            {!readOnly ? (
              <button
                type="button"
                onClick={saveBrainstorm}
                disabled={saving}
                className="rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save My Brainstorm"}
              </button>
            ) : (
              <p className="text-xs font-bold text-slate-500">
                Facilitator review view — student
                work is read-only.
              </p>
            )}

            {error ? (
              <p className="text-sm font-bold text-red-700">
                {error}
              </p>
            ) : null}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl bg-[#0D1B3D] p-5 text-white">
        <div className="font-black">
          KEEP WHAT MATTERS
        </div>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-200">
          Keep photographs, screenshots,
          documents, writing, links, and other
          pieces that may become part of your
          story. Your Digital Portfolio is your
          evidence archive while your Capstone
          develops.
        </p>

        <Link
          href={`/ambassador/student-passport/${studentId}/portfolio`}
          className="mt-4 inline-block rounded-xl bg-white px-4 py-2 text-xs font-black text-[#0D1B3D]"
        >
          Open Digital Portfolio →
        </Link>
      </div>
    </section>
  );
}
