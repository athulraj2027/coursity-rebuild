import type { Request, Response } from "express";
import LectureServices from "../../services/lecture.services.js";
import { pick } from "../../utils/pick.js";

const TeacherLectureController = {
  createLecture: async (req: Request, res: Response) => {
    const { title, startTime, courseId } = req.body;
    const user = req.user;
    try {
      const newLecture = await LectureServices.createLecture(
        title,
        startTime,
        courseId,
        user.id,
      );

      return res.json(newLecture);
    } catch (error: any) {
      console.log("Failed to create course");
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  editLecture: async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    const allowedFields = ["title", "startTime", "isDeleted"];
    const safeUpdates = pick(updates, allowedFields);

    try {
      const lecture = await LectureServices.editLecture(
        id as string,
        req.user,
        safeUpdates,
      );

      if (!lecture)
        return res
          .status(400)
          .json({ success: false, message: "Couldnt update lecture" });
      return res.status(200).json({ success: true, lecture });
    } catch (error: any) {
      console.log("Failed to update course : ", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  startLecture: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    try {
      await LectureServices.startLecture(id as string, user.id);
      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.log("Failed to start the class : ", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  endLecture: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    try {
      await LectureServices.endLecture(id as string, user.id);
      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.log("Failed to end the class : ", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default TeacherLectureController;
