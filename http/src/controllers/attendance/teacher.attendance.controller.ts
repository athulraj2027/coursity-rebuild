import type { Request, Response } from "express";
import AttendanceService from "../../services/attendance.services.js";

const TeacherAttendanceController = {
  // attendance for one lecture
  getAttendance: async (req: Request, res: Response) => {},

  finalizeAttendanceForLecture: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    try {
      await AttendanceService.finalizeAttendance(user.id, id as string);
      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.log("ERror in finalizing attendance : ", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
export default TeacherAttendanceController;
