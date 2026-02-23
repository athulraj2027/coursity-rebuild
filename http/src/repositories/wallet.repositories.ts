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

  getAllWallets: async () =>
    await prisma.wallet.findMany({
      where: {
        user: {
          role: "TEACHER",
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        transactions: {
          select: {
            amount: true,
            type: true,
            payoutProofUrl: true,
            createdAt: true,
          },
        },
      },
    }),

  // wallet.repository.ts

  getAllWalletsRaw: async () => {
    return await prisma.wallet.findMany({
      where: {
        user: {
          role: {
            not: "ADMIN",
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  },

  getCredits: async () => {
    return await prisma.walletTransaction.groupBy({
      by: ["walletId"],
      where: {
        type: "CREDIT",
      },
      _sum: {
        amount: true,
      },
      _max: {
        createdAt: true,
      },
    });
  },

  getDebits: async () => {
    return await prisma.walletTransaction.groupBy({
      by: ["walletId"],
      where: {
        type: "DEBIT",
      },
      _sum: {
        amount: true,
      },
      _max: {
        createdAt: true,
      },
    });
  },

  getRefunds: async () => {
    return await prisma.walletTransaction.groupBy({
      by: ["walletId"],
      where: {
        type: "REFUND",
      },
      _sum: {
        amount: true,
      },
    });
  },
};

export default WalletRepository;
