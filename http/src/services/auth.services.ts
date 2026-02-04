import { Role } from "@prisma/client";
import AuthRepositories from "../repositories/auth.repositories.js";
import bcrypt from "bcryptjs";

const AuthServices = {
  signupUser: async (
    name: string,
    email: string,
    role: Role,
    password: string,
  ) => {
    const existingUser = await AuthRepositories.findByEmail(email);
    if (existingUser) throw new Error("User already exists");
    const hashedPassword = await bcrypt.hash(password, 10);
    return AuthRepositories.signup({
      name,
      email,
      password: hashedPassword,
      role: role || Role.STUDENT,
    });
  },

  signinUser: async (email: string, password: string, role: Role) => {
    const user = await AuthRepositories.signin(email);
    if (!user) throw new Error("No user found");
    if (role !== user.role) throw new Error("Invalid role");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    return user;
  },
};
export default AuthServices;
