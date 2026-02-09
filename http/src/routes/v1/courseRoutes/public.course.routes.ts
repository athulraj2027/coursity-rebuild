import express from "express";
import PublicCoursesController from "../../../controllers/courses/public.courses.controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/", authMiddleware, PublicCoursesController.getCourses);
router.get("/:id", PublicCoursesController.getCourse);

export default router;
