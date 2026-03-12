import { prisma } from "../lib/prisma.js";

const createOrder = async (
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
  });

const findOrderByRazorpayOrderId = async (razorpayOrderId: string) =>
  prisma.payment.findUnique({
    where: { razorpayOrderId },
  });

const updatePaymentStatusToFailedById = async (paymentId: string) =>
  prisma.payment.update({
    where: { id: paymentId },
    data: { status: "FAILED" },
  });

const updatePaymentSuccess = async (
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
  });

export default {
  updatePaymentStatusToFailedById,
  updatePaymentSuccess,
  findOrderByRazorpayOrderId,
  createOrder,
};
