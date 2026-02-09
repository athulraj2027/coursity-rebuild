import express from "express";
import adminCourseRoutes from "./admin.course.routes.js";
import teacherCourseRoutes from "./teacher.course.routes.js";
import publicCourseRoutes from "./public.course.routes.js";
import studentCourseRoutes from "./student.course.routes.js";
import { roleMiddleware } from "../../../middlewares/role.middleware.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";

const router = express.Router();

router.use("/", authMiddleware, publicCourseRoutes);
router.use(
  "/admin",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminCourseRoutes,
);
router.use(
  "/student",
  authMiddleware,
  roleMiddleware("STUDENT"),
  studentCourseRoutes,
);
router.use(
  "/teacher",
  authMiddleware,
  roleMiddleware("TEACHER"),
  teacherCourseRoutes,
);

export default router;
