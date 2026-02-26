import AdminUserViewPageComponent from "../_components/AdminViewPageComponent";

export default async function UserViewPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <AdminUserViewPageComponent id={id} />;
}
