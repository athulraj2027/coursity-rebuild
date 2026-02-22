import { prisma } from "../lib/prisma.js";

const UserRepository = {
  getAllUsers() {
    return prisma.user.findMany();
  },
};

export default UserRepository;
