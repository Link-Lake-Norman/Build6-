import { redirect, notFound } from "next/navigation";
import { authorizeStudentAccess } from "@/lib/auth/student-access";

type Props = { params: Promise<{ id: string }> };

export default async function FridayLifeAccount({ params }: Props) {
  const { id } = await params;
  const access = await authorizeStudentAccess(id);

  if (!access.allowed) {
    if (access.status === 401) redirect("/ambassador/login");
    if (access.status === 404) notFound();
    redirect("/student-portal");
  }

  redirect(
    `/ambassador/student-portal/${encodeURIComponent(id)}/companion/journal?entry=friday`
  );
}
