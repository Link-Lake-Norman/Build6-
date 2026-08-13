import type { ReactNode } from "react";
import { redirect, notFound } from "next/navigation";
import { authorizeStudentAccess } from "@/lib/auth/student-access";

export default async function StudentPassportSecurityLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const access = await authorizeStudentAccess(id);

  if (!access.allowed) {
    if (access.status === 401) {
      redirect("/ambassador/login");
    }

    if (access.status === 404) {
      notFound();
    }

    redirect("/student-portal");
  }

  return children;
}
