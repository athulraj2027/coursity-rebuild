import type { Request, Response } from "express";
import CourseServices from "../../services/course.services.js";
import CourseRepositories from "../../repositories/courses/courses.repositories.js";

const AdminCoursesController = {
  getCourses: async (req: Request, res: Response) => {
    try {
      const courses = await CourseServices.getCourses(req.user);
      if (!courses)
        return res
          .status(400)
          .json({ success: false, message: "Courses not found" });
      return res.status(200).json(courses);
    } catch (error) {
      console.log("Error in getting all courses for admin : ", error);
      return res
        .status(500)
        .json({ success: false, message: "Couldn't get courses" });
    }
  },

  getCourse: async (req: Request, res: Response) => {
    try {
      const course = await CourseServices.getCourseById(req.user);
      if (!course)
        return res
          .status(400)
          .json({ success: false, message: "Course not found" });
      return res.status(200).json(course);
    } catch (error) {
      console.log("Error in getting course for admin : ", error);
      return res
        .status(500)
        .json({ success: false, message: "Couldn't get course" });
    }
  },

  patchCourse: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const isDisabled = req.body;
      const course = await CourseRepositories.toggleDisableCourseInternal(
        id as string,
        isDisabled,
      );
      return res.status(200).json(course);
    } catch (error) {}
  },
};

export default AdminCoursesController;
