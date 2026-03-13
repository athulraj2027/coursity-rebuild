import express from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import profileController from "../../controllers/profile.controller.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
const router = express.Router();

router.get(
  "/",
  roleMiddleware("TEACHER"),
  asyncHandler(profileController.getUserProfile),
);

router.put(
  "/",
  roleMiddleware("TEACHER"),
  asyncHandler(profileController.patchProfile),
);

router.get(
  "/:id",
  roleMiddleware("STUDENT"),
  asyncHandler(profileController.getTeacherProfile),
);

export default router;
