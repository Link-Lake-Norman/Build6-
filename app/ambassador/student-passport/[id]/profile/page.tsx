import StudentProfileEditor from "@/components/student/StudentProfileEditor";

export default async function StudentPassportProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <StudentProfileEditor
      studentId={id}
    />
  );
}
