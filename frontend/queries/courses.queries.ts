import {
  fetchAllCoursesForOwner,
  fetchAllCoursesForPublic,
  fetchCourseByIdForOwner,
  fetchCourseByIdForPublic,
  fetchEnrolledCourses,
} from "@/services/course.services";
import { useQuery } from "@tanstack/react-query";

export const useMyCoursesQuery = () =>
  useQuery({ queryKey: ["my-courses"], queryFn: fetchAllCoursesForOwner });

export const useMyCourseQueryById = (courseId: string) =>
  useQuery({
    queryKey: ["my-course", courseId],
    queryFn: () => fetchCourseByIdForOwner(courseId),
  });

export const useAllCoursesQueryPublic = () =>
  useQuery({ queryKey: ["all-courses"], queryFn: fetchAllCoursesForPublic });

export const useCourseByIdQueryPublic = (courseId: string) =>
  useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourseByIdForPublic(courseId),
  });

export const useEnrolledCoursesQuery = () =>
  useQuery({ queryKey: ["enrolled-courses"], queryFn: fetchEnrolledCourses });
