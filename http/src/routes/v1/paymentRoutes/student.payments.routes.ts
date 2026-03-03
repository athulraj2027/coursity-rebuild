import express from "express";
import StudentPaymentController from "../../../controllers/payment/student.payment.controller.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/create-order",
  asyncHandler(StudentPaymentController.createOrder),
);
router.post(
  "/verify-payment",
  asyncHandler(StudentPaymentController.verifyOrder),
);

export default router;
