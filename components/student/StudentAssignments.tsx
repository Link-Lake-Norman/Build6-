"use client";

import { useEffect, useState } from "react";

type Submission = {
  id: string;
  method: string | null;
  status: string;
  onlineResponse: unknown;
  studentNote: string | null;
  addToPortfolio: boolean;
  submittedAt: string | null;
  reviewedAt: string | null;
  feedback: string | null;
  updatedAt: string;
};

type Assignment = {
  id: string;
  title: string;
  instructions: string;
  estimatedMinutes: number;
  requirement: string;
  allowOnline: boolean;
  allowPrint: boolean;
  allowUpload: boolean;
  portfolioEligible: boolean;
  dueAt: string | null;
  dayNumber: number | null;
  submission: Submission | null;
};

function getResponseText(value: unknown) {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "response" in value
  ) {
    const response = (value as { response?: unknown }).response;

    return typeof response === "string" ? response : "";
  }

  return typeof value === "string" ? value : "";
}

function getStatusLabel(status: string | undefined) {
  switch (status) {
    case "DRAFT":
      return "Saved";
    case "SUBMITTED":
      return "Submitted";
    case "NEEDS_REVISION":
      return "Needs Revision";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Needs Attention";
    default:
      return "Needs Action";
  }
}

export default function StudentAssignments({
  studentId,
  lessonId,
}: {
  studentId: string;
  lessonId: string;
}) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [responses, setResponses] = useState<Record<string, string>>({});

  const [notes, setNotes] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);

  const [savingId, setSavingId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Record<string, string>>({});

  async function loadAssignments() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/student/assignments?studentId=${encodeURIComponent(
          studentId,
        )}&lessonId=${encodeURIComponent(lessonId)}`,
        {
          cache: "no-store",
        },
      );

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error ?? "Unable to load assignments.");
      }

      const nextAssignments = Array.isArray(body.assignments)
        ? body.assignments
        : [];

      setAssignments(nextAssignments);

      setResponses(
        Object.fromEntries(
          nextAssignments.map((assignment: Assignment) => [
            assignment.id,
            getResponseText(assignment.submission?.onlineResponse),
          ]),
        ),
      );

      setNotes(
        Object.fromEntries(
          nextAssignments.map((assignment: Assignment) => [
            assignment.id,
            assignment.submission?.studentNote ?? "",
          ]),
        ),
      );
    } catch (error) {
      setMessages({
        page:
          error instanceof Error
            ? error.message
            : "Unable to load assignments.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAssignments();
  }, [studentId, lessonId]);

  async function save(assignment: Assignment, action: "SAVE" | "SUBMIT") {
    setSavingId(assignment.id);

    setMessages((current) => ({
      ...current,
      [assignment.id]: "",
    }));

    try {
      const response = await fetch("/api/student/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          assignmentId: assignment.id,
          action,
          responseText: responses[assignment.id] ?? "",
          studentNote: notes[assignment.id] ?? "",
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error ?? "Unable to save assignment.");
      }

      setMessages((current) => ({
        ...current,
        [assignment.id]:
          action === "SUBMIT" ? "Assignment submitted." : "Draft saved.",
      }));

      await loadAssignments();
    } catch (error) {
      setMessages((current) => ({
        ...current,
        [assignment.id]:
          error instanceof Error ? error.message : "Unable to save assignment.",
      }));
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="font-bold text-slate-500">Loading assignments…</p>
      </section>
    );
  }

  if (assignments.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
        TODAY&apos;S WORK
      </p>

      <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
        My Assignments
      </h2>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        Save your work as you go. You can leave and come back before submitting.
      </p>

      <div className="mt-6 space-y-5">
        {assignments.map((assignment) => {
          const status = assignment.submission?.status;

          const locked = status === "SUBMITTED" || status === "APPROVED";

          const canEdit = !locked;

          return (
            <article
              key={assignment.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-[#0D1B3D]">
                    {assignment.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                    {assignment.dayNumber ? (
                      <span>Day {assignment.dayNumber}</span>
                    ) : null}

                    <span>{assignment.estimatedMinutes} min</span>

                    <span>{assignment.requirement}</span>
                  </div>
                </div>

                <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#0D1B3D]">
                  {getStatusLabel(status)}
                </span>
              </div>

              <div className="mt-4 rounded-xl bg-white p-4">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Directions
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-slate-700">
                  {assignment.instructions}
                </p>
              </div>

              {assignment.allowOnline ? (
                <div className="mt-4">
                  <label
                    htmlFor={`assignment-${assignment.id}`}
                    className="text-sm font-black text-[#0D1B3D]"
                  >
                    My Work
                  </label>

                  <textarea
                    id={`assignment-${assignment.id}`}
                    rows={7}
                    disabled={!canEdit}
                    value={responses[assignment.id] ?? ""}
                    onChange={(event) =>
                      setResponses((current) => ({
                        ...current,
                        [assignment.id]: event.target.value,
                      }))
                    }
                    placeholder="Complete your work here..."
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-4 text-sm leading-6 text-[#0D1B3D] outline-none focus:border-[#0D1B3D] disabled:bg-slate-100"
                  />
                </div>
              ) : null}

              <div className="mt-4">
                <label
                  htmlFor={`note-${assignment.id}`}
                  className="text-sm font-black text-[#0D1B3D]"
                >
                  My Notes
                </label>

                <textarea
                  id={`note-${assignment.id}`}
                  rows={3}
                  disabled={!canEdit}
                  value={notes[assignment.id] ?? ""}
                  onChange={(event) =>
                    setNotes((current) => ({
                      ...current,
                      [assignment.id]: event.target.value,
                    }))
                  }
                  placeholder="Add anything you want to remember..."
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-4 text-sm leading-6 text-[#0D1B3D] outline-none focus:border-[#0D1B3D] disabled:bg-slate-100"
                />
              </div>

              {assignment.allowPrint || assignment.allowUpload ? (
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                  {assignment.allowPrint ? (
                    <span className="rounded-full bg-white px-3 py-2">
                      Print option available
                    </span>
                  ) : null}

                  {assignment.allowUpload ? (
                    <span className="rounded-full bg-white px-3 py-2">
                      File upload supported
                    </span>
                  ) : null}
                </div>
              ) : null}

              {assignment.submission?.feedback ? (
                <div className="mt-4 rounded-xl border border-[#00A6A6]/30 bg-[#EAFBFB] p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-[#007C7C]">
                    Facilitator Feedback
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#0D1B3D]">
                    {assignment.submission.feedback}
                  </p>
                </div>
              ) : null}

              {canEdit ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={savingId === assignment.id}
                    onClick={() => void save(assignment, "SAVE")}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-[#0D1B3D] disabled:opacity-50"
                  >
                    {savingId === assignment.id ? "Saving..." : "Save Draft"}
                  </button>

                  <button
                    type="button"
                    disabled={savingId === assignment.id}
                    onClick={() => void save(assignment, "SUBMIT")}
                    className="rounded-xl bg-[#0D1B3D] px-4 py-3 text-sm font-black text-white disabled:opacity-50"
                  >
                    Submit Assignment
                  </button>
                </div>
              ) : (
                <p className="mt-5 text-sm font-black text-emerald-700">
                  ✓ Work submitted
                </p>
              )}

              {messages[assignment.id] ? (
                <p className="mt-3 text-sm font-bold text-slate-600">
                  {messages[assignment.id]}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
