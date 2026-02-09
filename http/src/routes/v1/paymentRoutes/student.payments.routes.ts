import express from "express";
import StudentPaymentController from "../../../controllers/payment/student.payment.controller.js";

const router = express.Router();

router.post("/create-order", StudentPaymentController.createOrder);
router.post("/verify-order", StudentPaymentController.verifyOrder);
router.get("/history", StudentPaymentController.getHistory);

export default router;
