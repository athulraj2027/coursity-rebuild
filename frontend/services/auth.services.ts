import { apiRequest } from "@/lib/apiClient";

type Role = "STUDENT" | "TEACHER" | "ADMIN";

export const signupApi = (data: {
  name: string;
  email: string;
  role: Role;
  password: string;
}) => {
  return apiRequest({
    path: "/auth/signup",
    method: "POST",
    body: data,
  });
};

export const signinApi = (data: {
  email: string;
  role: Role;
  password: string;
}) => {
  return apiRequest({
    path: "/auth/signin",
    method: "POST",
    body: data,
  });
};

export const logoutApi = () => {
  return apiRequest({
    path: "/auth/logout",
    method: "POST",
  });
};

export const meApi = () => {
  return apiRequest({
    path: "/auth/me",
  });
};
