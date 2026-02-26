import { apiRequest } from "@/lib/apiClient";

export const getUsersApi = () => apiRequest({ path: "/users", method: "GET" });

export const getUserById = (id: string) =>
  apiRequest({ path: `/users/${id}`, method: "GET" });
