import express from "express";
import UploadController from "../../controllers/upload.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const router = express.Router();

router.post(
  "/cloudinary-signature",
  authMiddleware,
  asyncHandler(UploadController.getCloudinarySignature),
);

export default router;
