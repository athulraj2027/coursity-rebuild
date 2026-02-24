import { apiRequest } from "@/lib/apiClient";
import { EnrollmentApiResponse } from "@/queries/enrollment.queries";

export const getEnrollment = (
  enrollmentId: string,
): Promise<EnrollmentApiResponse> =>
  apiRequest({ path: `/enrollment/student/${enrollmentId}`, method: "GET" });
