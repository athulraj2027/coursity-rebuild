import { apiRequest } from "@/lib/apiClient";

export const getEnrollment = (enrollmentId: string) =>
  apiRequest({ path: `/enrollment/student/${enrollmentId}`, method: "GET" });
