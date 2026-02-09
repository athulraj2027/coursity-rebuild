import { createLectureApi } from "@/services/lecture.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateLecture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      title: string;
      startTime: Date;
      courseId: string;
    }) => createLectureApi(payload),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) =>
      queryClient.invalidateQueries({
        queryKey: ["my-course", data.courseId],
      }),
  });
};
