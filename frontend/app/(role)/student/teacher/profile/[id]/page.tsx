import TeacherProfile from "@/components/student/TeacherProfile";

export default async function TeacherProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <TeacherProfile id={id} />;
}
