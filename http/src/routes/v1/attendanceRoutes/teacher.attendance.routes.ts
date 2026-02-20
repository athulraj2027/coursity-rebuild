import express from "express";
import TeacherAttendanceController from "../../../controllers/attendance/teacher.attendance.controller.js";
import { internalAuth } from "../../../middlewares/internal.middleware.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../../middlewares/role.middleware.js";
const router = express.Router();

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware,
  TeacherAttendanceController.getAttendance,
);
router.post(
  "/:id/finalize-attendance",
  internalAuth,
  TeacherAttendanceController.finalizeAttendanceForLecture,
);

export default router;
