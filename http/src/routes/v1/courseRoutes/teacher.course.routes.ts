import express from "express";
import TeacherCourseController from "../../../controllers/courses/teacher.courses.controller.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
const router = express.Router();

router.post("/", asyncHandler(TeacherCourseController.createCourse));
router.get("/my", asyncHandler(TeacherCourseController.getMyCourses));
router.get("/my/:id", asyncHandler(TeacherCourseController.getMyCourseById));
router.patch("/:id", asyncHandler(TeacherCourseController.patchCourse));
router.put("/edit/:id", asyncHandler(TeacherCourseController.editCourse));

export default router;
