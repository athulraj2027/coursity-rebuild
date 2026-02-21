import express from "express";
import { roleMiddleware } from "../../../middlewares/role.middleware.js";
import walletController from "../../../controllers/wallet.controller.js";
const router = express.Router();

router.get(
  "/",
  roleMiddleware(["STUDENT", "TEACHER"]),
  walletController.getWalletTransactions,
);
export default router;
