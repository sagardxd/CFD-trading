import { Router } from "express";
import { getSupportedAsset } from "../controller/supported-asset.controller";

const router = Router();

router.get("/", getSupportedAsset);

export default router;