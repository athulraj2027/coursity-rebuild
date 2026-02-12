import express from "express";
import StudentEnrollmentController from "../../../controllers/enrollment/student.enrollment.controller.js";
const router = express.Router();

router.get("/my", StudentEnrollmentController.getEnrolledCourses);
router.get("/my/:id", StudentEnrollmentController.getEnrolledCourseById);

export default router;
