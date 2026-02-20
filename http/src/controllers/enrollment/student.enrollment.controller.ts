import type { Request, Response } from "express";
import EnrollmentServices from "../../services/enrollment.services.js";

const StudentEnrollmentController = {
  getEnrolledCourses: async (req: Request, res: Response) => {
    try {
      const courses = await EnrollmentServices.getEnrolledCoursesStudent(
        req.user.id,
      );
      if (!courses)
        return res
          .status(400)
          .json({ success: false, message: "Courses not found" });
      return res.status(200).json({ success: true, courses });
    } catch (error: any) {
      console.log(
        `Failed to fetch enrolled courses for student ${req.user.id} : `,
        error,
      );
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch enrolled courses" });
    }
  },

  getEnrollmentData: async (req: Request, res: Response) => {
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
  },

  getEnrolledCourseById: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const course = await EnrollmentServices.getEnrolledCourseByIdStudent(
        req.user.id,
        id as string,
      );

      if (!course)
        return res
          .status(400)
          .json({ success: false, message: "Course not found" });

      return res.status(200).json({ success: true, course });
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
  },
};

export default StudentEnrollmentController;
