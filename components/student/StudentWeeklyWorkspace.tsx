"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  StudentWeeklyWorkspaceDefinition,
  StudentWorkspaceField,
} from "@/content/ambassador/student-weekly-workspaces";

const MARKER = "[[FUTURE_READY_WEEKLY_WORKSPACE_V1]]";
const END_MARKER = "[[END_FUTURE_READY_WEEKLY_WORKSPACE_V1]]";

type AnswerValue = string | string[];
type Answers = Record<string, AnswerValue>;

type Props = {
  studentId: string;
  lessonId: string;
  weekNumber: number;
  lessonTitle: string;
  reflectionPrompt: string;
  passportHref: string;
  workspace?: StudentWeeklyWorkspaceDefinition;
};

function isEmptyValue(value: AnswerValue | undefined) {
  if (Array.isArray(value)) return value.length === 0;
  return !value?.trim();
}

function normalizeAnswers(value: unknown): Answers {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const output: Answers = {};

  for (const [key, item] of Object.entries(value)) {
    if (typeof item === "string") {
      output[key] = item;
    } else if (
      Array.isArray(item) &&
      item.every((entry) => typeof entry === "string")
    ) {
      output[key] = item;
    }
  }

  return output;
}

function parseStoredResponse(response: string | null | undefined) {
  const raw = response ?? "";

  if (!raw.includes(MARKER)) {
    return {
      answers: {} as Answers,
      preservedPriorReflection: raw.trim(),
    };
  }

  const markerIndex = raw.indexOf(MARKER);
  const endIndex = raw.indexOf(END_MARKER, markerIndex);

  if (endIndex < 0) {
    return {
      answers: {} as Answers,
      preservedPriorReflection: raw.trim(),
    };
  }

  const jsonStart = markerIndex + MARKER.length;
  const jsonText = raw.slice(jsonStart, endIndex).trim();

  try {
    const parsed = JSON.parse(jsonText) as {
      answers?: unknown;
      preservedPriorReflection?: unknown;
    };

    return {
      answers: normalizeAnswers(parsed.answers),
      preservedPriorReflection:
        typeof parsed.preservedPriorReflection === "string"
          ? parsed.preservedPriorReflection
          : "",
    };
  } catch {
    return {
      answers: {} as Answers,
      preservedPriorReflection: raw.trim(),
    };
  }
}

function answerToText(value: AnswerValue | undefined) {
  if (Array.isArray(value)) return value.join(", ");
  return value ?? "";
}

function serializeWorkspace(
  workspace: StudentWeeklyWorkspaceDefinition,
  answers: Answers,
  preservedPriorReflection: string,
) {
  const humanReadable: string[] = [
    `BUILD6™ · Week ${workspace.week}`,
    workspace.title,
    workspace.subtitle,
    "",
    `ESSENTIAL QUESTION`,
    workspace.essentialQuestion,
  ];

  for (const section of workspace.sections) {
    humanReadable.push("", section.title);

    if (section.description) {
      humanReadable.push(section.description);
    }

    for (const field of section.fields) {
      const value = answerToText(answers[field.id]);
      humanReadable.push("", field.label, value || "—");
    }
  }

  if (preservedPriorReflection.trim()) {
    humanReadable.push(
      "",
      "PREVIOUS REFLECTION — PRESERVED",
      preservedPriorReflection.trim(),
    );
  }

  const payload = {
    version: 1,
    week: workspace.week,
    answers,
    preservedPriorReflection,
  };

  return [
    humanReadable.join("\n"),
    "",
    MARKER,
    JSON.stringify(payload),
    END_MARKER,
  ].join("\n");
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: StudentWorkspaceField;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
}) {
  if (field.type === "single-select") {
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {(field.options ?? []).map((option) => {
          const active = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
                active
                  ? "border-[#0D1B3D] bg-[#0D1B3D] text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-[#4B2265]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    );
  }

  if (field.type === "multi-select") {
    const selected = Array.isArray(value) ? value : [];

    return (
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {(field.options ?? []).map((option) => {
          const active = selected.includes(option);

          return (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-semibold ${
                active
                  ? "border-[#4B2265] bg-[#F7F1FA]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={(event) => {
                  if (event.target.checked) {
                    onChange([...selected, option]);
                  } else {
                    onChange(selected.filter((item) => item !== option));
                  }
                }}
              />
              {option}
            </label>
          );
        })}
      </div>
    );
  }

  if (field.type === "text") {
    return (
      <input
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#4B2265]"
      />
    );
  }

  return (
    <textarea
      value={typeof value === "string" ? value : ""}
      onChange={(event) => onChange(event.target.value)}
      rows={4}
      className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 leading-6 text-slate-900 outline-none transition focus:border-[#4B2265]"
    />
  );
}

export default function StudentWeeklyWorkspace({
  studentId,
  lessonId,
  weekNumber,
  lessonTitle,
  reflectionPrompt,
  passportHref,
  workspace,
}: Props) {
  const [answers, setAnswers] = useState<Answers>({});
  const [legacyResponse, setLegacyResponse] = useState("");
  const [genericResponse, setGenericResponse] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<
    "idle" | "dirty" | "saving" | "saved" | "error"
  >("idle");
  const [error, setError] = useState("");

  const loadedResponseRef = useRef("");
  const dirtyRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentResponse = useMemo(() => {
    if (!workspace) return genericResponse;

    return serializeWorkspace(workspace, answers, legacyResponse);
  }, [workspace, answers, legacyResponse, genericResponse]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/student/reflections?studentId=${encodeURIComponent(
            studentId,
          )}&week=${weekNumber}`,
          { cache: "no-store" },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error ?? "Unable to load your work.");
        }

        if (cancelled) return;

        const storedResponse =
          typeof result.reflection?.response === "string"
            ? result.reflection.response
            : "";

        if (workspace) {
          const parsed = parseStoredResponse(storedResponse);
          setAnswers(parsed.answers);
          setLegacyResponse(parsed.preservedPriorReflection);
        } else {
          setGenericResponse(storedResponse);
        }

        setStatus(result.reflection?.status ?? "DRAFT");
        loadedResponseRef.current = storedResponse;
        dirtyRef.current = false;
        setSaveState("idle");
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load your work.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [studentId, lessonId, weekNumber, workspace]);

  async function save(submit = false) {
    if (loading) return;

    const responseText = currentResponse;

    if (!submit && responseText === loadedResponseRef.current) {
      dirtyRef.current = false;
      setSaveState("saved");
      return;
    }

    setSaveState("saving");
    setError("");

    try {
      const response = await fetch("/api/student/reflections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          week: weekNumber,
          prompt: workspace
            ? `BUILD6™ Week ${weekNumber} Student Workspace · ${workspace.title}`
            : reflectionPrompt,
          response: responseText,
          submit,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to save your work.");
      }

      loadedResponseRef.current = responseText;
      dirtyRef.current = false;
      setStatus(result.reflection?.status ?? (submit ? "SUBMITTED" : "DRAFT"));
      setSaveState("saved");
    } catch (saveError) {
      setSaveState("error");
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save your work.",
      );
    }
  }

  function markChanged() {
    dirtyRef.current = true;
    setStatus("DRAFT");
    setSaveState("dirty");

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      void save(false);
    }, 1200);
  }

  function updateAnswer(fieldId: string, value: AnswerValue) {
    setAnswers((current) => ({
      ...current,
      [fieldId]: value,
    }));

    markChanged();
  }

  function updateGeneric(value: string) {
    setGenericResponse(value);
    markChanged();
  }

  useEffect(() => {
    const safetyTimer = setInterval(() => {
      if (dirtyRef.current) {
        void save(false);
      }
    }, 120000);

    return () => clearInterval(safetyTimer);
  });

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <p className="font-bold text-slate-600">Loading your Week {weekNumber} work...</p>
      </section>
    );
  }

  if (!workspace) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
          Week {weekNumber} Reflection
        </p>
        <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
          {lessonTitle}
        </h2>

        <textarea
          value={genericResponse}
          onChange={(event) => updateGeneric(event.target.value)}
          rows={10}
          className="mt-6 w-full rounded-2xl border border-slate-300 p-4 leading-7"
        />

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void save(false)}
            className="rounded-xl bg-[#0D1B3D] px-5 py-3 font-black text-white"
          >
            Save Reflection
          </button>

          <button
            type="button"
            onClick={() => void save(true)}
            className="rounded-xl bg-[#4B2265] px-5 py-3 font-black text-white"
          >
            Submit for Review
          </button>

          <span className="text-sm font-bold text-slate-500">
            {saveState === "saving"
              ? "Saving..."
              : saveState === "saved"
                ? "Saved"
                : "Autosave on"}
          </span>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl bg-red-50 p-3 font-semibold text-red-700">
            {error}
          </p>
        ) : null}
      </section>
    );
  }

  const answeredCount = workspace.sections.reduce((total, section) => {
    return (
      total +
      section.fields.filter((field) => !isEmptyValue(answers[field.id])).length
    );
  }, 0);

  const totalCount = workspace.sections.reduce(
    (total, section) => total + section.fields.length,
    0,
  );

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
              BUILD6™ · Week {weekNumber}
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
              {workspace.title}
            </h2>

            <p className="mt-2 font-bold text-slate-600">
              {workspace.subtitle}
            </p>

            <div className="mt-5 rounded-2xl bg-[#FFF8D8] p-5">
              <p className="text-xs font-black uppercase tracking-wider text-[#725500]">
                Essential Question
              </p>
              <p className="mt-2 text-lg font-black leading-7 text-[#0D1B3D]">
                {workspace.essentialQuestion}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-sm">
            <p className="font-black text-[#0D1B3D]">
              {answeredCount} / {totalCount} responses started
            </p>
            <p className="mt-1 font-semibold text-slate-500">
              {saveState === "saving"
                ? "Saving..."
                : saveState === "saved"
                  ? "✓ Saved"
                  : saveState === "error"
                    ? "Save problem"
                    : "Autosave on"}
            </p>
            <p className="mt-1 text-xs font-bold uppercase text-slate-400">
              {status.replaceAll("_", " ")}
            </p>
          </div>
        </div>

        {legacyResponse ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-amber-800">
              Your Previous Reflection
            </p>
            <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
              {legacyResponse}
            </p>
            <p className="mt-3 text-xs font-bold text-amber-800">
              Preserved exactly as it was. Completing this workspace will not erase it.
            </p>
          </div>
        ) : null}
      </div>

      {workspace.sections.map((section) => (
        <div
          key={section.id}
          className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
        >
          <h3 className="text-xl font-black text-[#0D1B3D]">
            {section.title}
          </h3>

          {section.description ? (
            <p className="mt-2 max-w-4xl leading-7 text-slate-600">
              {section.description}
            </p>
          ) : null}

          <div className="mt-6 space-y-6">
            {section.fields.map((field) => (
              <div
                key={field.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <label className="block font-black leading-6 text-[#0D1B3D]">
                  {field.label}
                </label>

                {field.helperText ? (
                  <p className="mt-1 text-sm text-slate-500">
                    {field.helperText}
                  </p>
                ) : null}

                <FieldControl
                  field={field}
                  value={answers[field.id]}
                  onChange={(value) => updateAnswer(field.id, value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="sticky bottom-4 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-xl backdrop-blur">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void save(false)}
            disabled={saveState === "saving"}
            className="rounded-xl bg-[#0D1B3D] px-5 py-3 font-black text-white disabled:opacity-50"
          >
            Save My Work
          </button>

          <button
            type="button"
            onClick={() => void save(true)}
            disabled={saveState === "saving"}
            className="rounded-xl bg-[#4B2265] px-5 py-3 font-black text-white disabled:opacity-50"
          >
            Submit for Review
          </button>

          <Link
            href={passportHref}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-black text-[#0D1B3D]"
          >
            Open My Passport →
          </Link>

          <Link
            href={`/ambassador/student-portal/${studentId}/capstone`}
            className="rounded-xl border border-[#F2B705] bg-[#FFF9E5] px-5 py-3 font-black text-[#0D1B3D]"
          >
            Beyond the Game · My Capstone →
          </Link>

          <span className="ml-auto text-sm font-bold text-slate-500">
            {saveState === "saving"
              ? "Saving..."
              : saveState === "saved"
                ? "✓ Saved"
                : saveState === "error"
                  ? "Save problem"
                  : "Autosave on"}
          </span>
        </div>

        {error ? (
          <p className="mt-3 rounded-xl bg-red-50 p-3 font-semibold text-red-700">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
