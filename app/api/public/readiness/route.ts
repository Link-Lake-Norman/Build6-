import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { generateDiscoveryCareers } from "@/content/career-intelligence";
import mammoth from "mammoth";
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

    const careerClaimToken = randomBytes(32).toString("hex");
    const careerClaimHash = createHash("sha256").update(careerClaimToken).digest("hex");
    const saved = await prisma.publicAssessmentSubmission.create({
      data: { firstName, lastName, email, audienceType, ageBand, gradeLevel, careerStage, schoolOrganization, guardianName, guardianEmail, consent, answers, categoryScores, overallScore, careerClaimHash, source: "PUBLIC_BUILD6_ASSESSMENT" },
      select: { id: true, overallScore: true, categoryScores: true, completedAt: true },
    });
    return NextResponse.json({ ok: true, ...saved, careerClaimToken });
  } catch (error) {
    console.error("Public readiness submission failed:", error);
    return NextResponse.json({ error: "Unable to save the assessment right now." }, { status: 500 });
  }
}

// A random one-time claim returned only to the submitting browser protects the
// public follow-up write. Never accept a participant ID alone as authorization.
const fields = ["strengths", "interests", "values", "goals"] as const;
type CareerField = typeof fields[number];
function parseCareerProfile(value: unknown): Record<CareerField, string> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const output = {} as Record<CareerField, string>;
  for (const field of fields) {
    if (typeof input[field] !== "string" || input[field].length > 500) return null;
    output[field] = input[field].trim();
  }
  if (!Object.values(output).some(Boolean)) return null;
  return output;
}
const careerSignals = (value: string) => value.split(/[,;\n]+/).map(v => v.trim()).filter(Boolean).slice(0, 12);

const ALLOWED = new Set(["application/pdf","application/vnd.openxmlformats-officedocument.wordprocessingml.document","text/plain"]);
async function documentText(value: FormDataEntryValue|null, label:string):Promise<string|null> {
  if(!(value instanceof File) || !value.size)return null;
  if(value.size>3*1024*1024)throw new Error(label+" exceeds 3 MB.");
  const ext=value.name.toLowerCase().split(".").pop();
  if(!["pdf","docx","txt"].includes(ext||""))throw new Error("Unsupported "+label+" file type.");
  const buf=Buffer.from(await value.arrayBuffer());
  let content="";
  if(ext==="txt")content=buf.toString("utf8");
  if(ext==="docx")content=(await mammoth.extractRawText({buffer:buf})).value;
  if(ext==="pdf"){
    const pdfParse=require("pdf-parse") as (buffer:Buffer, options?:object)=>Promise<{text:string}>;
    content=(await pdfParse(buf,{max:20})).text;
  }
  content=content.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,"").trim();
  if(!content)throw new Error(label+" has no extractable text. Use a text-based PDF, DOCX or TXT.");
  return content.slice(0,20000);
}
function experienceLabel(years:number|null, seniority:string):string {
  if(seniority==="Executive")return "Executive-level experience stated by participant";
  if(seniority==="Director")return "Director-level experience stated by participant";
  if(seniority==="Manager")return "Management-level experience stated by participant";
  if(seniority==="Team lead / supervisor")return "Supervisory experience stated by participant";
  if(years!==null && years>=8)return "Experienced professional — verify role-specific requirements";
  if(years!==null && years>=3)return "Developing / experienced professional";
  return "Exploration and entry-level pathways, with growth options";
}
export async function PATCH(request: NextRequest) {
  try {
    const form=await request.formData();
    const body={id:form.get("id"),careerClaimToken:form.get("careerClaimToken"),exploration:JSON.parse(String(form.get("exploration")||"null"))};
    const id = typeof body.id === "string" ? body.id : "";
    const token = typeof body.careerClaimToken === "string" ? body.careerClaimToken : "";
    const profile = parseCareerProfile(body.exploration);
    const rawExperience=JSON.parse(String(form.get("experience")||"{}"));
    const yearsValue=String(rawExperience.years||"");
    const years=yearsValue && /^\d{1,2}$/.test(yearsValue)?Number(yearsValue):null;
    if(years!==null && years>60)return NextResponse.json({error:"Invalid years of experience."},{status:400});
    const education=typeof rawExperience.education==="string"?rawExperience.education.slice(0,80):"";
    const seniority=typeof rawExperience.seniority==="string"?rawExperience.seniority.slice(0,80):"";
    const hasFiles=form.get("personalCv") instanceof File || form.get("resume") instanceof File;
    if(hasFiles && form.get("documentConsent")!=="true")return NextResponse.json({error:"Document processing consent is required."},{status:400});
    if (!/^c[a-z0-9]{15,35}$/i.test(id) || !/^[0-9a-f]{64}$/.test(token) || !profile)
      return NextResponse.json({ error: "Invalid career submission." }, { status: 400 });
    const submittedHash = createHash("sha256").update(token).digest();
    const row = await prisma.publicAssessmentSubmission.findUnique({
      where: { id }, select: { careerClaimHash: true, consent: true, careerCompletedAt: true },
    });
    if (!row?.careerClaimHash || !row.consent || row.careerCompletedAt)
      return NextResponse.json({ error: "This career submission is unavailable or already saved." }, { status: 403 });
    const storedHash = Buffer.from(row.careerClaimHash, "hex");
    if (storedHash.length !== submittedHash.length || !timingSafeEqual(storedHash, submittedHash))
      return NextResponse.json({ error: "Invalid career submission authorization." }, { status: 403 });
    let personalCvText:string|null=null,resumeText:string|null=null;
    try {
      personalCvText=await documentText(form.get("personalCv"),"Personal CV");
      resumeText=await documentText(form.get("resume"),"Resume");
    }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Unable to read uploaded document."},{status:400});}
    const level=experienceLabel(years,seniority);
    const enhancedProfile={...profile,yearsOfExperience:years,education,seniority,experienceLevel:level,
      personalCvText,resumeText,documentsProcessedAt:hasFiles?new Date().toISOString():null};
    // Document signals supplement self-reported strengths and interests. They are not
    // independently verified credentials and cannot establish employment eligibility.
    const documentSignals=[...(personalCvText||"").split(/[\n.;]+/),...(resumeText||"").split(/[\n.;]+/)]
      .map(v=>v.trim()).filter(v=>v.length>=5 && v.length<=120).slice(0,40);
    // The server generates and saves the recommendations; the browser cannot
    // forge career titles or overwrite another participant's record.
    const recommendations = generateDiscoveryCareers({
      studentId: id,
      strengths: [...careerSignals(profile.strengths), ...careerSignals(profile.values),...documentSignals.slice(0,20)],
      interests: [...careerSignals(profile.interests), ...careerSignals(profile.goals),...documentSignals.slice(20)],
      industries: [],
    }).map(({ title, industry, description, whyItFits, skillsToDevelop,
      experiencesToTry, educationRoutes }) => ({ title, industry, description,
      whyItFits, skillsToDevelop, experiencesToTry, educationRoutes }));
    const saved = await prisma.publicAssessmentSubmission.updateMany({
      where: { id, careerClaimHash: row.careerClaimHash, careerCompletedAt: null },
      data: { careerProfile: enhancedProfile, careerRecommendations: recommendations,
        careerCompletedAt: new Date(), careerClaimHash: null },
    });
    if (saved.count !== 1) return NextResponse.json({ error: "Career results were already saved." }, { status: 409 });
    // Paid details remain in the database for authorized administrator fulfillment.
    // Never send the detailed recommendations to an unauthenticated public client.
    const freeRecommendations = recommendations.map(({title,industry,description}) => ({title,industry,description}));
    return NextResponse.json({ ok: true, recommendations: freeRecommendations, experienceLevel:level });
  } catch (error) {
    console.error("Public career results save failed:", error);
    return NextResponse.json({ error: "Unable to save career results right now." }, { status: 500 });
  }
}
