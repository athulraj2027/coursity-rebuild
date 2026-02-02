import CourseRepositories from "../repositories/courses/courses.repositories.js";

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

  getCourseById: async (user?: any) => {
    if (!user.role) return CourseRepositories.findByIdPublic;
    switch (user.role) {
      case "ADMIN":
        return CourseRepositories.findByIdInternal;
      case "STUDENT":
        return CourseRepositories.findByIdPublic;
    }
  },

  patchCourse: async (user: any) => {
    switch (user.role) {
      case "ADMIN":
        return;
      case "TEACHER":
        return;
    }
  },

  putCourse: async (user: any) => {
    switch (user.role) {
      case "ADMIN":
        return;
      case "TEACHER":
        return;
    }
  },
};

export default CourseServices;
