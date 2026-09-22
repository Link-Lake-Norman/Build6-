import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DAY_ONE_QUESTIONS, type ReadinessCategory } from "@/content/day-one-readiness";

type AnswerPayload = { position: number; score: number };
type CategoryScores = Record<ReadinessCategory, number>;
const clean = (value: unknown, max = 180) => typeof value === "string" ? value.trim().slice(0, max) : "";
const percentFromAverage = (average: number) => Math.round((average / 5) * 100);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const firstName = clean(body.firstName, 80);
    const lastName = clean(body.lastName, 80);
    const email = clean(body.email).toLowerCase();
    const audienceType = clean(body.audienceType, 30);
    const ageBand = clean(body.ageBand, 30);
    const gradeLevel = clean(body.gradeLevel, 50) || null;
    const careerStage = clean(body.careerStage, 100) || null;
    const schoolOrganization = clean(body.schoolOrganization) || null;
    const guardianName = clean(body.guardianName, 160) || null;
    const guardianEmail = clean(body.guardianEmail).toLowerCase() || null;
    const consent = body.consent === true;
    const answers: AnswerPayload[] = Array.isArray(body.answers) ? body.answers : [];

    if (!firstName || !lastName || !email.includes("@")) return NextResponse.json({ error: "Name and a valid email are required." }, { status: 400 });
    if (!["STUDENT", "ADULT"].includes(audienceType)) return NextResponse.json({ error: "Select student or adult." }, { status: 400 });
    if (audienceType === "STUDENT" && !gradeLevel) return NextResponse.json({ error: "Grade level is required." }, { status: 400 });
    if (audienceType === "ADULT" && !careerStage) return NextResponse.json({ error: "Career stage is required." }, { status: 400 });
    if (ageBand === "UNDER_16" && (!guardianName || !guardianEmail || !consent)) return NextResponse.json({ error: "Parent/guardian information and consent are required for participants under 16." }, { status: 400 });
    if (!consent) return NextResponse.json({ error: "Consent is required before results can be saved." }, { status: 400 });
    if (answers.length !== DAY_ONE_QUESTIONS.length) return NextResponse.json({ error: `Please answer all ${DAY_ONE_QUESTIONS.length} questions.` }, { status: 400 });

    const answerMap = new Map<number, number>();
    for (const answer of answers) {
      if (!Number.isInteger(answer.position) || !Number.isInteger(answer.score) || answer.position < 1 || answer.position > DAY_ONE_QUESTIONS.length || answer.score < 1 || answer.score > 5) {
        return NextResponse.json({ error: "One or more assessment responses are invalid." }, { status: 400 });
      }
      answerMap.set(answer.position, answer.score);
    }
    if (answerMap.size !== DAY_ONE_QUESTIONS.length) return NextResponse.json({ error: "Each assessment question must be answered once." }, { status: 400 });

    const categoryTotals = new Map<ReadinessCategory, { total: number; count: number }>();
    for (const question of DAY_ONE_QUESTIONS) {
      const category = question.category as ReadinessCategory;
      const current = categoryTotals.get(category) ?? { total: 0, count: 0 };
      categoryTotals.set(category, { total: current.total + answerMap.get(question.position)!, count: current.count + 1 });
    }
    const categoryScores = {} as CategoryScores;
    for (const [category, values] of categoryTotals.entries()) categoryScores[category] = percentFromAverage(values.total / values.count);
    const overallScore = Math.round(Object.values(categoryScores).reduce((sum, value) => sum + value, 0) / Object.values(categoryScores).length);

    const saved = await prisma.publicAssessmentSubmission.create({
      data: { firstName, lastName, email, audienceType, ageBand, gradeLevel, careerStage, schoolOrganization, guardianName, guardianEmail, consent, answers, categoryScores, overallScore, source: "PUBLIC_BUILD6_ASSESSMENT" },
      select: { id: true, overallScore: true, categoryScores: true, completedAt: true },
    });
    return NextResponse.json({ ok: true, ...saved });
  } catch (error) {
    console.error("Public readiness submission failed:", error);
    return NextResponse.json({ error: "Unable to save the assessment right now." }, { status: 500 });
  }
}
