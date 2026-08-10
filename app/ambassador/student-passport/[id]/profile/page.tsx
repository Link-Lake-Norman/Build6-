"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { students } from "@/content/platform";

type ProfileData = {
  aboutMe: string;
  strengths: string;
  values: string;
  careerInterests: string;
  futureGoals: string;
  skillsToBuild: string;
};

const emptyProfile: ProfileData = {
  aboutMe: "",
  strengths: "",
  values: "",
  careerInterests: "",
  futureGoals: "",
  skillsToBuild: "",
};

export default function StudentProfilePage() {
  const params = useParams<{ id: string }>();
  const studentId = params.id;

  const student = useMemo(
    () =>
      students.find(
        (item) => item.id === studentId
      ),
    [studentId]
  );

  const storageKey =
    `future-ready-v2-profile-${studentId}`;

  const [profile, setProfile] =
    useState<ProfileData>(emptyProfile);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      return;
    }

    try {
      setProfile({
        ...emptyProfile,
        ...JSON.parse(stored),
      });
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  function updateField(
    field: keyof ProfileData,
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

  function saveProfile() {
    localStorage.setItem(
      storageKey,
      JSON.stringify(profile)
    );

    setSaved(true);
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
          href={`/ambassador/student-passport/${student.id}`}
          className="font-bold text-[#F2B705]"
        >
          ← Back to Student Passport
        </Link>

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-[#F2B705]">
          Future Ready™ Profile
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Build My Future Ready™ Profile
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
          Capture your strengths, values, interests, goals,
          and future direction.
        </p>
      </header>

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
              updateField("strengths", value)
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
            value={profile.careerInterests}
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
              updateField("futureGoals", value)
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
            className="rounded-xl bg-[#F2B705] px-7 py-4 font-black text-[#0D1B3D]"
          >
            Save Profile
          </button>

          <Link
            href={`/ambassador/student-passport/${student.id}`}
            className="rounded-xl bg-[#0D1B3D] px-7 py-4 font-black text-white"
          >
            View Passport
          </Link>

          {saved ? (
            <p className="font-black text-emerald-700">
              Profile saved.
            </p>
          ) : null}
        </div>
      </section>
    </div>
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
        className="mt-4 min-h-36 w-full rounded-2xl border border-slate-300 p-5 leading-7 outline-none transition focus:border-[#F2B705] focus:ring-4 focus:ring-[#F2B705]/20"
      />
    </label>
  );
}
