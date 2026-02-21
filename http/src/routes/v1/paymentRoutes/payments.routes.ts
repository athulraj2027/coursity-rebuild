import express from "express";
import { roleMiddleware } from "../../../middlewares/role.middleware.js";
import studentPaymentsRoutes from "./student.payments.routes.js";
const router = express.Router();

router.use("/student", roleMiddleware("STUDENT"), studentPaymentsRoutes);

export default router;
