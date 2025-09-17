import { Router } from "express";
import * as TradeController from '../controller/trades.controller'

const router = Router();

router.post("/create", TradeController.createTrade)
router.post("/close/:tradeId", TradeController.closeTrade)
router.get("/open", TradeController.getAllOpenTrades)
router.get("/close", TradeController.getAllCloseTrades)

export default router;