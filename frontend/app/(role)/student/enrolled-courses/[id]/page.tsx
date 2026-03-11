import PageComponent from "./components/PageComponent";

export default async function EnrolledCoursePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <PageComponent id={id} />;
}
