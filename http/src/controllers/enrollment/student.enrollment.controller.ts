import type { Request, Response } from "express";
import EnrollmentServices from "../../services/enrollment.services.js";

const getEnrolledCourses = async (req: Request, res: Response) => {
  const courses = await EnrollmentServices.getEnrolledCoursesStudent(
    req.user.id,
  );
  if (!courses)
    return res
      .status(400)
      .json({ success: false, message: "Courses not found" });
  return res.status(200).json({ success: true, courses });
};

const getEnrollmentData = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const enrollmentData = await EnrollmentServices.getEnrollmentDataById(
      id as string,
      user.id,
    );

    if (!enrollmentData)
      return res
        .status(400)
        .json({ success: false, message: "Data not found" });

    return res.status(200).json({ success: true, enrollmentData });
  } catch (error: any) {
    console.log(
      `Failed to fetch enrolled course ${id} for student ${req.user.id} : `,
      error,
    );
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch enrolled course" });
  }
};

const getEnrolledCourseById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const course = await EnrollmentServices.getEnrolledCourseByIdStudent(
    req.user.id,
    id as string,
  );

  if (!course)
    return res
      .status(400)
      .json({ success: false, message: "Course not found" });

  return res.status(200).json({ success: true, course });
};

export default { getEnrolledCourseById, getEnrollmentData, getEnrolledCourses };
