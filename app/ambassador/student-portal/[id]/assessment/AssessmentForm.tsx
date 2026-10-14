"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DAY_ONE_QUESTIONS,
  READINESS_SCALE,
} from "@/content/day-one-readiness";

type Props = {
  studentId: string;
  studentName: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  SELF_AWARENESS: "Self Awareness",
  COMMUNICATION: "Communication",
  LEADERSHIP: "Leadership",
  PROFESSIONAL_PRESENCE: "Professional Presence",
  CAREER_READINESS: "Career Readiness",
  ADAPTABILITY: "Adaptability",
  AI_READINESS: "AI Readiness",
};

export default function AssessmentForm({
  studentId,
  studentName,
}: Props) {
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const answeredCount = Object.keys(answers).length;

  const categories = useMemo(() => {
    const grouped = new Map<
      string,
      typeof DAY_ONE_QUESTIONS[number][]
    >();

    for (const question of DAY_ONE_QUESTIONS) {
      const existing = grouped.get(question.category) ?? [];
      existing.push(question);
      grouped.set(question.category, existing);
    }

    return Array.from(grouped.entries());
  }, []);

  function choose(position: number, score: number) {
    setAnswers((current) => ({
      ...current,
      [position]: score,
    }));

    setError(null);
  }

  async function submitAssessment() {
    if (answeredCount !== DAY_ONE_QUESTIONS.length) {
      setError(
        `Please answer all ${DAY_ONE_QUESTIONS.length} questions before submitting.`
      );
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/student/readiness", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: DAY_ONE_QUESTIONS.map((question) => ({
            position: question.position,
            score: answers[question.position],
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to save your assessment."
        );
      }

      router.replace(
        `/ambassador/student-portal/${studentId}/career-pathways?assessment=complete`
      );
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to save your assessment."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] bg-[#0D1B3D] p-8 text-white shadow-lg md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">
          BUILD6™ Day 1
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Your Starting Point
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
          {studentName}, this is not a test and there are no
          “right” answers. Be honest about where you are today.
          We will use this baseline to show how much you grow
          throughout BUILD6™.
        </p>

        <div className="mt-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black">
          {answeredCount} of {DAY_ONE_QUESTIONS.length} answered
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black text-[#0D1B3D]">
          Use this scale:
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {READINESS_SCALE.map((item) => (
            <div
              key={item.value}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center"
            >
              <div className="text-xl font-black text-[#4B2265]">
                {item.value}
              </div>
              <div className="mt-1 text-xs font-bold leading-5 text-slate-600">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {categories.map(([category, questions]) => (
        <section
          key={category}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
            BUILD6™ Dimension
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            {CATEGORY_LABELS[category] ?? category}
          </h2>

          <div className="mt-6 space-y-7">
            {questions.map((question) => (
              <div
                key={question.position}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <p className="text-base font-bold leading-7 text-[#0D1B3D]">
                  {question.position}. {question.question}
                </p>

                <div className="mt-4 grid grid-cols-5 gap-2">
                  {READINESS_SCALE.map((item) => {
                    const selected =
                      answers[question.position] === item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                          choose(
                            question.position,
                            item.value
                          )
                        }
                        className={`rounded-xl border px-2 py-3 text-sm font-black transition ${
                          selected
                            ? "border-[#F2B705] bg-[#F2B705] text-[#0D1B3D]"
                            : "border-slate-200 bg-white text-slate-600 hover:border-[#F2B705]"
                        }`}
                        aria-label={`${question.question}: ${item.value} - ${item.label}`}
                      >
                        {item.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-3xl border-2 border-[#F2B705] bg-[#FFF9DF] p-7">
        <h2 className="text-2xl font-black text-[#0D1B3D]">
          Ready to save your baseline?
        </h2>

        <p className="mt-3 leading-7 text-slate-700">
          Your answers become your Day 1 starting point. They
          are used to measure growth — not to rank you against
          anyone else.
        </p>

        <button
          type="button"
          onClick={submitAssessment}
          disabled={
            saving ||
            answeredCount !== DAY_ONE_QUESTIONS.length
          }
          className="mt-5 rounded-xl bg-[#0D1B3D] px-7 py-4 font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving
            ? "Saving My Baseline..."
            : answeredCount === DAY_ONE_QUESTIONS.length
              ? "Complete My Day 1 Assessment →"
              : `${DAY_ONE_QUESTIONS.length - answeredCount} Questions Remaining`}
        </button>
      </section>
    </main>
  );
}
