import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { authorizeStudentAccess } from "@/lib/auth/student-access";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 8 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function clean(value: unknown, max = 4000) {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

async function requireStudentOwner(studentId: string) {
  const session = await getSessionUser();

  if (!session) {
    return { allowed: false as const, status: 401, error: "Authentication required." };
  }

  const access = await authorizeStudentAccess(studentId);

  if (!access.allowed) {
    return { allowed: false as const, status: access.status, error: "Student access required." };
  }

  if (session.role !== "STUDENT") {
    return {
      allowed: false as const,
      status: 403,
      error: "Only the student may generate a reflection from their work.",
    };
  }

  const owner = await prisma.student.findUnique({
    where: { userId: session.id },
    select: { id: true },
  });

  if (!owner || owner.id !== studentId) {
    return {
      allowed: false as const,
      status: 403,
      error: "You may only use your own BUILD6 work.",
    };
  }

  return { allowed: true as const };
}

function extractJson(text: string) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");

  if (first < 0 || last < first) {
    throw new Error("AI response did not contain reflection data.");
  }

  return JSON.parse(cleaned.slice(first, last + 1)) as {
    transcription?: unknown;
    moment?: unknown;
    selfInsight?: unknown;
    keepForStory?: unknown;
    skills?: unknown;
  };
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    const studentId = clean(form.get("studentId"), 200);
    const week = clean(form.get("week"), 20);
    const assignmentContext = clean(form.get("assignmentContext"), 1200);
    const file = form.get("file");

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required." }, { status: 400 });
    }

    const authorization = await requireStudentOwner(studentId);

    if (!authorization.allowed) {
      return NextResponse.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Take a photo or choose an image of your paper work." },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error:
            "For AI reflection, upload a JPG, PNG, or WEBP photo. PDFs can still be stored as portfolio evidence.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "Photo must be 8 MB or smaller." }, { status: 400 });
    }

    const token =
      process.env.AI_GATEWAY_API_KEY ||
      process.env.VERCEL_OIDC_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "BUILD6 AI is not available in this environment." },
        { status: 503 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const imageUrl = `data:${file.type};base64,${bytes.toString("base64")}`;

    const model =
      process.env.BUILD6_AI_MODEL ||
      "google/gemini-2.5-flash";

    const systemPrompt = `
You are the private BUILD6™ student reflection assistant.

You are reading a photograph of work created by the student.

NON-NEGOTIABLE RULES:
1. Use only information reasonably visible in the student's uploaded work and any assignment context supplied.
2. Never invent an experience, opinion, skill, accomplishment, feeling, event, answer, or quote.
3. Do not complete unanswered homework questions for the student.
4. Do not grade the student.
5. Preserve the student's age-appropriate voice.
6. Improve clarity, organization, spelling, and reflection quality without turning the response into adult corporate language.
7. If handwriting or content cannot be read confidently, say that instead of guessing.
8. Skills must be supported by evidence in the uploaded work.
9. The output is only a DRAFT. The student must review and edit it before saving.
10. BUILD6 focuses on self-awareness, communication, professionalism, teamwork, adaptability, problem solving, leadership, career exploration, workplace observation, systems thinking, and career pathways where actually supported.

Return ONLY valid JSON in this exact shape:
{
  "transcription": "concise transcription/summary of what is actually visible",
  "moment": "draft answer for Moment / Thought",
  "selfInsight": "draft answer for What I Noticed About Me",
  "keepForStory": "draft answer for Keep for My Story",
  "skills": ["skill 1", "skill 2"]
}
`.trim();

    const userContext = [
      week ? `BUILD6 week: ${week}` : "",
      assignmentContext ? `Assignment context: ${assignmentContext}` : "",
      "Read the student's uploaded paper and create a reflection draft from their own work.",
    ]
      .filter(Boolean)
      .join("\n");

    const response = await fetch(
      "https://ai-gateway.vercel.sh/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                { type: "text", text: userContext },
                {
                  type: "image_url",
                  image_url: { url: imageUrl, detail: "high" },
                },
              ],
            },
          ],
          stream: false,
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text();
      console.error(
        "BUILD6 paper reflection AI failed:",
        response.status,
        detail.slice(0, 1200),
      );

      return NextResponse.json(
        {
          error:
            "BUILD6 could not read this paper yet. Try a clearer, well-lit photo.",
        },
        { status: 502 },
      );
    }

    const result = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };

    const output = result.choices?.[0]?.message?.content ?? "";
    const parsed = extractJson(output);

    const skills = Array.isArray(parsed.skills)
      ? parsed.skills
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 8)
      : [];

    return NextResponse.json({
      draft: {
        transcription: clean(parsed.transcription, 5000),
        moment: clean(parsed.moment, 5000),
        selfInsight: clean(parsed.selfInsight, 5000),
        keepForStory: clean(parsed.keepForStory, 5000),
        skills,
      },
      studentReviewRequired: true,
    });
  } catch (error) {
    console.error("BUILD6 paper reflection route failed:", error);

    return NextResponse.json(
      { error: "Unable to generate a reflection from this paper." },
      { status: 500 },
    );
  }
}
