import express from "express";
import StudentEnrollmentController from "../../../controllers/enrollment/student.enrollment.controller.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
const router = express.Router();

router.get("/my", asyncHandler(StudentEnrollmentController.getEnrolledCourses));
router.get("/:id", asyncHandler(StudentEnrollmentController.getEnrollmentData));
router.get(
  "/my/:id",
  asyncHandler(StudentEnrollmentController.getEnrolledCourseById),
);

export default router;
