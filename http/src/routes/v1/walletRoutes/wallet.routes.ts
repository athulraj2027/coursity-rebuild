import express from "express";
import { roleMiddleware } from "../../../middlewares/role.middleware.js";
import walletController from "../../../controllers/wallet.controller.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
const router = express.Router();

router.get("/", asyncHandler(walletController.getWalletTransactions));

router.get(
  "/all",
  roleMiddleware("ADMIN"),
  asyncHandler(walletController.getAllWallets),
);
router.post(
  "/pay-user",
  roleMiddleware("ADMIN"),
  asyncHandler(walletController.payUser),
);

export default router;
