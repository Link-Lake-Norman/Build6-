import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";

export default async function StudentRedirect() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/ambassador/login");
  }

  if (
    session.role === "STUDENT" &&
    session.studentId
  ) {
    redirect(
      `/ambassador/student-portal/${session.studentId}`
    );
  }

  redirect("/ambassador/facilitator/students");
}
