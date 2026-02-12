import {
  getMyLectureByIdForOwnerApi,
  getMyLecturesForOwnerApi,
  getScheduledLectures,
} from "@/services/lecture.services";
import { useQuery } from "@tanstack/react-query";

export const useMyLecturesQuery = () =>
  useQuery({ queryKey: ["my-lectures"], queryFn: getMyLecturesForOwnerApi });

export const useMyLectureQueryById = (lectureId: string) =>
  useQuery({
    queryKey: ["my-lecture", lectureId],
    queryFn: () => getMyLectureByIdForOwnerApi(lectureId),
  });

export const useScheduledLecturesQuery = () =>
  useQuery({ queryKey: ["lectures"], queryFn: getScheduledLectures });
