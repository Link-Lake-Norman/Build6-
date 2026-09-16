"use client";

import { useEffect, useState } from "react";

type Preferences = {
  readingMode: boolean;
  focusMode: boolean;
  largeText: boolean;
  increasedSpacing: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  highlightInstructions: boolean;
  chunkInstructions: boolean;
};

const DEFAULTS: Preferences = {
  readingMode: false,
  focusMode: false,
  largeText: false,
  increasedSpacing: false,
  highContrast: false,
  reducedMotion: false,
  highlightInstructions: false,
  chunkInstructions: false,
};

const CLASS_MAP: Record<keyof Preferences, string> = {
  readingMode: "b6-reading",
  focusMode: "b6-focus",
  largeText: "b6-large",
  increasedSpacing: "b6-spacing",
  highContrast: "b6-contrast",
  reducedMotion: "b6-motion",
  highlightInstructions: "b6-instructions",
  chunkInstructions: "b6-chunk",
};

function applyPreferences(preferences: Preferences) {
  const root = document.documentElement;

  for (const [key, className] of Object.entries(
    CLASS_MAP,
  ) as Array<[keyof Preferences, string]>) {
    root.classList.toggle(
      className,
      preferences[key],
    );
  }
}

export default function AccessibilityLearningTools({
  studentId,
  role,
}: {
  studentId?: string | null;
  role?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] =
    useState<Preferences>(DEFAULTS);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (role !== "STUDENT" || !studentId) {
      return;
    }

    let active = true;

    fetch(
      `/api/ambassador/student-support?studentId=${encodeURIComponent(
        studentId,
      )}`,
      { cache: "no-store" },
    )
      .then(async (response) => {
        const body = await response.json();

        if (!response.ok) {
          throw new Error(
            body.error ??
              "Unable to load accessibility settings.",
          );
        }

        if (active && body.preferences) {
          const next = {
            ...DEFAULTS,
            ...body.preferences,
          };
          setPreferences(next);
          applyPreferences(next);
        }
      })
      .catch(() => {})
      .finally(() => {});

    return () => {
      active = false;
    };
  }, [role, studentId]);

  useEffect(() => {
    applyPreferences(preferences);
  }, [preferences]);

  if (role !== "STUDENT" || !studentId) {
    return null;
  }

  function setPreference(
    key: keyof Preferences,
    value: boolean,
  ) {
    setMessage("");
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function save() {
    setMessage("Saving...");

    const response = await fetch(
      "/api/ambassador/student-support",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          ...preferences,
        }),
      },
    );

    const body = await response.json();

    setMessage(
      response.ok
        ? "Saved"
        : body.error ?? "Could not save settings.",
    );
  }

  function readPage() {
    if (!("speechSynthesis" in window)) {
      setMessage(
        "Read aloud is not supported by this browser.",
      );
      return;
    }

    window.speechSynthesis.cancel();

    const text =
      document
        .querySelector("main")
        ?.textContent?.replace(/\s+/g, " ")
        .trim() ?? "";

    if (!text) {
      return;
    }

    const utterance =
      new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  const rows: Array<{
    key: keyof Preferences;
    title: string;
    detail: string;
  }> = [
    {
      key: "readingMode",
      title: "Reading-friendly layout",
      detail:
        "Comfortable line length and easier-to-scan text.",
    },
    {
      key: "largeText",
      title: "Larger text",
      detail:
        "Increase portal text size without browser zoom.",
    },
    {
      key: "increasedSpacing",
      title: "More spacing",
      detail:
        "Increase line, word, and paragraph spacing.",
    },
    {
      key: "focusMode",
      title: "Focus Mode",
      detail:
        "Reduce visual noise and simplify the work area.",
    },
    {
      key: "reducedMotion",
      title: "Reduce motion",
      detail:
        "Minimize animations and transitions.",
    },
    {
      key: "highContrast",
      title: "Higher contrast",
      detail:
        "Strengthen text, links, and keyboard focus.",
    },
    {
      key: "highlightInstructions",
      title: "Highlight directions",
      detail:
        "Make instruction areas easier to find.",
    },
    {
      key: "chunkInstructions",
      title: "Chunked-work view",
      detail:
        "Add more separation between work sections.",
    },
  ];

  return (
    <>
      <style>{`
        html.b6-large { font-size: 112.5%; }
        html.b6-reading main p,
        html.b6-reading main li,
        html.b6-reading main label {
          max-width: 72ch;
          line-height: 1.75 !important;
        }
        html.b6-spacing main p,
        html.b6-spacing main li,
        html.b6-spacing main label,
        html.b6-spacing main input,
        html.b6-spacing main textarea,
        html.b6-spacing main button {
          line-height: 1.7 !important;
          letter-spacing: 0.015em;
          word-spacing: 0.06em;
        }
        html.b6-focus main {
          max-width: 1000px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        html.b6-focus main section,
        html.b6-focus main article {
          box-shadow: none !important;
        }
        html.b6-contrast main a {
          text-decoration: underline !important;
          text-decoration-thickness: 2px !important;
          text-underline-offset: 3px !important;
        }
        html.b6-instructions main label,
        html.b6-instructions main h2,
        html.b6-instructions main h3 {
          outline: 2px solid rgba(13, 27, 61, 0.18);
          outline-offset: 4px;
        }
        html.b6-chunk main section > * + *,
        html.b6-chunk main article > * + * {
          margin-top: 1rem;
        }
        html.b6-motion *,
        html.b6-motion *::before,
        html.b6-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        html.b6-reading main :focus-visible,
        html.b6-focus main :focus-visible,
        html.b6-contrast main :focus-visible {
          outline: 3px solid #0D1B3D !important;
          outline-offset: 3px !important;
        }
      `}</style>

      <button
        type="button"
        aria-expanded={open}
        aria-controls="build6-accessibility-panel"
        onClick={() => setOpen((current) => !current)}
        className="fixed bottom-5 right-5 z-[90] rounded-full border-2 border-white bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white shadow-xl focus-visible:ring-4 focus-visible:ring-[#F2B705]"
      >
        ACCESSIBILITY
      </button>

      {open ? (
        <div
          id="build6-accessibility-panel"
          role="dialog"
          aria-labelledby="build6-accessibility-title"
          className="fixed bottom-20 right-5 z-[89] max-h-[78vh] w-[min(430px,calc(100vw-2rem))] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4B2265]">
                ACCESSIBILITY & LEARNING SUPPORTS
              </p>
              <h2
                id="build6-accessibility-title"
                className="mt-2 text-2xl font-black text-[#0D1B3D]"
              >
                Make my portal easier to use
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                No diagnosis is required to use these
                display and learning supports.
              </p>
            </div>

            <button
              type="button"
              aria-label="Close accessibility settings"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-slate-200 px-3 py-2 font-black"
            >
              X
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setPreferences((current) => ({
                  ...current,
                  readingMode: true,
                  largeText: true,
                  increasedSpacing: true,
                  reducedMotion: true,
                }))
              }
              className="rounded-2xl border-2 border-[#4B2265] bg-[#FAF7FC] p-4 text-left"
            >
              <span className="block font-black text-[#4B2265]">
                Reading Support
              </span>
              <span className="mt-1 block text-xs font-semibold leading-5 text-slate-600">
                Dyslexia-friendly spacing, larger text,
                reading layout, and reduced motion.
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setPreferences((current) => ({
                  ...current,
                  focusMode: true,
                  increasedSpacing: true,
                  reducedMotion: true,
                  highlightInstructions: true,
                  chunkInstructions: true,
                }))
              }
              className="rounded-2xl border-2 border-[#0D1B3D] bg-slate-50 p-4 text-left"
            >
              <span className="block font-black text-[#0D1B3D]">
                Focus Support
              </span>
              <span className="mt-1 block text-xs font-semibold leading-5 text-slate-600">
                ADHD-friendly focus, chunking,
                highlighted directions, and less motion.
              </span>
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {rows.map((row) => (
              <label
                key={row.key}
                className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4"
              >
                <span>
                  <span className="block font-black text-[#0D1B3D]">
                    {row.title}
                  </span>
                  <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">
                    {row.detail}
                  </span>
                </span>

                <input
                  type="checkbox"
                  checked={preferences[row.key]}
                  onChange={(event) =>
                    setPreference(
                      row.key,
                      event.target.checked,
                    )
                  }
                  className="mt-1 h-5 w-5 shrink-0"
                />
              </label>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-black text-[#0D1B3D]">
              Read this page aloud
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={readPage}
                className="rounded-xl bg-[#0D1B3D] px-4 py-2 text-sm font-black text-white"
              >
                READ PAGE
              </button>
              <button
                type="button"
                onClick={() =>
                  window.speechSynthesis?.cancel()
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-black"
              >
                STOP
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={save}
              className="rounded-xl bg-[#F2B705] px-5 py-3 text-sm font-black text-[#0D1B3D]"
            >
              SAVE MY SETTINGS
            </button>
            <button
              type="button"
              onClick={() => {
                window.speechSynthesis?.cancel();
                setPreferences(DEFAULTS);
              }}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black"
            >
              RESET
            </button>
            {message ? (
              <span
                role="status"
                className="text-sm font-black text-[#4B2265]"
              >
                {message}
              </span>
            ) : null}
          </div>

          <p className="mt-5 text-xs font-semibold leading-5 text-slate-500">
            Approved school accommodations are managed
            privately by authorized staff.
          </p>
        </div>
      ) : null}
    </>
  );
}
