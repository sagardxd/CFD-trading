import type { NextFunction, Request, Response } from "express";
import { jwtVerify } from "../utils/jwt";
import { logger } from "@repo/config";

interface AuthenticatedRequest extends Request {
    user?: { email: string; id: string };
}

export const AuthMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decodedUser = jwtVerify(token);
        req.user = decodedUser;

        next();
    } catch (error) {
        logger.error("AuthMiddleware", "", error)
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};