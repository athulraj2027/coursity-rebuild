import { getWalletDetails } from "@/services/wallet.services";
import { useQuery } from "@tanstack/react-query";

export const useMyWalletTransactionsQuery = () =>
  useQuery({ queryKey: ["wallet"], queryFn: getWalletDetails });
