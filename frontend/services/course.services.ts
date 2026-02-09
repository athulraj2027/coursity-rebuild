import { apiRequest } from "@/lib/apiClient";

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

export const fetchAllCoursesForOwner = () =>
  apiRequest({ path: "/courses/teacher/my", method: "GET" });

export const fetchCourseByIdForOwner = (courseId: string) =>
  apiRequest({ path: `/courses/teacher/my/${courseId}`, method: "GET" });

export const fetchAllCoursesForPublic = () =>
  apiRequest({ path: `/courses`, method: "GET" });
