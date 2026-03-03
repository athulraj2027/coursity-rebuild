import express from "express";
import TeacherLectureController from "../../../controllers/lectures/teacher.lectures.controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../../middlewares/role.middleware.js";
import { internalAuth } from "../../../middlewares/internal.middleware.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("TEACHER"),
  asyncHandler(TeacherLectureController.getAllLectures),
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware("TEACHER"),
  asyncHandler(TeacherLectureController.createLecture),
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("TEACHER"),
  asyncHandler(TeacherLectureController.getLectureById),
);
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("TEACHER"),
  asyncHandler(TeacherLectureController.editLecture),
);
router.post(
  "/:id/start",
  authMiddleware,
  roleMiddleware("TEACHER"),
  asyncHandler(TeacherLectureController.startLecture),
);
router.post(
  "/:id/end",
  internalAuth,
  asyncHandler(TeacherLectureController.endLecture),
);

export default router;
