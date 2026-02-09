import express from "express";
import teacherEnrollmentRoutes from "./teacher.enrollment.routes.js";
import studentEnrollmentRoutes from "./student.enrollment.routes.js";
import { roleMiddleware } from "../../../middlewares/role.middleware.js";
const router = express.Router();

router.use("/student", roleMiddleware("STUDENT"), studentEnrollmentRoutes);
router.use("/teacher", roleMiddleware("TEACHER"), teacherEnrollmentRoutes);

export default router;
