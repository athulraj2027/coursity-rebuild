import express from "express";
import DashboardController from "../../controllers/dashboard.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const router = express.Router();

router.get("/", asyncHandler(DashboardController.getDashboard));

export default router;
