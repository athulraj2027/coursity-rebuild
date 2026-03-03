import express from "express";
import AdminCoursesController from "../../../controllers/courses/admin.courses.controller.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
const router = express.Router();

router.get("/", asyncHandler(AdminCoursesController.getCourses));
router.get("/:id", asyncHandler(AdminCoursesController.getCourse));
router.patch("/:id", asyncHandler(AdminCoursesController.patchCourse));

export default router;
