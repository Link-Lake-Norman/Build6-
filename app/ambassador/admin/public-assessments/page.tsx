import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
export const dynamic="force-dynamic";
export default async function PublicAssessmentsAdminPage(){
  const session=await getSessionUser();
  if(!session)redirect("/ambassador/login");
  if(!["SUPER_ADMIN","ORGANIZATION_ADMIN","SCHOOL_ADMIN"].includes(session.role))redirect("/ambassador");
  const rows=await prisma.publicAssessmentSubmission.findMany({orderBy:{completedAt:"desc"},take:250});
  return <main className="space-y-8"><section className="rounded-3xl bg-[#0D1B3D] p-8 text-white"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">BUILD6™ ADMIN</p><h1 className="mt-3 text-4xl font-black">Public Assessment Results</h1><p className="mt-3 text-slate-200">Free-assessment respondents, stages and readiness baselines.</p><Link className="mt-5 inline-block font-black text-[#F2B705]" href="/ambassador/admin">← Back to Admin</Link></section><section className="overflow-x-auto rounded-3xl border bg-white"><table className="min-w-full text-left text-sm"><thead><tr>{["Name","Email","Stage","School / Organization","Score","Completed"].map(h=><th key={h} className="px-5 py-4">{h}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.id} className="border-t"><td className="px-5 py-4 font-bold">{r.firstName} {r.lastName}</td><td className="px-5 py-4"><a href={`mailto:${r.email}`}>{r.email}</a></td><td className="px-5 py-4">{r.audienceType==="STUDENT"?r.gradeLevel:r.careerStage}</td><td className="px-5 py-4">{r.schoolOrganization||"—"}</td><td className="px-5 py-4 font-black">{r.overallScore}%</td><td className="px-5 py-4">{r.completedAt.toLocaleDateString()}</td></tr>)}</tbody></table></section></main>;
}
