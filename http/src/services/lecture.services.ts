import CourseRepositories from "../repositories/courses.repositories.js";
import LectureRepositories from "../repositories/lectures.repositories.js";
import { AppError } from "../utils/AppError.js";

const LectureServices = {
  getLectures: async (user: any) => {
    switch (user.role) {
      case "ADMIN":
        return LectureRepositories.findAllInternal();
      case "TEACHER":
        return LectureRepositories.findAllOwner(user.id);
      case "STUDENT":
        return LectureRepositories.findAllStudentLectures(user.id);
    }
  },

  getLectureById: async (lectureId: string, user: any) => {
    switch (user.role) {
      case "ADMIN":
        return LectureRepositories.findByIdInternal(lectureId);
      case "TEACHER":
        return LectureRepositories.findByIdOwner(user.id, lectureId);
      case "STUDENT":
        return LectureRepositories.findByIdStudent(user.id, lectureId);
    }
  },

  createLecture: async (
    title: string,
    startTime: Date,
    courseId: string,
    userId: string,
  ) => {
    const ownsCourse = await CourseRepositories.isCourseOwnedByUser(
      userId,
      courseId,
    );
    if (!ownsCourse) throw new AppError("You do not own this course", 403);
    return LectureRepositories.createByInternalOwner(
      title,
      startTime,
      courseId,
    );
  },

  editLecture: async (lectureId: string, user: any, updates: any) => {
    const lecture = await LectureRepositories.findByIdOwner(user.id, lectureId);
    if (!lecture) throw new AppError("Lecture not found", 400);
    if (lecture.status !== "NOT_STARTED")
      throw new AppError("Only lectures not started is allowed to edit", 403);
    return LectureRepositories.updateLectureOwner(lectureId, user.id, updates);
  },

  startLecture: async (lectureId: string, userId: string) => {
    const lecture = await LectureRepositories.findByIdOwner(userId, lectureId);
    if (!lecture) throw new AppError("No lecture found", 400);

    if (lecture.status !== "NOT_STARTED")
      throw new AppError("Lecture can't be started again", 403);
    return LectureRepositories.startLectureOwner(lecture.id);
  },

  endLecture: async (lectureId: string, userId: string) => {
    const lecture = await LectureRepositories.findByIdOwner(userId, lectureId);
    if (!lecture) throw new AppError("No lecture found", 400);
    if (lecture.status !== "STARTED")
      throw new AppError("Lecture is not started", 403);
    // update attendance
    return LectureRepositories.endLectureOwner(lectureId);
  },
};

export default LectureServices;
