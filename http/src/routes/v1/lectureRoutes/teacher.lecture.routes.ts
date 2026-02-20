import express from "express";
import TeacherLectureController from "../../../controllers/lectures/teacher.lectures.controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../../middlewares/role.middleware.js";
import { internalAuth } from "../../../middlewares/internal.middleware.js";
const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("TEACHER"),
  TeacherLectureController.getAllLectures,
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware("TEACHER"),
  TeacherLectureController.createLecture,
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("TEACHER"),
  TeacherLectureController.getLectureById,
);
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("TEACHER"),
  TeacherLectureController.editLecture,
);
router.post(
  "/:id/start",
  authMiddleware,
  roleMiddleware("TEACHER"),
  TeacherLectureController.startLecture,
);
router.post("/:id/end", internalAuth, TeacherLectureController.endLecture);

export default router;
