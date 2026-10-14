"use client";

import Link from "next/link";
import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

export default function AmbassadorRegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [cohortCode, setCohortCode] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  async function handleRegister(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    if (
      password !== confirmPassword
    ) {
      setError(
        "Your passwords do not match."
      );

      return;
    }

    if (password.length < 8) {
      setError(
        "Your password must be at least 8 characters."
      );

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            cohortCode,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to create your account."
        );
      }

      router.replace(
        result.destination
      );

      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">

        <section className="bg-[#0D1B3D] p-8 text-white md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F2B705]">
            BUILD6™
          </p>

          <h1 className="mt-5 text-4xl font-black leading-tight">
            Create Your
            <br />
            BUILD6™
            <br />
            Account
          </h1>

          <p className="mt-6 max-w-lg leading-7 text-slate-300">
            Your account gives you your own
            BUILD6™ Student Portal,
            Passport, Digital Portfolio,
            Reflection Journal, Career
            Exploration tools, and program
            progress.
          </p>

          <div className="mt-8 rounded-2xl border border-[#F2B705]/30 bg-white/5 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
              Ambassador Christian School
            </p>

            <p className="mt-2 font-black">
              Pilot Class 2026-2027
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Your facilitator will give you
              the class code you need to join
              your class.
            </p>
          </div>
        </section>

        <section className="p-8 md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            Student Registration
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#0D1B3D]">
            Let's build your portal.
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Use your own email address and
            create a password you will remember.
          </p>

          <form
            onSubmit={handleRegister}
            className="mt-8 space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-black text-[#0D1B3D]">
                  First Name
                </span>

                <input
                  type="text"
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(
                      event.target.value
                    )
                  }
                  required
                  autoComplete="given-name"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#4B2265]"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-black text-[#0D1B3D]">
                  Last Name
                </span>

                <input
                  type="text"
                  value={lastName}
                  onChange={(event) =>
                    setLastName(
                      event.target.value
                    )
                  }
                  required
                  autoComplete="family-name"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#4B2265]"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-black text-[#0D1B3D]">
                Email Address
              </span>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                required
                autoComplete="email"
                placeholder="yourname@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#4B2265]"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-black text-[#0D1B3D]">
                Class Code
              </span>

              <input
                type="text"
                value={cohortCode}
                onChange={(event) =>
                  setCohortCode(
                    event.target.value
                      .toUpperCase()
                  )
                }
                required
                autoCapitalize="characters"
                placeholder="Enter the code from your facilitator"
                className="w-full rounded-xl border-2 border-[#F2B705] bg-[#FFF9DF] px-4 py-3 font-black uppercase tracking-wide text-[#0D1B3D] outline-none"
              />

              <p className="text-xs text-slate-500">
                Your class code connects your
                account to the correct school,
                program, facilitator, and class.
              </p>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-black text-[#0D1B3D]">
                Create Password
              </span>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-20 outline-none focus:border-[#4B2265]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-[#4B2265]"
                >
                  {showPassword
                    ? "HIDE"
                    : "SHOW"}
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Minimum 8 characters.
              </p>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-black text-[#0D1B3D]">
                Confirm Password
              </span>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#4B2265]"
              />
            </label>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#F2B705] px-5 py-4 font-black text-[#0D1B3D] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating My Portal..."
                : "Create My BUILD6™ Account"}
            </button>
          </form>

          <div className="mt-7 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-600">
              Already created your account?
            </p>

            <Link
              href="/ambassador/login"
              className="mt-2 inline-block font-black text-[#4B2265]"
            >
              Sign In →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
