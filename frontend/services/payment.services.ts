/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiRequest } from "@/lib/apiClient";

export interface OrderData {
  orderId: string;
  amount: number;
  currency: string;
}

export interface CreateOrderResponse {
  success: boolean;
  res: OrderData;
}

export interface VerifyPaymentResponse {
  success: boolean;
  enrollment_id: string;
}

export const createOrderApi = async (
  courseId: string,
): Promise<CreateOrderResponse> =>
  apiRequest({
    path: "/payment/student/create-order",
    method: "POST",
    body: { courseId },
  });


export const verifyPaymentApi = async (
  body: any,
): Promise<VerifyPaymentResponse> =>
  apiRequest({
    path: "/payment/student/verify-payment",
    method: "POST",
    body,
  });
