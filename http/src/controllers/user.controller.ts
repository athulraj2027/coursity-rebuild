import type { Request, Response } from "express";
import UserServices from "../services/user.services.js";

const UserController = {
  getUsers: async (req: Request, res: Response) => {
    try {
      const users = await UserServices.getUsers();
      if (!users)
        return res
          .status(400)
          .json({ success: false, message: "No users found" });

      return res.status(200).json({ success: true, users });
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

  getUserById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await UserServices.getUserById(id as string);
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "No users found" });

      return res.status(200).json({ success: true, user });
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
  blockUser: async () => {},
};

export default UserController;
