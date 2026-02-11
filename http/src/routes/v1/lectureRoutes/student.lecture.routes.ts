import express from "express";
import StudentLectureController from "../../../controllers/lectures/student.lectures.controller.js";
const router = express.Router();

router.get("/", StudentLectureController.getScheduledLectures);
// router.get('/:id')

export default router;
