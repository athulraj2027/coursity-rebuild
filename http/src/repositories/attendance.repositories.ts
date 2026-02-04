import { prisma } from "../lib/prisma.js";

const AttendanceRepository = {
  findLectureById: (lectureId: string) => {
    return prisma.lecture.findUnique({
      where: { id: lectureId },
      select: {
        id: true,
        status: true,
        startTime: true,
        courseId: true,
      },
    });
  },

  isStudentEnrolled: (studentId: string, courseId: string) => {
    return prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });
  },

  upsertJoinTime: (lectureId: string, studentId: string, joinTime: Date) => {
    return prisma.attendance.upsert({
      where: {
        studentId_lectureId: {
          studentId,
          lectureId,
        },
      },
      create: {
        studentId,
        lectureId,
        joinTime,
        durationSec: 0,
        status: "ABSENT", // temporary, finalized later
      },
      update: {
        joinTime,
      },
    });
  },

  findAttendanceByStudentAndLectureIds: async (
    lectureId: string,
    studentId: string,
  ) => {
    return prisma.attendance.findUnique({
      where: {
        studentId_lectureId: {
          studentId,
          lectureId,
        },
      },
    });
  },

  updateLeaveTime: (
    lectureId: string,
    studentId: string,
    leaveTime: Date,
    durationSec: number,
  ) => {
    return prisma.attendance.update({
      where: {
        studentId_lectureId: {
          studentId,
          lectureId,
        },
      },
      data: {
        leaveTime,
        durationSec,
      },
    });
  },

  findLectureWithCourse: (lectureId: string) => {
    return prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        course: true,
      },
    });
  },

  getEnrollmentsByCourseId: (courseId: string) => {
    return prisma.enrollment.findMany({
      where: { courseId },
      select: { studentId: true },
    });
  },

  getAttendancesByLectureId: (lectureId: string) => {
    return prisma.attendance.findMany({
      where: { lectureId },
    });
  },

  markAbsent: (lectureId: string, studentId: string) => {
    return prisma.attendance.create({
      data: {
        lectureId,
        studentId,
        durationSec: 0,
        status: "ABSENT",
      },
    });
  },

  updateAttendanceStatus: (
    attendanceId: string,
    status: "PRESENT" | "LATE" | "ABSENT",
  ) => {
    return prisma.attendance.update({
      where: { id: attendanceId },
      data: { status },
    });
  },

  completeLecture: (lectureId: string) => {
    return prisma.lecture.update({
      where: { id: lectureId },
      data: { status: "COMPLETED" },
    });
  },
};

export default AttendanceRepository;
