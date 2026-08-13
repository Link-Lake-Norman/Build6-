"use client";

import { FormEvent, useState } from "react";

export default function FacilitatorForm() {
  const [firstName, setFirstName] = useState("Coach");
  const [lastName, setLastName] = useState("Jones");
  const [email, setEmail] = useState(
    "njones@ambassadorchristian.com"
  );
  const [temporaryPassword, setTemporaryPassword] =
    useState("");
  const [message, setMessage] =
    useState<string | null>(null);
  const [error, setError] =
    useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(
        "/api/ambassador/facilitators",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            temporaryPassword,
            cohortCode: "PILOT-2026-2027",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to create facilitator."
        );
      }

      setMessage(
        `${result.facilitator.name} is ready for ${result.facilitator.cohort}.`
      );

      setTemporaryPassword("");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to create facilitator."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mt-8 space-y-5 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-black">
            First Name
          </span>
          <input
            value={firstName}
            onChange={(event) =>
              setFirstName(event.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-black">
            Last Name
          </span>
          <input
            value={lastName}
            onChange={(event) =>
              setLastName(event.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-black">
          Email
        </span>
        <input
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-black">
          Temporary Password
        </span>
        <input
          type="password"
          value={temporaryPassword}
          onChange={(event) =>
            setTemporaryPassword(
              event.target.value
            )
          }
          minLength={8}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
          required
        />
        <p className="text-xs text-slate-500">
          Give this password to Coach Jones privately.
          He can change it after signing in.
        </p>
      </label>

      <div className="rounded-2xl bg-[#FFF9DF] p-4 text-sm font-bold text-[#725500]">
        Assigned cohort: PILOT-2026-2027
      </div>

      {error ? (
        <div className="rounded-xl bg-red-50 p-4 font-bold text-red-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-xl bg-emerald-50 p-4 font-bold text-emerald-800">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-[#0D1B3D] px-6 py-4 font-black text-white disabled:opacity-50"
      >
        {saving
          ? "Creating Facilitator..."
          : "Create Coach Jones Account"}
      </button>
    </form>
  );
}
