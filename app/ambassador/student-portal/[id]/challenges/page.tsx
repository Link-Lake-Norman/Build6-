import { notFound,redirect } from "next/navigation";
import StudentChallengeGame from "@/components/student/StudentChallengeGame";
import { authorizeStudentAccess } from "@/lib/auth/student-access";
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const a=await authorizeStudentAccess(id);if(!a.allowed){if(a.status===401)redirect('/ambassador/login');if(a.status===404)notFound();redirect('/ambassador')}if(a.session.role!=='STUDENT')redirect(`/ambassador/student-portal/${id}`);return <main className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-8"><StudentChallengeGame studentId={id}/></main>}
