import express from "express";
import UploadController from "../../controllers/upload.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
const router = express.Router();

router.post(
  "/cloudinary-signature",
  authMiddleware,
  UploadController.getCloudinarySignature,
);

export default router;
