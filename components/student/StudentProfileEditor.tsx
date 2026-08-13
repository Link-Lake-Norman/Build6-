"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ProfileData = {
  aboutMe: string;
  strengths: string;
  values: string;
  careerInterests: string;
  futureGoals: string;
  skillsToBuild: string;
};

type StudentData = {
  id: string;
  name: string;
  grade: string;
  school: string;
  cohort: string;
  totalWeeks: number;
  profileComplete: boolean;
};

const emptyProfile: ProfileData = {
  aboutMe: "",
  strengths: "",
  values: "",
  careerInterests: "",
  futureGoals: "",
  skillsToBuild: "",
};

export default function StudentProfileEditor({
  studentId,
}: {
  studentId: string;
}) {
  const [student, setStudent] =
    useState<StudentData | null>(null);

  const [profile, setProfile] =
    useState<ProfileData>(emptyProfile);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [savedAt, setSavedAt] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/student/profile?studentId=${encodeURIComponent(
            studentId
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ??
              "Unable to load profile."
          );
        }

        setStudent(data.student);

        setProfile({
          aboutMe:
            data.profile?.aboutMe ?? "",
          strengths:
            data.profile?.strengths ?? "",
          values:
            data.profile?.values ?? "",
          careerInterests:
            data.profile?.careerInterests ?? "",
          futureGoals:
            data.profile?.futureGoals ?? "",
          skillsToBuild:
            data.profile?.skillsToBuild ?? "",
        });

        setSavedAt(
          data.profile?.updatedAt ?? null
        );
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [studentId]);

  function updateField(
    field: keyof ProfileData,
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setSavedAt(null);
  }

  async function saveProfile() {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/student/profile",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            studentId,
            ...profile,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Unable to save profile."
        );
      }

      setSavedAt(
        data.profile.updatedAt
      );

      setStudent((current) =>
        current
          ? {
              ...current,
              profileComplete:
                data.complete,
            }
          : current
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to save profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-8">
        Loading profile...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="rounded-3xl bg-white p-8">
        Student not found.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="rounded-3xl bg-[#0D1B3D] px-8 py-10 text-white">
        <Link
          href={`/ambassador/student-passport/${studentId}`}
          className="font-bold text-[#F2B705]"
        >
          ← Back to Student Passport
        </Link>

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-[#F2B705]">
          Future Ready™ Student Profile
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Build My Future Ready™ Profile
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
          Capture your strengths, values,
          interests, goals, and future
          direction.
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ProfileStat
          label="Student"
          value={student.name}
        />

        <ProfileStat
          label="School"
          value={student.school}
        />

        <ProfileStat
          label="Grade"
          value={student.grade}
        />

        <ProfileStat
          label="Program"
          value={`${student.totalWeeks}-Week`}
        />
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 font-bold text-red-800">
          {error}
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-8">
          <ProfileField
            label="About Me"
            description="Tell your story and describe what makes you unique."
            placeholder="I am someone who..."
            value={profile.aboutMe}
            onChange={(value) =>
              updateField("aboutMe", value)
            }
          />

          <ProfileField
            label="My Strengths"
            description="Identify personal strengths and qualities that help you succeed."
            placeholder="My strengths include..."
            value={profile.strengths}
            onChange={(value) =>
              updateField(
                "strengths",
                value
              )
            }
          />

          <ProfileField
            label="My Values"
            description="Describe the values and principles that guide your choices."
            placeholder="The values that matter most to me are..."
            value={profile.values}
            onChange={(value) =>
              updateField("values", value)
            }
          />

          <ProfileField
            label="Career Interests"
            description="Share careers, industries, and work environments you want to explore."
            placeholder="I am interested in..."
            value={
              profile.careerInterests
            }
            onChange={(value) =>
              updateField(
                "careerInterests",
                value
              )
            }
          />

          <ProfileField
            label="Future Goals"
            description="Describe where you want to go and what you hope to accomplish."
            placeholder="My future goals are..."
            value={profile.futureGoals}
            onChange={(value) =>
              updateField(
                "futureGoals",
                value
              )
            }
          />

          <ProfileField
            label="Skills I Want to Build"
            description="Choose the skills you want to strengthen through Future Ready™."
            placeholder="I want to improve..."
            value={profile.skillsToBuild}
            onChange={(value) =>
              updateField(
                "skillsToBuild",
                value
              )
            }
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={saveProfile}
            disabled={saving}
            className="rounded-xl bg-[#F2B705] px-7 py-4 font-black text-[#0D1B3D] disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>

          <Link
            href={`/ambassador/student-passport/${studentId}`}
            className="rounded-xl bg-[#0D1B3D] px-7 py-4 font-black text-white"
          >
            View Passport
          </Link>

          {savedAt && (
            <p className="font-black text-emerald-700">
              ✓ Saved ·{" "}
              {new Date(
                savedAt
              ).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          )}

          {student.profileComplete && (
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-800">
              Profile Complete
            </span>
          )}
        </div>
      </section>
    </div>
  );
}

function ProfileStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-[#0D1B3D]">
        {value || "—"}
      </p>
    </article>
  );
}

function ProfileField({
  label,
  description,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  description: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-2xl font-black text-[#0D1B3D]">
        {label}
      </span>

      <span className="mt-2 block leading-7 text-slate-600">
        {description}
      </span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-4 min-h-32 w-full rounded-2xl border border-slate-300 p-5 text-lg leading-8 outline-none transition focus:border-[#F2B705] focus:ring-4 focus:ring-[#F2B705]/20"
      />
    </label>
  );
}
