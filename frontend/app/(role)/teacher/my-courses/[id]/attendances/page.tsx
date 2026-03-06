import AttendancePageComponent from "@/components/teacher/attendance/AttendancePage";

export default async function AttendancePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <AttendancePageComponent courseId={id} />;
}
