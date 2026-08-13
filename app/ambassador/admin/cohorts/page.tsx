"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

type Cohort = {
  id: string;
  name: string;
  code: string;
  status: string;
  capacity: number | null;

  organization: {
    id: string;
    name: string;
  };

  school: {
    id: string;
    name: string;
  } | null;

  program: {
    id: string;
    name: string;
    totalWeeks: number;
  };

  _count: {
    enrollments: number;
    facilitators: number;
  };
};

export default function AdminCohortsPage() {
  const [cohorts, setCohorts] =
    useState<Cohort[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [name, setName] =
    useState("");

  const [code, setCode] =
    useState("");

  const [programId, setProgramId] =
    useState("");

  const [organizationId, setOrganizationId] =
    useState("");

  const [schoolId, setSchoolId] =
    useState("");

  const [capacity, setCapacity] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  async function loadCohorts() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/ambassador/cohorts",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to load cohorts."
        );
      }

      setCohorts(data.cohorts ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load cohorts."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCohorts();
  }, []);

  async function createCohort(
    event: FormEvent
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        "/api/ambassador/cohorts",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            code,
            programId,
            organizationId,
            schoolId:
              schoolId || null,
            capacity:
              capacity
                ? Number(capacity)
                : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to create cohort."
        );
      }

      setName("");
      setCode("");
      setCapacity("");

      await loadCohorts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create cohort."
      );
    } finally {
      setSaving(false);
    }
  }

  const firstCohort = cohorts[0];

  useEffect(() => {
    if (!firstCohort) return;

    if (!programId) {
      setProgramId(
        firstCohort.program.id
      );
    }

    if (!organizationId) {
      setOrganizationId(
        firstCohort.organization.id
      );
    }

    if (
      !schoolId &&
      firstCohort.school
    ) {
      setSchoolId(
        firstCohort.school.id
      );
    }
  }, [
    firstCohort,
    programId,
    organizationId,
    schoolId,
  ]);

  return (
    <main className="space-y-8 p-8">
      <section className="rounded-3xl bg-[#0D1B3D] p-8 text-white">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">
          Future Ready™ Administration
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Cohort Management
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
          Manage Future Ready™ classes
          and the registration codes
          students use to join them.
        </p>
      </section>

      {error && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-5 font-bold text-red-700">
          {error}
        </section>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
          Student Registration
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
          Active Classes
        </h2>

        {loading ? (
          <p className="mt-6 text-slate-500">
            Loading cohorts…
          </p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cohorts.map((cohort) => (
              <article
                key={cohort.id}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#4B2265]">
                      {cohort.status}
                    </p>

                    <h3 className="mt-2 text-xl font-black text-[#0D1B3D]">
                      {cohort.name}
                    </h3>
                  </div>

                  <span className="rounded-full bg-[#FFF4C2] px-3 py-1 text-xs font-black text-[#725500]">
                    {
                      cohort._count
                        .enrollments
                    }{" "}
                    Students
                  </span>
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase text-slate-500">
                    Class Code
                  </p>

                  <p className="mt-1 text-xl font-black text-[#0D1B3D]">
                    {cohort.code}
                  </p>
                </div>

                <div className="mt-4 space-y-1 text-sm text-slate-600">
                  <p>
                    {cohort.program.name}
                  </p>

                  <p>
                    {
                      cohort.program
                        .totalWeeks
                    }
                    -week program
                  </p>

                  {cohort.school && (
                    <p>
                      {cohort.school.name}
                    </p>
                  )}

                  <p>
                    {
                      cohort._count
                        .facilitators
                    }{" "}
                    facilitator
                    {cohort._count
                      .facilitators === 1
                      ? ""
                      : "s"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {firstCohort && (
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            Administration
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            Create Another Cohort
          </h2>

          <p className="mt-3 text-slate-600">
            Use this when you launch a
            new class. Students will use
            its unique class code when
            creating their account.
          </p>

          <form
            onSubmit={createCohort}
            className="mt-6 grid gap-4 md:grid-cols-2"
          >
            <input
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              required
              placeholder="Cohort name"
              className="rounded-xl border border-slate-300 px-4 py-3"
            />

            <input
              value={code}
              onChange={(event) =>
                setCode(
                  event.target.value.toUpperCase()
                )
              }
              required
              placeholder="Class code"
              className="rounded-xl border border-slate-300 px-4 py-3"
            />

            <input
              value={capacity}
              onChange={(event) =>
                setCapacity(
                  event.target.value
                )
              }
              type="number"
              min="1"
              placeholder="Capacity (optional)"
              className="rounded-xl border border-slate-300 px-4 py-3"
            />

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#0D1B3D] px-5 py-3 font-black text-white disabled:opacity-60"
            >
              {saving
                ? "Creating…"
                : "Create Cohort"}
            </button>
          </form>
        </section>
      )}
    </main>
  );
}
