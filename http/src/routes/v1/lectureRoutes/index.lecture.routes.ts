import express from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../../middlewares/role.middleware.js";
import teacherLectureRoutes from "./teacher.lecture.routes.js";
import studentLectureRoutes from "./student.lecture.routes.js";
import adminLectureRoutes from "./admin.lecture.routes.js";
import LectureController from "../../../controllers/lectures/lectures.controller.js";
import { internalAuth } from "../../../middlewares/internal.middleware.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
const router = express.Router();

router.use(
  "/admin",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminLectureRoutes,
);
router.use("/teacher", teacherLectureRoutes);
router.use(
  "/student",
  authMiddleware,
  roleMiddleware("STUDENT"),
  studentLectureRoutes,
);

router.get("/", authMiddleware, asyncHandler(LectureController.getLectures));
router.get(
  "/:id",
  authMiddleware,
  asyncHandler(LectureController.getLectureById),
);
router.get(
  "/access/:id",
  authMiddleware,
  asyncHandler(LectureController.getLectureAccess),
);
router.post(
  "/:id/join",
  authMiddleware,
  roleMiddleware(["ADMIN", "STUDENT"]),
  asyncHandler(LectureController.joinLecture),
);

router.patch(
  "/:id/leave",
  internalAuth,
  asyncHandler(LectureController.leaveLecture),
);

export default router;
