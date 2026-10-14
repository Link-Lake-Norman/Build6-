"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
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

    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to change password."
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage(
        "Password changed successfully."
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to change password."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-12">
      <div className="mx-auto max-w-xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#725500]">
          BUILD6™ Account
        </p>

        <h1 className="mt-3 text-3xl font-black text-[#0D1B3D]">
          Change Password
        </h1>

        <form
          onSubmit={submit}
          className="mt-8 space-y-5"
        >
          <PasswordInput
            label="Current Password"
            value={currentPassword}
            setValue={setCurrentPassword}
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            setValue={setNewPassword}
          />

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            setValue={setConfirmPassword}
          />

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
            className="w-full rounded-xl bg-[#0D1B3D] px-6 py-4 font-black text-white disabled:opacity-50"
          >
            {saving
              ? "Changing Password..."
              : "Change My Password"}
          </button>
        </form>

        <Link
          href="/ambassador"
          className="mt-6 inline-block font-bold text-[#4B2265]"
        >
          ← Back to BUILD6™
        </Link>
      </div>
    </main>
  );
}

function PasswordInput({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-black text-[#0D1B3D]">
        {label}
      </span>

      <input
        type="password"
        value={value}
        onChange={(event) =>
          setValue(event.target.value)
        }
        minLength={8}
        required
        className="w-full rounded-xl border border-slate-300 px-4 py-3"
      />
    </label>
  );
}
