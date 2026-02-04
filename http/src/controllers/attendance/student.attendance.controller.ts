import type { Request, Response } from "express";
import AttendanceService from "../../services/attendance.services.js";

const StudentAttendanceController = {
  joinLecture: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    try {
      await AttendanceService.markAttendanceJoin(id as string, user.id);
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
    const { leaveTime } = req.body;
    const user = req.user;
    try {
      await AttendanceService.markAttendanceComplete(
        id as string,
        user.id,
        leaveTime,
      );
      return res.status(200).json({ success: true });
    } catch (error) {
      console.log("Failed to leave the class : ", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to leave the lecture" });
    }
  },

  myAttendance: async (req: Request, res: Response) => {},
};
export default StudentAttendanceController;
