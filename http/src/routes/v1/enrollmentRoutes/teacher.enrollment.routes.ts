import express from "express";
import TeacherEnrollmentController from "../../../controllers/enrollment/teacher.enrollment.controller.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
const router = express.Router();

router.get(
  "/my-courses",
  asyncHandler(TeacherEnrollmentController.getMyEnrollments),
);
router.get(
  "/my-courses/:id",
  asyncHandler(TeacherEnrollmentController.getMyEnrollmentsByCourseId),
);

export default router;
