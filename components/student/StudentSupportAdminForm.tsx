"use client";

import { useEffect, useState } from "react";

type FormState = {
  planType:
    | "NONE"
    | "SECTION_504"
    | "IEP"
    | "SERVICES_PLAN"
    | "SCHOOL_ACCOMMODATION"
    | "OTHER";
  planActive: boolean;
  extendedDeadlineDays: number;
  timeMultiplier: number;
  breaksAllowed: boolean;
  noTimedActivities: boolean;
  speechToText: boolean;
  alternativeResponse: boolean;
  staffNotes: string;
};

type BooleanSupportKey =
  | "breaksAllowed"
  | "noTimedActivities"
  | "speechToText"
  | "alternativeResponse";

const DEFAULTS: FormState = {
  planType: "NONE",
  planActive: false,
  extendedDeadlineDays: 0,
  timeMultiplier: 1,
  breaksAllowed: false,
  noTimedActivities: false,
  speechToText: false,
  alternativeResponse: false,
  staffNotes: "",
};

export default function StudentSupportAdminForm({
  studentId,
  studentName,
}: {
  studentId: string;
  studentName: string;
}) {
  const [form, setForm] =
    useState<FormState>(DEFAULTS);
  const [message, setMessage] =
    useState("Loading...");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
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
              "Unable to load learning supports.",
          );
        }

        if (active) {
          setForm({
            ...DEFAULTS,
            ...(body.supportPlan ?? {}),
          });
          setMessage("");
        }
      })
      .catch((error) => {
        if (active) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Unable to load supports.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [studentId]);

  function setValue<K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function save() {
    setSaving(true);
    setMessage("Saving...");

    try {
      const response = await fetch(
        "/api/ambassador/student-support",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            ...form,
          }),
        },
      );

      const body = await response.json();

      if (!response.ok) {
        throw new Error(
          body.error ??
            "Unable to save learning supports.",
        );
      }

      setMessage("Learning support plan saved");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save supports.",
      );
    } finally {
      setSaving(false);
    }
  }

  const supportToggles: Array<{
    key: BooleanSupportKey;
    title: string;
  }> = [
    {
      key: "breaksAllowed",
      title: "Flexible breaks",
    },
    {
      key: "noTimedActivities",
      title: "No timed activities",
    },
    {
      key: "speechToText",
      title: "Speech-to-text",
    },
    {
      key: "alternativeResponse",
      title: "Alternative response format",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
          PRIVATE STAFF RECORD
        </p>
        <h1 className="mt-2 text-3xl font-black text-[#0D1B3D]">
          Accessibility & Learning Supports
        </h1>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
          {studentName} - Record only the supports
          BUILD6 needs to implement. A diagnosis is not
          required here.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="block text-sm font-black text-[#0D1B3D]">
              Support plan
            </span>
            <select
              value={form.planType}
              onChange={(event) =>
                setValue(
                  "planType",
                  event.target
                    .value as FormState["planType"],
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value="NONE">
                No plan recorded
              </option>
              <option value="SECTION_504">
                504 Plan
              </option>
              <option value="IEP">IEP</option>
              <option value="SERVICES_PLAN">
                Services Plan
              </option>
              <option value="SCHOOL_ACCOMMODATION">
                School Accommodation Plan
              </option>
              <option value="OTHER">
                Other Approved Support
              </option>
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
            <input
              type="checkbox"
              checked={form.planActive}
              onChange={(event) =>
                setValue(
                  "planActive",
                  event.target.checked,
                )
              }
              className="h-5 w-5"
            />
            <span>
              <span className="block font-black text-[#0D1B3D]">
                Apply approved accommodations
              </span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">
                When off, standard BUILD6 deadlines
                and timing apply.
              </span>
            </span>
          </label>

          <label className="space-y-2">
            <span className="block text-sm font-black text-[#0D1B3D]">
              Assignment deadline extension
            </span>
            <select
              value={form.extendedDeadlineDays}
              onChange={(event) =>
                setValue(
                  "extendedDeadlineDays",
                  Number(event.target.value),
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value={0}>
                Standard due date
              </option>
              <option value={1}>+1 day</option>
              <option value={2}>+2 days</option>
              <option value={3}>+3 days</option>
              <option value={5}>+5 days</option>
              <option value={7}>+7 days</option>
              <option value={14}>+14 days</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="block text-sm font-black text-[#0D1B3D]">
              Time allowance
            </span>
            <select
              value={form.timeMultiplier}
              onChange={(event) =>
                setValue(
                  "timeMultiplier",
                  Number(event.target.value),
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value={1}>Standard time</option>
              <option value={1.25}>1.25x time</option>
              <option value={1.5}>1.5x time</option>
              <option value={2}>2x time</option>
              <option value={3}>3x time</option>
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {supportToggles.map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4"
            >
              <input
                type="checkbox"
                checked={form[item.key]}
                onChange={(event) =>
                  setValue(
                    item.key,
                    event.target.checked,
                  )
                }
                className="h-5 w-5"
              />
              <span className="font-black text-[#0D1B3D]">
                {item.title}
              </span>
            </label>
          ))}
        </div>

        <label className="mt-6 block space-y-2">
          <span className="block text-sm font-black text-[#0D1B3D]">
            Staff implementation notes
          </span>
          <textarea
            value={form.staffNotes}
            onChange={(event) =>
              setValue(
                "staffNotes",
                event.target.value,
              )
            }
            rows={5}
            maxLength={4000}
            placeholder="Record only what staff need to implement the approved supports."
            className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          />
        </label>

        <div className="mt-6 rounded-2xl border-2 border-[#F2B705] bg-[#FFF9DF] p-4">
          <p className="font-black text-[#0D1B3D]">
            Accountability protection
          </p>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
            When this plan is active, BUILD6 uses
            the student's effective accommodation-adjusted
            due date before showing missing work,
            sending Friday reminders, or applying
            the Monday participation-point rule.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-[#0D1B3D] px-6 py-3 font-black text-white disabled:opacity-50"
          >
            {saving
              ? "SAVING..."
              : "SAVE LEARNING SUPPORT PLAN"}
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
      </section>
    </div>
  );
}
