"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  studentId: string;
  firstName: string;
};

type Snapshot = {
  strength: string;
  growth: string;
  misunderstood: string;
  opportunity: string;
  reputation: string;
  futureSkill: string;
};

const EMPTY_SNAPSHOT: Snapshot = {
  strength: "",
  growth: "",
  misunderstood: "",
  opportunity: "",
  reputation: "",
  futureSkill: "",
};

const SNAPSHOT_FIELDS: {
  key: keyof Snapshot;
  number: string;
  title: string;
  prompt: string;
  placeholder: string;
}[] = [
  {
    key: "strength",
    number: "01",
    title: "Something I'm Good At",
    prompt:
      "What are you already good at that people may not realize is a real skill?",
    placeholder: "I am good at...",
  },
  {
    key: "growth",
    number: "02",
    title: "Something I Want to Build",
    prompt: "What do you want to become better at this semester?",
    placeholder: "I want to get better at...",
  },
  {
    key: "misunderstood",
    number: "03",
    title: "Something People May Miss",
    prompt:
      "What is something about you that people may not know or understand right away?",
    placeholder: "People may not realize that I...",
  },
  {
    key: "opportunity",
    number: "04",
    title: "An Experience I Want",
    prompt:
      "What is one opportunity or experience you would like before this program ends?",
    placeholder: "I would like the opportunity to...",
  },
  {
    key: "reputation",
    number: "05",
    title: "How I Want to Show Up",
    prompt:
      "If an employer met you today, what would you want them to remember about you?",
    placeholder: "I want people to remember that I...",
  },
  {
    key: "futureSkill",
    number: "06",
    title: "My Future Ready Goal",
    prompt:
      "By the end of Future Ready™, what do you want to be able to say you can do?",
    placeholder: "By the end of Future Ready™, I want to be able to...",
  },
];

export default function DayTwoExperience({ studentId, firstName }: Props) {
  const storageKey = `future-ready-day-two-${studentId}`;

  const [snapshot, setSnapshot] = useState<Snapshot>(EMPTY_SNAPSHOT);

  const [reflection, setReflection] = useState("");

  const [loaded, setLoaded] = useState(false);

  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);

  const [error, setError] = useState("");

  const completedPrompts = useMemo(
    () =>
      Object.values(snapshot).filter((value) => value.trim().length > 0).length,
    [snapshot],
  );

  useEffect(() => {
    const local = window.localStorage.getItem(storageKey);

    if (local) {
      try {
        const parsed = JSON.parse(local);

        if (parsed.snapshot) {
          setSnapshot({
            ...EMPTY_SNAPSHOT,
            ...parsed.snapshot,
          });
        }

        if (typeof parsed.reflection === "string") {
          setReflection(parsed.reflection);
        }
      } catch {
        // Ignore malformed local drafts.
      }
    }

    fetch(`/api/ambassador/day-two?studentId=${encodeURIComponent(studentId)}`)
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }

        return response.json();
      })
      .then((data) => {
        if (
          data?.reflection?.response &&
          typeof data.reflection.response === "string"
        ) {
          setReflection(data.reflection.response);
          setSaved(data.reflection.status === "SUBMITTED");
        }
      })
      .finally(() => {
        setLoaded(true);
      });
  }, [studentId, storageKey]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        snapshot,
        reflection,
      }),
    );
  }, [loaded, reflection, snapshot, storageKey]);

  function updateSnapshot(key: keyof Snapshot, value: string) {
    setSnapshot((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  }

  function buildReflection() {
    const parts = [
      snapshot.strength &&
        `One thing I already know about myself is that ${snapshot.strength}`,
      snapshot.growth &&
        `This semester I want to get better at ${snapshot.growth}`,
      snapshot.misunderstood &&
        `Something people may not immediately know about me is ${snapshot.misunderstood}`,
      snapshot.opportunity &&
        `One experience I would like to have is ${snapshot.opportunity}`,
      snapshot.reputation &&
        `If an employer met me today, I would want them to remember that ${snapshot.reputation}`,
      snapshot.futureSkill &&
        `By the end of Future Ready™, I want to be able to ${snapshot.futureSkill}`,
    ].filter(Boolean);

    setReflection(parts.join(". ") + (parts.length ? "." : ""));
    setSaved(false);
  }

  async function saveReflection() {
    setError("");

    if (reflection.trim().length < 20) {
      setError("Add a little more to your reflection before saving.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/ambassador/day-two", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          response: reflection,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save your reflection.");
      }

      setSaved(true);

      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          snapshot,
          reflection,
        }),
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save your reflection.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-[#0D1B3D] p-7 text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">
              Today · Day 2
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Start Your Future Ready™ Story
            </h2>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-200">
              {firstName}, there are no perfect answers today. This is a
              snapshot of where you are right now — before the real journey
              begins.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#F2B705]">
              Today&apos;s Mission
            </p>

            <p className="mt-1 font-black">Know Yourself. Tell Your Story.</p>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <Step
            number="1"
            title="Think"
            text="Complete your six quick snapshots."
          />

          <Step
            number="2"
            title="Talk"
            text="Take the 30-second partner challenge."
          />

          <Step
            number="3"
            title="Reflect"
            text="Save where you're starting today."
          />
        </div>

        <div className="mt-9">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
                Future Me · First Draft
              </p>

              <h3 className="mt-1 text-2xl font-black text-[#0D1B3D]">
                Who are you right now?
              </h3>
            </div>

            <p className="text-sm font-black text-slate-500">
              {completedPrompts}/6 answered
            </p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {SNAPSHOT_FIELDS.map((field) => (
              <div
                key={field.key}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2B705] text-xs font-black text-[#0D1B3D]">
                    {field.number}
                  </span>

                  <h4 className="font-black text-[#0D1B3D]">{field.title}</h4>
                </div>

                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                  {field.prompt}
                </p>

                <textarea
                  value={snapshot[field.key]}
                  onChange={(event) =>
                    updateSnapshot(field.key, event.target.value)
                  }
                  rows={3}
                  placeholder={field.placeholder}
                  className="mt-4 w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-sm leading-6 text-slate-800 outline-none focus:border-[#0D1B3D]"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-9 rounded-3xl bg-[#FFF9DF] p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
            Partner Challenge
          </p>

          <h3 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            You Have 30 Seconds
          </h3>

          <p className="mt-3 text-lg font-bold leading-8 text-slate-700">
            Tell your partner something about yourself they would not know just
            by looking at you.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <ChallengeCard
              label="ROUND 1"
              text="Partner A talks for 30 seconds."
            />

            <ChallengeCard
              label="ROUND 2"
              text="Partner B talks for 30 seconds."
            />

            <ChallengeCard
              label="THE TEST"
              text="Introduce your partner without reading their answer."
            />
          </div>
        </div>

        <div className="mt-9 rounded-3xl border-2 border-[#0D1B3D] p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
            My First Reflection
          </p>

          <h3 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            Day 2 · Where I&apos;m Starting
          </h3>

          <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
            Right now, what do you know about yourself, what are you still
            figuring out, and what is one thing you want Future Ready™ to help
            you accomplish?
          </p>

          <button
            type="button"
            onClick={buildReflection}
            className="mt-5 rounded-xl border border-[#0D1B3D] px-4 py-3 text-sm font-black text-[#0D1B3D]"
          >
            Use My Answers to Start My Reflection
          </button>

          <textarea
            value={reflection}
            onChange={(event) => {
              setReflection(event.target.value);
              setSaved(false);
            }}
            rows={8}
            placeholder="Right now, I know..."
            className="mt-4 w-full rounded-2xl border border-slate-300 p-4 text-base leading-7 text-slate-800 outline-none focus:border-[#0D1B3D]"
          />

          {error && (
            <p className="mt-3 text-sm font-bold text-red-700">{error}</p>
          )}

          {saved && (
            <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm font-black text-emerald-800">
              ✓ Saved to your Reflection Journal.
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              disabled={saving}
              onClick={saveReflection}
              className="rounded-xl bg-[#0D1B3D] px-6 py-4 font-black text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : saved
                  ? "Update My Reflection"
                  : "Save My First Reflection"}
            </button>

            <p className="text-xs font-semibold text-slate-500">
              This does not start Week 1 or change your curriculum progress.
            </p>
          </div>
        </div>

        <div className="mt-9 rounded-3xl bg-slate-100 p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
            Exit Ticket
          </p>

          <h3 className="mt-2 text-xl font-black text-[#0D1B3D]">
            Before you leave...
          </h3>

          <div className="mt-4 space-y-3 text-sm font-bold text-slate-700">
            <p>
              TODAY I DISCOVERED:{" "}
              <span className="font-semibold">
                {snapshot.misunderstood || "________________________"}
              </span>
            </p>

            <p>
              I WANT TO GET BETTER AT:{" "}
              <span className="font-semibold">
                {snapshot.growth || "________________________"}
              </span>
            </p>

            <p>
              ONE EXPERIENCE I WANT:{" "}
              <span className="font-semibold">
                {snapshot.opportunity || "________________________"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D1B3D] text-xs font-black text-white">
          {number}
        </span>

        <p className="font-black text-[#0D1B3D]">{title}</p>
      </div>

      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
        {text}
      </p>
    </div>
  );
}

function ChallengeCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-[10px] font-black tracking-[0.16em] text-[#725500]">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold leading-6 text-[#0D1B3D]">{text}</p>
    </div>
  );
}
