import express from "express";
import UserController from "../../controllers/user.controller.js";
const router = express.Router();

router.get("/", UserController.getUsers);
router.patch("/block-user", UserController.blockUser);
router.get("/:id", UserController.getUserById);
// router.get("/enrollments");
// router.get("/lectures")
// router.get("/courses");
// router.get('/pay-user')

export default router;
