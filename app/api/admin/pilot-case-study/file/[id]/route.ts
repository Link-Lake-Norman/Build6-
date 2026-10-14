import { readFile } from "node:fs/promises";
import path from "node:path";
import { get } from "@vercel/blob";
import { getSessionUser } from "@/lib/auth/session";
import { HEADERS, readRecord, seed } from "@/lib/build6-pilot-evidence";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
 const u=await getSessionUser();if(!u)return new Response("Authentication required",{status:401,headers:HEADERS});if(u.role!=="SUPER_ADMIN")return new Response("Owner administrator access required",{status:403,headers:HEADERS});
 try{
  const {id}=await params;
  if(id===seed.id){const bytes=await readFile(path.join(process.cwd(),"protected-resources/pilot-case-study",seed.originalName));return new Response(new Uint8Array(bytes),{headers:{...HEADERS,"Content-Type":"text/plain; charset=utf-8","Content-Disposition":`attachment; filename="${seed.originalName}"`}});}
  const e=await readRecord(id);if(!e || e.state!=="ready")return new Response("Evidence not found",{status:404,headers:HEADERS});
  const r=await get(e.pathname,{access:"private"});if(!r || r.statusCode!==200)return new Response("Evidence not found",{status:404,headers:HEADERS});
  const filename=e.originalName.replace(/[^a-zA-Z0-9._-]/g,"-").slice(0,140)||"evidence-file";
  return new Response(r.stream,{headers:{...HEADERS,"Content-Type":r.blob.contentType||"application/octet-stream","Content-Disposition":`attachment; filename="${filename}"`}});
 }catch{return new Response("Unable to retrieve evidence",{status:503,headers:HEADERS});}
}
