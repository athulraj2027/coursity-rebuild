import type { Role } from "@prisma/client";
import DashboardRepository from "../repositories/dashboard.repositories.js";
import { AppError } from "../utils/AppError.js";

const DashboardServices = {
  getDashboard: async (user: { id: string; role: Role }) => {
    const { id, role } = user;
    let dashboard;

    switch (role) {
      case "ADMIN":
        dashboard = await DashboardRepository.getAdminDashboard();
        break;

      case "STUDENT":
        dashboard = await DashboardRepository.getStudentDashboard(id);
        break;

      case "TEACHER":
        dashboard = await DashboardRepository.getTeacherDashboard(id);
        break;

      default:
        throw new AppError("Invalid role", 400);
    }

    if (!dashboard)
      throw new AppError("Dashboard not found. Please try again", 400);

    return dashboard;
  },
};

export default DashboardServices;
