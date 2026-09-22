"use client";
import { useMemo, useState } from "react";
import { DAY_ONE_QUESTIONS, READINESS_SCALE } from "@/content/day-one-readiness";

const LABELS: Record<string,string> = { SELF_AWARENESS:"Self Awareness", COMMUNICATION:"Communication", LEADERSHIP:"Leadership", PROFESSIONAL_PRESENCE:"Professional Presence", CAREER_READINESS:"Career Readiness", ADAPTABILITY:"Adaptability", AI_READINESS:"AI Readiness" };

export default function PublicAssessmentForm() {
  const [answers,setAnswers] = useState<Record<number,number>>({});
  const [profile,setProfile] = useState({ firstName:"",lastName:"",email:"",audienceType:"STUDENT",ageBand:"16_PLUS",gradeLevel:"",careerStage:"",schoolOrganization:"",guardianName:"",guardianEmail:"",consent:false });
  const [error,setError] = useState("");
  const [saving,setSaving] = useState(false);
  const [result,setResult] = useState<{overallScore:number;categoryScores:Record<string,number>}|null>(null);
  type PublicQuestion = { category: string; question: string; position: number };
  const groups = useMemo(() => {
    const m = new Map<string, PublicQuestion[]>();
    for (const q of DAY_ONE_QUESTIONS) {
      const list = m.get(q.category) ?? [];
      list.push({ category: q.category, question: q.question, position: q.position });
      m.set(q.category, list);
    }
    return [...m.entries()];
  }, []);

  async function submit() {
    setError("");
    if(Object.keys(answers).length!==DAY_ONE_QUESTIONS.length){setError(`Please answer all ${DAY_ONE_QUESTIONS.length} questions.`);return;}
    setSaving(true);
    try {
      const response=await fetch("/api/public/readiness",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...profile,answers:DAY_ONE_QUESTIONS.map(q=>({position:q.position,score:answers[q.position]}))})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||"Unable to save assessment.");
      setResult(data); window.scrollTo({top:0,behavior:"smooth"});
    } catch(e) { setError(e instanceof Error?e.message:"Unable to save assessment."); } finally { setSaving(false); }
  }

  if(result) return <section className="b6-public-assessment-result"><p className="eyebrow">YOUR BUILD6™ STARTING POINT</p><h1>{result.overallScore}% readiness baseline</h1><p>This is a starting point—not a grade. Use it to identify strengths and what to build next.</p><div className="b6-result-grid">{Object.entries(result.categoryScores).map(([key,value])=><article key={key}><strong>{value}%</strong><span>{LABELS[key]??key}</span></article>)}</div><p>Questions? <a href="mailto:build6info@linklakenorman.com">build6info@linklakenorman.com</a>.</p></section>;

  return <div className="b6-public-assessment">
    <section className="b6-assessment-start"><p className="eyebrow">TAKE THE FREE BUILD6™ ASSESSMENT</p><h1>Start with where you are.</h1><p>No account is required to begin. This is a growth baseline, not a pass/fail test.</p></section>
    {groups.map(([category,questions])=><section className="b6-question-group" key={category}><h2>{LABELS[category]??category}</h2>{questions.map(q=><div className="b6-question" key={q.position}><p><strong>{q.position}.</strong> {q.question}</p><div className="b6-scale">{READINESS_SCALE.map(item=><button type="button" key={item.value} className={answers[q.position]===item.value?"selected":""} onClick={()=>setAnswers(a=>({...a,[q.position]:item.value}))}><strong>{item.value}</strong><span>{item.label}</span></button>)}</div></div>)}</section>)}
    <section className="b6-assessment-profile"><p className="eyebrow">BEFORE WE DELIVER YOUR RESULTS</p><h2>Tell us who is taking the assessment.</h2><div className="b6-form-grid">
      <label>First name<input value={profile.firstName} onChange={e=>setProfile({...profile,firstName:e.target.value})}/></label>
      <label>Last name<input value={profile.lastName} onChange={e=>setProfile({...profile,lastName:e.target.value})}/></label>
      <label>Email<input type="email" value={profile.email} onChange={e=>setProfile({...profile,email:e.target.value})}/></label>
      <label>I am a<select value={profile.audienceType} onChange={e=>setProfile({...profile,audienceType:e.target.value})}><option value="STUDENT">Student</option><option value="ADULT">Adult / Career Professional</option></select></label>
      {profile.audienceType==="STUDENT"?<><label>Grade level<input value={profile.gradeLevel} onChange={e=>setProfile({...profile,gradeLevel:e.target.value})}/></label><label>Age<select value={profile.ageBand} onChange={e=>setProfile({...profile,ageBand:e.target.value})}><option value="16_PLUS">16 or older</option><option value="UNDER_16">Under 16</option></select></label></>:<label>Career stage<input value={profile.careerStage} onChange={e=>setProfile({...profile,careerStage:e.target.value})}/></label>}
      <label className="wide">School / organization (if applicable)<input value={profile.schoolOrganization} onChange={e=>setProfile({...profile,schoolOrganization:e.target.value})}/></label>
      {profile.audienceType==="STUDENT"&&profile.ageBand==="UNDER_16"?<><label>Parent / guardian name<input value={profile.guardianName} onChange={e=>setProfile({...profile,guardianName:e.target.value})}/></label><label>Parent / guardian email<input type="email" value={profile.guardianEmail} onChange={e=>setProfile({...profile,guardianEmail:e.target.value})}/></label></>:null}
    </div>
    <label className="b6-consent"><input type="checkbox" checked={profile.consent} onChange={e=>setProfile({...profile,consent:e.target.checked})}/><span>{profile.audienceType==="STUDENT"&&profile.ageBand==="UNDER_16"?"I am the parent/guardian and consent to this minor’s participation and storage of the submitted information for BUILD6 assessment and program purposes.":"I consent to BUILD6 storing the information I submit for assessment, program and follow-up purposes."}</span></label>
    {error?<p className="b6-assessment-error">{error}</p>:null}<button className="b6-submit-assessment" type="button" disabled={saving} onClick={submit}>{saving?"SAVING...":"SEE MY RESULTS →"}</button><p className="b6-existing-student">Already enrolled? <a href="/ambassador/login?next=/ambassador/student">Student Login</a></p>
    </section>
  </div>;
}
