import type { Request, Response } from "express";
import DashboardServices from "../services/dashboard.services.js";

const DashboardController = {
  getDashboard: async (req: Request, res: Response) => {
    try {
      const dashboard = await DashboardServices.getDashboard(req.user);
      return res.status(200).json(dashboard);
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
};

export default DashboardController;
