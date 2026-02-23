import type { Request, Response } from "express";
import WalletServices from "../services/wallet.services.js";

const WalletController = {
  getWalletTransactions: async (req: Request, res: Response) => {
    const user = req.user;
    console.log("user for the request : ", user);
    try {
      const walletTransactionsWithBalance =
        await WalletServices.getWalletTransactionsWithBalance(user);
      console.log("wallet transactions : ", walletTransactionsWithBalance);
      return res
        .status(200)
        .json({ success: true, walletTransactionsWithBalance });
    } catch (error: any) {
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  getAllWallets: async (req: Request, res: Response) => {
    try {
      const walletsData = await WalletServices.getAllWallets(req.user.id);
      if (!walletsData)
        return res
          .status(400)
          .json({ success: false, message: "Data not found" });
      return res.status(200).json({ success: true, walletsData });
    } catch (error: any) {
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  payUser: async (req: Request, res: Response) => {
    try {
      const { amount, userId, imageUrl } = req.body;

      await WalletServices.payUser(
        req.user.id, // admin ID
        amount,
        userId, // teacher ID
        imageUrl,
      );

      return res.status(200).json({ success: true });
    } catch (error: any) {
      if (error.statusCode) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }

      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default WalletController;
