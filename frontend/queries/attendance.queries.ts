import { getAttendanceApi } from "@/services/attendance.services";
import { useQuery } from "@tanstack/react-query";

export const useMyAttendanceQuery = (courseId: string) =>
  useQuery({
    queryKey: ["attendance", courseId],
    queryFn: () => getAttendanceApi(courseId),
  });
