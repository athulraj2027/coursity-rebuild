import express from "express";
import { roleMiddleware } from "../../../middlewares/role.middleware.js";
import teacherPaymentsRoutes from "./teacher.payments.routes.js";
import studentPaymentsRoutes from "./student.payments.routes.js";
const router = express.Router();

router.use("/teacher", roleMiddleware("TEACHER"), teacherPaymentsRoutes);
router.use("/student", roleMiddleware("STUDENT"), studentPaymentsRoutes);

export default router;
