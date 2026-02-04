import CourseRepositories from "../repositories/courses.repositories.js";
import LectureRepositories from "../repositories/lectures.repositories.js";

const LectureServices = {
  getLectures: async (user: any) => {
    switch (user.role) {
      case "ADMIN":
        return LectureRepositories.findAllInternal();
      case "TEACHER":
        return LectureRepositories.findAllOwner(user.id);
      case "STUDENT":
        return LectureRepositories.findAllStudent(user.id);
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
    if (!ownsCourse) throw new Error("You do not own this course");
    return LectureRepositories.createByInternalOwner(
      title,
      startTime,
      courseId,
      userId,
    );
  },

  editLecture: async (lectureId: string, user: any, updates: any) => {
    const lecture = await LectureRepositories.findByIdOwner(user.id, lectureId);
    if (!lecture) throw new Error("Lecture not found");
    if (lecture.status !== "NOT_STARTED")
      throw new Error("Only lectures not started is allowed to edit");

    return LectureRepositories.updateLectureOwner(lectureId, user.id, updates);
  },

  startLecture: async (lectureId: string, userId: string) => {
    const lecture = await LectureRepositories.findByIdOwner(userId, lectureId);
    if (!lecture) throw new Error("No lecture found");

    if (lecture.status !== "NOT_STARTED")
      throw new Error("Lecture can't be started again");

    return LectureRepositories.startLectureOwner(lecture.id);
  },

  endLecture: async (lectureId: string, userId: string) => {
    const lecture = await LectureRepositories.findByIdOwner(userId, lectureId);
    if (!lecture) throw new Error("No lecture found");
    if (lecture.status !== "STARTED") throw new Error("Lecture is not started");
    // update attendance
    return LectureRepositories.endLectureOwner(lectureId);
  },
};

export default LectureServices;
