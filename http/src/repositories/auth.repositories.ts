import { prisma } from "../lib/prisma.js";
import { Role } from "@prisma/client";

const AuthRepositories = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async signup(data: {
    name: string;
    email: string;
    password: string;
    role?: Role;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || Role.STUDENT,
      },
    });
  },

  async signin(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
};

export default AuthRepositories;
