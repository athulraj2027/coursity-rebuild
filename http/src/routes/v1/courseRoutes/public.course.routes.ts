import express from "express";
import PublicCoursesController from "../../../controllers/courses/public.courses.controller.js";
const router = express.Router();

router.get("/", PublicCoursesController.getCourses);
router.get("/:id", PublicCoursesController.getCourse);

export default router;
