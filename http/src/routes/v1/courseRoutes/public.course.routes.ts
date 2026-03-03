import express from "express";
import PublicCoursesController from "../../../controllers/courses/public.courses.controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
const router = express.Router();

router.get(
  "/",
  authMiddleware,
  asyncHandler(PublicCoursesController.getCourses),
);
router.get("/:id", asyncHandler(PublicCoursesController.getCourse));

export default router;
