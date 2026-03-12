import { prisma } from "../lib/prisma.js";
import { Role } from "@prisma/client";

const findByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

const signup = async (data: {
  name: string;
  email: string;
  password: string;
  role?: Role;
}) => {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || Role.STUDENT,
    },
  });
};

const signin = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

const findById = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });
};

export default { findByEmail, findById, signin, signup };
