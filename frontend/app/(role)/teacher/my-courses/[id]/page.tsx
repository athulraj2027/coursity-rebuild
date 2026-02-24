import CourseDetailPageComponent from "./components/CourseDetailPage";

export default async function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return <CourseDetailPageComponent id={id} />;
}
