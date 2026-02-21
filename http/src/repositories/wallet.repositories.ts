import { prisma } from "../lib/prisma.js";

const WalletRepository = {
  getWalletTransactionsWithBalance: async (userId: string) => {
    // 1️⃣ Get wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      select: {
        id: true,
        balance: true,
      },
    });

    if (!wallet) {
      return null;
    }

    // 2️⃣ Get transactions
    const transactions = await prisma.walletTransaction.findMany({
      where: {
        walletId: wallet.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20, // pagination later
    });

    return {
      balance: wallet.balance,
      transactions,
    };
  },
};

export default WalletRepository;
