import { useCallback } from "react";
import { FileWithPreview } from "./use-file-upload";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { patchProfileApi } from "@/services/profile.services";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type EditProfilePayload = {
  image?: FileWithPreview;
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
};

export const useProfile = () => {
  const queryClient = useQueryClient();
  const editProfile = useCallback(
    async (payload: EditProfilePayload) => {
      try {
       
        let imageUrl;
        if (payload.image)
          imageUrl = await uploadToCloudinary(payload.image.file as File);
        const data: any = {
          headline: payload.headline,
          bio: payload.bio,
          location: payload.location,
          website: payload.website,
          twitter: payload.twitter,
          github: payload.github,
          linkedin: payload.linkedin,
        };

        if (imageUrl) data.imageUrl = imageUrl;
        const res: any = await patchProfileApi(data);

        if (!res.success) {
          console.log(res.message);
          toast.error(res.message);
          return { success: false };
        }
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        toast.success("Profile updated successfully");

        return res;
      } catch (err: any) {
        toast.error(err.message);
        console.log(err);
        return { success: false };
      }
    },
    [queryClient],
  );

  return { editProfile };
};
