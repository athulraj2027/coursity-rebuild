import express from "express";
import StudentLectureController from "../../../controllers/lectures/student.lectures.controller.js";
const router = express.Router();

router.post("/:id/join", StudentLectureController.joinLecture);
router.post("/:id/leave", StudentLectureController.leaveLecture);

export default router;
