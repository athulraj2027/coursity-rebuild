import { apiRequest } from "@/lib/apiClient";

type Role = "STUDENT" | "TEACHER" | "ADMIN";

export const signupApi = (data: {
  name: string;
  email: string;
  role: Role;
  password: string;
}) =>
  apiRequest({
    path: "/auth/signup",
    method: "POST",
    body: data,
  });

export const signinApi = (data: {
  email: string;
  role: Role;
  password: string;
}) =>
  apiRequest({
    path: "/auth/signin",
    method: "POST",
    body: data,
  });

export const logoutApi = () =>
  apiRequest({
    path: "/auth/logout",
    method: "POST",
  });

export const meApi = () =>
  apiRequest({
    path: "/auth/me",
  });

export const dashboardApi = () =>
  apiRequest({ path: "/dashboard", method: "GET" });
