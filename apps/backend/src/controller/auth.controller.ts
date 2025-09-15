import { type Request, type Response } from "express";
import { InvalidInputs, ServerError } from "../utils/api-response";
import { logger } from "@repo/config";
import { userSchema } from "@repo/types";
import { jwtSign } from "../utils/jwt";

export const signUpController = async (req: Request, res: Response) => {
    try {
        const parsed = userSchema.safeParse(req.body);
        if (!parsed.success) InvalidInputs(res, 'Invalid email!')

        // const token = jwtSign()


    } catch (error) {
        logger.error('signUpController', '', error);
        return ServerError(res);
    }
}

export const signInController = async (req: Request, res: Response) => {
    try {
        const parsed = userSchema.safeParse(req.body);
        if (!parsed.success) InvalidInputs(res, 'Invalid email!')

    } catch (error) {
        logger.error('signInController', '', error);
        return ServerError(res);
    }
}

export const signInWithTokenController = async (req: Request, res: Response) => {
    const token = req.query.token as string
    try {
        if (!token) return res.status(403).json({ message: "not token provided" })


        return;
    } catch (error) {
        logger.error('signInWithTokenController', '', error);
        return ServerError(res);
    }
}