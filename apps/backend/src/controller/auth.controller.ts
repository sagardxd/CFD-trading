import { type Request, type Response } from "express";
import { ApiResponseTimedOut, ApiSuccessResponse, CustomApiResponse, EngineApiResponse, InvalidInputs, QueueError, ServerError } from "../utils/api-response";
import { logger } from "@repo/config";
import { EventType, userSchema, type AuthResponse, type UserProfile} from "@repo/types";
import { CreateUser, UpdateLastloggedIn, UserExists } from "../services/user.service";
import { jwtSign, jwtVerify } from "../utils/jwt";
import { enginerRequest, enginerResponse } from "../utils/engine-helper";
import { hashPass, isHashedPassMatch } from "../utils/hashPass";
import { StatusCodes } from "http-status-codes";

export const signUpController = async (req: Request, res: Response) => {
    try {
        const parsed = userSchema.safeParse(req.body);
        if (!parsed.success) return InvalidInputs(res, 'Invalid Inputs');

        const alreadyUser = await UserExists(parsed.data.email);
        if (alreadyUser) return CustomApiResponse(res, 'User already exists!', 409);

        const hashedPass = await hashPass(parsed.data.password);

        const user = await CreateUser(parsed.data.email, hashedPass);
        if (!user) return ServerError(res);

        const token = jwtSign({ email: parsed.data.email, id: user.id }, "7d")

        const id = await enginerRequest(EventType.CREATE_USER, { userId: user.id })
        if (!id) return QueueError(res);

        const response = await enginerResponse(id);
        if (!response) return ApiResponseTimedOut(res);

        if (response.payload.success) {
            return ApiSuccessResponse<AuthResponse>(res, {userId: user.id, token})
        }
        return EngineApiResponse(res, response);

    } catch (error) {
        logger.error('signUpController', '', error);
        return ServerError(res);
    }
}

export const signInController = async (req: Request, res: Response) => {
    try {
        const parsed = userSchema.safeParse(req.body);
        if (!parsed.success) return InvalidInputs(res, 'Invalid email!');

        const alreadyUser = await UserExists(parsed.data.email);
        if (!alreadyUser) return CustomApiResponse(res, 'User not found!', 404);
        
        const isMatch = await isHashedPassMatch(parsed.data.password ,alreadyUser.password)

        if (!isMatch) return CustomApiResponse(res, 'Wrong password', StatusCodes.FORBIDDEN)

        const token = jwtSign({ email: parsed.data.email, id: alreadyUser.id }, "7d")

        return ApiSuccessResponse<AuthResponse>(res, {token, userId: alreadyUser.id});
    } catch (error) {
        logger.error('signInController', '', error);
        return ServerError(res);
    }
}

export const getUserProfileController = async (req: Request, res: Response) => {
    const user = req.user
    try {

        if (!user) return CustomApiResponse(res, 'Failed to fetch user', StatusCodes.FORBIDDEN);

        return ApiSuccessResponse<UserProfile>(res, {
            email: user.email,
            id: user.id
        })

    } catch (error) {
        logger.error('getUserProfileController', 'error giving user profile data', error);
        return ServerError(res);
    }
}