import type { Request, Response } from "express";
import { pick } from "../../utils/pick.js";
import CourseServices from "../../services/course.services.js";

const TeacherCourseController = {
  getMyCourses: async (req: Request, res: Response) => {
    try {
      const courses = await CourseServices.getCourses(req.user.id);
      if (!courses)
        return res
          .status(400)
          .json({ success: false, message: "Your courses not found" });
      return res.status(200).json(courses);
    } catch (error) {
      console.log("Error in getting teacher's courses : ", error);
      return res
        .status(500)
        .json({ success: false, message: "Couldnt fetch courses" });
    }
  },

  getMyCourseById: async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const course = await CourseServices.getCourseByIdOwner(
        id as string,
        req.user.id,
      );
      if (!course)
        return res
          .status(400)
          .json({ success: false, message: "The course not found" });
      return res.status(200).json(course);
    } catch (error) {
      console.log(`DError in getting teacher's course with id ${id} : `, error);
      return res
        .status(500)
        .json({ success: false, message: "Couldnt fetch course" });
    }
  },

  createCourse: async (req: Request, res: Response) => {
    const { title, description, imageUrl } = req.body;
    try {
      const course = await CourseServices.createCourse(
        title,
        description,
        imageUrl,
        req.user,
      );
      if (!course)
        return res
          .status(400)
          .json({ success: false, message: "Couldn't create course" });
    } catch (error) {
      console.log("Failed to create course : ", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to create course" });
    }
  },

  patchCourse: async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = [
      "title",
      "description",
      "imageUrl",
      "isEnrollmentOpen",
      "isDeleted",
    ];

    const safeUpdates = pick(updates, allowedFields);
    try {
      const course = await CourseServices.patchCourseById(
        id as string,
        req.user,
        safeUpdates,
      );
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found or access denied",
        });
      }
      return res.status(200).json(course);
    } catch (error) {
      console.log("Failed to update course : ", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to update course" });
    }
  },
};

export default TeacherCourseController;
