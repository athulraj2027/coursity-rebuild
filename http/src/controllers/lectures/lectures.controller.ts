import type { Request, Response } from "express";
import LectureServices from "../../services/lecture.services.js";
import ParticipantService from "../../services/participant.service.js";

const LectureController = {
  getLectures: async (req: Request, res: Response) => {
    try {
      const lectures = await LectureServices.getLectures(req.user);
      if (!lectures)
        return res
          .status(400)
          .json({ success: false, message: "Lectures not found" });

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
    } catch (error: any) {
      console.log("Failed to fetch lecture for student: ", error);
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch lecture" });
    }
  },

  getLectureAccess: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    try {
      // check whether the course status is correct and lecture exists
      const lecture = await LectureServices.getLectureById(id as string, user);
      if (!lecture)
        return res
          .status(200)
          .json({ isAllowed: false, message: "Lecture not found" });
      if (user.role !== "TEACHER" && lecture.status === "NOT_STARTED")
        return res
          .status(200)
          .json({ isAllowed: false, message: "Lecture is not live" });
      return res
        .status(200)
        .json({ isAllowed: true, role: user.role, status: lecture.status });
    } catch (error: any) {
      console.log("Failed to fetch lecture for student: ", error);
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ isAllowed: false, message: error.message });
      }
      return res
        .status(500)
        .json({ isAllowed: false, message: "Failed to fetch lecture" });
    }
  },

  joinLecture: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    try {
      const lecture = await LectureServices.joinLecture(id as string, user);
      if (!lecture)
        return res
          .status(200)
          .json({ success: false, message: "Lecture not found" });

      if (lecture.status !== "STARTED")
        return res
          .status(200)
          .json({ success: false, message: "Lecture not started" });

      // check whether already joined
      await ParticipantService.upsertParticipant(id as string, user);

      return res.status(200).json({ success: true, lecture });
    } catch (error: any) {
      console.log("Failed to fetch lecture for student: ", error);
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch lecture" });
    }
  },

  leaveLecture: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;

    try {
      await ParticipantService.leaveLecture(id as string, user);
      return res.status(200).json({ message: "Left lecture successfully" });
    } catch (error: any) {
      console.log("Failed to fetch lecture for student: ", error);
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: "Failed to leave lecture" });
    }
  },
};

export default LectureController;
