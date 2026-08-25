"use client";

import { FormEvent, useState } from "react";
import SiteHeader from "../components/SiteHeader";

const connectionTypes = [
  "I've been invited to participate",
  "Presenter / Guest Speaker",
  "Facilitator",
  "Mentor",
  "Employer / Industry Partner",
  "Workplace Tour / Career Experience Host",
  "Job Shadow / Internship Host",
  "Sponsor / Supporter",
  "Resource / Community Partner",
  "I have another idea",
  "I'd like more information",
];

const pathways = [
  "Advanced Manufacturing",
  "Business / Entrepreneurship",
  "Education",
  "Engineering",
  "Government / Public Service",
  "Healthcare",
  "Information Technology / AI",
  "Skilled Trades",
  "Sports / Athletics",
  "Other / Multiple Industries",
];

export default function ConnectPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <main className="connect-page">
        <SiteHeader />

        <section className="connect-success">
          <div>
            <p className="connect-eyebrow">BUILD6™ PARTNER + CONTRIBUTOR</p>
            <div className="success-mark">✓</div>

            <h1>THANK YOU FOR CONNECTING.</h1>

            <p>
              Your information has been prepared for BUILD6™ review. Once the
              secure BUILD6™ data layer is connected, submissions will be saved
              directly to the contributor relationship system.
            </p>

            <a href="/" className="connect-primary">
              RETURN TO BUILD6™
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="connect-page">
      <SiteHeader />

      <section className="connect-hero">
        <div className="connect-hero-inner">
          <p className="connect-eyebrow">BUILD6™ PARTNER + CONTRIBUTOR</p>

          <h1>
            REAL CONNECTIONS CREATE
            <span> REAL POSSIBILITY.</span>
          </h1>

          <p>
            Whether you&apos;ve been invited to participate or you&apos;re
            interested in getting involved, tell us how you would like to
            connect with BUILD6™ and help students experience what&apos;s
            possible beyond the classroom.
          </p>
        </div>
      </section>

      <section className="connect-intro">
        <div>
          <p className="connect-section-label">GET INVOLVED</p>
          <h2>There are many ways to make an impact.</h2>
          <p>
            Share your experience. Open your workplace. Mentor a student.
            Facilitate a conversation. Introduce an industry. Support an
            experience. BUILD6™ creates meaningful ways for people and
            organizations to participate in student development.
          </p>
        </div>
      </section>

      <section className="connect-form-section">
        <form className="connect-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>1. HOW WOULD YOU LIKE TO CONNECT?</legend>

            <p className="field-help">
              Select the option that best describes your interest.
            </p>

            <div className="connection-choice-grid">
              {connectionTypes.map((type) => (
                <label className="connection-choice" key={type}>
                  <input
                    type="radio"
                    name="connectionType"
                    value={type}
                    required
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>2. ABOUT YOU</legend>

            <div className="form-grid">
              <label>
                First Name *
                <input name="firstName" type="text" required />
              </label>

              <label>
                Last Name *
                <input name="lastName" type="text" required />
              </label>

              <label>
                Company / Organization *
                <input name="organization" type="text" required />
              </label>

              <label>
                Title / Role
                <input name="title" type="text" />
              </label>

              <label>
                Email *
                <input name="email" type="email" required />
              </label>

              <label>
                Phone
                <input name="phone" type="tel" />
              </label>

              <label>
                LinkedIn
                <input
                  name="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                />
              </label>

              <label>
                Website
                <input
                  name="website"
                  type="url"
                  placeholder="https://..."
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>3. YOUR CONTRIBUTION OR EXPERIENCE</legend>

            <div className="form-grid">
              <label className="full-field">
                Topic / Presentation / Experience Title
                <input
                  name="engagementTitle"
                  type="text"
                  placeholder="What would you like to share or provide?"
                />
              </label>

              <label className="full-field">
                Brief Description
                <textarea
                  name="description"
                  rows={5}
                  placeholder="Tell us about the presentation, experience, opportunity, resource, or support you would like to provide."
                />
              </label>

              <label className="full-field">
                What would students learn, see, practice, or experience?
                <textarea
                  name="studentOutcome"
                  rows={4}
                  placeholder="A short description of the value or exposure students would gain."
                />
              </label>

              <label>
                Industry / Career Pathway
                <select name="pathway" defaultValue="">
                  <option value="" disabled>
                    Select a pathway
                  </option>
                  {pathways.map((pathway) => (
                    <option value={pathway} key={pathway}>
                      {pathway}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Participation Format
                <select name="format" defaultValue="">
                  <option value="" disabled>
                    Select a format
                  </option>
                  <option>In Person</option>
                  <option>Virtual</option>
                  <option>Either</option>
                  <option>Not Sure Yet</option>
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>4. SCHEDULING + LOGISTICS</legend>

            <div className="form-grid">
              <label>
                Is a date already established?
                <select name="dateStatus" defaultValue="">
                  <option value="" disabled>
                    Select
                  </option>
                  <option>Yes — I was invited for a specific date</option>
                  <option>No — I need to coordinate availability</option>
                  <option>Not applicable</option>
                </select>
              </label>

              <label>
                Proposed / Confirmed Date
                <input name="proposedDate" type="date" />
              </label>

              <label>
                Proposed / Confirmed Time
                <input name="proposedTime" type="time" />
              </label>

              <label>
                Location
                <input
                  name="location"
                  type="text"
                  placeholder="School, workplace, community location, or virtual"
                />
              </label>

              <label className="full-field">
                If a date is not established, what availability generally works?
                <textarea
                  name="availability"
                  rows={3}
                  placeholder="Days, times, date ranges, or other scheduling information."
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>5. ADDITIONAL INFORMATION</legend>

            <div className="form-grid">
              <label className="full-field">
                Short Bio / Background
                <textarea
                  name="bio"
                  rows={4}
                  placeholder="Optional short professional background we may use when preparing your participation."
                />
              </label>

              <label className="full-field">
                Notes / Special Requirements
                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Technology, accessibility, logistics, questions, introductions, sponsorship ideas, or anything else we should know."
                />
              </label>
            </div>

            <div className="contributor-notice">
              <strong>BUILD6™ Relationship Record</strong>
              <p>
                Information submitted here may be retained as part of the
                BUILD6™ partner and contributor relationship network so we can
                coordinate your participation and future opportunities.
              </p>
            </div>

            <label className="consent-row">
              <input type="checkbox" required />
              <span>
                I confirm that the information provided is accurate and I
                authorize BUILD6™ to contact me regarding this inquiry or
                participation.
              </span>
            </label>
          </fieldset>

          <div className="connect-submit-row">
            <button type="submit" className="connect-primary">
              SUBMIT TO BUILD6™ →
            </button>

            <p>
              Already invited? Complete this form so we can confirm the details
              and prepare your BUILD6™ experience.
            </p>
          </div>
        </form>
      </section>

      <footer className="connect-footer">
        <strong>BUILD6™</strong>
        <span>BUILD WHAT&apos;S NEXT.</span>

        <p>
          © 2026 BUILD6™. All Rights Reserved. Proprietary brand, platform,
          curriculum, research, data, methodologies, designs &amp; program
          materials.
        </p>
      </footer>
    </main>
  );
}
