import express from "express";
import TeacherAttendanceController from "../../../controllers/attendance/teacher.attendance.controller.js";
const router = express.Router();

router.get("/:id", TeacherAttendanceController.getAttendance);
router.get(
  "/:id/finalize-attendance",
  TeacherAttendanceController.finalizeAttendanceForLecture,
);

export default router;
