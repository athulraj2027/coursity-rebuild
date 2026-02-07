/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { FileWithPreview } from "./use-file-upload";
import { createCourseApi } from "@/services/course.services";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { toast } from "sonner";

export const useCourse = () => {
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
        console.log("image url : ", imageUrl);
        // create course
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
        toast.success("Course created successfully");
        return { success: true, course: res.course };
        // return
      } catch (err: any) {
        toast.error(err.message);
        console.log(err);
        return { success: false };
      }
    },
    [],
  );

  return { createCourse };
};
