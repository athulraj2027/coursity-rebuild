/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { FileWithPreview } from "./use-file-upload";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { verifyPayout } from "@/services/wallet.services";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  const verifyPayment = useCallback(
    async (image: FileWithPreview, userId: string, amount: number) => {
      try {
        const imageUrl = await uploadToCloudinary(image.file as File);

        const res: any = await verifyPayout(imageUrl, userId, amount);
        if (!res.success) {
          console.log(res.message);
          toast.error(res.message);
          return { success: false };
        }
        queryClient.invalidateQueries({ queryKey: ["wallets"] });
        toast.success("Payout processed successfully");
      } catch (err: any) {
        toast.error(err.message);
        console.log(err);
        return { success: false };
      }
    },
    [queryClient],
  );

  return { verifyPayment };
};
