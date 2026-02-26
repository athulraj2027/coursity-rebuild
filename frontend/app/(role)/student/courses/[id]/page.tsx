import CourseDetailPage from "../_components/CourseDetailPage";

export default async function ViewCoursePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <CourseDetailPage id={id} />;
}
