import { type Request, type Response } from "express";
import { ApiResponseTimedOut, ApiSuccessResponse, CustomApiResponse, EngineApiResponse, InvalidInputs, QueueError, ServerError } from "../utils/api-response";
import { logger } from "@repo/config";
import { EventType, userSchema, type SigninResponse, type SignupReponse } from "@repo/types";
import { CreateUser, UpdateLastloggedIn, UserExists } from "../services/user.service";
import { jwtSign, jwtVerify } from "../utils/jwt";
import { enginerRequest, enginerResponse } from "../utils/engine-helper";
import { hashPass } from "../utils/hashPass";

export const signUpController = async (req: Request, res: Response) => {
    try {
        const parsed = userSchema.safeParse(req.body);
        if (!parsed.success) return InvalidInputs(res, 'Invalid Inputs');

        const alreadyUser = await UserExists(parsed.data.email);
        if (alreadyUser) return CustomApiResponse(res, 'User already exists!', 409);

        const hashedPass = await hashPass(parsed.data.password);
        console.log('hadhed pass', hashedPass)

        const user = await CreateUser(parsed.data.email, hashedPass);
        if (!user) return ServerError(res);

        const token = jwtSign({ email: parsed.data.email, id: user.id }, "7d")
        console.log('token', token);

        const id = await enginerRequest(EventType.CREATE_USER, { userId: user.id })
        if (!id) return QueueError(res);

        const response = await enginerResponse(id);
        if (!response) return ApiResponseTimedOut(res);

        if (response.payload.success) {
            return ApiSuccessResponse<SignupReponse>(res, {userId: user.id, token})
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

        const token = jwtSign({ email: parsed.data.email, id: alreadyUser.id }, "7d")

        return ApiSuccessResponse<SigninResponse>(res, {token});
    } catch (error) {
        logger.error('signInController', '', error);
        return ServerError(res);
    }
}

export const signInWithTokenController = async (req: Request, res: Response) => {
    const token = req.query.token as string
    try {
        if (!token) return CustomApiResponse(res, "No token provided", 403);

        const decodedUser = jwtVerify(token);
        const newToken = jwtSign({ email: decodedUser.email, id: decodedUser.id }, '7d');
        await UpdateLastloggedIn(decodedUser.id)

        res.cookie('token', newToken);

        return ApiSuccessResponse(res, { userId: decodedUser.id })
    } catch (error) {
        logger.error('signInWithTokenController', '', error);
        return ServerError(res);
    }
}