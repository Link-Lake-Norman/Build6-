"use client";

import { useCallback, useEffect, useState } from "react";

type CohortExperience = {
  id: string;
  weekNumber: number;
  dayNumber: number;
  experienceType: string;
  title: string;
  description: string | null;
  eventDate: string | null;
  startTime: string | null;
  endTime: string | null;
  departureTime: string | null;
  returnTime: string | null;
  siteName: string | null;
  city: string | null;
  state: string | null;
  contactName: string | null;
  contactTitle: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  capacity: number | null;
  learningObjective: string | null;
  careerConnection: string | null;
  preTripPreparation: string | null;
  studentQuestions: string | null;
  postTripReflection: string | null;
  studentVisibleNotes: string | null;
  facilitatorNotes: string | null;
  visibleToStudent: boolean;
  status: string;
};

type ExperienceDraft = {
  experienceType: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  siteName: string;
  city: string;
  state: string;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  capacity: string;
  learningObjective: string;
  careerConnection: string;
  preTripPreparation: string;
  postTripReflection: string;
  studentVisibleNotes: string;
  facilitatorNotes: string;
  visibleToStudent: boolean;
};

const COHORT_CODE = "PILOT-2026-2027";

const EXPERIENCE_TYPES = [
  ["GUEST_SPEAKER", "Guest Speaker"],
  ["FIELD_TRIP", "Field Trip"],
  ["EMPLOYER_VISIT", "Employer / Workplace Visit"],
  ["CAREER_PANEL", "Career Panel"],
  ["WORKSHOP", "Special Workshop"],
  ["COMMUNITY", "Community Experience"],
  ["OTHER", "Other Experience"],
] as const;

function emptyDraft(): ExperienceDraft {
  return {
    experienceType: "GUEST_SPEAKER",
    title: "",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    siteName: "",
    city: "",
    state: "NC",
    contactName: "",
    contactTitle: "",
    contactEmail: "",
    contactPhone: "",
    capacity: "",
    learningObjective: "",
    careerConnection: "",
    preTripPreparation: "",
    postTripReflection: "",
    studentVisibleNotes: "",
    facilitatorNotes: "",
    visibleToStudent: true,
  };
}

function typeLabel(value: string) {
  return (
    EXPERIENCE_TYPES.find(([key]) => key === value)?.[1] ??
    value.replaceAll("_", " ")
  );
}

export default function ExperiencesPage() {
  const [week, setWeek] = useState(1);
  const [day, setDay] = useState(4);
  const [experiences, setExperiences] = useState<CohortExperience[]>([]);
  const [draft, setDraft] = useState<ExperienceDraft>(emptyDraft());
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadExperiences = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/ambassador/experiences?cohortCode=${encodeURIComponent(
          COHORT_CODE
        )}&week=${week}`,
        { cache: "no-store" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to load experiences.");
      }

      setExperiences(
        Array.isArray(result.experiences) ? result.experiences : []
      );
    } catch (caught) {
      setExperiences([]);
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to load experiences."
      );
    } finally {
      setLoading(false);
    }
  }, [week]);

  useEffect(() => {
    void loadExperiences();
  }, [loadExperiences]);

  function update<K extends keyof ExperienceDraft>(
    field: K,
    value: ExperienceDraft[K]
  ) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveExperience() {
    if (!draft.title.trim()) {
      setError("Give the experience a title.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/ambassador/experiences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cohortCode: COHORT_CODE,
          weekNumber: week,
          dayNumber: day,
          ...draft,
          capacity: draft.capacity ? Number(draft.capacity) : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to save experience.");
      }

      setDraft(emptyDraft());
      setShowForm(false);
      setMessage(`Experience saved to Week ${week}, Day ${day}.`);

      await loadExperiences();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to save experience."
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeExperience(id: string) {
    if (!window.confirm("Remove this experience from the cohort plan?")) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/ambassador/experiences", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cohortCode: COHORT_CODE,
          experienceId: id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to remove experience.");
      }

      setMessage("Experience removed.");
      await loadExperiences();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to remove experience."
      );
    }
  }

  const selectedDayExperiences = experiences.filter(
    (item) => item.dayNumber === day
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-[#0D1B3D] p-6 text-white md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
          EXPERIENCES
        </p>

        <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black">
              Speakers + Field Experiences
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Organize guest speakers, field trips, employer visits,
              career panels, workshops and community experiences around the
              Future Ready™ lesson plan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm((current) => !current)}
            className="rounded-xl bg-[#F2B705] px-5 py-3 text-sm font-black text-[#0D1B3D]"
          >
            {showForm ? "Close" : "+ Add Experience"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-2">
          <label>
            <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
              Week
            </span>

            <select
              value={week}
              onChange={(event) => setWeek(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-bold text-[#0D1B3D]"
            >
              {Array.from({ length: 16 }, (_, index) => index + 1).map(
                (number) => (
                  <option key={number} value={number}>
                    Week {number}
                  </option>
                )
              )}
            </select>
          </label>

          <div>
            <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
              Class Day
            </span>

            <div className="mt-2 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => setDay(number)}
                  className={`rounded-xl px-4 py-3 text-sm font-black ${
                    day === number
                      ? "bg-[#0D1B3D] text-white"
                      : "border border-slate-200 bg-slate-50 text-[#0D1B3D]"
                  }`}
                >
                  Day {number}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800">
          ✓ {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-800">
          {error}
        </div>
      ) : null}

      {showForm ? (
        <section className="rounded-2xl border border-[#00A6A6] bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#007C7C]">
              WEEK {week} · DAY {day}
            </p>

            <h2 className="mt-1 text-2xl font-black text-[#0D1B3D]">
              Add Speaker or Experience
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Experience Type">
              <select
                value={draft.experienceType}
                onChange={(event) =>
                  update("experienceType", event.target.value)
                }
                className={inputClass}
              >
                {EXPERIENCE_TYPES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Title">
              <input
                value={draft.title}
                onChange={(event) => update("title", event.target.value)}
                className={inputClass}
                placeholder="Healthcare Career Panel"
              />
            </Field>

            <Field label="Date">
              <input
                type="date"
                value={draft.eventDate}
                onChange={(event) =>
                  update("eventDate", event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Start">
                <input
                  type="time"
                  value={draft.startTime}
                  onChange={(event) =>
                    update("startTime", event.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="End">
                <input
                  type="time"
                  value={draft.endTime}
                  onChange={(event) =>
                    update("endTime", event.target.value)
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Speaker / Site / Organization">
              <input
                value={draft.siteName}
                onChange={(event) =>
                  update("siteName", event.target.value)
                }
                className={inputClass}
                placeholder="Organization, company, venue or speaker"
              />
            </Field>

            <Field label="Capacity">
              <input
                type="number"
                min="1"
                value={draft.capacity}
                onChange={(event) =>
                  update("capacity", event.target.value)
                }
                className={inputClass}
                placeholder="20"
              />
            </Field>

            <Field label="Contact Name">
              <input
                value={draft.contactName}
                onChange={(event) =>
                  update("contactName", event.target.value)
                }
                className={inputClass}
                placeholder="Primary contact"
              />
            </Field>

            <Field label="Contact Title">
              <input
                value={draft.contactTitle}
                onChange={(event) =>
                  update("contactTitle", event.target.value)
                }
                className={inputClass}
                placeholder="HR Leader, Speaker, Tour Coordinator"
              />
            </Field>

            <Field label="Contact Email">
              <input
                type="email"
                value={draft.contactEmail}
                onChange={(event) =>
                  update("contactEmail", event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Contact Phone">
              <input
                value={draft.contactPhone}
                onChange={(event) =>
                  update("contactPhone", event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="City">
              <input
                value={draft.city}
                onChange={(event) => update("city", event.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="State">
              <input
                value={draft.state}
                onChange={(event) => update("state", event.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <TextField
              label="Description / Agenda"
              value={draft.description}
              onChange={(value) => update("description", value)}
              placeholder="What will happen during the experience?"
            />

            <TextField
              label="Future Ready™ Learning Objective"
              value={draft.learningObjective}
              onChange={(value) => update("learningObjective", value)}
              placeholder="What should students learn or demonstrate?"
            />

            <TextField
              label="Career / Workplace Connection"
              value={draft.careerConnection}
              onChange={(value) => update("careerConnection", value)}
              placeholder="How does this connect to careers, skills or workplace expectations?"
            />

            <TextField
              label="Student Preparation"
              value={draft.preTripPreparation}
              onChange={(value) =>
                update("preTripPreparation", value)
              }
              placeholder="Research, questions, dress expectations, preparation..."
            />

            <TextField
              label="Student Reflection"
              value={draft.postTripReflection}
              onChange={(value) =>
                update("postTripReflection", value)
              }
              placeholder="What should students reflect on afterward?"
            />

            <TextField
              label="Facilitator-Only Notes"
              value={draft.facilitatorNotes}
              onChange={(value) =>
                update("facilitatorNotes", value)
              }
              placeholder="Internal coordination notes..."
            />
          </div>

          <label className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={draft.visibleToStudent}
              onChange={(event) =>
                update("visibleToStudent", event.target.checked)
              }
            />

            <span className="text-sm font-bold text-[#0D1B3D]">
              Show this experience to students when ready
            </span>
          </label>

          <button
            type="button"
            disabled={saving}
            onClick={saveExperience}
            className="mt-5 w-full rounded-xl bg-[#0D1B3D] px-6 py-4 font-black text-white disabled:opacity-50"
          >
            {saving
              ? "Saving…"
              : `Save to Week ${week} · Day ${day}`}
          </button>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#4B2265]">
              SCHEDULED
            </p>

            <h2 className="mt-1 text-xl font-black text-[#0D1B3D]">
              Week {week} · Day {day}
            </h2>
          </div>

          <p className="text-sm font-bold text-slate-500">
            {selectedDayExperiences.length} experience
            {selectedDayExperiences.length === 1 ? "" : "s"}
          </p>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-slate-500">
            Loading experiences…
          </p>
        ) : selectedDayExperiences.length === 0 ? (
          <div className="mt-6 rounded-xl bg-slate-50 p-6 text-center">
            <p className="font-black text-[#0D1B3D]">
              No experience scheduled for this class day.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              The Future Ready™ lesson still runs normally. Add an
              experience only when it strengthens the week.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {selectedDayExperiences.map((experience) => (
              <article
                key={experience.id}
                className="rounded-xl border border-slate-200 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#007C7C]">
                      {typeLabel(experience.experienceType)}
                    </p>

                    <h3 className="mt-1 text-lg font-black text-[#0D1B3D]">
                      {experience.title}
                    </h3>

                    {experience.siteName ? (
                      <p className="mt-1 text-sm font-bold text-slate-600">
                        {experience.siteName}
                      </p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                      {experience.eventDate ? (
                        <span className="rounded-lg bg-slate-100 px-3 py-2">
                          {experience.eventDate}
                        </span>
                      ) : null}

                      {experience.startTime ? (
                        <span className="rounded-lg bg-slate-100 px-3 py-2">
                          {experience.startTime}
                          {experience.endTime
                            ? ` – ${experience.endTime}`
                            : ""}
                        </span>
                      ) : null}

                      <span className="rounded-lg bg-slate-100 px-3 py-2">
                        {experience.visibleToStudent
                          ? "Student Visible"
                          : "Facilitator Only"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeExperience(experience.id)}
                    className="text-xs font-black text-red-600"
                  >
                    Remove
                  </button>
                </div>

                {experience.description ? (
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {experience.description}
                  </p>
                ) : null}

                {experience.learningObjective ? (
                  <div className="mt-4 rounded-xl bg-[#EAFBFB] p-4">
                    <p className="text-xs font-black uppercase text-[#007C7C]">
                      Learning Objective
                    </p>
                    <p className="mt-1 text-sm text-[#0D1B3D]">
                      {experience.learningObjective}
                    </p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-[#0D1B3D]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label>
      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>

      <textarea
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}
