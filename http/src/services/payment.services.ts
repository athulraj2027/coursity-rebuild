import crypto from "crypto";
import { razorpay } from "../lib/razorpay.js";
import CourseRepositories from "../repositories/courses.repositories.js";
import EnrollmentRepositories from "../repositories/enrollment.repositories.js";
import PaymentRepositories from "../repositories/payments.repositories.js";
import { AppError } from "../utils/AppError.js";

export interface VerifyPaymentDto {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  courseId: string;
}

const PaymentServices = {
  createOrder: async (courseId: string, user: any) => {
    const course = await CourseRepositories.findByIdInternal(courseId);
    if (!course) throw new AppError("Course not found", 400);
    if (!course.isEnrollmentOpen)
      throw new Error("Enrollment is closed for this course");
    if (course.isDeleted) throw new AppError("Course has been deleted", 401);
    if (course.isDisabled)
      throw new AppError("Course is currently disabled", 401);
    const isEnrolledAlready =
      await EnrollmentRepositories.findEnrolledCourseById(user.id, courseId);

    if (isEnrolledAlready)
      throw new AppError("You have already enrolled to this course", 300);

    const order = await razorpay.orders.create({
      amount: course.price * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    const payment = await PaymentRepositories.createOrder(
      user.id,
      courseId,
      course.price,
      order.id,
    );
    if (!payment) throw new AppError("Couldn't create payment", 400);
    return order;
  },

  verifyOrder: async (
    data: VerifyPaymentDto,
    user: any,
  ): Promise<{ success: boolean; paymentId?: string }> => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = data;

    const payment =
      await PaymentRepositories.findOrderByRazorpayOrderId(razorpay_order_id);

    if (!payment) throw new AppError("Payment record not found", 400);
    if (payment.status === "PAID") return { success: true };

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await PaymentRepositories.updatePaymentStatusToFailedById(payment.id);
      throw new Error("Invalid payment signature");
    }

    await PaymentRepositories.updatePaymentSuccess(
      razorpay_payment_id,
      razorpay_signature,
      payment.id,
    );

    return { success: true, paymentId: payment.id };
  },

  getHistory: async () => {},
};

export default PaymentServices;
