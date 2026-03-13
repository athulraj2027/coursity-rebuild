import { apiRequest } from "@/lib/apiClient";

export const getProfileApi = async () =>
  apiRequest({ path: "/profile", method: "GET" });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const patchProfileApi = async (data: any) =>
  apiRequest({ path: "/profile", method: "PUT", body: data });

export const getTeacherProfileApi = async (id: string) =>
  apiRequest({ path: `/profile/${id}`, method: "GET" });
