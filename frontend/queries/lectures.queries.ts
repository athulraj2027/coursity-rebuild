import {
  getMyLectureByIdForOwnerApi,
  getMyLecturesForOwnerApi,
} from "@/services/lecture.services";
import { useQuery } from "@tanstack/react-query";

export const useMyLecturesQuery = () =>
  useQuery({ queryKey: ["my-lectures"], queryFn: getMyLecturesForOwnerApi });

export const useMyLectureQueryById = (lectureId: string) =>
  useQuery({
    queryKey: ["my-lecture", lectureId],
    queryFn: () => getMyLectureByIdForOwnerApi(lectureId),
  });
