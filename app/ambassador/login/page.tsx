"use client";

import Link from "next/link";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AmbassadorLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);
  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to sign in."
        );
      }

      router.replace(
        result.destination ?? "/"
      );

      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl lg:grid-cols-[1.05fr_0.95fr]">

        <section className="bg-[#0D1B3D] p-8 text-white md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F2B705]">
            Future Ready™
          </p>

          <h1 className="mt-5 max-w-xl text-4xl font-black leading-tight md:text-5xl">
            Discover Purpose.
            <br />
            Build Skills.
            <br />
            Launch Your Future.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
            Secure access for students,
            facilitators, administrators,
            employers, and approved Future
            Ready™ partners.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              "Student Experience",
              "Facilitator Teaching Hub",
              "Administration",
              "Employer Experience",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-bold"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
              Ambassador Christian School
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Authorized Ambassador users
              sign in here using their
              approved Future Ready™ account.
            </p>
          </div>
        </section>

        <section className="p-8 md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            Secure Account Access
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#0D1B3D]">
            Sign in
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter the email address and
            password associated with your
            Future Ready™ account.
          </p>

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
          >
            <label className="block space-y-2">
              <span className="text-sm font-black text-[#0D1B3D]">
                Email Address
              </span>

              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                required
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-[#0D1B3D] outline-none transition focus:border-[#4B2265] focus:ring-2 focus:ring-[#4B2265]/10"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-black text-[#0D1B3D]">
                Password
              </span>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-20 text-[#0D1B3D] outline-none transition focus:border-[#4B2265] focus:ring-2 focus:ring-[#4B2265]/10"
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
            </label>

            <div className="text-right">
              <Link
                href="/ambassador/forgot-password"
                className="text-sm font-black text-[#4B2265]"
              >
                Forgot Password?
              </Link>
            </div>

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
              className="w-full rounded-xl bg-[#F2B705] px-5 py-3.5 font-black text-[#0D1B3D] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing In..."
                : "Sign In Securely"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-[#F2B705] bg-[#FFF9DF] p-5 text-center">
            <p className="font-black text-[#0D1B3D]">
              New Future Ready™ Student?
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Create your personal account using
              the class code provided by your facilitator.
            </p>

            <Link
              href="/ambassador/register"
              className="mt-4 inline-block rounded-xl bg-[#0D1B3D] px-6 py-3 font-black text-white"
            >
              Create Student Account
            </Link>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <p className="text-sm leading-6 text-slate-500">
              Password recovery and new
              account activation are managed
              through the Future Ready™
              account approval process. Those
              secure recovery controls will
              be connected before launch.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
