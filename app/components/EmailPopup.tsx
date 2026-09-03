"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

type ContactPath =
  | "Ask a Question"
  | "Bring BUILD6™ to My Organization"
  | "Participate / Partner";

const contactPaths: ContactPath[] = [
  "Ask a Question",
  "Bring BUILD6™ to My Organization",
  "Participate / Partner",
];

export default function EmailPopup() {
  const [open, setOpen] = useState(false);

  const [path, setPath] =
    useState<ContactPath>("Ask a Question");

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleEscape
      );
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    const form = event.currentTarget;

    const data = new FormData(form);

    const payload = {
      source: "EMAIL_POPUP",

      inquiryType: "QUICK_CONTACT",

      interestType: path,

      firstName: String(
        data.get("firstName") ?? ""
      ),

      lastName: String(
        data.get("lastName") ?? ""
      ),

      organization: String(
        data.get("organization") ?? ""
      ),

      role: String(
        data.get("role") ?? ""
      ),

      email: String(
        data.get("email") ?? ""
      ),

      phone: String(
        data.get("phone") ?? ""
      ),

      location: "",
      participantCount: "",
      timeline: "",
      goals: "",

      message: String(
        data.get("message") ?? ""
      ),

      companyFax: String(
        data.get("companyFax") ?? ""
      ),

      consent:
        data.get("consent") === "on",
    };

    try {
      const response = await fetch(
        "/api/inquiries",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error ||
            "We could not submit your message right now."
        );
      }

      setSubmitted(true);

      form.reset();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not submit your message right now."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function closePopup() {
    setOpen(false);

    window.setTimeout(() => {
      setSubmitted(false);
      setError("");
    }, 200);
  }

  return (
    <>
      <button
        className="build6-email-trigger"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Email BUILD6"
      >
        <span className="email-trigger-icon">
          ✉
        </span>

        <span>EMAIL BUILD6™</span>
      </button>

      {open && (
        <div
          className="email-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closePopup();
            }
          }}
        >
          <section
            className="email-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="build6-email-title"
          >
            <button
              className="email-modal-close"
              type="button"
              aria-label="Close email form"
              onClick={closePopup}
            >
              ×
            </button>

            {!submitted ? (
              <>
                <p className="email-modal-kicker">
                  BUILD6™
                </p>

                <h2 id="build6-email-title">
                  HOW CAN WE HELP?
                </h2>

                <p className="email-modal-intro">
                  Send a quick message to
                  BUILD6™. We&apos;ll connect
                  you with the right next step.
                </p>

                <div className="email-paths">
                  {contactPaths.map(
                    (option) => (
                      <button
                        type="button"
                        key={option}
                        className={
                          path === option
                            ? "email-path active"
                            : "email-path"
                        }
                        onClick={() =>
                          setPath(option)
                        }
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>

                <form
                  className="email-popup-form"
                  onSubmit={handleSubmit}
                >
                  <label
                    className="connect-honeypot"
                    aria-hidden="true"
                  >
                    Company Fax

                    <input
                      type="text"
                      name="companyFax"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </label>

                  <div className="email-popup-grid">
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
                      Organization

                      <input
                        name="organization"
                        type="text"
                      />
                    </label>

                    <label>
                      Role / Title

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
                  </div>

                  <label className="email-popup-message">
                    Message *

                    <textarea
                      name="message"
                      rows={4}
                      required
                      placeholder="Tell us what you're looking for..."
                    />
                  </label>

                  <label className="email-popup-consent">
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

                  {error && (
                    <p className="email-popup-error">
                      {error}
                    </p>
                  )}

                  <button
                    className="email-popup-submit"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting
                      ? "SENDING..."
                      : "SEND MESSAGE →"}
                  </button>
                </form>

                <p className="email-public-address">
                  info@build6.education
                </p>
              </>
            ) : (
              <div className="email-popup-success">
                <div>✓</div>

                <p className="email-modal-kicker">
                  MESSAGE RECEIVED
                </p>

                <h2>THANK YOU.</h2>

                <p>
                  Your message has been
                  submitted to BUILD6™.
                  We&apos;ll follow up using the
                  contact information you
                  provided.
                </p>

                <button
                  type="button"
                  onClick={closePopup}
                >
                  DONE
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
