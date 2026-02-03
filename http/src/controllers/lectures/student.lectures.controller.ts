import type { Request, Response } from "express";
import LectureServices from "../../services/lecture.services.js";

const StudentLectureController = {
  joinLecture: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    try {
      await LectureServices.joinLecture(id as string, user.id);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.log("Failed to join the class : ", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to join the lecture" });
    }
  },

  leaveLecture: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    try {
      await LectureServices.leaveLecture(id as string, user.id);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.log("Failed to leave the class : ", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to leave the lecture" });
    }
  },
};

export default StudentLectureController;
