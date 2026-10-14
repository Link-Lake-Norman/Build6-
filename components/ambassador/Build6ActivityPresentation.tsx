"use client";

import { useState } from "react";
import type { AIGeneratedActivity } from "@/content/ai-activity-types";

type Props = { activity: AIGeneratedActivity; week: number; day: string };

const colors = ["#07818B", "#D66A12", "#8139D9"];

function normalizeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 66);
}

export default function Build6ActivityPresentation({ activity, week, day }: Props) {
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const cases = activity.presentationCases ?? [];

  async function downloadPptx() {
    if (!cases.length || busy) return;
    setBusy(true);
    setError("");
    try {
      const { default: PptxGenJS } = await import("pptxgenjs");
      const pptx = new PptxGenJS();
      pptx.layout = "LAYOUT_WIDE";
      pptx.author = "LINK Lake Norman, LLC";
      pptx.subject = `BUILD6™ Week ${week} ${day}`;
      pptx.title = activity.title;
      pptx.company = "LINK Lake Norman, LLC";
      const slide = pptx.addSlide();
      slide.background = { color: "F8F7F1" };
      const shape = pptx.ShapeType;
      const rect = (x:number,y:number,w:number,h:number,fill:string,radius=0) => {
        slide.addShape(radius ? shape.roundRect : shape.rect, {
          x,y,w,h,
          line:{color:fill,transparency:100},fill:{color:fill.replace('#','')}
        });
      };
      const txt = (text:string,x:number,y:number,w:number,h:number,size=10,color="10233E",bold=false,other:Record<string,unknown>={}) => {
        slide.addText(text,{x,y,w,h,fontFace:"Aptos",fontSize:size,color:color.replace('#',''),bold,margin:0,
          breakLine:false, valign:"top",...other});
      };
      rect(0,0,13.333,1.05,"0D203A");
      txt(activity.activityType.toUpperCase() + " · WEEK " + week,0.39,0.14,5,0.23,9,"F6C344",true);
      txt(activity.title,0.39,0.39,8.5,0.44,21,"FFFFFF",true);
      rect(0,1.04,13.333,0.075,"E0AC28");
      txt(`TIME: ${activity.durationMinutes ?? 12} MINUTES     ROLES: TEAM LEAD  ·  COLLEAGUE  ·  OBSERVER`,0.45,1.19,12.45,0.26,10,"163B5A",true,{align:"center"});
      const cardW=4.03, y=1.55, cardH=4.24, gap=0.18;
      cases.slice(0,3).forEach((c,i)=>{
        const x=0.38+i*(cardW+gap);
        rect(x,y,cardW,cardH,"FFFFFF",0.08);
        slide.addShape(shape.rect,{x,y,w:cardW,h:0.11,line:{transparency:100},fill:{color:colors[i].slice(1)}});
        txt(`GROUP ${i+1}  •  ${c.industry.toUpperCase()}`,x+0.17,y+0.23,cardW-0.34,0.21,9,colors[i],true);
        txt(c.workplace,x+0.17,y+0.51,cardW-0.34,0.35,15,"10233E",true);
        txt("SITUATION",x+0.17,y+1.03,cardW-0.34,0.22,8,"596579",true);
        txt(c.situation,x+0.17,y+1.26,cardW-0.34,0.85,10,"28364A");
        txt("YOUR JOB",x+0.17,y+2.14,cardW-0.34,0.20,8,"596579",true);
        txt(c.tasks.map(t=>"• "+t).join("\n"),x+0.17,y+2.35,cardW-0.34,0.79,9,"28364A");
        txt("REMINDER: "+c.reminder,x+0.17,y+3.17,cardW-0.34,0.35,8,"0D4668",true);
        rect(x+0.12,y+3.58,cardW-0.24,0.54,"FFF2CC",0.06);
        txt("TWIST: "+c.twist,x+0.22,y+3.70,cardW-0.44,0.34,8.5,"875115",true);
      });
      rect(0.38,5.94,8.12,0.98,"E8F4F5",0.06);
      txt("OBSERVER CHECKLIST",0.57,6.07,2.8,0.21,12,"103F60",true);
      txt("□ Risk identified    □ Clear communication    □ Right person informed\n□ Realistic response    □ Safety & trust protected    □ Adapted to twist",0.57,6.35,7.68,0.48,8.4,"18344B");
      rect(8.67,5.94,4.28,0.98,"0D203A",0.06);
      txt("FINAL QUESTION · DEFEND YOUR DECISION",8.89,6.08,3.84,0.22,9,"E6B32D",true,{align:"center"});
      txt("What made your team's response the most professional choice?",8.9,6.38,3.82,0.46,11,"FFFFFF",true,{align:"center"});
      txt("© Link Lake Norman, LLC — All Rights Reserved",0.39,7.2,6.2,0.15,7.5,"64748B");
      try {
        const response = await fetch("/brand/build6-horizontal-lockup.png",{cache:"force-cache"});
        if (response.ok) {
          const blob = await response.blob();
          const imgData = await new Promise<string>((resolve,reject)=>{
            const reader = new FileReader();
            reader.onload=()=>resolve(String(reader.result));
            reader.onerror=()=>reject(new Error("Could not read official logo"));
            reader.readAsDataURL(blob);
          });
          slide.addImage({data:imgData,x:11.18,y:7.03,w:1.75,h:0.35});
        } else throw new Error("Logo unavailable");
      } catch {
        // Do not export an unbranded slide if the approved asset is unavailable.
        throw new Error("Official BUILD6 logo was unavailable. Refresh and try again.");
      }
      await pptx.writeFile({fileName:`BUILD6-Week${week}-${normalizeFilename(day)}-${normalizeFilename(activity.activityType)}.pptx`});
    } catch(e) { setError(e instanceof Error ? e.message : "PowerPoint download failed."); }
    finally { setBusy(false); }
  }

  if (!cases.length) return null;
  const slide = (
    <div className="bg-[#F8F7F1] text-[#11243c] w-full" style={{aspectRatio:"16 / 9",containerType:"inline-size",overflow:"hidden"}}>
      <div className="h-[14%] bg-[#0D203A] text-white px-[3%] py-[1.5%] flex items-center justify-between gap-[3%] border-b-[0.7cqw] border-[#E0AC28]">
        <div className="min-w-0"><div className="font-black uppercase text-[#F6C344]" style={{fontSize:"1.15cqw"}}>BUILD6™ · Week {week} · {activity.activityType}</div><div className="font-extrabold leading-tight" style={{fontSize:"2.15cqw"}}>{activity.title}</div></div>
        <div className="max-w-[36%] rounded-xl bg-white/5 p-[1.3%] font-bold" style={{fontSize:"1.1cqw"}}>MISSION: Solve a realistic workplace problem — no script.</div>
      </div>
      <div className="h-[5%] text-center font-black text-[#163B5A] pt-[0.6%]" style={{fontSize:"1.2cqw"}}>Time: {activity.durationMinutes ?? 12} minutes &nbsp; Roles: Team Lead • Colleague • Observer</div>
      <div className="h-[65%] grid grid-cols-3 gap-[1.15%] px-[2%] pt-[0.6%]">
        {cases.slice(0,3).map((c,i)=><div key={c.id} className="min-w-0 rounded-lg bg-white border border-slate-200 flex flex-col overflow-hidden">
          <div className="h-[2%]" style={{backgroundColor:colors[i]}}/>
          <div className="px-[4%] py-[3%] flex flex-col h-full gap-[1.5%]">
            <div className="font-bold uppercase" style={{color:colors[i],fontSize:"1cqw"}}>Group {i+1} · {c.industry}</div>
            <div className="font-black leading-tight" style={{fontSize:"1.42cqw"}}>{c.workplace}</div>
            <div className="text-slate-500 font-black uppercase mt-[1%]" style={{fontSize:"0.82cqw"}}>Situation</div>
            <div className="leading-snug" style={{fontSize:"1.03cqw"}}>{c.situation}</div>
            <div className="text-slate-500 font-black uppercase mt-[1%]" style={{fontSize:"0.82cqw"}}>Your job</div>
            <ul className="leading-snug" style={{fontSize:"1.02cqw",paddingLeft:"1.2cqw",listStyle:"disc"}}>{c.tasks.map((t,j)=><li key={j}>{t}</li>)}</ul>
            <div className="font-bold mt-auto" style={{fontSize:"0.95cqw",color:"#16516B"}}>Reminder: {c.reminder}</div>
            <div className="rounded-lg bg-[#FFF2CC] border border-[#F2CB63] p-[2%] font-bold" style={{fontSize:"0.93cqw",color:"#875115"}}>TWIST: {c.twist} {c.question}</div>
          </div>
        </div>)}
      </div>
      <div className="h-[11%] flex gap-[1.3%] px-[2%] pt-[1.1%]">
        <div className="basis-2/3 bg-[#E8F4F5] rounded-lg px-[2%] py-[1.5%]"><div className="font-black" style={{fontSize:"1.25cqw"}}>Observer Checklist</div><div style={{fontSize:"0.98cqw"}}>□ Risk identified &nbsp; □ Clear communication &nbsp; □ Right person informed<br/>□ Realistic solution &nbsp; □ Safety and trust protected &nbsp; □ Adapted to twist</div></div>
        <div className="basis-1/3 rounded-lg bg-[#0D203A] text-white text-center px-[2%] py-[1.6%]"><div className="font-black text-[#F2B705]" style={{fontSize:"1cqw"}}>FINAL QUESTION</div><div className="font-bold" style={{fontSize:"1.06cqw"}}>Defend your decision. What made it professional?</div></div>
      </div>
      <div className="h-[5%] flex items-center justify-between px-[2%] text-slate-500" style={{fontSize:"0.75cqw"}}><span>© Link Lake Norman, LLC — All Rights Reserved</span><img src="/brand/build6-horizontal-lockup.png" alt="Official BUILD6™ logo" className="max-w-[16%] h-[80%] object-contain object-right"/></div>
    </div>
  );

  return <div className="mt-5 space-y-2">
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={()=>setPreview(true)} className="rounded-lg bg-[#0D203A] px-4 py-2 font-bold text-white">Preview / Present</button>
      <button type="button" onClick={downloadPptx} disabled={busy} className="rounded-lg bg-[#EFBF43] px-4 py-2 font-bold text-[#0D203A] disabled:opacity-60">{busy?"Building PPTX...":"Download Editable PPTX"}</button>
    </div>
    {error && <p role="alert" className="text-red-700 text-sm">{error}</p>}
    {preview && <div role="dialog" aria-modal="true" aria-label="BUILD6 classroom presentation" className="fixed inset-0 z-[200] flex flex-col bg-black/95 p-3 sm:p-7">
      <div className="flex justify-end gap-3 pb-3"><button type="button" onClick={()=>document.documentElement.requestFullscreen?.()} className="text-white border border-white/30 rounded-lg px-4 py-2">Full Screen</button><button type="button" onClick={downloadPptx} className="text-white border border-white/30 rounded-lg px-4 py-2">Download PPTX</button><button type="button" onClick={()=>setPreview(false)} className="text-white bg-red-700 rounded-lg px-4 py-2">Close</button></div>
      <div className="w-full max-w-[1650px] mx-auto my-auto">{slide}</div>
    </div>}
  </div>;
}
