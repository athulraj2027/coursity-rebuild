import express from "express";
import StudentLectureController from "../../../controllers/lectures/student.lectures.controller.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
const router = express.Router();

router.get("/", asyncHandler(StudentLectureController.getScheduledLectures));

export default router;
