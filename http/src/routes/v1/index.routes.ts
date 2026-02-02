import express from "express";
import authRoutes from "./auth.routes.js";
import courseRoutes from "./courseRoutes/index.course.routes.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/courses",  courseRoutes);

export default router;
