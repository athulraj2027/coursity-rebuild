import { apiRequest } from "@/lib/apiClient";

export const createLectureApi = async (payload: {
  title: string;
  startTime: Date;
  courseId: string;
}) => apiRequest({ path: "/lectures/teacher", method: "POST", body: payload });
