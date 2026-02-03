import express from "express";
import TeacherLectureController from "../../../controllers/lectures/teacher.lectures.controller.js";
const router = express.Router();

router.post("/", TeacherLectureController.createLecture);
router.patch("/:id", TeacherLectureController.editLecture);
router.post("/:id/start", TeacherLectureController.startLecture);
router.post("/:id/end", TeacherLectureController.endLecture);

export default router;
