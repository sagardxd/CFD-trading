import { Router } from "express";
import { getUSDBalance } from "../controller/balance.controller";

const router = Router();

router.get("/usd", getUSDBalance)

export default router;
