import express from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../../middlewares/role.middleware.js";
import teacherLectureRoutes from "./teacher.lecture.routes.js";
import studentLectureRoutes from "./student.lecture.routes.js";
import adminLectureRoutes from "./admin.lecture.routes.js";
import LectureController from "../../../controllers/lectures/lectures.controller.js";
import { internalAuth } from "../../../middlewares/internal.middleware.js";
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

router.get("/", authMiddleware, LectureController.getLectures);
router.get("/:id", authMiddleware, LectureController.getLectureById);
router.get("/access/:id", authMiddleware, LectureController.getLectureAccess);
router.post(
  "/:id/join",
  authMiddleware,
  roleMiddleware(["ADMIN", "STUDENT"]),
  LectureController.joinLecture,
);

router.patch("/:id/leave", internalAuth, LectureController.leaveLecture);

export default router;
