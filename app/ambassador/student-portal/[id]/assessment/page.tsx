import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authorizeStudentAccess } from "@/lib/auth/student-access";
import AssessmentForm from "./AssessmentForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DayOneAssessmentPage({
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

    redirect("/student-portal");
  }

  if (access.session.role !== "STUDENT") {
    redirect(`/ambassador/student-portal/${id}`);
  }

  const student = await prisma.student.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          displayName: true,
        },
      },
      readinessProfile: {
        select: {
          completedAt: true,
        },
      },
    },
  });

  if (!student) {
    notFound();
  }

  if (student.readinessProfile?.completedAt) {
    redirect(`/ambassador/student-portal/${student.id}/career-pathways`);
  }

  const studentName =
    student.user.displayName ??
    `${student.user.firstName} ${student.user.lastName}`.trim();

  return (
    <AssessmentForm
      studentId={student.id}
      studentName={studentName}
    />
  );
}
