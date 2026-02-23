/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { createCourseApi } from "@/services/course.services";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { toast } from "sonner";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { useQueryClient } from "@tanstack/react-query";

export const useCourse = () => {
  const queryClient = useQueryClient();
  const createCourse = useCallback(
    async (payload: {
      title: string;
      description: string;
      price: string;
      startDate: Date;
      image: FileWithPreview;
    }) => {
      try {
        // uploadd image and get imageurl
        const imageUrl = await uploadToCloudinary(payload.image.file as File);
        const res: any = await createCourseApi({
          title: payload.title,
          description: payload.description,
          price: payload.price,
          startDate: payload.startDate,
          imageUrl,
        });
        console.log(res);
        if (!res.success) {
          console.log(res.message);
          toast.error(res.message);
          return { success: false };
        }
        queryClient.invalidateQueries({ queryKey: ["my-courses"] });
        toast.success("Course created successfully");

        return res;
        // return
      } catch (err: any) {
        toast.error(err.message);
        console.log(err);
        return { success: false };
      }
    },
    [queryClient],
  );

  return { createCourse };
};
