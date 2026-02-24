/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { createCourseApi, editCourseApi } from "@/services/course.services";
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

  const editCourse = useCallback(
    async (
      courseId: string,
      payload: {
        title?: string;
        description?: string;
        price?: string;
        startDate?: Date;
        image?: FileWithPreview;
      },
    ) => {
      try {
        let imageUrl: string | undefined;

        if (payload.image) {
          imageUrl = await uploadToCloudinary(payload.image.file as File);
        }

        const updateData: any = {};

        if (payload.title !== undefined) updateData.title = payload.title;
        if (payload.description !== undefined)
          updateData.description = payload.description;
        if (payload.price !== undefined)
          updateData.price = Math.round(Number(payload.price) * 100);
        if (payload.startDate !== undefined)
          updateData.startDate = payload.startDate;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

        const res = await editCourseApi(courseId, updateData);
        queryClient.invalidateQueries({ queryKey: ["my-courses"] });
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });

        toast.success("Course updated successfully");

        return { success: true, data: res };
      } catch (err: any) {
        toast.error(err?.message || "Something went wrong");
        return { success: false };
      }
    },
    [queryClient],
  );

  return { createCourse, editCourse };
};
