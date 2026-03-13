import profileRepositories from "../repositories/profile.repositories.js";
import { AppError } from "../utils/AppError.js";

const getUserProfile = async (userId: string) => {
  return await profileRepositories.getUserProfile(userId);
};

const putUserProfile = async (userId: string, data: any) => {
  return await profileRepositories.putUserProfile(userId, data);
};

const getTeacherProfile = async (id: string) => {
  const profile = await profileRepositories.getTeacherProfileForStudents(id);
  if (!profile) throw new AppError("Profile not found", 400);
  return profile;
};

export default { getUserProfile, putUserProfile, getTeacherProfile };
