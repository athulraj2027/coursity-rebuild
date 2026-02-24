import CourseEditComponent from "../components/CourseEditComponent";

export default async function EditCoursePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <CourseEditComponent id={id} />;
}
