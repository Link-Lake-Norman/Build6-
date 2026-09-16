import Link from "next/link";
import {
  notFound,
  redirect,
} from "next/navigation";

import StudentSupportAdminForm from "@/components/student/StudentSupportAdminForm";
import { authorizeStudentAccess } from "@/lib/auth/student-access";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StudentLearningSupportsPage({
  params,
}: PageProps) {
  const { id } = await params;
  const access = await authorizeStudentAccess(id);

  if (!access.allowed) {
    if (access.status === 401) {
      redirect("/ambassador/login");
    }

    if (access.status === 404) {
      notFound();
    }

    redirect("/ambassador");
  }

  if (access.session.role === "STUDENT") {
    redirect(
      `/ambassador/student-portal/${id}`,
    );
  }

  const student = await prisma.student.findUnique({
    where: { id },
    select: {
      id: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          displayName: true,
        },
      },
    },
  });

  if (!student) {
    notFound();
  }

  const studentName =
    student.user.displayName ??
    `${student.user.firstName} ${student.user.lastName}`.trim();

  return (
    <main className="space-y-6">
      <Link
        href={`/ambassador/student-portal/${student.id}`}
        className="inline-flex font-black text-[#4B2265]"
      >
        Back to {studentName}&apos;s portal
      </Link>

      <StudentSupportAdminForm
        studentId={student.id}
        studentName={studentName}
      />
    </main>
  );
}
