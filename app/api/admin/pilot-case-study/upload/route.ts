import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSessionUser } from "@/lib/auth/session";
import { HEADERS, PREFIX, metadata, validId, saveRecord, sameOrigin, ready } from "@/lib/build6-pilot-evidence";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const types=["image/jpeg","image/png","image/webp","image/heic","video/mp4","video/quicktime","video/webm","application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","text/plain","message/rfc822","text/csv","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
export async function POST(request:Request){
 try{
  const body=await request.json() as HandleUploadBody;
  const result=await handleUpload({body,request,
   onBeforeGenerateToken:async(pathname,clientPayload)=>{
    const u=await getSessionUser();if(!u || u.role!=="SUPER_ADMIN")throw new Error("Owner administrator access required");
    if(!sameOrigin(request))throw new Error("Invalid request origin");
    if(!ready())throw new Error("Private upload storage is not configured");
    const input=JSON.parse(clientPayload||"{}");const m=metadata(input);
    const id=pathname.slice(PREFIX.length).split("/")[1];
    if(!validId(id) || !new RegExp("^build6/pilot-case-study/files/[a-f0-9-]{36}/[a-zA-Z0-9._-]{1,140}$").test(pathname))throw new Error("Invalid file path");
    if(typeof input.originalName!=="string" || input.originalName.length>240)throw new Error("Invalid filename");
    return {allowedContentTypes:types,maximumSizeInBytes:250*1024*1024,addRandomSuffix:false,allowOverwrite:false,validUntil:Date.now()+5*60*1000,tokenPayload:JSON.stringify({...m,id,pathname,originalName:input.originalName,date:new Date().toISOString(),state:"ready",ownerId:u.id})};
   },
   onUploadCompleted:async({blob,tokenPayload})=>{
    // handleUpload verifies the Blob callback signature. No browser session is expected here.
    const e=JSON.parse(tokenPayload||"{}");if(blob.pathname!==e.pathname || !validId(e.id))throw new Error("Upload does not match authorization");
    await saveRecord(e);
   }
  });return Response.json(result,{headers:HEADERS});
 }catch{return Response.json({error:"Upload could not be authorized or recorded. Confirm owner access, private storage, type, and size."},{status:400,headers:HEADERS});}
}
