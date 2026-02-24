import type { Request, Response } from "express";
import AuthServices from "../services/auth.services.js";
import generateToken from "../utils/generateToken.js";

const AuthController = {
  signup: async (req: Request, res: Response) => {
    const { name, email, role, password } = req.body;
    try {
      const user = await AuthServices.signupUser(name, email, role, password);
      const token = generateToken(user.id, user.role, user.name);
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(201).json({
        success: true,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error: any) {
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  signin: async (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;
      const user = await AuthServices.signinUser(email, password, role);
      const token = generateToken(user.id, user.role, user.name);
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(201).json({
        success: true,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error: any) {
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie("auth_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      console.error(error);
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      return res.status(500).json({
        success: false,
        message: "Failed to logout",
      });
    }
  },

  me: async (req: Request, res: Response) => {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }
    try {
      const user = await AuthServices.getUserById(userId);
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      console.error(error);
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      return res.status(500).json({
        success: false,
        message: "Failed to fetch user",
      });
    }
  },
};

export default AuthController;
