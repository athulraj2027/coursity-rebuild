import express from "express";
import UserController from "../../controllers/user.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const router = express.Router();

router.get("/", asyncHandler(UserController.getUsers));
router.patch("/block-user", asyncHandler(UserController.blockUser));
router.get("/:id", asyncHandler(UserController.getUserById));
// router.get("/enrollments");
// router.get("/lectures")
// router.get("/courses");
// router.get('/pay-user')

export default router;
