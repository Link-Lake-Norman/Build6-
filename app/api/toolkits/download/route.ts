import {buyer,event} from "@/lib/toolkits/access";
import {renderGuide} from "@/lib/toolkits/guide";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(){const l=await buyer();const headers={"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer"};if(!l)return new Response("Toolkit sign-in and an active license are required.",{status:401,headers});const origin=process.env.BUILD6_TOOLKIT_ORIGIN;if(!origin)return new Response("Delivery not configured.",{status:503,headers});await event(l.id,"DOWNLOAD");return new Response(renderGuide(l.name,l.id,origin),{headers:{...headers,"Content-Type":"text/html; charset=utf-8","Content-Disposition":'attachment; filename="BUILD6-Facilitator-Session-Kit.html"',"Content-Security-Policy":"default-src 'none'; img-src https:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"}});}
