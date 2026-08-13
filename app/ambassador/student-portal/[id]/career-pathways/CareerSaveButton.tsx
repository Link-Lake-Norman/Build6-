"use client";

import { useState } from "react";

type CareerSaveButtonProps = {
  studentId: string;
  careerName: string;
  industry: string;
  description: string;
  initiallySaved: boolean;
};

export default function CareerSaveButton({
  studentId,
  careerName,
  industry,
  description,
  initiallySaved,
}: CareerSaveButtonProps) {
  const [saved, setSaved] =
    useState(initiallySaved);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  async function saveCareer() {
    if (saved || saving) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        "/api/student/career-interests",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            studentId,
            careerName,
            industry,
            description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Unable to save career."
        );
      }

      setSaved(true);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save career."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={saveCareer}
        disabled={saved || saving}
        className={`rounded-xl px-5 py-3 font-black transition ${
          saved
            ? "bg-emerald-100 text-emerald-800"
            : "bg-[#0D1B3D] text-white hover:bg-[#162A57]"
        } disabled:cursor-default`}
      >
        {saved
          ? "✓ Saved to My Career Interests"
          : saving
            ? "Saving..."
            : "Save Career to My Passport"}
      </button>

      {error ? (
        <p className="mt-2 text-sm font-bold text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
