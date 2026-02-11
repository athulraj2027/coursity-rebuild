import { apiRequest } from "@/lib/apiClient";

export const createOrderApi = async (courseId: string) =>
  apiRequest({
    path: "/payment/student/create-order",
    method: "POST",
    body: { courseId },
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const verifyPaymentApi = async (body: any) =>
  apiRequest({
    path: "/payment/student/verify-payment",
    method: "POST",
    body,
  });
