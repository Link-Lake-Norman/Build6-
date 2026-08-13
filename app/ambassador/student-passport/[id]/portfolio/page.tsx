import StudentPortfolioEditor from "@/components/student/StudentPortfolioEditor";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PortfolioPage({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <StudentPortfolioEditor
      studentId={id}
      backHref={`/ambassador/student-passport/${id}`}
      backLabel="Back to Student Passport"
    />
  );
}
