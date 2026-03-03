import type { Request, Response } from "express";
import { pick } from "../../utils/pick.js";
import CourseServices from "../../services/course.services.js";

const TeacherCourseController = {
  getMyCourses: async (req: Request, res: Response) => {
    const courses = await CourseServices.getCourses(req.user);
    if (!courses)
      return res
        .status(400)
        .json({ success: false, message: "Your courses not found" });
    return res.status(200).json(courses);
  },

  getMyCourseById: async (req: Request, res: Response) => {
    const id = req.params.id;

    const course = await CourseServices.getCourseById(id as string, req.user);
    if (!course)
      return res
        .status(400)
        .json({ success: false, message: "The course not found" });
    return res.status(200).json(course);
  },

  createCourse: async (req: Request, res: Response) => {
    const { title, description, imageUrl, price, startDate } = req.body;

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
  },

  editCourse: async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    console.log("id : ", id);
    console.log("req body : ", req.body);

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
  },
};

export default TeacherCourseController;
