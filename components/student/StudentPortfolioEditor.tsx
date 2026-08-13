"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type ArtifactType =
  | "DOCUMENT"
  | "IMAGE"
  | "VIDEO"
  | "PRESENTATION"
  | "CERTIFICATE"
  | "LINK"
  | "OTHER";

type Artifact = {
  id: string;
  lessonId: string | null;
  title: string;
  description: string;
  type: ArtifactType;
  fileUrl: string | null;
  externalUrl: string | null;
  approval: string;
  approvedById: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lesson: {
    id: string;
    title: string;
    weekNumber: number | null;
  } | null;
};

type PortfolioData = {
  student: {
    id: string;
    name: string;
    careerSummary: string;
    readinessScore: number;
    profileComplete: boolean;
  };
  portfolio: {
    id: string | null;
    headline: string;
    summary: string;
    isPublic: boolean;
    publicSlug: string | null;
    updatedAt: string | null;
  };
  artifacts: Artifact[];
};

type ArtifactForm = {
  title: string;
  description: string;
  type: ArtifactType;
  fileUrl: string;
  externalUrl: string;
};

const EMPTY_ARTIFACT: ArtifactForm = {
  title: "",
  description: "",
  type: "OTHER",
  fileUrl: "",
  externalUrl: "",
};

const ARTIFACT_TYPES: ArtifactType[] = [
  "DOCUMENT",
  "IMAGE",
  "VIDEO",
  "PRESENTATION",
  "CERTIFICATE",
  "LINK",
  "OTHER",
];

export default function StudentPortfolioEditor({
  studentId,
  backHref,
  backLabel,
}: {
  studentId: string;
  backHref: string;
  backLabel: string;
}) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [careerSummary, setCareerSummary] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingPortfolio, setSavingPortfolio] = useState(false);
  const [savingArtifact, setSavingArtifact] = useState(false);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const [showArtifactForm, setShowArtifactForm] = useState(false);
  const [editingArtifactId, setEditingArtifactId] =
    useState<string | null>(null);
  const [artifactForm, setArtifactForm] =
    useState<ArtifactForm>(EMPTY_ARTIFACT);

  const loadPortfolio = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/student/portfolio?studentId=${encodeURIComponent(
          studentId
        )}`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to load portfolio."
        );
      }

      setData(result);
      setHeadline(result.portfolio.headline || "");
      setSummary(result.portfolio.summary || "");
      setCareerSummary(result.student.careerSummary || "");

      if (result.portfolio.updatedAt) {
        setSavedAt(result.portfolio.updatedAt);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load portfolio."
      );
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    void loadPortfolio();
  }, [loadPortfolio]);

  async function savePortfolio() {
    setSavingPortfolio(true);
    setError("");
    setSavedAt(null);

    try {
      const response = await fetch("/api/student/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          headline,
          summary,
          careerSummary,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to save portfolio."
        );
      }

      setSavedAt(
        result.portfolio.updatedAt ||
          new Date().toISOString()
      );

      await loadPortfolio();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save portfolio."
      );
    } finally {
      setSavingPortfolio(false);
    }
  }

  function startNewArtifact() {
    setEditingArtifactId(null);
    setArtifactForm(EMPTY_ARTIFACT);
    setShowArtifactForm(true);
    setError("");
  }

  function startEditArtifact(artifact: Artifact) {
    setEditingArtifactId(artifact.id);
    setArtifactForm({
      title: artifact.title,
      description: artifact.description || "",
      type: artifact.type,
      fileUrl: artifact.fileUrl || "",
      externalUrl: artifact.externalUrl || "",
    });
    setShowArtifactForm(true);
    setError("");
  }

  function cancelArtifactForm() {
    setEditingArtifactId(null);
    setArtifactForm(EMPTY_ARTIFACT);
    setShowArtifactForm(false);
  }

  async function saveArtifact() {
    if (!artifactForm.title.trim()) {
      setError("Artifact title is required.");
      return;
    }

    setSavingArtifact(true);
    setError("");

    try {
      const editing = Boolean(editingArtifactId);

      const response = await fetch("/api/student/portfolio", {
        method: editing ? "PATCH" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          ...(editingArtifactId
            ? { artifactId: editingArtifactId }
            : {}),
          title: artifactForm.title,
          description: artifactForm.description,
          type: artifactForm.type,
          fileUrl: artifactForm.fileUrl,
          externalUrl: artifactForm.externalUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to save artifact."
        );
      }

      cancelArtifactForm();
      setSavedAt(new Date().toISOString());
      await loadPortfolio();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save artifact."
      );
    } finally {
      setSavingArtifact(false);
    }
  }

  async function deleteArtifact(artifact: Artifact) {
    const confirmed = window.confirm(
      `Delete "${artifact.title}" from this portfolio?`
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      const response = await fetch("/api/student/portfolio", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          artifactId: artifact.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to delete artifact."
        );
      }

      setSavedAt(new Date().toISOString());
      await loadPortfolio();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete artifact."
      );
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="font-bold text-[#0D1B3D]">
          Loading portfolio...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
        <p className="font-bold text-red-800">
          {error || "Unable to load portfolio."}
        </p>
      </div>
    );
  }

  const artifacts = data.artifacts;
  const artifactCount = artifacts.length;

  const approvedCount = artifacts.filter(
    (artifact) => artifact.approval === "APPROVED"
  ).length;

  return (
    <main className="space-y-10">
      <header className="rounded-3xl bg-[#0D1B3D] px-8 py-10 text-white shadow-lg">
        <Link
          href={backHref}
          className="inline-flex font-bold text-[#F2B705] hover:underline"
        >
          ← {backLabel}
        </Link>

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-[#F2B705]">
          Future Ready™ Digital Portfolio
        </p>

        <h1 className="mt-3 text-4xl font-black">
          {data.student.name}
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
          A growing record of work, reflections, skills,
          achievements, experiences, and evidence of career
          readiness.
        </p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-800">
          {error}
        </div>
      ) : null}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Portfolio Artifacts"
          value={String(artifactCount)}
          detail="Saved evidence"
        />

        <StatCard
          label="Approved"
          value={String(approvedCount)}
          detail="Verified artifacts"
        />

        <StatCard
          label="Readiness Score"
          value={`${Math.round(
            data.student.readinessScore
          )}%`}
          detail="Career readiness"
        />

        <StatCard
          label="Profile"
          value={
            data.student.profileComplete
              ? "Complete"
              : "Building"
          }
          detail="Student profile"
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
              Portfolio Story
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
              Tell the Story Behind the Work
            </h2>

            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              Build a portfolio headline, summary, and career
              direction that travel with this student record.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 lg:items-end">
            <button
              type="button"
              onClick={savePortfolio}
              disabled={savingPortfolio}
              className="rounded-xl bg-[#0D1B3D] px-6 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingPortfolio
                ? "Saving..."
                : "Save Portfolio"}
            </button>

            {savedAt ? (
              <p className="text-sm font-bold text-emerald-700">
                ✓ Saved ·{" "}
                {new Date(savedAt).toLocaleString()}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          <label className="block">
            <span className="font-bold text-[#0D1B3D]">
              Portfolio Headline
            </span>

            <input
              value={headline}
              onChange={(event) =>
                setHeadline(event.target.value)
              }
              className="mt-2 w-full rounded-2xl border border-slate-300 px-5 py-4 outline-none focus:border-[#F2B705] focus:ring-4 focus:ring-[#F2B705]/20"
              placeholder="Example: Future healthcare leader focused on service and communication"
            />
          </label>

          <label className="block">
            <span className="font-bold text-[#0D1B3D]">
              Portfolio Summary
            </span>

            <textarea
              value={summary}
              onChange={(event) =>
                setSummary(event.target.value)
              }
              className="mt-2 min-h-40 w-full rounded-2xl border border-slate-300 p-5 leading-7 outline-none focus:border-[#F2B705] focus:ring-4 focus:ring-[#F2B705]/20"
              placeholder="Describe growth, accomplishments, projects, strengths, and what this portfolio demonstrates..."
            />
          </label>

          <label className="block">
            <span className="font-bold text-[#0D1B3D]">
              Career Direction
            </span>

            <textarea
              value={careerSummary}
              onChange={(event) =>
                setCareerSummary(event.target.value)
              }
              className="mt-2 min-h-32 w-full rounded-2xl border border-slate-300 p-5 leading-7 outline-none focus:border-[#F2B705] focus:ring-4 focus:ring-[#F2B705]/20"
              placeholder="Describe career interests, industries, goals, and next-step direction..."
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4B2265]">
              Portfolio Evidence
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
              Artifacts
            </h2>

            <p className="mt-3 text-slate-600">
              Add projects, documents, presentations,
              certificates, links, images, and other evidence of
              growth.
            </p>
          </div>

          <button
            type="button"
            onClick={startNewArtifact}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#0D1B3D] px-6 py-3 font-black text-white"
          >
            + Add Artifact
          </button>
        </div>
      </section>

      {showArtifactForm ? (
        <section className="rounded-3xl border-2 border-[#F2B705] bg-white p-8 shadow-sm">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
              {editingArtifactId
                ? "Edit Artifact"
                : "New Artifact"}
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
              {editingArtifactId
                ? "Update Portfolio Evidence"
                : "Add Portfolio Evidence"}
            </h2>
          </div>

          <div className="mt-8 grid gap-6">
            <label>
              <span className="font-bold text-[#0D1B3D]">
                Title *
              </span>

              <input
                value={artifactForm.title}
                onChange={(event) =>
                  setArtifactForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#F2B705]"
                placeholder="Artifact title"
              />
            </label>

            <label>
              <span className="font-bold text-[#0D1B3D]">
                Description
              </span>

              <textarea
                value={artifactForm.description}
                onChange={(event) =>
                  setArtifactForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className="mt-2 min-h-32 w-full rounded-xl border border-slate-300 p-4 outline-none focus:border-[#F2B705]"
                placeholder="What does this artifact demonstrate?"
              />
            </label>

            <div className="grid gap-6 lg:grid-cols-2">
              <label>
                <span className="font-bold text-[#0D1B3D]">
                  Artifact Type
                </span>

                <select
                  value={artifactForm.type}
                  onChange={(event) =>
                    setArtifactForm((current) => ({
                      ...current,
                      type: event.target.value as ArtifactType,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  {ARTIFACT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {formatType(type)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="font-bold text-[#0D1B3D]">
                  External Link
                </span>

                <input
                  value={artifactForm.externalUrl}
                  onChange={(event) =>
                    setArtifactForm((current) => ({
                      ...current,
                      externalUrl: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                  placeholder="https://..."
                />
              </label>
            </div>

            <label>
              <span className="font-bold text-[#0D1B3D]">
                File URL
              </span>

              <input
                value={artifactForm.fileUrl}
                onChange={(event) =>
                  setArtifactForm((current) => ({
                    ...current,
                    fileUrl: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="Saved file URL, if available"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={saveArtifact}
              disabled={savingArtifact}
              className="rounded-xl bg-[#0D1B3D] px-6 py-3 font-black text-white disabled:opacity-60"
            >
              {savingArtifact
                ? "Saving..."
                : editingArtifactId
                  ? "Save Changes"
                  : "Save Artifact"}
            </button>

            <button
              type="button"
              onClick={cancelArtifactForm}
              disabled={savingArtifact}
              className="rounded-xl border-2 border-slate-300 px-6 py-3 font-bold text-slate-700"
            >
              Cancel
            </button>
          </div>
        </section>
      ) : null}

      {artifacts.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-2xl font-black text-[#0D1B3D]">
            No portfolio artifacts yet
          </h2>

          <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
            As work is completed, add evidence here to build the
            student's permanent Future Ready™ portfolio.
          </p>

          <button
            type="button"
            onClick={startNewArtifact}
            className="mt-6 rounded-xl bg-[#0D1B3D] px-6 py-3 font-black text-white"
          >
            Add First Artifact
          </button>
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-2">
          {artifacts.map((artifact) => (
            <article
              key={artifact.id}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#4B2265]">
                    {formatType(artifact.type)}
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
                    {artifact.title}
                  </h2>
                </div>

                <ApprovalBadge
                  approval={artifact.approval}
                />
              </div>

              {artifact.description ? (
                <p className="mt-5 leading-7 text-slate-600">
                  {artifact.description}
                </p>
              ) : null}

              {artifact.lesson ? (
                <p className="mt-5 text-sm font-semibold text-slate-500">
                  {artifact.lesson.weekNumber
                    ? `Week ${artifact.lesson.weekNumber} · `
                    : ""}
                  {artifact.lesson.title}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-200 pt-5">
                {artifact.externalUrl ? (
                  <a
                    href={artifact.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-[#0D1B3D] hover:underline"
                  >
                    Open Link →
                  </a>
                ) : null}

                {artifact.fileUrl ? (
                  <a
                    href={artifact.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-[#0D1B3D] hover:underline"
                  >
                    Open File →
                  </a>
                ) : null}

                <button
                  type="button"
                  onClick={() =>
                    startEditArtifact(artifact)
                  }
                  className="font-bold text-[#0D1B3D] hover:underline"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteArtifact(artifact)
                  }
                  className="font-bold text-red-700 hover:underline"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-4xl font-black text-[#0D1B3D]">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {detail}
      </p>
    </article>
  );
}

function ApprovalBadge({
  approval,
}: {
  approval: string;
}) {
  const styles =
    approval === "APPROVED"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : approval === "REJECTED"
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-sm font-bold ${styles}`}
    >
      {formatType(approval)}
    </span>
  );
}

function formatType(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");
}
