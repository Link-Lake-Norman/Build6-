"use server";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import bcrypt from "bcryptjs";
import { createHash,randomBytes,randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { admin,buyer,licenseByEmail,setLogin,event,throttle,COOKIE,type License } from "@/lib/toolkits/access";
import { TOOLKIT, READY } from "@/lib/toolkits/catalog";
import { validEmail,validPayment } from "@/lib/toolkits/rules";
function field(f:FormData,k:string,max=254) { const v=f.get(k); if(typeof v!=="string" || v.length>max) throw new Error("Invalid input.");return v.trim(); }
function passwordField(f:FormData) { const v=f.get("password"); if(typeof v!=="string" || Buffer.byteLength(v,"utf8")>72) throw new Error("Password must fit within 72 UTF-8 bytes."); return v; }
function hash(s:string) { return createHash("sha256").update(s).digest("hex"); }
async function origin() { const configured=process.env.BUILD6_TOOLKIT_ORIGIN; const h=await headers(); if(!configured || h.get("origin")!==new URL(configured).origin) throw new Error("Toolkit origin is not configured or request origin is invalid."); }
export async function login(f:FormData) {
 await origin(); const email=field(f,"email").toLowerCase(),password=passwordField(f);
 await throttle("login:"+hash(email)); const l=await licenseByEmail(email);
 if(!l || l.status!=="ACTIVE" || !l.passwordHash || l.termsVersion!==TOOLKIT.termsVersion || !await bcrypt.compare(password,l.passwordHash)) redirect("/toolkits/login?error=credentials");
 await event(l.id,"SIGN_IN"); await setLogin(l); redirect("/my-toolkits");
}
export async function activate(f:FormData) {
 await origin(); const token=field(f,"token",64),password=passwordField(f); if(!/^[a-f0-9]{64}$/.test(token)||password.length<12||f.get("accept")!=="yes") throw new Error("Accept the license and use a password of 12–128 characters.");
 await throttle("activate:"+hash(token)); const passwordHash=await bcrypt.hash(password,12);
 const rows=await prisma.$queryRaw<License[]>`UPDATE "Build6ToolkitLicense" SET "passwordHash"=${passwordHash},"status"='ACTIVE',"termsVersion"=${TOOLKIT.termsVersion},"acceptedAt"=now(),"emailVerifiedAt"=now(),"inviteHash"=NULL,"inviteExpires"=NULL WHERE "inviteHash"=${hash(token)} AND "status"='INVITED' AND "inviteExpires">now() RETURNING *`;
 const l=rows[0]; if(!l) throw new Error("Activation link expired or already used. Contact support."); await event(l.id,"TERMS_ACCEPTED"); await setLogin(l); redirect("/my-toolkits");
}
export async function logout() { await origin(); const l=await buyer(); if(l) await prisma.$executeRaw`UPDATE "Build6ToolkitLicense" SET "sessionVersion"="sessionVersion"+1 WHERE "id"=${l.id}`; (await cookies()).delete(COOKIE); redirect("/toolkits/login"); }
export async function grant(f:FormData) {
 await origin(); const a=await admin(); if(!READY) throw new Error("Complete launch settings before issuing paid licenses.");
 const email=field(f,"email").toLowerCase(),name=field(f,"name",120),reference=field(f,"reference",120);
 if(!validEmail(email)||!name||!validPayment(Number(field(f,"amount",8)),reference)||f.get("verified")!=="yes") throw new Error("Confirm the settled $99 payment directly in QuickBooks.");
 const token=randomBytes(32).toString("hex"),id=randomUUID();
 await prisma.$transaction(async tx=>{ await tx.$executeRaw`INSERT INTO "Build6ToolkitLicense" ("id","email","name","paymentReference","amountCents","paymentVerifiedBy","inviteHash","inviteExpires") VALUES (${id},${email},${name},${reference},9900,${a.id},${hash(token)},now()+interval '48 hours')`; await tx.$executeRaw`INSERT INTO "Build6ToolkitEvent" ("id","licenseId","actorId","event") VALUES (${randomUUID()},${id},${a.id},'PAYMENT_VERIFIED_INVITE_CREATED')`; });
 // Token goes to an owner-only page, never a public order record or server log.
 redirect("/admin/toolkits?invite="+token);
}
export async function revoke(f:FormData) { await origin(); const a=await admin(); const id=field(f,"id",64),status=field(f,"status",12); if(!["SUSPENDED","REFUNDED"].includes(status)) throw new Error("Invalid status.");await prisma.$transaction(async tx=>{const n=await tx.$executeRaw`UPDATE "Build6ToolkitLicense" SET "status"=${status},"sessionVersion"="sessionVersion"+1,"inviteHash"=NULL WHERE "id"=${id}`;if(n!==1) throw new Error("License not found.");await tx.$executeRaw`INSERT INTO "Build6ToolkitEvent" ("id","licenseId","actorId","event") VALUES (${randomUUID()},${id},${a.id},${status})`;}); redirect("/admin/toolkits"); }
export async function reissue(f:FormData) { await origin();const a=await admin();if(!READY) throw new Error("Launch settings are incomplete.");const id=field(f,"id",64),token=randomBytes(32).toString("hex");await prisma.$transaction(async tx=>{const n=await tx.$executeRaw`UPDATE "Build6ToolkitLicense" SET "status"='INVITED',"sessionVersion"="sessionVersion"+1,"passwordHash"=NULL,"inviteHash"=${hash(token)},"inviteExpires"=now()+interval '48 hours' WHERE "id"=${id} AND "status"<>'REFUNDED'`;if(n!==1) throw new Error("License unavailable.");await tx.$executeRaw`INSERT INTO "Build6ToolkitEvent" ("id","licenseId","actorId","event") VALUES (${randomUUID()},${id},${a.id},'ACTIVATION_REISSUED')`;});redirect("/admin/toolkits?invite="+token); }
