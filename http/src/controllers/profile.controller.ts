import type { Request, Response } from "express";
import profileServices from "../services/profile.services.js";

const getUserProfile = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return;
  const profile = await profileServices.getUserProfile(user.id);
  return res.status(200).json({ success: true, profile });
};

const patchProfile = async (req: Request, res: Response) => {
  console.log("req body : ", req.body);
  const user = req.user;
  await profileServices.putUserProfile(user.id, req.body);
  return res.status(200).json({ success: true });
};

export default { getUserProfile, patchProfile };
