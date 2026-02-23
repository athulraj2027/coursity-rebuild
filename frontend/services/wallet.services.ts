import { apiRequest } from "@/lib/apiClient";

export const getWalletDetails = async () =>
  apiRequest({ path: "/wallet", method: "GET" });

export const getWalletsApiForAdmin = async () =>
  apiRequest({ path: `/wallet/all`, method: "GET" });

export const verifyPayout = async (
  imageUrl: string,
  userId: string,
  amount: number,
) =>
  apiRequest({
    path: "/wallet/pay-user",
    method: "POST",
    body: { imageUrl, userId, amount },
  });
