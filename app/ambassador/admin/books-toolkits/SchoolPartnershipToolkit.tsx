"use client";
import { useState } from "react";
const deck = "https://docs.google.com/presentation/d/1eTlqpu8Dj17gdZ0UH3270qo1bCCnxw4vAUc-nGn7Nak";
const viewer = "/toolkits/school-partnership/index.html";
const pdf = "/toolkits/school-partnership/BUILD6-School-Partnership.pdf";
export default function SchoolPartnershipToolkit() {
  const [notice, setNotice] = useState("");
  const button = "rounded-xl bg-[#0D1B3D] px-4 py-3 font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";
  async function copyLink() {
    try { await navigator.clipboard.writeText(new URL(viewer, window.location.origin).href); setNotice("Website link copied."); }
    catch { setNotice("Copy the address from the website slideshow tab."); }
  }
  function email() {
    const link = new URL(viewer, window.location.origin).href;
    const download = new URL(pdf, window.location.origin).href;
    const subject = "BUILD6 school and student-athlete partnership";
    const body = `I wanted to share this BUILD6 overview of school and student-athlete pathways, workshop formats, and partnership options.\n\nView or present: ${link}\nDownload the PDF: ${download}\n\nLet’s discuss the right scope for your students.`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="partnership-toolkit-title">
    <p className="text-sm font-bold text-[#087f94]">PRESENTATIONS &amp; PARTNERSHIP TOOLKITS</p>
    <h2 id="partnership-toolkit-title" className="mt-3 text-2xl font-black">K–12 &amp; Student-Athlete School Partnership</h2>
    <p className="mt-3 max-w-3xl leading-7 text-slate-700">16 slides covering student outcomes, age-specific pathways, athlete readiness, workshop formats, school responsibilities, and next steps.</p>
    <div className="mt-5 flex flex-wrap gap-3">
      <a className={button} href={viewer} target="_blank" rel="noopener noreferrer">View / Present on Website</a>
      <a className={button} href={pdf} download="BUILD6-School-Partnership.pdf">Download PDF</a>
      <a className={button} href={`${deck}/edit`} target="_blank" rel="noopener noreferrer">Edit Google Slides</a>
      <a className={button} href={`${deck}/present`} target="_blank" rel="noopener noreferrer">Present Google Slides</a>
      <button className={button} type="button" onClick={copyLink}>Copy Website Link</button>
      <button className={button} type="button" onClick={email}>Share by Email</button>
    </div>
    <p className="mt-4 text-sm leading-6 text-slate-600">The website slideshow and PDF are shareable resources. Google Slides keeps its existing access permissions. Books and paid drafts retain their separate launch controls.</p>
    <p className="mt-2 text-sm font-semibold text-[#087f94]" role="status" aria-live="polite">{notice}</p>
  </section>;
}
