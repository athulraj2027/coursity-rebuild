import express from "express";
import TeacherCourseController from "../../../controllers/courses/teacher.courses.controller.js";
const router = express.Router();

router.post("/", TeacherCourseController.createCourse);
router.get("/my", TeacherCourseController.getMyCourses);
router.get("/my/:id", TeacherCourseController.getMyCourseById);
router.patch("/:id", TeacherCourseController.patchCourse);

export default router;
