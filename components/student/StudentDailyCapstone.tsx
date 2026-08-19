"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

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
  status?: string;
};

type Props = {
  studentId: string;
  lessonId: string;
  weekNumber: number;
};

type PromptField = "learning" | "skillEvidence" | "growth";

type HelperMode = "different" | "words" | "deeper" | "phrase";

type HelperState = {
  field: PromptField;
  mode: HelperMode;
  content: string[];
};

const helperIdeas: Record<PromptField, Record<HelperMode, string[]>> = {
  learning: {
    different: [
      "What moment from today keeps coming back to you?",
      "What happened today that made you stop and think?",
      "What interested you more than you expected?",
      "Was there a moment that felt important even if you are not sure why?",
      "What did you notice about yourself that you had not really thought about before?",
      "If you had to tell someone one thing about today, what would you mention first?",
    ],
    words: [
      "curiosity",
      "confidence",
      "independence",
      "belonging",
      "challenge",
      "pressure",
      "interest",
      "purpose",
      "motivation",
      "responsibility",
      "connection",
      "possibility",
    ],
    deeper: [
      "Why do you think that mattered to you?",
      "Would the same thing have mattered to you a year ago?",
      "What does your reaction tell you about what you care about?",
      "Did this confirm something you already knew about yourself or surprise you?",
      "What part of the experience felt most like you?",
      "What question are you still thinking about?",
    ],
    phrase: [
      "What stood out to me was...",
      "I did not expect to realize that...",
      "I kept thinking about...",
      "Something that mattered to me was...",
      "This made me notice that...",
      "I was surprised by...",
    ],
  },

  skillEvidence: {
    different: [
      "What did you actually do today that you are proud of?",
      "Where did you contribute instead of just participate?",
      "What did someone watching you today see you do well?",
      "When did you communicate, lead, listen, solve, adjust, or take initiative?",
      "What did you do when something was difficult or unclear?",
      "What strength showed up naturally for you today?",
    ],
    words: [
      "communication",
      "leadership",
      "teamwork",
      "adaptability",
      "initiative",
      "discipline",
      "reliability",
      "empathy",
      "problem-solving",
      "listening",
      "professionalism",
      "resilience",
      "accountability",
      "creativity",
      "patience",
      "courage",
    ],
    deeper: [
      "What is the evidence that proves you showed that skill?",
      "Did someone else depend on you in that moment?",
      "What choice did you make that demonstrates this strength?",
      "How could this skill matter outside of athletics?",
      "Where else in your life have you used this same strength?",
      "Is this a skill you want people to know you for?",
    ],
    phrase: [
      "A strength I showed today was...",
      "I demonstrated this when I...",
      "The evidence is...",
      "I handled the situation by...",
      "Someone could see this skill when I...",
      "This is something I can bring to a workplace because...",
    ],
  },

  growth: {
    different: [
      "What does this experience tell you about the person you are becoming?",
      "What do you understand about yourself now that you did not before?",
      "Did today point you toward something you want more of—or away from something you do not?",
      "What might this mean for the kind of life you want?",
      "What would your future self want you to remember from today?",
      "What is one thing about yourself you want to keep developing?",
    ],
    words: [
      "purpose",
      "growth",
      "balance",
      "freedom",
      "stability",
      "impact",
      "family",
      "success",
      "service",
      "ambition",
      "integrity",
      "confidence",
      "community",
      "ownership",
      "learning",
      "opportunity",
      "direction",
      "fulfillment",
    ],
    deeper: [
      "Why is that important to the life you want to build?",
      "Does this connect to one of your values?",
      "Who do you want to be when nobody is giving you instructions?",
      "What would taking this realization seriously change for you?",
      "Does this connect to a person, mentor, quote, goal, or experience that has shaped you?",
      "What is one next step that would move you closer to that version of yourself?",
    ],
    phrase: [
      "Today I realized I am someone who...",
      "This matters to me because...",
      "I want to become someone who...",
      "One thing I want to carry forward is...",
      "This connects to my future because...",
      "I am starting to understand that I value...",
    ],
  },
};

function pickHelperIdeas(
  field: PromptField,
  mode: HelperMode,
  previous?: string[],
) {
  const source = helperIdeas[field][mode];

  const available = previous?.length
    ? source.filter((item) => !previous.includes(item))
    : source;

  const pool = available.length >= 3 ? available : source;

  return [...pool]
    .sort(() => Math.random() - 0.5)
    .slice(0, mode === "words" ? 8 : 3);
}

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

  const [autoSaving, setAutoSaving] = useState(false);

  const [message, setMessage] = useState<string | null>(null);

  const [helper, setHelper] = useState<HelperState | null>(null);

  const loadedValuesRef = useRef({
    learning: "",
    skillEvidence: "",
    growth: "",
  });

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function load() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/student/capstone-daily?studentId=${encodeURIComponent(
          studentId,
        )}&lessonId=${encodeURIComponent(lessonId)}&weekNumber=${weekNumber}`,
        {
          cache: "no-store",
        },
      );

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error ?? "Unable to load Capstone progress.");
      }

      const nextDirections = Array.isArray(body.directions)
        ? body.directions
        : [];

      const nextEntries = Array.isArray(body.entries) ? body.entries : [];

      setDirections(nextDirections);
      setEntries(nextEntries);

      const firstIncomplete =
        nextDirections.find((direction: Direction) => {
          const entry = nextEntries.find(
            (candidate: Entry) => candidate.dayNumber === direction.dayNumber,
          );

          return (
            !entry || !entry.learning || !entry.skillEvidence || !entry.growth
          );
        })?.dayNumber ??
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
    void load();
  }, [studentId, lessonId, weekNumber]);

  const savedEntry = useMemo(
    () => entries.find((entry) => entry.dayNumber === dayNumber),
    [entries, dayNumber],
  );

  const directionsForDay = useMemo(
    () => directions.find((direction) => direction.dayNumber === dayNumber),
    [directions, dayNumber],
  );

  useEffect(() => {
    const nextLearning = savedEntry?.learning ?? "";

    const nextSkillEvidence = savedEntry?.skillEvidence ?? "";

    const nextGrowth = savedEntry?.growth ?? "";

    setLearning(nextLearning);
    setSkillEvidence(nextSkillEvidence);
    setGrowth(nextGrowth);

    loadedValuesRef.current = {
      learning: nextLearning,
      skillEvidence: nextSkillEvidence,
      growth: nextGrowth,
    };

    setMessage(null);
    setHelper(null);
  }, [savedEntry, dayNumber]);

  async function persist({
    showMessage = false,
  }: {
    showMessage?: boolean;
  } = {}) {
    const values = {
      learning: learning.trim(),
      skillEvidence: skillEvidence.trim(),
      growth: growth.trim(),
    };

    const unchanged =
      values.learning === loadedValuesRef.current.learning &&
      values.skillEvidence === loadedValuesRef.current.skillEvidence &&
      values.growth === loadedValuesRef.current.growth;

    if (unchanged) {
      return;
    }

    const hasAnything =
      Boolean(values.learning) ||
      Boolean(values.skillEvidence) ||
      Boolean(values.growth);

    if (!hasAnything) {
      return;
    }

    if (showMessage) {
      setSaving(true);
      setMessage(null);
    } else {
      setAutoSaving(true);
    }

    try {
      const response = await fetch("/api/student/capstone-daily", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          lessonId,
          weekNumber,
          dayNumber,
          ...values,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error ?? "Unable to save Capstone progress.");
      }

      loadedValuesRef.current = values;

      setEntries((currentEntries) => {
        const existing = currentEntries.find(
          (entry) => entry.dayNumber === dayNumber,
        );

        const nextEntry: Entry = {
          id: body.reflection?.id ?? existing?.id ?? `day-${dayNumber}`,
          dayNumber,
          learning: values.learning,
          skillEvidence: values.skillEvidence,
          growth: values.growth,
          updatedAt: body.reflection?.updatedAt ?? new Date().toISOString(),
          status: body.reflection?.status ?? body.status,
        };

        return existing
          ? currentEntries.map((entry) =>
              entry.dayNumber === dayNumber ? nextEntry : entry,
            )
          : [...currentEntries, nextEntry];
      });

      const complete =
        Boolean(values.learning) &&
        Boolean(values.skillEvidence) &&
        Boolean(values.growth);

      if (showMessage) {
        setMessage(
          complete
            ? "Saved to your growing story."
            : "Draft saved. You can come back anytime.",
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save Capstone progress.",
      );
    } finally {
      setSaving(false);
      setAutoSaving(false);
    }
  }

  useEffect(() => {
    if (loading) {
      return;
    }

    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    const current = {
      learning: learning.trim(),
      skillEvidence: skillEvidence.trim(),
      growth: growth.trim(),
    };

    const changed =
      current.learning !== loadedValuesRef.current.learning ||
      current.skillEvidence !== loadedValuesRef.current.skillEvidence ||
      current.growth !== loadedValuesRef.current.growth;

    if (!changed) {
      return;
    }

    autoSaveTimer.current = setTimeout(() => {
      void persist();
    }, 1200);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [learning, skillEvidence, growth, dayNumber, loading]);

  async function changeDay(nextDay: number) {
    await persist();
    setDayNumber(nextDay);
  }

  function showHelper(field: PromptField, mode: HelperMode) {
    const previous =
      helper?.field === field && helper?.mode === mode
        ? helper.content
        : undefined;

    setHelper({
      field,
      mode,
      content: pickHelperIdeas(field, mode, previous),
    });
  }

  function insertStarter(field: PromptField, starter: string) {
    const append = (current: string) =>
      current.trim() ? `${current.trim()} ${starter}` : starter;

    if (field === "learning") {
      setLearning(append);
    }

    if (field === "skillEvidence") {
      setSkillEvidence(append);
    }

    if (field === "growth") {
      setGrowth(append);
    }
  }

  return (
    <section className="rounded-3xl border-2 border-[#F2B705] bg-[#FFFDF5] p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
            REFLECT → BUILD MY STORY
          </p>

          <h2 className="mt-1 text-2xl font-black text-[#0D1B3D]">
            What Did Today Show Me About Myself?
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            You are not writing your whole book today. Capture one honest piece
            at a time. Your thoughts will save as you write and become part of
            the story you are building about yourself.
          </p>
        </div>

        <Link
          href={`/ambassador/student-portal/${studentId}/capstone`}
          className="shrink-0 rounded-xl border border-[#0D1B3D] px-4 py-2 text-xs font-black text-[#0D1B3D]"
        >
          See My Story So Far →
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {[1, 2, 3, 4, 5].map((day) => {
          const entry = entries.find(
            (candidate) => candidate.dayNumber === day,
          );

          const complete =
            Boolean(entry?.learning) &&
            Boolean(entry?.skillEvidence) &&
            Boolean(entry?.growth);

          const started = Boolean(entry) && !complete;

          return (
            <button
              key={day}
              type="button"
              onClick={() => void changeDay(day)}
              className={`rounded-full px-3 py-2 text-xs font-black ${
                day === dayNumber
                  ? "bg-[#0D1B3D] text-white"
                  : complete
                    ? "bg-emerald-100 text-emerald-800"
                    : started
                      ? "bg-amber-100 text-amber-800"
                      : "border border-slate-200 bg-white text-slate-600"
              }`}
            >
              Day {day}
              {complete ? " ✓" : started ? " · saved" : ""}
            </button>
          );
        })}

        <span className="ml-auto text-xs font-bold text-slate-500">
          {autoSaving ? "Saving..." : "Autosave on"}
        </span>
      </div>

      {directionsForDay?.instructions ? (
        <div className="mt-4 rounded-xl border border-[#00A6A6]/30 bg-[#EAFBFB] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#007C7C]">
            TODAY&apos;S DIRECTIONS
          </p>

          <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-[#0D1B3D]">
            {directionsForDay.instructions}
          </p>
        </div>
      ) : null}

      {loading ? (
        <p className="mt-4 text-sm font-bold text-slate-400">
          Loading your story…
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          <Prompt
            field="learning"
            label="1 · WHAT STAYED WITH ME?"
            prompt="What happened today that mattered, surprised you, challenged you, interested you, or made you think differently?"
            value={learning}
            onChange={setLearning}
            helper={helper}
            onHelp={showHelper}
            onInsert={insertStarter}
          />

          <Prompt
            field="skillEvidence"
            label="2 · WHAT DID I SHOW?"
            prompt="What did you actually do today? What skill, strength, value, or personal quality did you show — and what proves it?"
            value={skillEvidence}
            onChange={setSkillEvidence}
            helper={helper}
            onHelp={showHelper}
            onInsert={insertStarter}
          />

          <Prompt
            field="growth"
            label="3 · WHAT DOES THIS SAY ABOUT ME?"
            prompt="What does this tell you about who you are, what matters to you, or who you want to become?"
            value={growth}
            onChange={setGrowth}
            helper={helper}
            onHelp={showHelper}
            onInsert={insertStarter}
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                void persist({
                  showMessage: true,
                })
              }
              className="rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save My Story"}
            </button>

            <p className="text-xs font-bold text-slate-500">
              You can leave and come back. Your work is saved as you type.
            </p>

            {message ? (
              <p className="w-full text-sm font-bold text-slate-600">
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
  field,
  label,
  prompt,
  value,
  onChange,
  helper,
  onHelp,
  onInsert,
}: {
  field: PromptField;
  label: string;
  prompt: string;
  value: string;
  onChange: (value: string) => void;
  helper: HelperState | null;
  onHelp: (field: PromptField, mode: HelperMode) => void;
  onInsert: (field: PromptField, starter: string) => void;
}) {
  const activeHelper = helper?.field === field ? helper : null;

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
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        placeholder="There is no perfect answer. Start with what comes to mind."
        className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-[#0D1B3D] outline-none focus:border-[#F2B705]"
      />

      <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
        <p className="text-xs font-black text-[#0D1B3D]">
          Stuck? Help me think.
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          <HelperButton
            label="Ask me differently"
            onClick={() => onHelp(field, "different")}
          />

          <HelperButton
            label="Give me words"
            onClick={() => onHelp(field, "words")}
          />

          <HelperButton
            label="Help me go deeper"
            onClick={() => onHelp(field, "deeper")}
          />

          <HelperButton
            label="Help me say it"
            onClick={() => onHelp(field, "phrase")}
          />
        </div>

        {activeHelper ? (
          <div className="mt-3 rounded-xl bg-white p-3">
            {activeHelper.mode === "words" ? (
              <>
                <p className="text-xs font-bold text-slate-500">
                  Do any of these sound like you?
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {activeHelper.content.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-[#EAFBFB] px-3 py-1.5 text-xs font-black text-[#007C7C]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-2">
                {activeHelper.content.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      if (activeHelper.mode === "phrase") {
                        onInsert(field, item);
                      }
                    }}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm leading-6 ${
                      activeHelper.mode === "phrase"
                        ? "bg-[#FFF9DF] font-bold text-[#0D1B3D]"
                        : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => onHelp(field, activeHelper.mode)}
              className="mt-3 text-xs font-black text-[#4B2265]"
            >
              Give me different ideas →
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function HelperButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-black text-[#0D1B3D]"
    >
      {label}
    </button>
  );
}
