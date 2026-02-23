import {
  getWalletDetails,
  getWalletsApiForAdmin,
} from "@/services/wallet.services";
import { useQuery } from "@tanstack/react-query";

export const useMyWalletTransactionsQuery = () =>
  useQuery({ queryKey: ["wallet"], queryFn: getWalletDetails });

export const useAllWalletsQuery = () =>
  useQuery({ queryKey: ["wallets"], queryFn: getWalletsApiForAdmin });
