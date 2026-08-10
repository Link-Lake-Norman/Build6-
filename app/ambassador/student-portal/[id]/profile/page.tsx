"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ambassadorStudents } from "@/content/ambassador-students";

type StudentProfileForm = {
  aboutMe: string;
  strengths: string;
  careerInterests: string;
  futureGoals: string;
  skillsToBuild: string;
};

const emptyProfile: StudentProfileForm = {
  aboutMe: "",
  strengths: "",
  careerInterests: "",
  futureGoals: "",
  skillsToBuild: "",
};

export default function StudentProfileBuilderPage() {
  const params = useParams<{ id: string }>();
  const studentId = params.id;

  const student = useMemo(
    () =>
      ambassadorStudents.find(
        (item) => item.id === studentId
      ),
    [studentId]
  );

  const storageKey = `future-ready-profile-${studentId}`;

  const [profile, setProfile] =
    useState<StudentProfileForm>(emptyProfile);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedProfile = window.localStorage.getItem(
      storageKey
    );

    if (!savedProfile) {
      return;
    }

    try {
      const parsed = JSON.parse(
        savedProfile
      ) as Partial<StudentProfileForm>;

      setProfile({
        aboutMe: parsed.aboutMe ?? "",
        strengths: parsed.strengths ?? "",
        careerInterests:
          parsed.careerInterests ?? "",
        futureGoals: parsed.futureGoals ?? "",
        skillsToBuild:
          parsed.skillsToBuild ?? "",
      });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  function updateField(
    field: keyof StudentProfileForm,
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

  function saveProfile() {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify(profile)
    );

    setSaved(true);
  }

  if (!student) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900">
          Student Not Found
        </h1>

        <Link
          href="/ambassador"
          className="mt-6 inline-flex rounded-xl bg-[#0D1B3D] px-5 py-3 font-bold text-white"
        >
          Back to Ambassador Home
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 py-10">
      <header className="rounded-3xl bg-[#0D1B3D] px-8 py-10 text-white shadow-lg">
        <Link
          href={`/ambassador/student-passport/${student.id}`}
          className="inline-flex font-bold text-[#F2B705] hover:underline"
        >
          ← Back to Student Passport
        </Link>

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-[#F2B705]">
          Future Ready™ Student Profile
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Build Your Future Ready™ Profile
        </h1>

        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-200">
          Discover your strengths, interests, skills,
          goals, and future direction.
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ProfileStat
          label="Student"
          value={student.name}
        />

        <ProfileStat
          label="School"
          value="Ambassador Christian School"
        />

        <ProfileStat
          label="Grade"
          value={student.grade}
        />

        <ProfileStat
          label="Current Week"
          value={String(student.currentWeek)}
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-8">
          <ProfileField
            label="About Me"
            description="Tell us about yourself, your interests, and what matters to you."
            placeholder="I am someone who..."
            value={profile.aboutMe}
            onChange={(value) =>
              updateField("aboutMe", value)
            }
          />

          <ProfileField
            label="My Strengths"
            description="Identify personal qualities and skills that help you succeed."
            placeholder="Leadership, creativity, teamwork..."
            value={profile.strengths}
            onChange={(value) =>
              updateField("strengths", value)
            }
          />

          <ProfileField
            label="Career Interests"
            description="Share the industries, careers, or work environments you want to explore."
            placeholder="Healthcare, technology, business..."
            value={profile.careerInterests}
            onChange={(value) =>
              updateField("careerInterests", value)
            }
          />

          <ProfileField
            label="Future Goals"
            description="Describe where you want to go and what you hope to accomplish."
            placeholder="My goals for the future are..."
            value={profile.futureGoals}
            onChange={(value) =>
              updateField("futureGoals", value)
            }
          />

          <ProfileField
            label="Skills I Want To Build"
            description="Choose skills you want to strengthen through Future Ready™."
            placeholder="Communication, confidence, problem solving..."
            value={profile.skillsToBuild}
            onChange={(value) =>
              updateField("skillsToBuild", value)
            }
          />
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={saveProfile}
            className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#F2B705] px-7 py-4 text-lg font-bold text-[#0D1B3D] transition hover:bg-[#DDA600]"
          >
            Save Profile
          </button>

          <Link
            href={`/ambassador/student-portal/${student.id}`}
            className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#0D1B3D] px-7 py-4 text-lg font-bold text-white transition hover:bg-[#172B55]"
          >
            View Complete Student Record
          </Link>

          {saved && (
            <p className="font-bold text-emerald-700">
              Profile saved successfully.
            </p>
          )}
        </div>
      </section>
    </main>
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
        {value}
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
      <span className="block text-2xl font-bold text-[#0D1B3D]">
        {label}
      </span>

      <span className="mt-2 block text-base leading-7 text-slate-600">
        {description}
      </span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-4 min-h-36 w-full rounded-2xl border border-slate-300 p-5 text-base leading-7 outline-none transition focus:border-[#F2B705] focus:ring-4 focus:ring-[#F2B705]/20"
      />
    </label>
  );
}