import { prisma } from "../lib/prisma.js";

const CourseRepositories = {
  async CreateCourseOwnerInternal(
    title: string,
    description: string,
    imageUrl: string,
    priceString: string,
    startDate: Date,
    userId: string,
  ) {
    return prisma.course.create({
      data: {
        title,
        description,
        imageUrl,
        price: Number(priceString),
        startDate,
        teacherId: userId,
      },
    });
  },

  // Full data (admin / internal use)
  async findAllInternal() {
    return prisma.course.findMany({
      include: {
        teacher: {
          select: { id: true, name: true, email: true },
        },
        enrollments: true,
        lectures: true,
      },
    });
  },

  async isCourseOwnedByUser(userId: string, courseId: string) {
    return prisma.course.findFirst({
      where: {
        id: courseId,
        teacherId: userId,
        isDeleted: false,
      },
      select: { id: true },
    });
  },

  // Public-safe course list
  async findAllPublic() {
    return prisma.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        teacher: {
          select: { id: true, name: true },
        },
        createdAt: true,
      },
    });
  },

  // Full single course view
  async findByIdInternal(courseId: string) {
    return prisma.course.findUnique({
      where: { id: courseId },
      include: {
        teacher: true,
        lectures: true,
        enrollments: true,
      },
    });
  },

  // Public single course view
  async findByIdPublic(courseId: string) {
    return prisma.course.findUnique({
      where: { id: courseId },
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
    });
  },

  // Fetching teacher's courses
  async findByIdInternalOwnerView(courseId: string, teacherId: string) {
    return prisma.course.findFirst({
      where: {
        id: courseId,
        teacherId: teacherId,
      },
      include: {
        teacher: {
          select: { id: true, name: true, email: true },
        },
        lectures: true,
        enrollments: {
          include: {
            student: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });
  },

  // Fetching teacher's course with id
  async findAllInternalOwnerView(teacherId: string) {
    return prisma.course.findMany({
      where: {
        teacherId: teacherId,
      },
      include: {
        lectures: true,
        enrollments: {
          select: {
            id: true,
          },
        },
      },
    });
  },

  // fetch all the enrolled courses for student
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

  // disable course by admin
  async toggleDisableCourseInternal(courseId: string, isDisabled: boolean) {
    return prisma.course.update({
      where: { id: courseId },
      data: { isDisabled },
    });
  },

  async patchCourseByOwner(
    courseId: string,
    teacherId: string,
    safeUpdates: any,
  ) {
    return prisma.course.update({
      where: { id: courseId, teacherId },
      data: safeUpdates,
    });
  },
};

export default CourseRepositories;
