import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import PilotCaseStudy from "./PilotCaseStudy";
export const dynamic="force-dynamic";
export const metadata={title:"Pilot Case Study | BUILD6 Admin",robots:{index:false,follow:false}};
export default async function Page(){const u=await getSessionUser();if(!u)redirect("/ambassador/login");if(u.role!=="SUPER_ADMIN")redirect("/ambassador");return <main className="mx-auto max-w-6xl space-y-6 px-5 py-8 text-[#0D1B3D]"><header className="rounded-3xl bg-[#0D1B3D] p-7 text-white"><p className="text-sm font-bold text-[#F2B705]">BUILD6™ OWNER ADMIN</p><h1 className="mt-2 text-3xl font-black">Pilot Case Study</h1><p className="mt-3 leading-7">Ambassador Christian pilot · Private evidence workspace</p><Link className="mt-4 inline-block rounded-xl bg-white px-4 py-3 font-bold text-[#0D1B3D]" href="/ambassador/admin/books-toolkits">Back to Books &amp; Toolkits</Link></header><PilotCaseStudy/><footer className="text-sm text-slate-600">© 2026 Link Lake Norman, LLC · Private pilot records</footer></main>;}
