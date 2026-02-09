import express from "express";
import authRoutes from "./auth.routes.js";
import courseRoutes from "./courseRoutes/index.course.routes.js";
import attendanceRoutes from "./attendanceRoutes/index.attendance.routes.js";
import uploadsRoutes from "./upload.routes.js";
import lectureRoutes from "./lectureRoutes/index.lecture.routes.js";
import enrollmentRoutes from "./enrollmentRoutes/enrollment.routes.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/lectures", lectureRoutes);
router.use("/uploads", uploadsRoutes);
router.use("/enrollment", authMiddleware, enrollmentRoutes);
router.use("/attendance", authMiddleware, attendanceRoutes);

export default router;
