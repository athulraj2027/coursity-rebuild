import { apiRequest } from "@/lib/apiClient";
import { Course, CourseForTeacher } from "@/queries/courses.queries";

interface EditCoursePayload {
  title?: string;
  description?: string;
  price?: number; // already converted to paise
  startDate?: Date;
  imageUrl?: string;
}

export interface PublicCourse {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  price: number;
  startDate: string;
  isEnrollmentOpen: boolean;
  isEnrolled: boolean;
  teacher: {
    name: string;
  } | null;
  _count: {
    lectures: number;
  };
}

export const createCourseApi = ({
  title,
  description,
  price,
  startDate,
  imageUrl,
}: {
  title: string;
  description: string;
  price: string;
  startDate: Date;
  imageUrl: string;
}) => {
  return apiRequest({
    path: "/courses/teacher",
    method: "POST",
    body: { title, description, imageUrl, price, startDate },
  });
};

export const editCourseApi = (id: string, payload: EditCoursePayload) =>
  apiRequest({
    path: `/courses/teacher/edit/${id}`,
    method: "PUT",
    body: payload,
  });

export const fetchAllCoursesForOwner = (): Promise<CourseForTeacher[]> =>
  apiRequest({ path: "/courses/teacher/my", method: "GET" });

export const fetchCourseByIdForOwner = (courseId: string) =>
  apiRequest({ path: `/courses/teacher/my/${courseId}`, method: "GET" });

export const fetchAllCoursesForPublic = (): Promise<Course[]> =>
  apiRequest({ path: `/courses`, method: "GET" });

export const fetchCourseByIdForPublic = (courseId: string) =>
  apiRequest<PublicCourse>({ path: `/courses/${courseId}`, method: "GET" });

export const fetchEnrolledCourses = () =>
  apiRequest({ path: "/enrollment/student/my", method: "GET" });

export const fetchAllCourses = () =>
  apiRequest({ path: "/courses", method: "GET" });

export const fetchCourseByIdAdmin = (id: string) =>
  apiRequest({ path: `/courses/admin/${id}`, method: "GET" });
