import UserRepository from "../repositories/users.repositories.js";

const UserServices = {
  getUsers: async () => await UserRepository.getAllUsers(),
};

export default UserServices;
