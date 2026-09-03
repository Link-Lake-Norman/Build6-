import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const ALLOWED_INQUIRY_TYPES = new Set([
  "ORGANIZATION_INTEREST",
  "QUICK_CONTACT",
]);

function clean(value: unknown, max = 5000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function optional(value: unknown, max = 5000) {
  const result = clean(value, max);
  return result || null;
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function ensureInquiryTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS build6_inquiries (
      id BIGSERIAL PRIMARY KEY,
      source VARCHAR(80) NOT NULL DEFAULT 'WEBSITE',
      inquiry_type VARCHAR(80) NOT NULL,
      interest_type VARCHAR(200),
      status VARCHAR(40) NOT NULL DEFAULT 'NEW',

      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,

      organization VARCHAR(250),
      role VARCHAR(200),

      email VARCHAR(320) NOT NULL,
      phone VARCHAR(100),

      location VARCHAR(300),
      participant_count VARCHAR(200),
      timeline VARCHAR(500),

      goals TEXT,
      message TEXT,

      consent BOOLEAN NOT NULL DEFAULT false,

      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS build6_inquiries_email_idx
    ON build6_inquiries (lower(email))
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS build6_inquiries_status_idx
    ON build6_inquiries (status, created_at DESC)
  `);
}

function emailConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
}

async function sendInquiryEmails(data: {
  inquiryId: string;
  inquiryType: string;
  interestType: string | null;

  firstName: string;
  lastName: string;

  organization: string | null;
  role: string | null;

  email: string;
  phone: string | null;

  location: string | null;
  participantCount: string | null;
  timeline: string | null;

  goals: string | null;
  message: string | null;
}) {
  if (!emailConfigured()) {
    return false;
  }

  const port = Number(process.env.SMTP_PORT);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const publicEmail =
    process.env.BUILD6_PUBLIC_EMAIL || "info@build6.education";

  const internalRecipient =
    process.env.BUILD6_INQUIRY_TO || "jaime@linklakenorman.com";

  const from =
    process.env.SMTP_FROM || `BUILD6™ <${publicEmail}>`;

  const details = [
    `BUILD6™ Website Inquiry`,
    ``,
    `Inquiry ID: ${data.inquiryId}`,
    `Inquiry Type: ${data.inquiryType}`,
    `Interest: ${data.interestType || "Not specified"}`,
    ``,
    `Name: ${data.firstName} ${data.lastName}`,
    `Organization: ${data.organization || "Not provided"}`,
    `Role: ${data.role || "Not provided"}`,
    ``,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "Not provided"}`,
    `Location: ${data.location || "Not provided"}`,
    ``,
    `Participant Count: ${data.participantCount || "Not provided"}`,
    `Timeline: ${data.timeline || "Not provided"}`,
    ``,
    `Goals:`,
    data.goals || "Not provided",
    ``,
    `Message:`,
    data.message || "Not provided",
  ].join("\n");

  await transporter.sendMail({
    from,
    to: internalRecipient,
    replyTo: data.email,
    subject: `BUILD6™ Inquiry — ${
      data.interestType || data.inquiryType
    } — ${data.firstName} ${data.lastName}`,
    text: details,
  });

  await transporter.sendMail({
    from,
    to: data.email,
    replyTo: publicEmail,
    subject: "We received your BUILD6™ inquiry",
    text: [
      `Hi ${data.firstName},`,
      ``,
      `Thank you for connecting with BUILD6™.`,
      ``,
      `We received your information and will review what you shared so we can follow up with the right next step.`,
      ``,
      `BUILD6™`,
      `Build What's Next.`,
      publicEmail,
    ].join("\n"),
  });

  return true;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid request.",
      },
      {
        status: 400,
      }
    );
  }

  /*
   * Honeypot:
   * Bots filling the hidden companyFax field receive a harmless success.
   */
  if (clean(body.companyFax, 200)) {
    return NextResponse.json({
      ok: true,
    });
  }

  const inquiryType = clean(body.inquiryType, 80);
  const source = clean(body.source, 80) || "WEBSITE";

  const firstName = clean(body.firstName, 100);
  const lastName = clean(body.lastName, 100);

  const email = clean(body.email, 320).toLowerCase();

  const consent = body.consent === true;

  if (
    !ALLOWED_INQUIRY_TYPES.has(inquiryType) ||
    !firstName ||
    !lastName ||
    !email ||
    !validEmail(email) ||
    !consent
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please complete all required fields.",
      },
      {
        status: 400,
      }
    );
  }

  const organization = optional(body.organization, 250);

  if (inquiryType === "ORGANIZATION_INTEREST" && !organization) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please enter your organization.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    await ensureInquiryTable();

    const result = await db.query(
      `
        INSERT INTO build6_inquiries (
          source,
          inquiry_type,
          interest_type,

          first_name,
          last_name,

          organization,
          role,

          email,
          phone,

          location,
          participant_count,
          timeline,

          goals,
          message,

          consent
        )
        VALUES (
          $1, $2, $3,
          $4, $5,
          $6, $7,
          $8, $9,
          $10, $11, $12,
          $13, $14,
          $15
        )
        RETURNING id, status, created_at
      `,
      [
        source,
        inquiryType,
        optional(body.interestType, 200),

        firstName,
        lastName,

        organization,
        optional(body.role, 200),

        email,
        optional(body.phone, 100),

        optional(body.location, 300),
        optional(body.participantCount, 200),
        optional(body.timeline, 500),

        optional(body.goals, 5000),
        optional(body.message, 5000),

        consent,
      ]
    );

    const inquiryId = String(result.rows[0].id);

    let emailSent = false;

    try {
      emailSent = await sendInquiryEmails({
        inquiryId,
        inquiryType,

        interestType: optional(body.interestType, 200),

        firstName,
        lastName,

        organization,
        role: optional(body.role, 200),

        email,
        phone: optional(body.phone, 100),

        location: optional(body.location, 300),
        participantCount: optional(body.participantCount, 200),
        timeline: optional(body.timeline, 500),

        goals: optional(body.goals, 5000),
        message: optional(body.message, 5000),
      });
    } catch (emailError) {
      /*
       * IMPORTANT:
       * The inquiry remains safely stored even if outbound email fails.
       */
      console.error(
        "BUILD6 inquiry email notification failed",
        emailError
      );
    }

    return NextResponse.json(
      {
        ok: true,
        inquiryId,
        status: result.rows[0].status,
        emailSent,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("BUILD6 inquiry submission failed", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not save your information right now. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}
