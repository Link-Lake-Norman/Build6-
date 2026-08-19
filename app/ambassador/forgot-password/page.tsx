"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitRequest(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Unable to submit request.",
        );
      }

      setMessage(result.message);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to submit request.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-12">
      <div className="mx-auto max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-xl md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
          Account Help
        </p>

        <h1 className="mt-3 text-3xl font-black text-[#0D1B3D]">
          Forgot your password?
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Enter the email address you use to sign in.
          Staff will receive your reset request.
        </p>

        <form
          onSubmit={submitRequest}
          className="mt-8 space-y-5"
        >
          <label className="block space-y-2">
            <span className="text-sm font-black text-[#0D1B3D]">
              Email Address
            </span>

            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            />
          </label>

          {message ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#F2B705] px-5 py-3.5 font-black text-[#0D1B3D] disabled:opacity-60"
          >
            {loading
              ? "Submitting..."
              : "Request Password Reset"}
          </button>
        </form>

        <Link
          href="/ambassador/login"
          className="mt-6 inline-block text-sm font-black text-[#4B2265]"
        >
          ← Back to Sign In
        </Link>
      </div>
    </main>
  );
}
