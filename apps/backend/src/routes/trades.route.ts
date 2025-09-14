import { Router } from "express";
import * as TradeController from '../controller/trades.controller'

const router = Router();

router.post("/create", TradeController.createTrade)
router.post("/close/:orderId", TradeController.closeTrade)
router.get("/open", TradeController.getOpenTrades)
router.get("/close", TradeController.getCloseTrades)

export default router;