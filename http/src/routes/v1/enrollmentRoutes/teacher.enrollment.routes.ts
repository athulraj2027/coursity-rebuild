import express from "express";
import TeacherEnrollmentController from "../../../controllers/enrollment/teacher.enrollment.controller.js";
const router = express.Router();

router.get("/my-courses", TeacherEnrollmentController.getMyEnrollments);
router.get(
  "/my-courses/:id",
  TeacherEnrollmentController.getMyEnrollmentsByCourseId,
);

export default router;
