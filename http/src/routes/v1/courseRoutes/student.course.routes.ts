import express from "express";
import StudentCoursesController from "../../../controllers/courses/student.courses.controller.js";
const router = express.Router();

router.get("/enrolled", StudentCoursesController.getEnrolledCourses);
router.get("/enrolled/:id", StudentCoursesController.getEnrolledCourseById);
// router.post("/:id/enroll");

export default router;
