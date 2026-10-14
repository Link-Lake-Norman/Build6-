"use client";
import { useMemo, useState } from "react";
import { DAY_ONE_QUESTIONS, READINESS_SCALE } from "@/content/day-one-readiness";
import { generateDiscoveryCareers } from "@/content/career-intelligence";

const REPORT_PAYMENT_URL = "https://connect.intuit.com/pay/LinkLakeNorman/scs-v1-b312abc8dd1646808d0010783387168a9e19d6b46d5a472c98c2e18ddc57bafc556baacda9a843a08a85797dbfba87fa-0?locale=EN_US&cta=saveandcopylink";
const CONSULTATION_PAYMENT_URL = "https://connect.intuit.com/pay/LinkLakeNorman/scs-v1-52db2d5429a9443c817e94eb67c1d06eccfc624542d948b487630e503b40859e12d20836ed244a468643f14b30b42799-1?locale=EN_US&cta=saveandcopylink";
const CONSULTATION_BOOKING_URL = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ32hj7UJuSiKBBYU_7lMINZNOuBiEBWTfipUoXnjhYTZ_F2NjRhgZzAMOPndtiYhPwFYsXK5Lfn?gv=true";
const LABELS: Record<string,string> = { SELF_AWARENESS:"Self Awareness", COMMUNICATION:"Communication", LEADERSHIP:"Leadership", PROFESSIONAL_PRESENCE:"Professional Presence", CAREER_READINESS:"Career Readiness", ADAPTABILITY:"Adaptability", AI_READINESS:"AI Readiness" };

export default function PublicAssessmentForm() {
  const [answers,setAnswers] = useState<Record<number,number>>({});
  const [profile,setProfile] = useState({ firstName:"",lastName:"",email:"",audienceType:"STUDENT",ageBand:"16_PLUS",gradeLevel:"",careerStage:"",schoolOrganization:"",guardianName:"",guardianEmail:"",consent:false });
  // Career inputs are saved to the original assessment only after consent and explicit submission.
  const [exploration,setExploration] = useState({strengths:"",interests:"",values:"",goals:""});
  const [showCareers,setShowCareers] = useState(false);
  const [careerSaving,setCareerSaving] = useState(false);
  const [careerError,setCareerError] = useState("");
  const [savedCareers,setSavedCareers] = useState<ReturnType<typeof generateDiscoveryCareers>>([]);
  const [personalCv,setPersonalCv] = useState<File|null>(null);
  const [resume,setResume] = useState<File|null>(null);
  const [experience,setExperience] = useState({years:"",education:"",seniority:""});
  const [documentConsent,setDocumentConsent] = useState(false);
  const [careerLevel,setCareerLevel] = useState("");
  const [error,setError] = useState("");
  const [saving,setSaving] = useState(false);
  const [result,setResult] = useState<{id:string;careerClaimToken:string;overallScore:number;categoryScores:Record<string,number>}|null>(null);
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

  async function saveCareerResults() {
    if (!result || careerSaving || showCareers) return;
    setCareerError(""); setCareerSaving(true);
    try {
      const response = await fetch("/api/public/readiness", {
        method: "PATCH", body: (()=>{const form=new FormData();
          form.append("id",result.id);form.append("careerClaimToken",result.careerClaimToken);
          form.append("exploration",JSON.stringify(exploration));
          form.append("experience",JSON.stringify(experience));
          form.append("documentConsent",String(documentConsent));
          if(personalCv)form.append("personalCv",personalCv);
          if(resume)form.append("resume",resume);
          return form;})(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save career results.");
      setSavedCareers(data.recommendations);
      setCareerLevel(data.experienceLevel || "");
      setShowCareers(true);
    } catch (e) { setCareerError(e instanceof Error ? e.message : "Unable to save career results."); }
    finally { setCareerSaving(false); }
  }

  if(result) return <section className="b6-public-assessment-result" style={{maxWidth:1100,margin:"0 auto",padding:"24px 16px"}}>
    <p className="eyebrow">YOUR BUILD6™ STARTING POINT</p>
    <h1>{result.overallScore}% readiness baseline</h1>
    <p>This is a starting point—not a grade. Use it to identify strengths and what to build next.</p>
    <div className="b6-result-grid">{Object.entries(result.categoryScores).map(([key,value])=><article key={key}><strong>{value}%</strong><span>{LABELS[key]??key}</span></article>)}</div>
    <section aria-labelledby="b6-career-heading" style={{marginTop:36,padding:"24px",border:"2px solid #0f766e",borderRadius:18,background:"#f0fdfa",color:"#0d1b3d"}}>
      <p className="eyebrow">EXPLORE BEYOND THE FAMILIAR</p>
      <h2 id="b6-career-heading" style={{fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:800}}>Discover six careers you may not have considered</h2>
      <p style={{fontSize:"1.05rem",lineHeight:1.65}}>Your readiness scores show skills to build, not which careers fit you. Add a few interests, strengths, values and goals to explore six possibilities. No additional account is required.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,260px),1fr))",gap:16,marginTop:20}}>
        {([ ["strengths","My strengths","For example: organizing, helping others, problem solving"], ["interests","My interests","For example: sports, healthcare, design, technology"], ["values","What matters to me","For example: teamwork, creativity, service"], ["goals","What I want to explore","For example: working outdoors, business, community impact"] ] as const).map(([field,label,placeholder])=><label key={field} style={{display:"grid",gap:6,fontWeight:700}}>{label}<textarea value={exploration[field]} placeholder={placeholder} rows={3} maxLength={500} onChange={e=>{setExploration(current=>({...current,[field]:e.target.value}));if(!showCareers)setCareerError("");}} style={{width:"100%",padding:12,border:"1px solid #64748b",borderRadius:8,fontSize:"1rem",background:"white",color:"#0d1b3d"}}/></label>)}
      </div>
      <fieldset disabled={showCareers || careerSaving} style={{marginTop:20,padding:16,border:"1px solid #99d5ce",borderRadius:12}}>
        <legend style={{fontWeight:800,fontSize:"1.2rem"}}>Optional: Tell us more about you</legend>
        <p>Upload a personal CV/About Me document describing your authentic personality, interests, values and experiences, and/or a general resume. PDF, DOCX or TXT, maximum 3 MB each. Files are processed into text; originals are not retained.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,marginTop:12}}>
          <label>Personal CV / About Me<input aria-label="Personal CV or About Me" type="file" accept=".pdf,.docx,.txt" onChange={e=>setPersonalCv(e.target.files?.[0]||null)}/></label>
          <label>General resume<input aria-label="General resume" type="file" accept=".pdf,.docx,.txt" onChange={e=>setResume(e.target.files?.[0]||null)}/></label>
          <label>Years of relevant experience<input type="number" min="0" max="60" value={experience.years} onChange={e=>setExperience(v=>({...v,years:e.target.value}))}/></label>
          <label>Highest completed education<select value={experience.education} onChange={e=>setExperience(v=>({...v,education:e.target.value}))}><option value="">Prefer not to say</option><option>Some high school</option><option>High school / GED</option><option>Trade certificate</option><option>Some college</option><option>Associate degree</option><option>Bachelor degree</option><option>Master degree</option><option>Doctoral / professional degree</option></select></label>
          <label>Current career level<select value={experience.seniority} onChange={e=>setExperience(v=>({...v,seniority:e.target.value}))}><option value="">Exploring / prefer not to say</option><option>Student / first job</option><option>Entry level</option><option>Experienced individual contributor</option><option>Team lead / supervisor</option><option>Manager</option><option>Director</option><option>Executive</option><option>Career changer</option></select></label>
        </div>
        <label style={{display:"flex",gap:10,marginTop:16,alignItems:"flex-start"}}><input type="checkbox" checked={documentConsent} onChange={e=>setDocumentConsent(e.target.checked)}/><span>I consent to BUILD6 processing any documents I upload for career exploration and storing extracted text with my assessment for authorized administrators. I understand uploads are optional and should not contain sensitive identifiers.</span></label>
      </fieldset>
      <p style={{fontSize:"0.9rem",marginTop:12}}>Your exploration answers and six career recommendations will be saved with your assessment and visible to authorized BUILD6 administrators. Avoid entering private or sensitive information.</p>
      <button type="button" disabled={careerSaving || showCareers || (!!(personalCv||resume) && !documentConsent) || !Object.values(exploration).some(v=>v.trim())} onClick={saveCareerResults} style={{marginTop:16,padding:"14px 22px",borderRadius:10,background:"#0d1b3d",color:"white",fontWeight:800,fontSize:"1rem",cursor:"pointer",opacity:Object.values(exploration).some(v=>v.trim())?1:.55}}>{careerSaving ? "SAVING MY CAREERS..." : showCareers ? "SIX CAREERS SAVED" : "SHOW AND SAVE MY SIX CAREER IDEAS →"}</button>
      {careerError?<p role="alert" style={{color:"#991b1b",fontWeight:700,marginTop:12}}>{careerError}</p>:null}
      {showCareers?<div aria-live="polite" style={{marginTop:28}}>
        <h3 style={{fontSize:"1.5rem",fontWeight:800}}>Six exploratory career ideas</h3>
        {careerLevel?<p><strong>Experience-informed exploration:</strong> {careerLevel}. Review each role's actual qualification requirements; these are not eligibility decisions or live job listings.</p>:null}
        <p>These are possibilities to investigate, not career placement, eligibility decisions or verified training requirements.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,320px),1fr))",gap:18,marginTop:16}}>
          {savedCareers.map(career=><article key={career.title} style={{padding:20,border:"1px solid #99d5ce",borderRadius:14,background:"white"}}>
            <p style={{fontWeight:800,color:"#0f766e"}}>{career.industry}</p>
            <h4 style={{fontSize:"1.35rem",fontWeight:800,marginTop:5}}>{career.title}</h4>
            <p style={{lineHeight:1.65}}>{career.description}</p>

          </article>)}
        </div>
        <section aria-label="Explore your next steps" style={{marginTop:28,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,320px),1fr))",gap:18}}>
          <article style={{padding:24,border:"2px solid #0f766e",borderRadius:16,background:"#fff"}}>
            <p className="eyebrow">LIKE WHAT YOU SEE? GET DEEPER RESULTS</p>
            <h4 style={{fontSize:"1.5rem",fontWeight:800}}>Your detailed career report — $15</h4>
            <p>Unlock a deeper look at your career pathways, the skills and qualifications needed for your goals, and opportunities that can help you take the next step. Get personalized insights to understand where you fit and what to build next.</p>
            <p style={{fontSize:"0.95rem"}}>After payment, include your assessment reference <strong>{result.id}</strong> and the email you used for the assessment when contacting BUILD6. Reports are delivered after payment verification; checkout does not automatically unlock results.</p>
            <a href={REPORT_PAYMENT_URL} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",padding:"13px 20px",background:"#0d1b3d",color:"#fff",borderRadius:10,fontWeight:800}}>Purchase the $15 report →</a>
          </article>
          <article style={{padding:24,border:"2px solid #0d1b3d",borderRadius:16,background:"#fff"}}>
            <p className="eyebrow">ONE-ON-ONE CAREER GUIDANCE</p>
            <h4 style={{fontSize:"1.5rem",fontWeight:800}}>Personalized career consultation — $200</h4>
            <p>Book a one-hour consultation to explore pathways aligned with your interests and goals, skills and qualifications you may need, and opportunities to move forward. Leave with practical insights and a clearer next-step plan.</p>
            <p style={{fontSize:"0.95rem"}}>Complete payment and then select an available appointment. Payment and scheduling are separate; please use the same email for both.</p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <a href={CONSULTATION_PAYMENT_URL} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",padding:"13px 20px",background:"#0d1b3d",color:"#fff",borderRadius:10,fontWeight:800}}>Pay for consultation →</a>
              <a href={CONSULTATION_BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",padding:"13px 20px",border:"2px solid #0d1b3d",color:"#0d1b3d",borderRadius:10,fontWeight:800}}>Book your appointment →</a>
            </div>
          </article>
        </section>
        <p style={{marginTop:14,fontSize:"0.95rem"}}>Please confirm the amount shown at each Intuit checkout before paying. For paid report delivery or booking questions, email <a href="mailto:info@build6.education" style={{textDecoration:"underline"}}>info@build6.education</a> with your assessment reference <strong>{result.id}</strong>. Do not email sensitive CV or résumé information.</p>
        <p style={{marginTop:18}}>Already enrolled? <a href="/ambassador/login?next=/ambassador/student" style={{textDecoration:"underline"}}>Sign in to your student portal</a> to save and continue exploring careers.</p>
      </div>:null}
    </section>
    <p style={{marginTop:28}}>Questions? <a href="mailto:info@build6.education">info@build6.education</a>.</p>
  </section>;

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
