"use client";

import { ChangeEvent, useMemo, useState } from "react";

type Props = {
  studentId: string;
};

type Draft = {
  transcription: string;
  moment: string;
  selfInsight: string;
  keepForStory: string;
  skills: string[];
};

function todayKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export default function Build6PaperReflectionUpload({
  studentId,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [week, setWeek] = useState("");
  const [assignmentContext, setAssignmentContext] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] ?? null;
    setFile(next);
    setDraft(null);
    setMessage("");
    setError("");
  }

  async function generateReflection() {
    if (!file) {
      setError("Take a photo or choose a photo first.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const form = new FormData();
      form.set("studentId", studentId);
      form.set("file", file);
      form.set("week", week);
      form.set("assignmentContext", assignmentContext);

      const response = await fetch("/api/student/paper-reflection", {
        method: "POST",
        body: form,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to generate reflection.");
      }

      setDraft(result.draft);
      setMessage(
        "Draft created from your work. Read it, change anything that does not sound like you, then decide whether to save it.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to generate reflection.",
      );
    } finally {
      setLoading(false);
    }
  }

  function updateDraft(
    key: "moment" | "selfInsight" | "keepForStory",
    value: string,
  ) {
    setDraft((current) =>
      current ? { ...current, [key]: value } : current,
    );
  }

  async function saveReflection(saveToStory: boolean) {
    if (!draft) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/student/companion-journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          dateKey: todayKey(),
          moment: draft.moment,
          selfInsight: draft.selfInsight,
          keepForStory: draft.keepForStory,
          saveToStory,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to save reflection.");
      }

      setMessage(
        saveToStory
          ? "Saved to your Companion Journal and My Story."
          : "Saved as a private Companion Journal draft.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to save reflection.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-[28px] border border-[#F2B705]/40 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
        BUILD6™ · PAPER TO REFLECTION
      </p>

      <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
        📸 Turn My Paper Work Into a Reflection
      </h2>

      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
        Take a clear photo of your handwritten homework, workbook page, activity
        notes, or class work. BUILD6 will use your own work to create a reflection
        draft. You review and edit it before anything is saved.
      </p>

      <div className="mt-5 rounded-2xl border border-[#F2B705] bg-[#FFF9DF] p-4 text-sm font-semibold text-[#0D1B3D]">
        AI rule: BUILD6 may help organize your thinking, but it may not make up an
        experience, answer, opinion, or skill that you did not provide.
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-black text-[#0D1B3D]">
            BUILD6 Week
          </span>

          <select
            value={week}
            onChange={(event) => setWeek(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="">Choose week if applicable</option>

            {Array.from({ length: 16 }, (_, index) => (
              <option key={index + 1} value={String(index + 1)}>
                Week {index + 1}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-black text-[#0D1B3D]">
            What was this assignment about?
          </span>

          <input
            value={assignmentContext}
            onChange={(event) => setAssignmentContext(event.target.value)}
            placeholder="Optional — example: workplace observation"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>
      </div>

      <div className="mt-5">
        <label className="block">
          <span className="text-sm font-black text-[#0D1B3D]">
            Take or Upload a Photo
          </span>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            onChange={chooseFile}
            className="mt-2 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4"
          />
        </label>
      </div>

      {previewUrl ? (
        <div className="mt-4">
          <img
            src={previewUrl}
            alt="Student paper preview"
            className="max-h-80 rounded-2xl border border-slate-200 object-contain"
          />
        </div>
      ) : null}

      <button
        type="button"
        disabled={!file || loading}
        onClick={generateReflection}
        className="mt-5 rounded-xl bg-[#0D1B3D] px-6 py-3 font-black text-white disabled:opacity-50"
      >
        {loading ? "Reading My Work..." : "Generate My Reflection Draft"}
      </button>

      {error ? (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800">
          {message}
        </p>
      ) : null}

      {draft ? (
        <div className="mt-7 space-y-5">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              What BUILD6 could read
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {draft.transcription || "The writing was difficult to read clearly."}
            </p>
          </div>

          <label className="block">
            <span className="text-sm font-black text-[#0D1B3D]">
              Moment / Thought
            </span>
            <textarea
              value={draft.moment}
              onChange={(event) => updateDraft("moment", event.target.value)}
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-300 p-4"
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-[#0D1B3D]">
              What I Noticed About Me
            </span>
            <textarea
              value={draft.selfInsight}
              onChange={(event) => updateDraft("selfInsight", event.target.value)}
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-300 p-4"
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-[#0D1B3D]">
              Keep for My Story
            </span>
            <textarea
              value={draft.keepForStory}
              onChange={(event) => updateDraft("keepForStory", event.target.value)}
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-300 p-4"
            />
          </label>

          {draft.skills.length > 0 ? (
            <div>
              <p className="text-sm font-black text-[#0D1B3D]">
                Skills I May Have Demonstrated
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {draft.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-[#E7F7F8] px-3 py-1 text-xs font-black text-[#0D5560]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Keep only skills that you believe your work actually demonstrates.
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => saveReflection(false)}
              className="rounded-xl border border-[#0D1B3D] bg-white px-5 py-3 font-black text-[#0D1B3D]"
            >
              Save as Journal Draft
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => saveReflection(true)}
              className="rounded-xl bg-[#F2B705] px-5 py-3 font-black text-[#0D1B3D]"
            >
              Save to My Story
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
