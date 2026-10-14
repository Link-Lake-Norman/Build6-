import { createHash, randomBytes } from "crypto";

export const CHALLENGES = {
  FINISH_IT:{title:"Finish It",prompt:"Finish one BUILD6™ assignment or piece of work you committed to completing.",points:20,icon:"✅"},
  GO_BEYOND:{title:"Go Beyond",prompt:"Take one piece of work beyond the minimum with more depth, evidence, polish, or a stronger real-world connection.",points:40,icon:"🚀"},
  COMMUNITY_AMBASSADOR:{title:"Community Ambassador",prompt:"Take one positive action that helps your school, team, neighborhood, nonprofit, or community.",points:50,icon:"🌎"},
  LEARN_SHARE:{title:"Learn + Share",prompt:"Learn one useful skill and teach or share what you learned with someone else.",points:35,icon:"🧠"},
  FIND_OPPORTUNITY:{title:"Find an Opportunity",prompt:"Find one legitimate volunteer, work, internship, job-shadow, service, or career exploration opportunity.",points:50,icon:"🔎"},
  MAKE_CONNECTION:{title:"Make the Connection",prompt:"Make one appropriate professional connection and ask one thoughtful career or skill question.",points:40,icon:"🤝"},
  PROFESSIONAL_COURAGE:{title:"Professional Courage",prompt:"Speak up, present, ask a thoughtful question, introduce yourself, or practice your professional pitch.",points:35,icon:"🎤"},
  THANK_SOMEONE:{title:"Thank Someone",prompt:"Send a thoughtful professional thank-you to someone who helped you learn, grow, connect, or explore.",points:25,icon:"💛"},
  OWN_WEEK:{title:"Own Your Week",prompt:"Review your BUILD6™ portal and complete everything you are responsible for this week.",points:60,icon:"🏆"},
} as const;

export type ChallengeType = keyof typeof CHALLENGES;

export const CHALLENGE_SECURITY = {
  maxPerStudentPer24Hours: 10,
  maxExternalPerStudentPer24Hours: 5,
  maxActivePerStudent: 20,
  externalLinkLifetimeDays: 14,
  maxEvidenceChars: 1000,
  maxExternalEvidenceChars: 500,
} as const;

export function isChallengeType(v:unknown):v is ChallengeType {
  return typeof v === 'string' && Object.prototype.hasOwnProperty.call(CHALLENGES,v);
}
export function clean(v:unknown,max:number){return typeof v==='string'?v.replace(/\s+/g,' ').trim().slice(0,max):''}
export function safeNote(v:unknown){const x=clean(v,180);if(/https?:\/\//i.test(x)||/www\./i.test(x)||/\b\S+@\S+\.\S+\b/i.test(x)||/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(x))throw new Error('Challenge notes cannot include phone numbers, email addresses, or links.');return x}
export function newShareToken(){const raw=randomBytes(32).toString('base64url');return {raw,hash:hashShareToken(raw)}}
export function hashShareToken(raw:string){return createHash('sha256').update(raw).digest('hex')}
export function externalExpiryDate(){return new Date(Date.now()+CHALLENGE_SECURITY.externalLinkLifetimeDays*24*60*60*1000)}
export function challengeUnavailable(c:{status:string;expiresAt:Date|null;revokedAt:Date|null}){return c.status==='REVOKED'||Boolean(c.revokedAt)||Boolean(c.expiresAt&&c.expiresAt.getTime()<=Date.now())}
