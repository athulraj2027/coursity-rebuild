import EnrollmentRepositories from "../repositories/enrollment.repositories.js";
import { AppError } from "../utils/AppError.js";

const EnrollmentServices = {
  getEnrolledCoursesStudent: async (userId: string) =>
    EnrollmentRepositories.findEnrolledCourses(userId),

  getEnrolledCourseByIdStudent: async (userId: string, courseId: string) =>
    EnrollmentRepositories.findEnrolledCourseById(userId, courseId),

  getCourseEnrollmentsForOwner: async (userId: string) => {},

  getCourseEnrollmentsOfCourseForOwner: async (
    userId: string,
    courseId: string,
  ) => {},

  getEnrollmentDataById: async (id: string, userId: string) => {
    const enrollment = await EnrollmentRepositories.getEnrollmentById(
      id,
      userId,
    );

    if (!enrollment) throw new AppError("Enrollment not found", 400);

    return await EnrollmentRepositories.enrollmentDataById(id, userId);
  },
};

export default EnrollmentServices;
