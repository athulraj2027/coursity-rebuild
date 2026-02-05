import { Role } from "@prisma/client";
import AuthRepositories from "../repositories/auth.repositories.js";
import bcrypt from "bcryptjs";
import { AppError } from "../utils/AppError.js";

const AuthServices = {
  signupUser: async (
    name: string,
    email: string,
    role: Role,
    password: string,
  ) => {
    const existingUser = await AuthRepositories.findByEmail(email);
    if (existingUser) throw new AppError("User already exists", 400);
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
    if (!user) throw new AppError("No user found", 400);
    if (role !== user.role) throw new AppError("Invalid role", 400);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError("Invalid password", 400);

    return user;
  },
};
export default AuthServices;
