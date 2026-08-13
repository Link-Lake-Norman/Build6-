import StudentPortfolioEditor from "@/components/student/StudentPortfolioEditor";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StudentPortfolioPage({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <StudentPortfolioEditor
      studentId={id}
      backHref={`/ambassador/student-portal/${id}`}
      backLabel="Back to Student Profile"
    />
  );
}
