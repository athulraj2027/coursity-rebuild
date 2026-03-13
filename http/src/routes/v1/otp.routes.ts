import express from "express";
import OtpController from "../../controllers/otp.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const router = express.Router();

router.post(
  "/send",
  authMiddleware,
  roleMiddleware(["STUDENT", "TEACHER"]),
  asyncHandler(OtpController.sendOtp),
);

router.post(
  "/verify",
  authMiddleware,
  roleMiddleware(["STUDENT", "TEACHER"]),
  asyncHandler(OtpController.verifyOtp),
);

export default router;
