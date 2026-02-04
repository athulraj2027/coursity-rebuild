import type { Request, Response } from "express";
import AuthServices from "../services/auth.services.js";
import generateToken from "../utils/generateToken.js";

const AuthController = {
  signup: async (req: Request, res: Response) => {
    const { name, email, role, password } = req.body;
    try {
      const user = await AuthServices.signupUser(name, email, role, password);
      const token = generateToken(user.id, user.role);
      return res.status(201).json(token);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  signin: async (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;
      const user = await AuthServices.signinUser(email, password, role);
      const token = generateToken(user.id, user.role);
      return res.status(201).json({ user, token });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

export default AuthController;
