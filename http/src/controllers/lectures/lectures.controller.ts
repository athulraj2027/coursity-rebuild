import type { Request, Response } from "express";
import LectureServices from "../../services/lecture.services.js";

const LectureController = {
  getLectures: async (req: Request, res: Response) => {
    try {
      const lectures = await LectureServices.getLectures(req.user);
      if (!lectures)
        return res
          .status(400)
          .json({ success: false, message: "Lectures not found" });

      return res.status(200).json({ success: true, lectures });
    } catch (error) {
      console.log("Failed to fetch lectures for student : ", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch lectures" });
    }
  },

  getLectureById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const lecture = await LectureServices.getLectureById(
        id as string,
        req.user,
      );
      if (!lecture)
        return res
          .status(400)
          .json({ success: false, message: "Lectures not found" });
      return res.status(200).json({ success: true, lecture });
    } catch (error) {
      console.log("Failed to fetch lecture for student: ", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch lecture" });
    }
  },
};

export default LectureController;
