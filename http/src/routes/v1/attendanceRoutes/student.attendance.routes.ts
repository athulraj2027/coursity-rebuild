import express from "express";
import StudentAttendanceController from "../../../controllers/attendance/student.attendance.controller.js";
const router = express.Router();

router.post("/:id/join", StudentAttendanceController.joinLecture);
router.post("/:id/leave", StudentAttendanceController.leaveLecture);
export default router;
