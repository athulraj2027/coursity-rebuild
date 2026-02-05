import AttendanceRepositories from "../repositories/attendance.repositories.js";
import { AppError } from "../utils/AppError.js";
const LATE_THRESHOLD_MIN = 10;
const PRESENT_THRESHOLD_PERCENT = 70;

const AttendanceService = {
  markAttendanceJoin: async (lectureId: string, studentId: string) => {
    const lecture = await AttendanceRepositories.findLectureById(lectureId);
    if (!lecture) throw new AppError("Lecture not found", 400);

    if (lecture.status !== "STARTED") {
      throw new AppError("Lecture is not live", 400);
    }

    const enrollment = await AttendanceRepositories.isStudentEnrolled(
      studentId,
      lecture.courseId,
    );

    if (!enrollment) {
      throw new AppError("Student not enrolled in course", 300);
    }

    return AttendanceRepositories.upsertJoinTime(
      lectureId,
      studentId,
      new Date(),
    );
  },

  markAttendanceComplete: async (
    lectureId: string,
    studentId: string,
    leaveTime: Date,
  ) => {
    const lecture = await AttendanceRepositories.findLectureById(lectureId);
    if (!lecture) throw new AppError("Lecture not found", 400);
    if (lecture.status !== "STARTED")
      throw new AppError("Lecture is not live", 403);

    const attendance =
      await AttendanceRepositories.findAttendanceByStudentAndLectureIds(
        lectureId,
        studentId,
      );

    if (!attendance || !attendance.joinTime)
      throw new AppError("Attendance credentials not found", 400);

    const now = new Date();
    const sessionDuration = Math.floor(
      (now.getTime() - attendance.joinTime.getTime()) / 1000,
    );

    return AttendanceRepositories.updateLeaveTime(
      lectureId,
      studentId,
      leaveTime,
      sessionDuration,
    );
  },

  finalizeAttendance: async (teacherId: string, lectureId: string) => {
    const lecture =
      await AttendanceRepositories.findLectureWithCourse(lectureId);

    if (!lecture) throw new AppError("Lecture not found", 400);

    if (lecture.course.teacherId !== teacherId) {
      throw new AppError("Unauthorized", 403);
    }

    if (lecture.status !== "STARTED") {
      throw new AppError("Lecture is not live", 403);
    }

    if (!lecture.startTime) {
      throw new AppError("Lecture start time missing", 400);
    }

    const lectureEndTime = new Date();
    const lectureDurationSec = Math.floor(
      (lectureEndTime.getTime() - lecture.startTime.getTime()) / 1000,
    );

    const enrollments = await AttendanceRepositories.getEnrollmentsByCourseId(
      lecture.courseId,
    );

    const attendances =
      await AttendanceRepositories.getAttendancesByLectureId(lectureId);

    const attendanceMap = new Map(attendances.map((a) => [a.studentId, a]));

    for (const enrollment of enrollments) {
      const attendance = attendanceMap.get(enrollment.studentId);

      // Case 1: Student never joined → ABSENT
      if (!attendance) {
        await AttendanceRepositories.markAbsent(
          lectureId,
          enrollment.studentId,
        );
        continue;
      }

      const attendedPercent =
        lectureDurationSec === 0
          ? 0
          : (attendance.durationSec / lectureDurationSec) * 100;

      const joinedLate =
        attendance.joinTime &&
        (attendance.joinTime.getTime() - lecture.startTime.getTime()) /
          (1000 * 60) >
          LATE_THRESHOLD_MIN;

      let status: "PRESENT" | "LATE" | "ABSENT" = "ABSENT";

      if (attendedPercent >= PRESENT_THRESHOLD_PERCENT) {
        status = joinedLate ? "LATE" : "PRESENT";
      }

      await AttendanceRepositories.updateAttendanceStatus(
        attendance.id,
        status,
      );
    }

    await AttendanceRepositories.completeLecture(lectureId);

    return { message: "Attendance finalized successfully" };
  },
};

export default AttendanceService;
