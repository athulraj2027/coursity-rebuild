import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma.js";

// create new lecture
const createByInternalOwner = async (
  title: string,
  startTime: Date,
  courseId: string,
) => {
  return prisma.lecture.create({
    data: {
      title,
      startTime,
      courseId,
    },
  });
};

//  Admin – all lectures
const findAllInternal = async () => {
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
};

//  Teacher – lectures of their own courses
const findAllOwner = async (teacherId: string) => {
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
};

//  Student – lectures of enrolled courses
const findAllStudentLectures = async (studentId: string) => {
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
};

//  Admin – single lecture
const findByIdInternal = async (lectureId: string) => {
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
};

//  Teacher – single lecture (ownership enforced)
const findByIdOwner = async (teacherId: string, lectureId: string) => {
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
};

//  Student – single lecture (enrollment enforced)
const findByIdStudent = async (studentId: string, lectureId: string) => {
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
};

const updateLectureOwner = async (
  lectureId: string,
  userId: string,
  updates: {
    title?: string;
    startTime?: Date;
  },
) => {
  return prisma.lecture.update({
    where: {
      id: lectureId,
      course: {
        teacherId: userId,
      },
    },
    data: updates,
  });
};

const startLectureOwner = async (lectureId: string) => {
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
};

const endLectureOwner = async (lectureId: string) => {
  return prisma.lecture.update({
    where: {
      id: lectureId,
      status: "STARTED",
    },
    data: {
      status: "COMPLETED",
    },
  });
};

const getAllLecturesForACourse = async (courseId: string) => {
  return prisma.lecture.findMany({
    where: { courseId, isDeleted: false },
    select: {
      id: true,
      title: true,
      startTime: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });
};

export default {
  createByInternalOwner,
  findAllInternal,
  findAllOwner,
  findAllStudentLectures,
  findByIdInternal,
  findByIdOwner,
  findByIdStudent,
  updateLectureOwner,
  startLectureOwner,
  endLectureOwner,
  getAllLecturesForACourse,
};
