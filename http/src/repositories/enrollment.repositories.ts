import { prisma } from "../lib/prisma.js";

const EnrollmentRepositories = {
  async findEnrolledCourses(studentId: string) {
    return prisma.enrollment.findMany({
      where: {
        studentId,
      },
      select: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            price: true,
            startDate: true,

            teacher: {
              select: {
                id: true,
                name: true,
              },
            },

            lectures: {
              where: {
                isDeleted: false,
              },
              select: {
                id: true,
                title: true,
                startTime: true,
                status: true,
              },
              orderBy: {
                startTime: "asc",
              },
            },

            _count: {
              select: {
                enrollments: true,
              },
            },
          },
        },
      },
    });
  },

  // fetch course which student enrolled with id
  async findEnrolledCourseById(studentId: string, courseId: string) {
    return prisma.enrollment.findFirst({
      where: {
        studentId,
        courseId,
      },
      select: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            teacher: {
              select: { id: true, name: true },
            },
            lectures: {
              select: {
                id: true,
                title: true,
                startTime: true,
                status: true,
              },
            },
          },
        },
      },
    });
  },

  async enrollmentDataById(id: string, userId: string) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id, studentId: userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            price: true,
            startDate: true,
            teacher: {
              select: {
                id: true,
                name: true,
              },
            },
            lectures: {
              where: { isDeleted: false },
              orderBy: { startTime: "asc" },
              select: {
                id: true,
                title: true,
                startTime: true,
                status: true,
              },
            },
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
          },
        },
      },
    });

    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    return {
      success: true,
      enrollmentId: enrollment.id,
      course: enrollment.course,
      payment: enrollment.payment,
    };
  },

  async getEnrollmentById(id: string, userId: string) {
    return prisma.enrollment.findUnique({
      where: { id, studentId: userId },
    });
  },
};

export default EnrollmentRepositories;
