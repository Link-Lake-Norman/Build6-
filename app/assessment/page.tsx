"use client";

import {
  FormEvent,
  useState,
} from "react";

import SiteHeader
  from "../components/SiteHeader";

import {
  assessmentQuestions,
} from "@/lib/assessment/questions";

type Answers =
  Record<
    string,
    string[]
  >;

type Match = {
  id: string;
  title: string;
  pathway: string;
  description: string;
  environment: string;
  education: string;
  nextStep: string;
  relatedRoles: string[];
  score: number;
  fitReasons: string[];
};

type Result = {
  profileTitle: string;
  topDimensions: {
    dimension: string;
    score: number;
    label: string;
  }[];
  pathways: {
    pathway: string;
    score: number;
  }[];
  careerMatches: Match[];
};

export default function AssessmentPage() {
  const [
    answers,
    setAnswers,
  ] =
    useState<Answers>({});

  const [
    step,
    setStep,
  ] =
    useState(0);

  const [
    result,
    setResult,
  ] =
    useState<Result | null>(
      null
    );

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const questionCount =
    assessmentQuestions.length;

  const isContactStep =
    step === questionCount;

  const current =
    assessmentQuestions[
      step
    ];

  function chooseSingle(
    questionId: string,
    value: string
  ) {
    setAnswers(
      (previous) => ({
        ...previous,
        [questionId]:
          [value],
      })
    );
  }

  function toggleMulti(
    questionId: string,
    value: string
  ) {
    setAnswers(
      (previous) => {
        const existing =
          previous[
            questionId
          ] ?? [];

        const next =
          existing.includes(
            value
          )
            ? existing.filter(
                (item) =>
                  item !== value
              )
            : [
                ...existing,
                value,
              ];

        return {
          ...previous,
          [questionId]:
            next,
        };
      }
    );
  }

  function canContinue() {
    if (!current) {
      return true;
    }

    return (
      answers[
        current.id
      ]?.length > 0
    );
  }

  async function submit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const form =
      new FormData(
        event.currentTarget
      );

    const payload = {
      firstName:
        String(
          form.get(
            "firstName"
          ) ?? ""
        ),
      email:
        String(
          form.get(
            "email"
          ) ?? ""
        ),
      schoolOrOrg:
        String(
          form.get(
            "schoolOrOrg"
          ) ?? ""
        ),
      gradeLevel:
        String(
          form.get(
            "gradeLevel"
          ) ?? ""
        ),
      location:
        String(
          form.get(
            "location"
          ) ?? ""
        ),
      companyFax:
        String(
          form.get(
            "companyFax"
          ) ?? ""
        ),
      consent:
        form.get(
          "consent"
        ) === "on",
      answers,
    };

    try {
      const response =
        await fetch(
          "/api/assessment",
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

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.ok
      ) {
        throw new Error(
          data.error ||
            "We could not complete your assessment."
        );
      }

      setResult(
        data.result
      );

      window.scrollTo({
        top: 0,
        behavior:
          "smooth",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We could not complete your assessment."
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  if (result) {
    return (
      <main className="assessment-page">
        <SiteHeader />

        <section className="assessment-results-hero">
          <div>
            <p className="public-eyebrow">
              YOUR BUILD6™
              FUTURE FIT
            </p>

            <h1>
              {result.profileTitle}
            </h1>

            <p>
              Your answers point
              toward a mix of
              strengths, work
              environments and
              pathways worth
              exploring. These
              matches are starting
              points — not limits.
            </p>
          </div>
        </section>

        <section className="assessment-results">
          <div className="assessment-result-block">
            <p className="section-kicker">
              WHAT STANDS OUT
            </p>

            <h2>
              Your strongest
              indicators
            </h2>

            <div className="assessment-strengths">
              {result
                .topDimensions
                .map(
                  (item) => (
                    <span
                      key={
                        item.dimension
                      }
                    >
                      {item.label}
                    </span>
                  )
                )}
            </div>
          </div>

          <div className="assessment-result-block">
            <p className="section-kicker">
              PATHWAYS TO EXPLORE
            </p>

            <h2>
              Where your profile
              may connect
            </h2>

            <div className="assessment-pathways">
              {result.pathways.map(
                (
                  pathway,
                  index
                ) => (
                  <article
                    key={
                      pathway.pathway
                    }
                  >
                    <span>
                      0{index + 1}
                    </span>
                    <strong>
                      {
                        pathway.pathway
                      }
                    </strong>
                  </article>
                )
              )}
            </div>
          </div>

          <div className="assessment-result-block">
            <p className="section-kicker">
              YOUR CAREER MATCHES
            </p>

            <h2>
              Roles worth
              exploring
            </h2>

            <p className="assessment-result-intro">
              These roles were
              ranked from your
              interests, strengths
              and preferred ways
              of working.
            </p>

            <div className="career-match-grid">
              {result
                .careerMatches
                .slice(0, 6)
                .map(
                  (
                    career,
                    index
                  ) => (
                    <article
                      className="career-match-card"
                      key={
                        career.id
                      }
                    >
                      <div className="career-match-number">
                        {String(
                          index +
                            1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <p className="career-pathway">
                        {
                          career.pathway
                        }
                      </p>

                      <h3>
                        {
                          career.title
                        }
                      </h3>

                      <p>
                        {
                          career.description
                        }
                      </p>

                      <div className="career-fit">
                        <strong>
                          WHY IT MAY FIT
                        </strong>

                        <p>
                          {career.fitReasons.join(
                            " · "
                          )}
                        </p>
                      </div>

                      <div className="career-detail">
                        <strong>
                          WHERE YOU MAY
                          WORK
                        </strong>
                        <p>
                          {
                            career.environment
                          }
                        </p>
                      </div>

                      <div className="career-detail">
                        <strong>
                          PATH TO GET
                          THERE
                        </strong>
                        <p>
                          {
                            career.education
                          }
                        </p>
                      </div>

                      <div className="career-detail">
                        <strong>
                          TRY THIS NEXT
                        </strong>
                        <p>
                          {
                            career.nextStep
                          }
                        </p>
                      </div>

                      <div className="career-related">
                        <strong>
                          RELATED ROLES
                        </strong>
                        <p>
                          {career.relatedRoles.join(
                            " · "
                          )}
                        </p>
                      </div>
                    </article>
                  )
                )}
            </div>
          </div>

          <div className="assessment-closing">
            <p className="public-eyebrow">
              BUILD WHAT'S NEXT.
            </p>

            <h2>
              Your results are
              a beginning.
            </h2>

            <p>
              You do not need to
              have your whole
              future figured out.
              Explore, ask
              questions, meet
              people and keep
              learning about what
              fits you.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const progress =
    Math.round(
      ((step + 1) /
        (questionCount +
          1)) *
        100
    );

  return (
    <main className="assessment-page">
      <SiteHeader />

      <section className="assessment-hero">
        <div>
          <p className="public-eyebrow">
            FREE BUILD6™
            ASSESSMENT
          </p>

          <h1>
            WHAT COULD FIT
            <span>
              {" "}
              YOU?
            </span>
          </h1>

          <p>
            Explore your
            interests, skills,
            strengths, work style
            and environment
            preferences — then
            discover career roles
            and pathways you may
            want to explore.
          </p>
        </div>
      </section>

      <section className="assessment-shell">
        <div className="assessment-progress-wrap">
          <div className="assessment-progress-copy">
            <span>
              {isContactStep
                ? "YOUR RESULTS"
                : `QUESTION ${
                    step + 1
                  } OF ${questionCount}`}
            </span>

            <span>
              {progress}%
            </span>
          </div>

          <div className="assessment-progress">
            <span
              style={{
                width:
                  `${progress}%`,
              }}
            />
          </div>
        </div>

        {!isContactStep &&
          current && (
            <section className="assessment-question">
              <p className="section-kicker">
                {
                  current.section
                }
              </p>

              <h2>
                {
                  current.prompt
                }
              </h2>

              {current.help && (
                <p className="assessment-help">
                  {
                    current.help
                  }
                </p>
              )}

              <div className="assessment-options">
                {current.options.map(
                  (option) => {
                    const selected =
                      answers[
                        current.id
                      ]?.includes(
                        option.value
                      ) ??
                      false;

                    return (
                      <button
                        key={
                          option.value
                        }
                        type="button"
                        className={
                          selected
                            ? "assessment-option is-selected"
                            : "assessment-option"
                        }
                        onClick={() => {
                          if (
                            current.type ===
                            "single"
                          ) {
                            chooseSingle(
                              current.id,
                              option.value
                            );
                          } else {
                            toggleMulti(
                              current.id,
                              option.value
                            );
                          }
                        }}
                      >
                        <span className="assessment-option-mark">
                          {selected
                            ? "✓"
                            : ""}
                        </span>

                        <strong>
                          {
                            option.label
                          }
                        </strong>

                        {option.description && (
                          <small>
                            {
                              option.description
                            }
                          </small>
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              <div className="assessment-controls">
                <button
                  type="button"
                  className="assessment-back"
                  disabled={
                    step === 0
                  }
                  onClick={() =>
                    setStep(
                      Math.max(
                        0,
                        step - 1
                      )
                    )
                  }
                >
                  ← BACK
                </button>

                <button
                  type="button"
                  className="assessment-next"
                  disabled={
                    !canContinue()
                  }
                  onClick={() =>
                    setStep(
                      step + 1
                    )
                  }
                >
                  CONTINUE →
                </button>
              </div>
            </section>
          )}

        {isContactStep && (
          <form
            className="assessment-contact"
            onSubmit={
              submit
            }
          >
            <p className="section-kicker">
              ALMOST THERE
            </p>

            <h2>
              See your Future Fit
              + career matches.
            </h2>

            <p>
              Enter your
              information to
              generate and save
              your personalized
              BUILD6™ results.
            </p>

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

            <div className="assessment-contact-grid">
              <label>
                First Name *
                <input
                  name="firstName"
                  type="text"
                  required
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
                School /
                Organization
                <input
                  name="schoolOrOrg"
                  type="text"
                />
              </label>

              <label>
                Grade Level
                <select
                  name="gradeLevel"
                  defaultValue=""
                >
                  <option value="">
                    Select...
                  </option>
                  <option value="9">
                    9th Grade
                  </option>
                  <option value="10">
                    10th Grade
                  </option>
                  <option value="11">
                    11th Grade
                  </option>
                  <option value="12">
                    12th Grade
                  </option>
                  <option value="College">
                    College /
                    Postsecondary
                  </option>
                  <option value="Adult">
                    Adult /
                    Workforce
                  </option>
                  <option value="Other">
                    Other
                  </option>
                </select>
              </label>

              <label className="assessment-full-field">
                City / State
                <input
                  name="location"
                  type="text"
                />
              </label>
            </div>

            <label className="assessment-consent">
              <input
                name="consent"
                type="checkbox"
                required
              />

              <span>
                I agree that
                BUILD6™ may save
                my assessment
                responses and
                results and may
                contact me about
                BUILD6™ resources
                and opportunities.
              </span>
            </label>

            <p className="assessment-privacy">
              This public
              assessment is
              intended for users
              age 13 and older.
              Do not enter
              sensitive personal
              information.
            </p>

            {error && (
              <p className="interest-form-error">
                {error}
              </p>
            )}

            <div className="assessment-controls">
              <button
                type="button"
                className="assessment-back"
                onClick={() =>
                  setStep(
                    questionCount -
                      1
                  )
                }
              >
                ← BACK
              </button>

              <button
                className="assessment-next"
                type="submit"
                disabled={
                  submitting
                }
              >
                {submitting
                  ? "BUILDING YOUR RESULTS..."
                  : "SEE MY RESULTS →"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
