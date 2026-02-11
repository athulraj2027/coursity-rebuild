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

  async enrollToCourse(params: {
    paymentId: string;
    courseId: string;
    user: any;
  }) {
    return prisma.enrollment.create({
      data: {
        studentId: params.user.id,
        courseId: params.courseId,
        paymentId: params.paymentId,
      },
    });
  },
};

export default EnrollmentRepositories;
