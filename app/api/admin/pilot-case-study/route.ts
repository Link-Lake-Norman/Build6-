import { getSessionUser } from "@/lib/auth/session";
import { HEADERS, seed, ready, evidenceList, sameOrigin, saveNote } from "@/lib/build6-pilot-evidence";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(req:Request){
 const u=await getSessionUser();if(!u)return Response.json({error:"Authentication required"},{status:401,headers:HEADERS});if(u.role!=="SUPER_ADMIN")return Response.json({error:"Owner administrator access required"},{status:403,headers:HEADERS});
 const cursor=new URL(req.url).searchParams.get("cursor")||undefined;
 if(!ready())return Response.json({items:cursor?[]:[seed],cursor:null,storageReady:false,error:"Private upload storage is not configured."},{headers:HEADERS});
 try{const page=await evidenceList(cursor);return Response.json({...page,items:cursor?page.items:[seed,...page.items],storageReady:true},{headers:HEADERS});}
 catch{return Response.json({items:cursor?[]:[seed],cursor:null,storageReady:false,error:"Private storage could not be reached. Existing saved files have not been removed."},{headers:HEADERS});}
}
export async function POST(req:Request){
 const u=await getSessionUser();if(!u)return Response.json({error:"Authentication required"},{status:401,headers:HEADERS});if(u.role!=="SUPER_ADMIN")return Response.json({error:"Owner administrator access required"},{status:403,headers:HEADERS});
 if(!sameOrigin(req))return Response.json({error:"Invalid request origin"},{status:403,headers:HEADERS});
 if(!ready())return Response.json({error:"Private upload storage is not configured"},{status:503,headers:HEADERS});
 if(Number(req.headers.get("content-length")||0)>100000)return Response.json({error:"Text request too large"},{status:413,headers:HEADERS});
 try{const item=await saveNote(await req.json(),u.id);return Response.json({item},{status:201,headers:HEADERS});}
 catch{return Response.json({error:"Unable to save. Check the title, category, week, and text, then retry."},{status:400,headers:HEADERS});}
}
