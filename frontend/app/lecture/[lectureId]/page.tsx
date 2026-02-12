import LecturePageComponent from "@/components/lecturePage/LecturePage";

export default async function LecturePage({
  params,
}: {
  params: { lectureId: string };
}) {
  const { lectureId } = await params;

  return <LecturePageComponent lectureId={lectureId} />;
}
