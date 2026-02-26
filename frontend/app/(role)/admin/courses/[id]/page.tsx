import AdminCourseDetail from "../_components/AdminCourseDetail";

export default async function CourseViewPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <AdminCourseDetail id={id} />;
}
