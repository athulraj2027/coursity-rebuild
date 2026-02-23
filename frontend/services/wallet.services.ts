import { apiRequest } from "@/lib/apiClient";

export const getWalletDetails = async () =>
  apiRequest({ path: "/wallet", method: "GET" });

export const getWalletsApiForAdmin = async () =>
  apiRequest({ path: `/wallet/all`, method: "GET" });
