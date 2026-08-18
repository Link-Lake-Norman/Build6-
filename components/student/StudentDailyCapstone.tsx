"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Direction = {
  dayNumber: number;
  instructions: string;
};

type Entry = {
  id: string;
  dayNumber: number;
  learning: string;
  skillEvidence: string;
  growth: string;
  updatedAt: string;
};

type Props = {
  studentId: string;
  lessonId: string;
  weekNumber: number;
};

export default function StudentDailyCapstone({
  studentId,
  lessonId,
  weekNumber,
}: Props) {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [dayNumber, setDayNumber] = useState(1);

  const [learning, setLearning] = useState("");
  const [skillEvidence, setSkillEvidence] = useState("");
  const [growth, setGrowth] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/student/capstone-daily?studentId=${encodeURIComponent(
          studentId,
        )}&lessonId=${encodeURIComponent(
          lessonId,
        )}&weekNumber=${weekNumber}`,
        {
          cache: "no-store",
        },
      );

      const body = await response.json();

      if (!response.ok) {
        throw new Error(
          body.error ?? "Unable to load Capstone progress.",
        );
      }

      const nextDirections = Array.isArray(body.directions)
        ? body.directions
        : [];

      const nextEntries = Array.isArray(body.entries)
        ? body.entries
        : [];

      setDirections(nextDirections);
      setEntries(nextEntries);

      const firstIncomplete =
        nextDirections.find(
          (direction: Direction) =>
            !nextEntries.some(
              (entry: Entry) =>
                entry.dayNumber === direction.dayNumber,
            ),
        )?.dayNumber ??
        nextDirections[0]?.dayNumber ??
        1;

      setDayNumber(firstIncomplete);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load Capstone progress.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [studentId, lessonId, weekNumber]);

  const savedEntry = useMemo(
    () =>
      entries.find(
        (entry) => entry.dayNumber === dayNumber,
      ),
    [entries, dayNumber],
  );

  const directionsForDay = useMemo(
    () =>
      directions.find(
        (direction) =>
          direction.dayNumber === dayNumber,
      ),
    [directions, dayNumber],
  );

  useEffect(() => {
    setLearning(savedEntry?.learning ?? "");
    setSkillEvidence(savedEntry?.skillEvidence ?? "");
    setGrowth(savedEntry?.growth ?? "");
    setMessage(null);
  }, [savedEntry, dayNumber]);

  async function save() {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(
        "/api/student/capstone-daily",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            lessonId,
            weekNumber,
            dayNumber,
            learning,
            skillEvidence,
            growth,
          }),
        },
      );

      const body = await response.json();

      if (!response.ok) {
        throw new Error(
          body.error ?? "Unable to save Capstone progress.",
        );
      }

      setMessage("Capstone progress saved.");
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save Capstone progress.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border-2 border-[#F2B705] bg-[#FFFDF5] p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
            AFTER CLASS · BUILD YOUR CAPSTONE
          </p>

          <h2 className="mt-1 text-2xl font-black text-[#0D1B3D]">
            Turn Today Into Progress
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Capture what you learned while it is fresh. These daily
            reflections build your ideas, skills, goals, evidence, and
            direction over time.
          </p>
        </div>

        <Link
          href={`/ambassador/student-portal/${studentId}/capstone`}
          className="shrink-0 rounded-xl border border-[#0D1B3D] px-4 py-2 text-xs font-black text-[#0D1B3D]"
        >
          Open My Capstone →
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((day) => {
          const complete = entries.some(
            (entry) => entry.dayNumber === day,
          );

          return (
            <button
              key={day}
              type="button"
              onClick={() => setDayNumber(day)}
              className={`rounded-full px-3 py-2 text-xs font-black ${
                day === dayNumber
                  ? "bg-[#0D1B3D] text-white"
                  : complete
                    ? "bg-emerald-100 text-emerald-800"
                    : "border border-slate-200 bg-white text-slate-600"
              }`}
            >
              Day {day}
              {complete ? " ✓" : ""}
            </button>
          );
        })}
      </div>

      {directionsForDay?.instructions ? (
        <div className="mt-4 rounded-xl border border-[#00A6A6]/30 bg-[#EAFBFB] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#007C7C]">
            TODAY'S DIRECTIONS
          </p>

          <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-[#0D1B3D]">
            {directionsForDay.instructions}
          </p>
        </div>
      ) : null}

      {loading ? (
        <p className="mt-4 text-sm font-bold text-slate-400">
          Loading today's closeout…
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          <Prompt
            label="1 · LEARNING + IDEAS"
            prompt="What did you learn today? What idea, possibility, interest, or insight became clearer?"
            value={learning}
            onChange={setLearning}
          />

          <Prompt
            label="2 · SKILL EVIDENCE"
            prompt="What skill did you practice today? What did you do that proves you are developing it?"
            value={skillEvidence}
            onChange={setSkillEvidence}
          />

          <Prompt
            label="3 · VISION + GOAL + NEXT STEP"
            prompt="How did today change or strengthen your thinking about your future? What goal, decision, or next step should you take?"
            value={growth}
            onChange={setGrowth}
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={save}
              className="rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : savedEntry
                  ? "Update Today's Capstone"
                  : "Save Today's Capstone"}
            </button>

            {message ? (
              <p className="text-sm font-bold text-slate-600">
                {message}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}

function Prompt({
  label,
  prompt,
  value,
  onChange,
}: {
  label: string;
  prompt: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#725500]">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold leading-6 text-[#0D1B3D]">
        {prompt}
      </p>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={3}
        className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-[#0D1B3D] outline-none focus:border-[#F2B705]"
      />
    </div>
  );
}
