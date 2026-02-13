import { apiRequest } from "@/lib/apiClient";
// types/cloudinary.ts
export interface CloudinarySignatureResponse {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}
export const GetCloudinarySignatureApi = (
  folder = "courses",
): Promise<CloudinarySignatureResponse> =>
  apiRequest({
    path: "/uploads/cloudinary-signature",
    method: "POST",
    body: { folder },
  });
