import type { Request, Response } from "express";
import profileServices from "../services/profile.services.js";

const getUserProfile = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return;
  const profile = await profileServices.getUserProfile(user.id);
  return res.status(200).json({ success: true, profile });
};

const patchProfile = async (req: Request, res: Response) => {
  const user = req.user;
  await profileServices.putUserProfile(user.id, req.body);
  return res.status(200).json({ success: true });
};

const getTeacherProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const teacherProfile = await profileServices.getTeacherProfile(id as string);
  return res.status(200).json({ success: true, teacherProfile });
};

export default { getUserProfile, patchProfile, getTeacherProfile };
