import type { Request, Response } from "express";
import { pick } from "../../utils/pick.js";
import CourseServices from "../../services/course.services.js";

const TeacherCourseController = {
  getMyCourses: async (req: Request, res: Response) => {
    try {
      // console.log("req user : ", req.user);
      const courses = await CourseServices.getCourses(req.user);
      if (!courses)
        return res
          .status(400)
          .json({ success: false, message: "Your courses not found" });
      // console.log("courses : ", courses);
      return res.status(200).json(courses);
    } catch (error: any) {
      console.log("Error in getting teacher's courses : ", error);
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: "Couldnt fetch courses" });
    }
  },

  getMyCourseById: async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const course = await CourseServices.getCourseById(id as string, req.user);
      if (!course)
        return res
          .status(400)
          .json({ success: false, message: "The course not found" });
      return res.status(200).json(course);
    } catch (error: any) {
      console.log(`DError in getting teacher's course with id ${id} : `, error);
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: "Couldnt fetch course" });
    }
  },

  createCourse: async (req: Request, res: Response) => {
    const { title, description, imageUrl, price, startDate } = req.body;
    try {
      const course = await CourseServices.createCourse(
        title,
        description,
        imageUrl,
        price,
        startDate,
        req.user,
      );
      if (!course)
        return res
          .status(400)
          .json({ success: false, message: "Couldn't create course" });
      return res.status(200).json({ success: true, course });
    } catch (error: any) {
      console.log("Failed to create course : ", error);
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
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
    } catch (error: any) {
      console.log("Failed to update course : ", error);
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: "Failed to update course" });
    }
  },

  editCourse: async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    console.log("id : ", id);
    console.log("req body : ", req.body);
    try {
      const updatedCourse = await CourseServices.editCourseById(
        user.id,
        id as string,
        req.body,
      );
      if (!updatedCourse)
        return res
          .status(400)
          .json({ success: false, message: "Updating course failed" });

      return res.status(200).json({ success: true, updatedCourse });
    } catch (error: any) {
      console.log("Failed to update course : ", error);
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: "Failed to update course" });
    }
  },
};

export default TeacherCourseController;
