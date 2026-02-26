import UserRepository from "../repositories/users.repositories.js";

const UserServices = {
  getUsers: async () => await UserRepository.getAllUsers(),
  getUserById: async (id: string) =>
    await UserRepository.getUserByIdForAdmin(id),
};

export default UserServices;
