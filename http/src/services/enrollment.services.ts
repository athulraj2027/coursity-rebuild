import EnrollmentRepositories from "../repositories/enrollment.repositories.js";
import { AppError } from "../utils/AppError.js";

const getEnrolledCoursesStudent = async (userId: string) =>
  EnrollmentRepositories.findEnrolledCourses(userId);

const getEnrolledCourseByIdStudent = async (userId: string, courseId: string) =>
  EnrollmentRepositories.findEnrolledCourseById(userId, courseId);

const getCourseEnrollmentsForOwner = async (userId: string) => {};

const getCourseEnrollmentsOfCourseForOwner = async (
  userId: string,
  courseId: string,
) => {};

const getEnrollmentDataById = async (id: string, userId: string) => {
  const enrollment = await EnrollmentRepositories.getEnrollmentById(id, userId);

  if (!enrollment) throw new AppError("Enrollment not found", 400);

  return await EnrollmentRepositories.enrollmentDataById(id, userId);
};

export default {
  getCourseEnrollmentsForOwner,
  getCourseEnrollmentsOfCourseForOwner,
  getEnrolledCourseByIdStudent,
  getEnrollmentDataById,
  getEnrolledCoursesStudent,
};
