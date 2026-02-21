import express from "express";
import StudentPaymentController from "../../../controllers/payment/student.payment.controller.js";

const router = express.Router();

router.post("/create-order", StudentPaymentController.createOrder);
router.post("/verify-payment", StudentPaymentController.verifyOrder);

export default router;
