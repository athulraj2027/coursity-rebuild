import LecturePageComponent from "@/features/lecture/components/LecturePage";

export default async function LecturePage({
  params,
}: {
  params: { lectureId: string };
}) {
  const { lectureId } = await params;

  return <LecturePageComponent lectureId={lectureId} />;
}
