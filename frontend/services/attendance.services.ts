import { apiRequest } from "@/lib/apiClient";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAttendanceApi = (courseId: string) =>
  apiRequest({ path: `/attendance/teacher/${courseId}`, method: "GET" });

export const downloadAttendanceApi = async (courseId: string) => {
  const response = await fetch(
    `${BACKEND_URL}/attendance/teacher/${courseId}/download`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Download failed");
  }

  return response.blob(); // IMPORTANT
};
