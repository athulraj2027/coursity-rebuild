import type { Role } from "@prisma/client";
import WalletRepository from "../repositories/wallet.repositories.js";
import { AppError } from "../utils/AppError.js";

const WalletServices = {
  getWalletTransactionsWithBalance: async (user: {
    id: string;
    role: Role;
  }) => {
    const { id } = user;
    const walletTransactionsWithBalance =
      await WalletRepository.getWalletTransactionsWithBalance(id);
    if (!walletTransactionsWithBalance) return null;

    return walletTransactionsWithBalance;
  },
};

export default WalletServices;
