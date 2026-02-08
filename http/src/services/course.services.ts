import CourseRepositories from "../repositories/courses.repositories.js";

const CourseServices = {
  getCourses: async (user?: any) => {
    if (!user.role) return CourseRepositories.findAllPublic;
    switch (user.role) {
      case "ADMIN":
        return CourseRepositories.findAllInternal;
      case "STUDENT":
        return CourseRepositories.findAllPublic;
      case "TEACHER":
        return CourseRepositories.findAllInternalOwnerView(user.id);
    }
  },

  getCourseById: async (courseId: string, user?: any) => {
    if (!user.role) return CourseRepositories.findByIdPublic(courseId);
    switch (user.role) {
      case "ADMIN":
        return CourseRepositories.findByIdInternal(courseId);
      case "STUDENT":
        return CourseRepositories.findByIdPublic(courseId);
      case "TEACHER":
        return CourseRepositories.findByIdInternalOwnerView(courseId, user.id);
    }
  },

  createCourse: async (
    title: string,
    description: string,
    imageUrl: string,
    price: string,
    startDate: Date,
    user: any,
  ) => {
    return CourseRepositories.CreateCourseOwnerInternal(
      title,
      description,
      imageUrl,
      price,
      startDate,
      user.id,
    );
  },

  patchCourseById: async (courseId: string, user: any, data: any) => {
    switch (user.role) {
      case "ADMIN":
        return CourseRepositories.toggleDisableCourseInternal(courseId, data);
      case "TEACHER":
        return CourseRepositories.patchCourseByOwner(courseId, user.id, data);
    }
  },

  getEnrolledCoursesStudent: async (userId: string) => {
    return CourseRepositories.findEnrolledCourses(userId);
  },

  getEnrolledCourseByIdStudent: async (userId: string, courseId: string) => {
    return CourseRepositories.findEnrolledCourseById(userId, courseId);
  },
};

export default CourseServices;
