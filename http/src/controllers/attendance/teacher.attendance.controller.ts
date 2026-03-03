import type { Request, Response } from "express";
import AttendanceService from "../../services/attendance.services.js";

const TeacherAttendanceController = {
  // attendance for one lecture
  getAttendance: async (req: Request, res: Response) => {},

  finalizeAttendanceForLecture: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    await AttendanceService.finalizeAttendance(user.id, id as string);
    return res.status(200).json({ success: true });
  },
};
export default TeacherAttendanceController;
