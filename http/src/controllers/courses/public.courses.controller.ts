import type { Request, Response } from "express";
import CourseServices from "../../services/course.services.js";

const PublicCoursesController = {
  getCourses: async (req: Request, res: Response) => {
    try {
      const courses = await CourseServices.getCourses();
      if (!courses)
        return res
          .status(400)
          .json({ success: false, message: "Courses not found" });
      return res.status(200).json(courses);
    } catch (error) {
      console.log("Error in getting all courses for public : ", error);
      return res
        .status(500)
        .json({ success: false, message: "Couldn't get courses" });
    }
  },

  getCourse: async (req: Request, res: Response) => {
    try {
      const course = await CourseServices.getCourseById();
      if (!course)
        return res
          .status(400)
          .json({ success: false, message: "Course not found" });
      return res.status(200).json(course);
    } catch (error) {
      console.log("Error in getting course for public : ", error);
      return res
        .status(500)
        .json({ success: false, message: "Couldn't get course" });
    }
  },
};

export default PublicCoursesController;
