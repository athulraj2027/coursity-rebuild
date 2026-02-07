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
