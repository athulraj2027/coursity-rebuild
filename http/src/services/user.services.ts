import UserRepository from "../repositories/users.repositories.js";

const getUsers = async () => await UserRepository.getAllUsers();
const getUserById = async (id: string) =>
  await UserRepository.getUserByIdForAdmin(id);

export default { getUserById, getUsers };
