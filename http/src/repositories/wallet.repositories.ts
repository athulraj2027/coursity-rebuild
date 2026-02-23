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

  getWalletByUserId: async (userId: string) =>
    await prisma.wallet.findFirst({ where: { userId } }),

  payUserWallet: async (
    walletId: string,
    amount: number,
    adminUserId: string,
    payoutProofUrl?: string,
  ) => {
    return await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { id: walletId },
      });

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      if (wallet.balance < amount) {
        throw new Error("Insufficient balance");
      }

      const newBalance = wallet.balance - amount;

      // Create PAYOUT transaction
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: -Math.abs(amount),
          type: "PAYOUT",
          description: "Teacher payout",
          payoutProofUrl: payoutProofUrl || null,
          processedById: adminUserId,
          processedAt: new Date(),
        },
      });

      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: newBalance,
        },
      });

      return updatedWallet;
    });
  },
};

export default WalletRepository;
