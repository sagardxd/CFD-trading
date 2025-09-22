import { Router } from "express";
import * as authController from "../controller/auth.controller"
import { AuthMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", authController.signUpController)
router.post("/signin", authController.signInController) 
router.get("/me", AuthMiddleware ,authController.getUserProfileController)

export default router;