import "server-only";
import { get, put, list } from "@vercel/blob";
import { randomUUID } from "node:crypto";

export const PREFIX = "build6/pilot-case-study/";
export const CATEGORIES = ["media", "videos", "documents", "emails", "assignments", "results", "notes"] as const;
export type Category = typeof CATEGORIES[number];
export type Evidence = { id: string; category: Category; title: string; notes: string; week: string; date: string | null; originalName: string; pathname: string; ownerId?: string; state: "ready" | "pending" };
export const seed: Evidence = { id: "tyler-tour-email", category: "emails", title: "Tyler Williams · Facility tour thank-you", notes: "Original text provided by Jaime. Email send date not provided. Private evidence; publication permission not recorded. Student reports interest in labs and construction technology; this is qualitative feedback, not a measured outcome.", week: "", date: null, originalName: "Tyler-Williams-Facility-Tour-Thank-You.txt", pathname: "seed", state: "ready" };
export const HEADERS = { "Cache-Control": "private, no-store, max-age=0", "X-Robots-Tag": "noindex, nofollow, noarchive", "X-Content-Type-Options": "nosniff" };
export const ready = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
export function sameOrigin(req: Request) { const origin=req.headers.get("origin");return origin===new URL(req.url).origin; }
export function metadata(input: unknown) {
  if (!input || typeof input!=="object") throw new Error("Evidence details are required.");
  const v=input as Record<string, unknown>;
  const text=(key:string,n:number)=>typeof v[key]==="string" ? (v[key] as string).trim().slice(0,n):"";
  const category=text("category",30) as Category;
  if (!CATEGORIES.includes(category)) throw new Error("Choose a valid category.");
  const title=text("title",160);if(!title) throw new Error("A title is required.");
  const week=text("week",2);if(week && (!/^\d+$/.test(week) || Number(week)<1 || Number(week)>16))throw new Error("Week must be 1–16 or blank.");
  return {category,title,week,notes:text("notes",3000)};
}
export const validId=(id:string)=>/^[a-f0-9-]{36}$/.test(id);
export const recordPath=(id:string)=>PREFIX+"records/"+id+".json";
export async function saveRecord(e:Evidence) { if(!validId(e.id) || !e.pathname.startsWith(PREFIX+"files/"+e.id+"/")) throw new Error("Invalid evidence record.");await put(recordPath(e.id),JSON.stringify(e),{access:"private",contentType:"application/json",addRandomSuffix:false,allowOverwrite:true}); }
export async function readRecord(id:string):Promise<Evidence|null> {
  if(!validId(id))return null;
  const r=await get(recordPath(id),{access:"private",useCache:false});
  if(!r || r.statusCode!==200)return null;
  const e=JSON.parse(await new Response(r.stream).text()) as Evidence;
  if(e.id!==id || !e.pathname.startsWith(PREFIX+"files/"+id+"/") || !CATEGORIES.includes(e.category)) throw new Error("Invalid evidence record.");return e;
}
export async function evidenceList(cursor?:string) {
  const batch=await list({prefix:PREFIX+"records/",limit:100,cursor});
  const records=await Promise.all(batch.blobs.map(b=>readRecord(b.pathname.split("/").pop()!.replace(/\.json$/,""))));
  return {items:records.filter((e):e is Evidence=>Boolean(e)).sort((a,b)=>(b.date||"").localeCompare(a.date||"")),cursor:batch.hasMore?batch.cursor:null};
}
export async function saveNote(input:unknown,userId:string) {
 const m=metadata(input);const v=input as Record<string,unknown>;const text=typeof v.text==="string"?v.text:"";
 if(!text.trim() || text.length>20000)throw new Error("Paste 1–20,000 characters of text.");
 const id=randomUUID();const pathname=PREFIX+"files/"+id+"/note.txt";
 await put(pathname,text,{access:"private",contentType:"text/plain",addRandomSuffix:false});
 const e:Evidence={...m,id,ownerId:userId,date:new Date().toISOString(),originalName:"note.txt",pathname,state:"ready"};
 // Date records saving time, not the original event or email send time.
 await saveRecord(e);return e;
}
