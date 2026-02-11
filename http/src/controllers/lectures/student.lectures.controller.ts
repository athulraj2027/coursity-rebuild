import type { Request, Response } from "express";
import LectureServices from "../../services/lecture.services.js";

const StudentLectureController = {
  getScheduledLectures: async (req: Request, res: Response) => {
    try {
      const lectures = await LectureServices.getLectures(req.user);
      return res.status(200).json({ success: true, lectures });
    } catch (error: any) {
      console.log("Failed to fetch lectures for student : ", error);
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch lectures" });
    }
  },
};

export default StudentLectureController;
