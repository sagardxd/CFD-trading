import { Router } from "express";
import * as authController from "../controller/auth.controller"

const router = Router();

router.post("/signup", authController.signUpController)
router.post("/signin", authController.signUpController)
router.get("/signin/post", authController.signInWithTokenController)

export default router;