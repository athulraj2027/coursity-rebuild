import express from "express";
import AdminCoursesController from "../../../controllers/courses/admin.courses.controller.js";
const router = express.Router();

router.get("/", AdminCoursesController.getCourses);
router.get("/:id", AdminCoursesController.getCourse);
router.patch("/:id", AdminCoursesController.patchCourse);

export default router;
