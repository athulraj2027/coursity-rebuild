import type { Request, Response } from "express";
import PaymentServices from "../../services/payment.services.js";

const StudentPaymentController = {
  createOrder: async (req: Request, res: Response) => {
    const { courseId } = req.body;
    const user = req.user;
    try {
      const order = await PaymentServices.createOrder(courseId, user);
      if (!order)
        return res
          .status(400)
          .json({ success: false, message: "Couldn't create order" });

      return res.status(200).json({
        success: true,
        res: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
        },
      });
    } catch (error: any) {
      console.log(
        `Failed to create order for student ${req.user.id} : `,
        error,
      );
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  verifyOrder: async (req: Request, res: Response) => {
    try {
      const completeEnrollment =
        await PaymentServices.completeEnrollmentAfterPayment(
          req.body,
          req.user,
        );

      // send email
      return res.status(200).json(completeEnrollment);
    } catch (error: any) {
      console.log(`Failed to enroll student ${req.user.id} : `, error);
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },
};

export default StudentPaymentController;
