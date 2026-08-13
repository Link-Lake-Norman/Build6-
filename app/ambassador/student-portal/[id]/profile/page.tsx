import StudentProfileEditor from "@/components/student/StudentProfileEditor";

export default async function StudentPortalProfilePage({
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
