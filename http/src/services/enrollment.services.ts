import EnrollmentRepositories from "../repositories/enrollment.repositories.js";

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

  enrollCourse: async (data: any) =>
    EnrollmentRepositories.enrollToCourse(data),
};

export default EnrollmentServices;
