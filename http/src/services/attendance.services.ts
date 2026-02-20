import AttendanceRepositories from "../repositories/attendance.repositories.js";
import LectureRepositories from "../repositories/lectures.repositories.js";
import ParticipantRepository from "../repositories/participants.repositories.js";
import { AppError } from "../utils/AppError.js";
const LATE_THRESHOLD_MIN = 10;
const PRESENT_THRESHOLD_PERCENT = 70;

const AttendanceService = {
  finalizeAttendance: async (teacherId: string, lectureId: string) => {
    const lecture =
      await AttendanceRepositories.findLectureWithCourse(lectureId);

    if (!lecture) throw new AppError("Lecture not found", 400);

    if (lecture.course.teacherId !== teacherId)
      throw new AppError("Unauthorized", 403);

    if (lecture.status !== "STARTED")
      throw new AppError("Lecture is not live", 403);

    const lectureEndTime = new Date();

    const lectureDurationSec = Math.floor(
      (lectureEndTime.getTime() - lecture.startTime.getTime()) / 1000,
    );

    const enrollments = await AttendanceRepositories.getEnrollmentsByCourseId(
      lecture.courseId,
    );

    const participants =
      await ParticipantRepository.getParticipantsByLectureId(lectureId);

    const durationMap = new Map<string, number>();

    for (const p of participants) {
      if (p.role !== "STUDENT") continue;

      const leaveTime = p.leaveTime ?? lectureEndTime;

      const sessionDuration = Math.floor(
        (leaveTime.getTime() - p.joinTime.getTime()) / 1000,
      );

      const existing = durationMap.get(p.userId) || 0;
      durationMap.set(p.userId, existing + sessionDuration);
    }

    for (const enrollment of enrollments) {
      const totalDuration = durationMap.get(enrollment.studentId) || 0;

      const attendedPercent =
        lectureDurationSec === 0
          ? 0
          : (totalDuration / lectureDurationSec) * 100;

      const status =
        attendedPercent >= PRESENT_THRESHOLD_PERCENT
          ? "PRESENT"
          : totalDuration > 0
            ? "LATE"
            : "ABSENT";

      await AttendanceRepositories.upsertAttendance({
        lectureId,
        studentId: enrollment.studentId,
        durationSec: totalDuration,
        status,
      });
    }

    await LectureRepositories.endLectureOwner(lectureId);

    await ParticipantRepository.closeAllActiveParticipants(
      lectureId,
      lectureEndTime,
    );
    return { message: "Attendance finalized successfully" };
  },
};

export default AttendanceService;
