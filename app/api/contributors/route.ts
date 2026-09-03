import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
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
]);

const ROLE_MAP: Record<string, string> = {
  "I've been invited to participate": "OTHER",
  "Presenter / Guest Speaker": "PRESENTER",
  Facilitator: "FACILITATOR",
  Mentor: "MENTOR",
  "Employer / Industry Partner": "EMPLOYER_PARTNER",
  "Workplace Tour / Career Experience Host": "WORKPLACE_HOST",
  "Job Shadow / Internship Host": "JOB_SHADOW_INTERNSHIP_HOST",
  "Sponsor / Supporter": "SPONSOR_SUPPORTER",
  "Resource / Community Partner": "RESOURCE_COMMUNITY_PARTNER",
  "I have another idea": "OTHER",
  "I'd like more information": "INFORMATION_REQUEST",
};

const FORMAT_MAP: Record<string, string> = {
  "In Person": "IN_PERSON",
  Virtual: "VIRTUAL",
  Either: "EITHER",
  "Not Sure Yet": "UNDECIDED",
};

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

function validUrl(value: string | null) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (clean(body.companyFax, 200)) {
    return NextResponse.json({ ok: true });
  }

  const connectionType = clean(body.connectionType, 120);
  const firstName = clean(body.firstName, 100);
  const lastName = clean(body.lastName, 100);
  const organization = clean(body.organization, 200);
  const email = clean(body.email, 320).toLowerCase();
  const consent = body.consent === true;

  if (
    !ALLOWED_TYPES.has(connectionType) ||
    !firstName ||
    !lastName ||
    !organization ||
    !email ||
    !validEmail(email) ||
    !consent
  ) {
    return NextResponse.json(
      { ok: false, error: "Please complete all required fields." },
      { status: 400 },
    );
  }

  const linkedin = optional(body.linkedin, 500);
  const website = optional(body.website, 500);

  if (!validUrl(linkedin) || !validUrl(website)) {
    return NextResponse.json(
      { ok: false, error: "Please enter valid website links." },
      { status: 400 },
    );
  }

  const source =
    connectionType === "I've been invited to participate" ? "INVITED" : "INQUIRY";
  const role = ROLE_MAP[connectionType] ?? "OTHER";
  const format = FORMAT_MAP[clean(body.format, 60)] ?? null;

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const contributorResult = await client.query(
      `
        INSERT INTO contributors (
          source, status, first_name, last_name, organization_name,
          title, email, phone, linkedin, website, bio, consent
        )
        VALUES ($1, 'NEW', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (lower(email), lower(organization_name))
        DO UPDATE SET
          source = EXCLUDED.source,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          title = COALESCE(EXCLUDED.title, contributors.title),
          phone = COALESCE(EXCLUDED.phone, contributors.phone),
          linkedin = COALESCE(EXCLUDED.linkedin, contributors.linkedin),
          website = COALESCE(EXCLUDED.website, contributors.website),
          bio = COALESCE(EXCLUDED.bio, contributors.bio),
          consent = EXCLUDED.consent,
          updated_at = now()
        RETURNING id
      `,
      [
        source,
        firstName,
        lastName,
        organization,
        optional(body.title, 200),
        email,
        optional(body.phone, 100),
        linkedin,
        website,
        optional(body.bio, 3000),
        consent,
      ],
    );

    const contributorId = contributorResult.rows[0].id as string;

    await client.query(
      `
        INSERT INTO contributor_roles (contributor_id, role)
        VALUES ($1, $2)
        ON CONFLICT (contributor_id, role) DO NOTHING
      `,
      [contributorId, role],
    );

    const engagementResult = await client.query(
      `
        INSERT INTO contributor_engagements (
          contributor_id, title, description, student_outcome, industry_pathway,
          format, proposed_date, proposed_time, location, availability, notes, status
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          NULLIF($7, '')::date,
          NULLIF($8, '')::time,
          $9, $10, $11, 'NEW'
        )
        RETURNING id
      `,
      [
        contributorId,
        optional(body.engagementTitle, 300),
        optional(body.description, 5000),
        optional(body.studentOutcome, 4000),
        optional(body.pathway, 200),
        format,
        clean(body.proposedDate, 20),
        clean(body.proposedTime, 20),
        optional(body.location, 500),
        optional(body.availability, 2000),
        optional(body.notes, 4000),
      ],
    );

    await client.query("COMMIT");

    return NextResponse.json(
      {
        ok: true,
        contributorId,
        engagementId: engagementResult.rows[0].id,
        source,
        status: "NEW",
      },
      { status: 201 },
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("BUILD6 contributor submission failed", error);

    return NextResponse.json(
      {
        ok: false,
        error: "We could not save your information right now. Please try again.",
      },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
