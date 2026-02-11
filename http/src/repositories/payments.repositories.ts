import { prisma } from "../lib/prisma.js";

const PaymentRepositories = {
  createOrder: async (
    userId: string,
    courseId: string,
    coursePrice: number,
    orderId: string,
  ) =>
    prisma.payment.create({
      data: {
        studentId: userId,
        courseId,
        amount: coursePrice,
        razorpayOrderId: orderId,
      },
    }),

  findOrderByRazorpayOrderId: async (razorpayOrderId: string) =>
    prisma.payment.findUnique({
      where: { razorpayOrderId },
    }),

  updatePaymentStatusToFailedById: async (paymentId: string) =>
    prisma.payment.update({
      where: { id: paymentId },
      data: { status: "FAILED" },
    }),

  updatePaymentSuccess: async (
    razorpay_payment_id: string,
    razorpay_signature: string,
    paymentId: string,
  ) =>
    prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "PAID",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    }),
};

export default PaymentRepositories;
