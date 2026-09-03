import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  db,
} from "@/lib/db";

import {
  scoreAssessment,
} from "@/lib/assessment/score";

export const runtime =
  "nodejs";

function clean(
  value: unknown
) {
  return String(
    value ?? ""
  ).trim();
}

function validEmail(
  value: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
}

async function ensureTables() {
  const client =
    await db.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS build6_assessments (
        id BIGSERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        email TEXT NOT NULL,
        school_or_org TEXT,
        grade_level TEXT,
        location TEXT,
        profile_title TEXT NOT NULL,
        top_dimensions JSONB NOT NULL DEFAULT '[]'::jsonb,
        pathways JSONB NOT NULL DEFAULT '[]'::jsonb,
        career_matches JSONB NOT NULL DEFAULT '[]'::jsonb,
        answers JSONB NOT NULL DEFAULT '{}'::jsonb,
        consent BOOLEAN NOT NULL DEFAULT FALSE,
        source TEXT NOT NULL DEFAULT 'PUBLIC_ASSESSMENT',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS
      build6_assessments_email_idx
      ON build6_assessments
      (lower(email));
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS
      build6_assessments_created_idx
      ON build6_assessments
      (created_at DESC);
    `);
  } finally {
    client.release();
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    if (
      clean(
        body.companyFax
      )
    ) {
      return NextResponse.json(
        {
          ok: true,
        }
      );
    }

    const firstName =
      clean(body.firstName);

    const email =
      clean(body.email)
        .toLowerCase();

    const schoolOrOrg =
      clean(
        body.schoolOrOrg
      );

    const gradeLevel =
      clean(
        body.gradeLevel
      );

    const location =
      clean(body.location);

    const consent =
      body.consent === true;

    const answers =
      body.answers &&
      typeof body.answers ===
        "object"
        ? body.answers
        : {};

    if (!firstName) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Please enter your first name.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !email ||
      !validEmail(email)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    if (!consent) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Please confirm permission to save your assessment.",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      scoreAssessment(
        answers
      );

    await ensureTables();

    const client =
      await db.connect();

    try {
      const saved =
        await client.query(
          `
          INSERT INTO build6_assessments (
            first_name,
            email,
            school_or_org,
            grade_level,
            location,
            profile_title,
            top_dimensions,
            pathways,
            career_matches,
            answers,
            consent
          )
          VALUES (
            $1,$2,$3,$4,$5,
            $6,$7::jsonb,$8::jsonb,
            $9::jsonb,$10::jsonb,$11
          )
          RETURNING id
          `,
          [
            firstName,
            email,
            schoolOrOrg ||
              null,
            gradeLevel ||
              null,
            location ||
              null,
            result.profileTitle,
            JSON.stringify(
              result.topDimensions
            ),
            JSON.stringify(
              result.pathways
            ),
            JSON.stringify(
              result.careerMatches
            ),
            JSON.stringify(
              answers
            ),
            consent,
          ]
        );

      return NextResponse.json(
        {
          ok: true,
          assessmentId:
            saved.rows[0].id,
          result,
        },
        {
          status: 201,
        }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(
      "BUILD6 assessment error:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not complete your assessment right now.",
      },
      {
        status: 500,
      }
    );
  }
}
