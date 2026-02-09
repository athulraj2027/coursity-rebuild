import { getMyLecturesForOwnerApi } from "@/services/lecture.services";
import { useQuery } from "@tanstack/react-query";

export const useMyLecturesQuery = () =>
  useQuery({ queryKey: ["my-lectures"], queryFn: getMyLecturesForOwnerApi });
