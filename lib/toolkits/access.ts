import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { SignJWT, jwtVerify } from "jose";
import { randomUUID } from "node:crypto";
import { eligible } from "./rules";
import { TOOLKIT } from "./catalog";
export type License = { id:string; email:string; name:string; status:string; passwordHash:string|null; termsVersion:string|null; sessionVersion:number; paymentReference:string; createdAt:Date; inviteExpires:Date|null };
export const COOKIE = "build6-toolkit-session";
function secret() { const s=process.env.BUILD6_TOOLKIT_SESSION_SECRET; if(!s || s.length<32) throw new Error("Toolkit session secret must be at least 32 characters."); return new TextEncoder().encode(s); }
export async function admin() {
 const s=await getSessionUser(); if(!s) throw new Error("Administrator sign-in required.");
 const u=await prisma.user.findUnique({where:{id:s.id},select:{id:true,role:true,status:true,deletedAt:true}});
 if(!u || u.role!=="SUPER_ADMIN" || u.status!=="ACTIVE" || u.deletedAt) throw new Error("Owner administrator access required."); return u;
}
export async function licenseByEmail(email:string) { const rows=await prisma.$queryRaw<License[]>`SELECT * FROM "Build6ToolkitLicense" WHERE "email"=${email}`; return rows[0]??null; }
export async function event(id:string,action:string,actor:string|null=null) { await prisma.$executeRaw`INSERT INTO "Build6ToolkitEvent" ("id","licenseId","actorId","event") VALUES (${randomUUID()},${id},${actor},${action})`; }
export async function setLogin(l:License) { const token=await new SignJWT({v:l.sessionVersion}).setProtectedHeader({alg:"HS256"}).setSubject(l.id).setIssuer("build6-toolkit").setAudience("build6-toolkit-buyer").setIssuedAt().setExpirationTime("8h").sign(secret()); (await cookies()).set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:28800}); }
export async function buyer() {
 const token=(await cookies()).get(COOKIE)?.value; if(!token) return null;
 try { const {payload}=await jwtVerify(token,secret(),{issuer:"build6-toolkit",audience:"build6-toolkit-buyer",algorithms:["HS256"]}); if(typeof payload.sub!=="string") return null;
 const rows=await prisma.$queryRaw<License[]>`SELECT * FROM "Build6ToolkitLicense" WHERE "id"=${payload.sub}`; const l=rows[0];
 if(!l || !eligible(l.status,l.termsVersion,TOOLKIT.termsVersion) || payload.v!==l.sessionVersion) return null; return l;
 } catch { return null; }
}
export async function throttle(key:string) { const rows=await prisma.$queryRaw<{count:number}[]>`INSERT INTO "Build6ToolkitAttempt" ("key","count") VALUES (${key},1) ON CONFLICT ("key") DO UPDATE SET "count"=CASE WHEN "Build6ToolkitAttempt"."windowStart" < now()-interval '15 minutes' THEN 1 ELSE "Build6ToolkitAttempt"."count"+1 END, "windowStart"=CASE WHEN "Build6ToolkitAttempt"."windowStart" < now()-interval '15 minutes' THEN now() ELSE "Build6ToolkitAttempt"."windowStart" END RETURNING "count"`; if(rows[0].count>10) throw new Error("Too many attempts. Try again in 15 minutes."); }
