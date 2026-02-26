import ViewLecturePageComponents from "../_components/ViewLecturePageComponents";

export default async function LectureViewPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <ViewLecturePageComponents id={id} />;
}
