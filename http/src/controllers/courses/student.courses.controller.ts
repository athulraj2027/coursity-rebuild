import type { Request, Response } from "express";
import CourseRepositories from "../../repositories/courses/courses.repositories.js";

const StudentCoursesController = {
  getEnrolledCourses: async (req: Request, res: Response) => {
    try {
      const courses = await CourseRepositories.findEnrolledCourses(req.user.id);
      if (!courses)
        return res
          .status(400)
          .json({ success: false, message: "Courses not found" });
      return res.status(200).json({ success: true, courses });
    } catch (error) {
      console.log(
        `Failed to fetch enrolled courses for student ${req.user.id} : `,
        error,
      );
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch enrolled courses" });
    }
  },

  getEnrolledCourseById: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const course = await CourseRepositories.findEnrolledCourseById(
        req.user.id,
        id as string,
      );

      if (!course)
        return res
          .status(400)
          .json({ success: false, message: "Course not found" });
    } catch (error) {
      console.log(
        `Failed to fetch enrolled course ${id} for student ${req.user.id} : `,
        error,
      );
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch enrolled course" });
    }
  },
};

export default StudentCoursesController;
