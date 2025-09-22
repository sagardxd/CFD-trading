import type { NextFunction, Request, Response } from "express";
import { jwtVerify } from "../utils/jwt";
import { logger } from "@repo/config";

interface AuthenticatedRequest extends Request {
    user?: { email: string; id: string };
}

export const AuthMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader && authHeader?.startsWith(`Bearer `))
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });

        const token = authHeader?.split(" ")[1];
        if (!token) 
            return res.status(401).json({
                success: false,
                message: "Invalid token format",
            });

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