import type { Request, Response } from "express";
import AttendanceService from "../../services/attendance.services.js";

const TeacherAttendanceController = {
  
  // attendance for one lecture
  getAttendance: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    console.log("hidfas");
    // const { startDate, endDate, status } = req.body;
    const attendanceData = await AttendanceService.getAttendanceDataForTeacher(
      user.id,
      id as string,
    );
    return res.status(200).json({ success: true, attendanceData });
  },

  finalizeAttendanceForLecture: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    await AttendanceService.finalizeAttendance(user.id, id as string);
    return res.status(200).json({ success: true });
  },
};

export default TeacherAttendanceController;
