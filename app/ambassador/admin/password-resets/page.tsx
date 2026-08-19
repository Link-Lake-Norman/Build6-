"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ResetRequest = {
  id: string;
  email: string;
  status: string;
  requestedAt: string;
  handledAt: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string | null;
    email: string;
    role: string;
    status: string;
  } | null;
};

export default function PasswordResetAdminPage() {
  const [requests, setRequests] = useState<ResetRequest[]>([]);

  const [loading, setLoading] = useState(true);

  const [workingId, setWorkingId] = useState<string | null>(null);

  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(
    null,
  );

  const [resetEmail, setResetEmail] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  async function loadRequests() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ambassador/admin/password-resets", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to load reset requests.");
      }

      setRequests(result.requests ?? []);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load reset requests.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRequests();
  }, []);

  async function resetPassword(requestItem: ResetRequest) {
    const name =
      requestItem.user?.displayName ??
      [requestItem.user?.firstName, requestItem.user?.lastName]
        .filter(Boolean)
        .join(" ") ??
      requestItem.email;

    const confirmed = window.confirm(
      `Create a temporary password for ${name}? Their current password will stop working.`,
    );

    if (!confirmed) {
      return;
    }

    setWorkingId(requestItem.id);
    setError(null);
    setTemporaryPassword(null);
    setResetEmail(null);

    try {
      const response = await fetch("/api/ambassador/admin/password-resets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: requestItem.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to reset password.");
      }

      setTemporaryPassword(result.temporaryPassword);

      setResetEmail(result.email);

      await loadRequests();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to reset password.",
      );
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/ambassador/admin"
          className="text-sm font-black text-[#4B2265]"
        >
          ← Back to Administration
        </Link>

        <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
            Account Administration
          </p>

          <h1 className="mt-2 text-3xl font-black text-[#0D1B3D]">
            Password Reset Requests
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Create a temporary password only when you have confirmed the student
            requesting account help.
          </p>
        </div>

        {temporaryPassword ? (
          <section className="mt-6 rounded-3xl border-2 border-emerald-300 bg-emerald-50 p-6">
            <p className="text-sm font-black text-emerald-800">
              Temporary password created
            </p>

            <p className="mt-2 text-sm text-emerald-900">
              Account: {resetEmail}
            </p>

            <div className="mt-4 rounded-xl bg-white p-4 font-mono text-lg font-black text-[#0D1B3D]">
              {temporaryPassword}
            </div>

            <p className="mt-3 text-sm leading-6 text-emerald-900">
              Give this password directly to the student. After signing in, they
              should change it from their account password page. This password
              is shown here only for this reset action.
            </p>
          </section>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 font-bold text-red-800">
            {error}
          </div>
        ) : null}

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {loading ? (
            <p className="font-bold text-slate-500">
              Loading reset requests...
            </p>
          ) : requests.length === 0 ? (
            <p className="font-bold text-slate-500">
              No password reset requests.
            </p>
          ) : (
            <div className="space-y-4">
              {requests.map((item) => {
                const name =
                  item.user?.displayName ??
                  [item.user?.firstName, item.user?.lastName]
                    .filter(Boolean)
                    .join(" ") ??
                  "Account";

                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="font-black text-[#0D1B3D]">{name}</h2>

                        <p className="mt-1 text-sm text-slate-600">
                          {item.email}
                        </p>

                        <p className="mt-2 text-xs font-bold text-slate-400">
                          Requested{" "}
                          {new Date(item.requestedAt).toLocaleString()}
                        </p>
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-[#0D1B3D]">
                        {item.status}
                      </span>
                    </div>

                    {item.status === "PENDING" && item.user ? (
                      <button
                        type="button"
                        disabled={workingId === item.id}
                        onClick={() => void resetPassword(item)}
                        className="mt-4 rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white disabled:opacity-50"
                      >
                        {workingId === item.id
                          ? "Creating..."
                          : "Create Temporary Password"}
                      </button>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
