import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma.js";

const LectureRepositories = {
  // create new lecture
  async createByInternalOwner(
    title: string,
    startTime: Date,
    courseId: string,
    userId: string,
  ) {},

  //  Admin – all lectures
  async findAllInternal() {
    return prisma.lecture.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
            teacher: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });
  },

  //  Teacher – lectures of their own courses
  async findAllOwner(teacherId: string) {
    return prisma.lecture.findMany({
      where: {
        course: {
          teacherId,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  },

  //  Student – lectures of enrolled courses
  async findAllStudent(studentId: string) {
    return prisma.lecture.findMany({
      where: {
        course: {
          enrollments: {
            some: {
              studentId,
            },
          },
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  },

  //  Admin – single lecture
  async findByIdInternal(lectureId: string) {
    return prisma.lecture.findUnique({
      where: { id: lectureId },
      include: {
        course: {
          include: {
            teacher: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        participants: true,
        attendance: true,
      },
    });
  },

  //  Teacher – single lecture (ownership enforced)
  async findByIdOwner(teacherId: string, lectureId: string) {
    return prisma.lecture.findFirst({
      where: {
        id: lectureId,
        course: {
          teacherId,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        attendance: true,
      },
    });
  },

  //  Student – single lecture (enrollment enforced)
  async findByIdStudent(studentId: string, lectureId: string) {
    return prisma.lecture.findFirst({
      where: {
        id: lectureId,
        course: {
          enrollments: {
            some: {
              studentId,
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        startTime: true,
        status: true,
        meetingId: true,
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  },

  async updateLectureOwner(
    lectureId: string,
    userId: string,
    updates: {
      title?: string;
      startTime?: Date;
    },
  ) {
    return prisma.lecture.update({
      where: {
        id: lectureId,
        course: {
          teacherId: userId,
        },
      },
      data: updates,
    });
  },

  async startLectureOwner(lectureId: string) {
    return prisma.lecture.update({
      where: {
        id: lectureId,
        status: "NOT_STARTED", // guards double start
      },
      data: {
        status: "STARTED",
        meetingId: randomUUID(),
      },
    });
  },

  async endLectureOwner(lectureId: string) {
    return prisma.lecture.update({
      where: {
        id: lectureId,
        status: "STARTED",
      },
      data: {
        status: "COMPLETED",
      },
    });
  },
};

export default LectureRepositories;
