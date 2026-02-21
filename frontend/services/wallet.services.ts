import { apiRequest } from "@/lib/apiClient";

export const getWalletDetails = async () =>
  apiRequest({ path: "/wallet", method: "GET" });
