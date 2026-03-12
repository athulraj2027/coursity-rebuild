import type { Request, Response } from "express";
import DashboardServices from "../services/dashboard.services.js";

const getDashboard = async (req: Request, res: Response) => {
  const dashboard = await DashboardServices.getDashboard(req.user);
  return res.status(200).json(dashboard);
};

export default { getDashboard };
