import type { Request, Response } from "express";
import DashboardServices from "../services/dashboard.services.js";

const DashboardController = {
  getDashboard: async (req: Request, res: Response) => {
    const dashboard = await DashboardServices.getDashboard(req.user);
    return res.status(200).json(dashboard);
  },
};

export default DashboardController;
