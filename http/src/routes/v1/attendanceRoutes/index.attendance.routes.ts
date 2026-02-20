import express from "express";
import studentAttendanceRoutes from "./student.attendance.routes.js";
import teacherAttendanceRoutes from "./teacher.attendance.routes.js";
import { roleMiddleware } from "../../../middlewares/role.middleware.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
const router = express.Router();

router.use(
  "/student",
  authMiddleware,
  roleMiddleware("STUDENT"),
  studentAttendanceRoutes,
);
router.use("/teacher", teacherAttendanceRoutes);

export default router;
