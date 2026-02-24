import { getEnrollment } from "@/services/enrollment.services";
import { useQuery } from "@tanstack/react-query";

interface Teacher {
  id: string;
  name: string;
}

interface Lecture {
  id: string;
  title: string;
  startTime: string;
  status: string; // "COMPLETED" | "IN_PROGRESS" | etc.
}

interface Course {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price: number;
  startDate: string;
  teacher: Teacher;
  lectures?: Lecture[];
}

interface Payment {
  id: string;
  amount: number; // in paise
  currency: string; // "INR"
  status: string; // "PAID", etc.
}

interface EnrollmentData {
  success: boolean;
  enrollmentId: string;
  course: Course;
  payment: Payment;
}

export interface EnrollmentApiResponse {
  success: boolean;
  enrollmentData: EnrollmentData;
}

export const useMyEnrollmentQuery = (enrollmentId: string) =>
  useQuery<EnrollmentApiResponse>({
    queryKey: ["enrollment"],
    queryFn: () => getEnrollment(enrollmentId),
    retry: false,
  });
