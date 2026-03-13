import profileRepositories from "../repositories/profile.repositories.js";
import { AppError } from "../utils/AppError.js";

const getUserProfile = async (userId: string) => {
  return await profileRepositories.getUserProfile(userId);
};

const putUserProfile = async (userId: string, data: any) => {
  return await profileRepositories.putUserProfile(userId, data);
};

export default { getUserProfile, putUserProfile };
