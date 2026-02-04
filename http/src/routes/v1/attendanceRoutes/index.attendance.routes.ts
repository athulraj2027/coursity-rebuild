import express from "express";
import studentAttendanceRoutes from "./student.attendance.routes.js";
import teacherAttendanceRoutes from "./teacher.attendance.routes.js";
import { roleMiddleware } from "../../../middlewares/role.middleware.js";
const router = express.Router();

router.use("/student", roleMiddleware("STUDENT"), studentAttendanceRoutes);
router.use("/teacher", roleMiddleware("TEACHER"), teacherAttendanceRoutes);

export default router;
