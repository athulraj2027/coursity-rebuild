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

  upsertAttendance: async ({
    lectureId,
    studentId,
    durationSec,
    status,
  }: {
    lectureId: string;
    studentId: string;
    durationSec: number;
    status: "PRESENT" | "LATE" | "ABSENT";
  }) => {
    return prisma.attendance.upsert({
      where: {
        studentId_lectureId: {
          studentId,
          lectureId,
        },
      },
      update: {
        durationSec,
        status,
      },
      create: {
        lectureId,
        studentId,
        durationSec,
        status,
      },
    });
  },
};

export default AttendanceRepository;
