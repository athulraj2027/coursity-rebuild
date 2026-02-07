import { GetCloudinarySignatureApi } from "@/services/upload.services";

// lib/uploadToCloudinary.ts
export async function uploadToCloudinary(file: File) {
  const { signature, timestamp, cloudName, apiKey, folder } =
    await GetCloudinarySignatureApi();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);
  console.log(formData);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!res.ok) throw new Error("Image upload failed");

  const data = await res.json();
  return data.secure_url as string;
}
