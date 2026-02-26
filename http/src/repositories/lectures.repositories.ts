import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma.js";

const LectureRepositories = {
  // create new lecture
  async createByInternalOwner(
    title: string,
    startTime: Date,
    courseId: string,
  ) {
    return prisma.lecture.create({
      data: {
        title,
        startTime,
        courseId,
      },
    });
  },

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
        isDeleted: false,
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
  async findAllStudentLectures(studentId: string) {
    return prisma.lecture.findMany({
      where: {
        isDeleted: false,
        course: {
          enrollments: {
            some: {
              studentId,
            },
          },
          isDeleted: false,
          isDisabled: false,
        },
      },

      orderBy: {
        startTime: "asc",
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
            isDeleted: true,
            isDisabled: true,
            teacher: {
              select: {
                id: true,
                name: true,
              },
            },
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
        isDeleted: false,
        course: {
          teacherId,
          isDeleted: false,
          isDisabled: false,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            price: true,
            startDate: true,
            _count: {
              select: {
                enrollments: true,
                lectures: { where: { isDeleted: false } },
              },
            },
          },
        },

        // Academic truth
        attendance: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            durationSec: "desc",
          },
        },

        // Realtime truth
        participants: {
          select: {
            id: true,
            userId: true,
            role: true,
            joinTime: true,
            leaveTime: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },

        _count: {
          select: {
            attendance: true,
            participants: true,
          },
        },
      },
    });
  },

  //  Student – single lecture (enrollment enforced)
  async findByIdStudent(studentId: string, lectureId: string) {
    return prisma.lecture.findFirst({
      where: {
        id: lectureId,
        isDeleted: false,
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
            isEnrollmentOpen: true,
            isDeleted: true,
            isDisabled: true,
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
