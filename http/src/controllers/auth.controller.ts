import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthRepositories from "../repositories/auth.repositories.js";
import { Role } from "@prisma/client";
const JWT_SECRET = process.env.JWT_SECRET || "myjwtsecret";

const isValidRole = (role: string): role is Role => {
  return Object.values(Role).includes(role as Role);
};

const AuthController = {
  signup: async (req: Request, res: Response) => {
    const { name, email, role, password } = req.body;
    try {
      const existingUser = await AuthRepositories.findByEmail(email);
      if (existingUser)
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      const userRole = role || Role.STUDENT;
      if (!isValidRole(userRole)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await AuthRepositories.signup({
        name,
        email,
        password: hashedPassword,
        role: role || Role.STUDENT,
      });

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(201).json(token);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Signup failed" });
    }
  },

  signin: async (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;
      console.log(req.body);

      const user = await AuthRepositories.signin(email);
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "User not found" });

      if (role !== user.role)
        return res
          .status(400)
          .json({ success: false, message: "Invalid role" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });

      // Generate JWT
      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(201).json({ user, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Signin failed" });
    }
  },
};

export default AuthController;
