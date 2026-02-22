import { apiRequest } from "@/lib/apiClient";

export const getUsersApi = () => apiRequest({ path: "/users", method: "GET" });
