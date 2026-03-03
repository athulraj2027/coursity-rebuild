import type { Request, Response } from "express";
import UserServices from "../services/user.services.js";

const UserController = {
  getUsers: async (req: Request, res: Response) => {
    const users = await UserServices.getUsers();
    if (!users)
      return res
        .status(400)
        .json({ success: false, message: "No users found" });

    return res.status(200).json({ success: true, users });
  },

  getUserById: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await UserServices.getUserById(id as string);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "No users found" });

    return res.status(200).json({ success: true, user });
  },
  blockUser: async () => {},
};

export default UserController;
