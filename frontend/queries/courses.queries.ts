import {
  fetchAllCoursesForOwner,
  fetchCourseByIdForOwner,
} from "@/services/course.services";
import { useQuery } from "@tanstack/react-query";

export const useMyCoursesQuery = () =>
  useQuery({ queryKey: ["my-courses"], queryFn: fetchAllCoursesForOwner });

export const useMyCourseQueryById = (courseId: string) =>
  useQuery({
    queryKey: ["my-course", courseId],
    queryFn: () => fetchCourseByIdForOwner(courseId),
  });
