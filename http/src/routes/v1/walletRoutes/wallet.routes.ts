import express from "express";
import { roleMiddleware } from "../../../middlewares/role.middleware.js";
import walletController from "../../../controllers/wallet.controller.js";
const router = express.Router();

router.get(
  "/",
  walletController.getWalletTransactions,
);

router.get("/all", roleMiddleware("ADMIN"), walletController.getAllWallets);
export default router;
