import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
type CareerRecord = { title: string; industry: string; description: string;
  whyItFits: string[]; skillsToDevelop: string[]; experiencesToTry: string[]; educationRoutes: string[] };
function careerRecords(value: unknown): CareerRecord[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is CareerRecord => Boolean(item) && typeof item === "object"
    && typeof item.title === "string" && typeof item.industry === "string"
    && Array.isArray(item.educationRoutes));
}
function profileFields(value: unknown): {strengths?:string;interests?:string;values?:string;goals?:string;yearsOfExperience?:number;education?:string;seniority?:string;experienceLevel?:string;personalCvText?:string;resumeText?:string} {
  return value && typeof value === "object" && !Array.isArray(value) ? value as ReturnType<typeof profileFields> : {};
}
export const dynamic="force-dynamic";
export default async function PublicAssessmentsAdminPage(){
  const session=await getSessionUser();
  if(!session)redirect("/ambassador/login");
  if(!["SUPER_ADMIN","ORGANIZATION_ADMIN","SCHOOL_ADMIN"].includes(session.role))redirect("/ambassador");
  const rows=await prisma.publicAssessmentSubmission.findMany({orderBy:{completedAt:"desc"},take:250});
  return <main className="space-y-8"><section className="rounded-3xl bg-[#0D1B3D] p-8 text-white"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">BUILD6™ ADMIN</p><h1 className="mt-3 text-4xl font-black">Public Assessment Results</h1><p className="mt-3 text-slate-200">Free-assessment respondents, stages and readiness baselines.</p><Link className="mt-5 inline-block font-black text-[#F2B705]" href="/ambassador/admin">← Back to Admin</Link></section><section className="overflow-x-auto rounded-3xl border bg-white"><table className="min-w-full text-left text-sm"><thead><tr>{["Name","Email","Stage","School / Organization","Score","Completed"].map(h=><th key={h} className="px-5 py-4">{h}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.id} className="border-t"><td className="px-5 py-4 font-bold">{r.firstName} {r.lastName}</td><td className="px-5 py-4"><a href={`mailto:${r.email}`}>{r.email}</a></td><td className="px-5 py-4">{r.audienceType==="STUDENT"?r.gradeLevel:r.careerStage}</td><td className="px-5 py-4">{r.schoolOrganization||"—"}</td><td className="px-5 py-4 font-black">{r.overallScore}%</td><td className="px-5 py-4">{r.completedAt.toLocaleDateString()}</td></tr>)}</tbody></table></section>
  <section className="space-y-5"><h2 className="text-2xl font-black">Career exploration submissions</h2>
  {rows.filter(r=>r.careerCompletedAt).map(r=>{
    const careers=careerRecords(r.careerRecommendations); const p=profileFields(r.careerProfile);
    return <details key={r.id} className="rounded-2xl border bg-white p-5"><summary className="cursor-pointer text-lg font-bold">{r.firstName} {r.lastName} — {r.email} — {r.overallScore}% — {r.careerCompletedAt?.toLocaleDateString()}</summary>
      <div className="mt-4 space-y-2"><p><strong>Consent:</strong> {r.consent?"Yes":"No"} | <strong>Audience:</strong> {r.audienceType} | <strong>Organization:</strong> {r.schoolOrganization||"—"}</p>
      <p><strong>Strengths:</strong> {p.strengths||"—"}</p><p><strong>Interests:</strong> {p.interests||"—"}</p><p><strong>Values:</strong> {p.values||"—"}</p><p><strong>Goals:</strong> {p.goals||"—"}</p>
       <p><strong>Experience:</strong> {p.yearsOfExperience??"Not provided"} years | <strong>Education:</strong> {p.education||"Not provided"} | <strong>Current level:</strong> {p.seniority||"Not provided"}</p>
       <p><strong>Career level guidance:</strong> {p.experienceLevel||"Not provided"}</p>
       {session.role==="SUPER_ADMIN" && p.personalCvText?<details><summary className="font-bold">Personal CV / About Me (extracted text)</summary><pre className="whitespace-pre-wrap break-words p-3">{p.personalCvText}</pre></details>:null}
       {session.role==="SUPER_ADMIN" && p.resumeText?<details><summary className="font-bold">Resume (extracted text)</summary><pre className="whitespace-pre-wrap break-words p-3">{p.resumeText}</pre></details>:null}
      <h3 className="text-lg font-bold">Seven readiness categories</h3><pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm">{JSON.stringify(r.categoryScores,null,2)}</pre>
      <div className="grid gap-4 md:grid-cols-2">{careers.map(c=><article key={c.title} className="rounded-xl border p-4"><h4 className="text-lg font-black">{c.title}</h4><p className="text-sm font-semibold">{c.industry}</p><p className="mt-2">{c.description}</p>
      {([["Why explore it",c.whyItFits],["Skills to develop",c.skillsToDevelop],["Experiences to try",c.experiencesToTry],["Education and training routes to research",c.educationRoutes]] as const).map(([label,items])=><div key={label} className="mt-3"><h5 className="font-bold">{label}</h5><ul className="list-disc pl-5">{items.map(item=><li key={item}>{item}</li>)}</ul></div>)}</article>)}</div></div></details>;
  })}</section></main>;
}
