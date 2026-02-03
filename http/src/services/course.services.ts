import CourseRepositories from "../repositories/courses.repositories.js";

const CourseServices = {
  getCourses: async (user?: any) => {
    if (!user.role) return CourseRepositories.findAllPublic;
    switch (user.role) {
      case "ADMIN":
        return CourseRepositories.findAllInternal;
      case "STUDENT":
        return CourseRepositories.findAllPublic;
    }
  },

  getCourseById: async (courseId: string, user?: any) => {
    if (!user.role) return CourseRepositories.findByIdPublic(courseId);
    switch (user.role) {
      case "ADMIN":
        return CourseRepositories.findByIdInternal(courseId);
      case "STUDENT":
        return CourseRepositories.findByIdPublic(courseId);
    }
  },

  createCourse: async (
    title: string,
    description: string,
    imageUrl: string,
    user: any,
  ) => {
    return CourseRepositories.CreateCourseOwnerInternal(
      title,
      description,
      imageUrl,
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

  getCoursesOwner: async (userId: string) => {
    return CourseRepositories.findAllInternalOwnerView(userId);
  },

  getCourseByIdOwner: async (courseId: string, userId: string) => {
    return CourseRepositories.findByIdInternalOwnerView(courseId, userId);
  },

  getEnrolledCoursesStudent: async (userId: string) => {
    return CourseRepositories.findEnrolledCourses(userId);
  },

  getEnrolledCourseByIdStudent: async (userId: string, courseId: string) => {
    return CourseRepositories.findEnrolledCourseById(userId, courseId);
  },
};

export default CourseServices;
