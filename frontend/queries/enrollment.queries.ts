import { getEnrollment } from "@/services/enrollment.services";
import { useQuery } from "@tanstack/react-query";

export const useMyEnrollmentQuery = (enrollmentId: string) =>
  useQuery({
    queryKey: ["enrollment"],
    queryFn: () => getEnrollment(enrollmentId),
    retry: false,
  });
