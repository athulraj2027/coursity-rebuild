import { prisma } from "../lib/prisma.js";

const findLectureById = (lectureId: string) => {
  return prisma.lecture.findUnique({
    where: { id: lectureId },
    select: {
      id: true,
      status: true,
      startTime: true,
      courseId: true,
    },
  });
};

const isStudentEnrolled = (studentId: string, courseId: string) => {
  return prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId,
      },
    },
  });
};

const findAttendanceByStudentAndLectureIds = async (
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
};

const findLectureWithCourse = (lectureId: string) => {
  return prisma.lecture.findUnique({
    where: { id: lectureId },
    include: {
      course: true,
    },
  });
};

const getEnrollmentsByCourseId = (courseId: string) => {
  return prisma.enrollment.findMany({
    where: { courseId },
    select: { studentId: true },
  });
};

const getAttendancesByLectureId = (lectureId: string) => {
  return prisma.attendance.findMany({
    where: { lectureId },
  });
};

const markAbsent = (lectureId: string, studentId: string) => {
  return prisma.attendance.create({
    data: {
      lectureId,
      studentId,
      durationSec: 0,
      status: "ABSENT",
    },
  });
};

const updateAttendanceStatus = (
  attendanceId: string,
  status: "PRESENT" | "LATE" | "ABSENT",
) => {
  return prisma.attendance.update({
    where: { id: attendanceId },
    data: { status },
  });
};

const upsertAttendance = async ({
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
};

const getAttendanceForCourse = async (courseId: string) => {
  return await prisma.attendance.findMany({
    where: {
      lecture: {
        courseId: courseId,
      },
    },
    select: {
      lectureId: true,
      studentId: true,
      durationSec: true,
      status: true,
    },
  });
};

export default {
  findLectureById,
  isStudentEnrolled,
  findAttendanceByStudentAndLectureIds,
  findLectureWithCourse,
  getEnrollmentsByCourseId,
  getAttendanceForCourse,
  upsertAttendance,
  updateAttendanceStatus,
  markAbsent,
  getAttendancesByLectureId,
};
