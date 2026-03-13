import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import profileController from "../../controllers/profile.controller.js";
const router = express.Router();

router.get("/", asyncHandler(profileController.getUserProfile));
router.put("/", asyncHandler(profileController.patchProfile));

export default router;
