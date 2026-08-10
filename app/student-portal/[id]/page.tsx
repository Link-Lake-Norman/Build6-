import { redirect } from "next/navigation";

export default async function StudentPortalRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  redirect(
    `/ambassador/student-portal/${id}`
  );

}
