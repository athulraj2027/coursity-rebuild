import EditLecturePageComponent from "@/app/(role)/teacher/my-lectures/_components/EditLecturePage";

export default async function EditLecturePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <EditLecturePageComponent lectureId={id} />;
}
