import type { Request, Response } from "express";
import PaymentServices from "../../services/payment.services.js";
import EnrollmentServices from "../../services/enrollment.services.js";

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
    const user = req.user;
    console.log("req body : ", req.body);

    try {
      const verifiedOrder = await PaymentServices.verifyOrder(
        req.body,
        req.user,
      );
      if (!verifiedOrder.success || !verifiedOrder.paymentId)
        return res
          .status(400)
          .json({ success: false, message: "Couldn't verify order" });

      const enroll = await EnrollmentServices.enrollCourse({
        paymentId: verifiedOrder.paymentId,
        courseId: req.body.courseId,
        user,
      });

      console.log(enroll);

      // add wallet money for teacher

      return res.status(200).json({ success: true, enroll });
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

  getHistory: async (req: Request, res: Response) => {
    const user = req.user;
    // try {
    //   const history = await PaymentServices.getHistory();
    //   if (!history)
    //     return res
    //       .status(400)
    //       .json({ success: false, message: "Couldnt fetch history" });

    //   return res.status(200).json({ success: true, history });
    // } catch (error: any) {
    //   console.log(
    //     `Failed to fetch enrolled courses for student ${req.user.id} : `,
    //     error,
    //   );
    //   if (error.statusCode) {
    //     return res
    //       .status(error.statusCode)
    //       .json({ success: false, message: error.message });
    //   }
    //   return res.status(500).json({ success: false, message: "Server error" });
    // }
  },
};

export default StudentPaymentController;
