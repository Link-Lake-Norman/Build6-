"use client";
import "../approved-public-pages.css";

import { Suspense } from "react";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import SiteHeader from "../components/SiteHeader";

const interestOptions = [
  "School / District",
  "Students",
  "Student Athletes / Athletic Program",
  "Team / Organization",
  "Employees / Workforce",
  "Employee Training + Retention",
  "College / Postsecondary Program",
  "Community / Workforce Initiative",
  "Partnership / Sponsorship",
  "Other",
];

function mappedInterest(
  value: string | null
) {
  const map: Record<string, string> = {
    athletics:
      "Student Athletes / Athletic Program",

    workforce:
      "Employees / Workforce",

    postsecondary:
      "College / Postsecondary Program",

    community:
      "Community / Workforce Initiative",

    school:
      "School / District",
  };

  return value
    ? map[value] ?? ""
    : "";
}

function InterestPageContent() {
  const searchParams = useSearchParams();

  const initialInterest = useMemo(
    () =>
      mappedInterest(
        searchParams.get("for")
      ),
    [searchParams]
  );

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    submitError,
    setSubmitError,
  ] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(true);
    setSubmitError("");

    const form = event.currentTarget;

    const data =
      new FormData(form);

    const payload = {
      source:
        "INTEREST_PAGE",

      inquiryType:
        "ORGANIZATION_INTEREST",

      interestType:
        String(
          data.get("interestType") ?? ""
        ),

      firstName:
        String(
          data.get("firstName") ?? ""
        ),

      lastName:
        String(
          data.get("lastName") ?? ""
        ),

      organization:
        String(
          data.get("organization") ?? ""
        ),

      role:
        String(
          data.get("role") ?? ""
        ),

      email:
        String(
          data.get("email") ?? ""
        ),

      phone:
        String(
          data.get("phone") ?? ""
        ),

      location:
        String(
          data.get("location") ?? ""
        ),

      participantCount:
        String(
          data.get(
            "participantCount"
          ) ?? ""
        ),

      timeline:
        String(
          data.get("timeline") ?? ""
        ),

      goals:
        String(
          data.get("goals") ?? ""
        ),

      message:
        String(
          data.get("message") ?? ""
        ),

      companyFax:
        String(
          data.get("companyFax") ?? ""
        ),

      consent:
        data.get("consent") === "on",
    };

    try {
      const response =
        await fetch(
          "/api/inquiries",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.ok
      ) {
        throw new Error(
          result.error ||
            "We could not save your inquiry right now."
        );
      }

      setSubmitted(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not save your inquiry right now."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="public-page">
        <SiteHeader />

        <section className="interest-success">
          <div>
            <div className="success-mark">
              ✓
            </div>

            <p className="public-eyebrow">
              BUILD6™
            </p>

            <h1>
              LET&apos;S BUILD
              WHAT&apos;S NEXT.
            </h1>

            <p>
              Thank you. Your
              information has been
              securely submitted.
              We&apos;ll review what you
              shared and follow up about
              the right BUILD6™ path for
              your organization.
            </p>

            <a href="/">
              RETURN TO BUILD6™
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="public-page">
      <SiteHeader />

      <section className="public-form-hero">
        <div>
          <p className="public-eyebrow">
            BRING BUILD6™
          </p>

          <h1>
            BUILT AROUND{" "}
            <span>
              YOUR PEOPLE.
            </span>
          </h1>

          <p>
            Tell us about your
            organization, participants,
            goals and timing. BUILD6™
            can be configured for
            schools, athletic programs,
            teams, employees, colleges
            and community or workforce
            initiatives.
          </p>
        </div>
      </section>

      <section className="interest-layout">
        <aside className="interest-aside">
          <p className="section-kicker">
            ONE FOUNDATION.
            MULTIPLE APPLICATIONS.
          </p>

          <h2>
            Six stages. Designed
            around your goals.
          </h2>

          <p>
            BUILD6™ combines skill
            development, reflection,
            real-world relationships,
            career and pathway
            exploration, applied
            experience and next-step
            planning in one connected
            experience.
          </p>

          <div className="interest-stage-list">
            <span>DISCOVER™</span>
            <span>DEVELOP™</span>
            <span>EXPLORE™</span>
            <span>CONNECT™</span>
            <span>EXPERIENCE™</span>
            <span>LAUNCH™</span>
          </div>

          <p className="interest-contact-note">
            Prefer a quick question?
            Use{" "}
            <strong>
              EMAIL BUILD6™
            </strong>{" "}
            or contact{" "}
            <strong>
              info@build6.education
            </strong>.
          </p>
        </aside>

        <form
          className="interest-form"
          onSubmit={handleSubmit}
        >
          <label
            className="connect-honeypot"
            aria-hidden="true"
          >
            Company Fax

            <input
              name="companyFax"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>

          <fieldset>
            <legend>
              1. WHAT ARE YOU
              INTERESTED IN?
            </legend>

            <label className="full-field">
              Select the best fit *
              <select
                name="interestType"
                defaultValue={initialInterest}
                required
              >
                <option value="">
                  Select one...
                </option>
                {interestOptions.map(
                  (option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  )
                )}
              </select>
            </label>
          </fieldset>

          <fieldset>
            <legend>
              2. ABOUT YOU +
              YOUR ORGANIZATION
            </legend>

            <div className="form-grid">
              <label>
                First Name *

                <input
                  name="firstName"
                  type="text"
                  required
                />
              </label>

              <label>
                Last Name *

                <input
                  name="lastName"
                  type="text"
                  required
                />
              </label>

              <label>
                Organization *

                <input
                  name="organization"
                  type="text"
                  required
                />
              </label>

              <label>
                Your Role / Title

                <input
                  name="role"
                  type="text"
                />
              </label>

              <label>
                Email *

                <input
                  name="email"
                  type="email"
                  required
                />
              </label>

              <label>
                Phone

                <input
                  name="phone"
                  type="tel"
                />
              </label>

              <label>
                City / State /
                Location

                <input
                  name="location"
                  type="text"
                />
              </label>

              <label>
                Approx. Number
                of Participants

                <select
                  name="participantCount"
                  defaultValue=""
                >
                  <option value="">
                    Select...
                  </option>
                  <option value="1-10">
                    1-10
                  </option>
                  <option value="11-25">
                    11-25
                  </option>
                  <option value="26-50">
                    26-50
                  </option>
                  <option value="51-100">
                    51-100
                  </option>
                  <option value="101-250">
                    101-250
                  </option>
                  <option value="251-500">
                    251-500
                  </option>
                  <option value="500+">
                    500+
                  </option>
                  <option value="District / organization-wide">
                    District / organization-wide
                  </option>
                  <option value="Not sure yet">
                    Not sure yet
                  </option>
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              3. WHAT ARE YOU
              LOOKING TO BUILD?
            </legend>

            <label className="full-field">
              Primary Goals

              <textarea
                name="goals"
                rows={4}
                placeholder="Skills, readiness, workforce development, retention, student-athlete development, career exploration..."
              />
            </label>

            <label className="full-field">
              Desired Timeline

              <select
                name="timeline"
                defaultValue=""
              >
                <option value="">
                  Select...
                </option>
                <option value="As soon as possible">
                  As soon as possible
                </option>
                <option value="This semester">
                  This semester
                </option>
                <option value="Next semester">
                  Next semester
                </option>
                <option value="This school year">
                  This school year
                </option>
                <option value="Next school year">
                  Next school year
                </option>
                <option value="Within 3 months">
                  Within 3 months
                </option>
                <option value="Within 6 months">
                  Within 6 months
                </option>
                <option value="Exploring options">
                  Exploring options
                </option>
              </select>
            </label>

            <label className="full-field">
              Anything Else
              We Should Know?

              <textarea
                name="message"
                rows={5}
              />
            </label>
          </fieldset>

          <label className="interest-consent">
            <input
              name="consent"
              type="checkbox"
              required
            />

            <span>
              I agree that BUILD6™ may
              contact me about this
              inquiry.
            </span>
          </label>

          {submitError && (
            <p className="interest-form-error">
              {submitError}
            </p>
          )}

          <button
            className="interest-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "SUBMITTING..."
              : "START A CONVERSATION →"}
          </button>

          <p className="form-privacy-note">
            Information submitted
            through this form is used
            to respond to your BUILD6™
            inquiry and coordinate
            potential next steps.
          </p>
        </form>
      </section>
    </main>
  );
}

export default function InterestPage() {
  return (
    <Suspense
      fallback={
        <main className="public-page">
          <section className="public-form-hero">
            <div>
              <p className="public-eyebrow">BUILD6™</p>
              <h1>LET&apos;S BUILD WHAT&apos;S NEXT.</h1>
              <p>Loading your BUILD6™ inquiry experience...</p>
            </div>
          </section>
        </main>
      }
    >
      <InterestPageContent />
    </Suspense>
  );
}

