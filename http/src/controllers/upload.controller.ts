import type { Request, Response } from "express";
import crypto from "crypto";

const UploadController = {
  getCloudinarySignature: async (req: Request, res: Response) => {
    try {
      const timestamp = Math.round(Date.now() / 1000);

      // Get any additional parameters from the request body
      const { folder, upload_preset, ...otherParams } = req.body || {};
      console.log("request body : ", req.body);

      const params: Record<string, string | number> = {
        folder, // Add folder FIRST
        timestamp,
      };

      // Add folder if provided
      if (folder) {
        params.folder = folder;
      }

      // Add upload_preset if provided
      if (upload_preset) {
        params.upload_preset = upload_preset;
      }

      // Add any other parameters
      Object.keys(otherParams).forEach((key) => {
        if (otherParams[key] !== undefined && otherParams[key] !== null) {
          params[key] = otherParams[key];
        }
      });

      // Sort parameters alphabetically and create the string to sign
      const sortedParams = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("&");

      // Generate signature
      const signature = crypto
        .createHash("sha1")
        .update(sortedParams + process.env.CLOUDINARY_API_SECRET)
        .digest("hex");

      res.json({
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder,
      });
    } catch (error) {
      console.error("Error generating Cloudinary signature:", error);
      res.status(500).json({ error: "Failed to generate signature" });
    }
  },
};

export default UploadController;
