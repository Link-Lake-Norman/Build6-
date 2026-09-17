"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Build6VoiceCaptureButton from "@/components/student/Build6VoiceCaptureButton";

type Props = {
  studentId: string;
  firstName: string;
};

function todayInNewYork() {
  const parts = new Intl.DateTimeFormat("en-US", {
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

function appendSpeech(current: string, transcript: string) {
  const clean = transcript.trim();

  if (!clean) {
    return current;
  }

  if (!current.trim()) {
    return clean;
  }

  return `${current.trim()} ${clean}`;
}

export default function Build6CompanionJournal({
  studentId,
  firstName,
}: Props) {
  const router = useRouter();

  const dateKey = useMemo(() => todayInNewYork(), []);

  const [moment, setMoment] = useState("");
  const [selfInsight, setSelfInsight] = useState("");
  const [keepForStory, setKeepForStory] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const addMomentSpeech = useCallback((text: string) => {
    setMoment((current) => appendSpeech(current, text));
  }, []);

  const addInsightSpeech = useCallback((text: string) => {
    setSelfInsight((current) => appendSpeech(current, text));
  }, []);

  const addStorySpeech = useCallback((text: string) => {
    setKeepForStory((current) => appendSpeech(current, text));
  }, []);

  async function save(saveToStory: boolean) {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/student/companion-journal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            dateKey,
            moment,
            selfInsight,
            keepForStory,
            saveToStory,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to save your journal entry.",
        );
      }

      setMessage(
        saveToStory
          ? "Saved to your Companion Story Vault."
          : "Private journal draft saved.",
      );

      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save your journal entry.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            TODAY&apos;S QUICK CAPTURE
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
            What do you want to remember, {firstName}?
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Type it or speak it. Capture the moments, ideas, challenges,
            people, wins, mistakes, questions, and realizations that are
            shaping who you are becoming.
          </p>
        </div>

        <div className="rounded-xl bg-[#FFF9DF] px-4 py-3 text-xs font-black text-[#725500]">
          {dateKey}
        </div>
      </div>

      <div className="mt-7 space-y-6">
        <label className="block">
          <span className="font-black text-[#0D1B3D]">
            What happened, stood out, or is on your mind?
          </span>

          <span className="mt-1 block text-sm text-slate-500">
            A moment, conversation, challenge, idea, quote, question,
            observation, win, frustration, or random thought.
          </span>

          <Build6VoiceCaptureButton
            onTranscript={addMomentSpeech}
            label="Speak this thought"
          />

          <textarea
            value={moment}
            onChange={(event) => setMoment(event.target.value)}
            rows={5}
            placeholder="Today I noticed..."
            className="mt-3 w-full rounded-2xl border border-slate-300 p-4 leading-7 text-[#0D1B3D] outline-none transition focus:border-[#4B2265] focus:ring-2 focus:ring-[#4B2265]/10"
          />
        </label>

        <label className="block">
          <span className="font-black text-[#0D1B3D]">
            What did this show you about yourself?
          </span>

          <span className="mt-1 block text-sm text-slate-500">
            Think strengths, values, reactions, communication, leadership,
            confidence, habits, interests, or something you want to improve.
          </span>

          <Build6VoiceCaptureButton
            onTranscript={addInsightSpeech}
            label="Speak my reflection"
          />

          <textarea
            value={selfInsight}
            onChange={(event) => setSelfInsight(event.target.value)}
            rows={4}
            placeholder="This showed me that I..."
            className="mt-3 w-full rounded-2xl border border-slate-300 p-4 leading-7 text-[#0D1B3D] outline-none transition focus:border-[#4B2265] focus:ring-2 focus:ring-[#4B2265]/10"
          />
        </label>

        <label className="block">
          <span className="font-black text-[#0D1B3D]">
            Is there anything here worth keeping for your story?
          </span>

          <span className="mt-1 block text-sm text-slate-500">
            This can become evidence, a future example, a Capstone idea,
            or something you want to remember later.
          </span>

          <Build6VoiceCaptureButton
            onTranscript={addStorySpeech}
            label="Speak what I want to keep"
          />

          <textarea
            value={keepForStory}
            onChange={(event) => setKeepForStory(event.target.value)}
            rows={4}
            placeholder="I want to remember..."
            className="mt-3 w-full rounded-2xl border border-slate-300 p-4 leading-7 text-[#0D1B3D] outline-none transition focus:border-[#4B2265] focus:ring-2 focus:ring-[#4B2265]/10"
          />
        </label>
      </div>

      {error ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
          {message}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={() => save(false)}
          className="rounded-xl border border-[#0D1B3D] bg-white px-5 py-3 text-sm font-black text-[#0D1B3D] disabled:opacity-50"
        >
          {saving ? "SAVING..." : "SAVE PRIVATE DRAFT"}
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={() => save(true)}
          className="rounded-xl bg-[#F2B705] px-5 py-3 text-sm font-black text-[#0D1B3D] disabled:opacity-50"
        >
          {saving ? "SAVING..." : "SAVE TO MY STORY →"}
        </button>
      </div>

      <p className="mt-5 text-xs leading-5 text-slate-500">
        Your Companion journal is private program data. Saving to My Story
        flags the entry for your BUILD6 story vault; it does not make the
        entry public.
      </p>
    </section>
  );
}
