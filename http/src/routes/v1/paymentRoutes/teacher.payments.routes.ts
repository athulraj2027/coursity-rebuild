import express from "express";
import TeacherPaymentController from "../../../controllers/payment/teacher.payment.controller.js";
const router = express.Router();

router.get("/revenue", TeacherPaymentController.getRevenue);

export default router;
