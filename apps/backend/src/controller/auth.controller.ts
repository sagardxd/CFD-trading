import { type Request, type Response } from "express";
import { ApiSuccessResponse, CustomApiResponse, InvalidInputs, QueueError, ServerError } from "../utils/api-response";
import { logger } from "@repo/config";
import { EventType, StreamName, userSchema } from "@repo/types";
import { CreateUser, UserExists } from "../services/user.service";
import { jwtSign, jwtVerify } from "../utils/jwt";
import { engineReqStream, engineResStream } from "../redis/redis-setup";

export const signUpController = async (req: Request, res: Response) => {
    try {
        const parsed = userSchema.safeParse(req.body);
        if (!parsed.success) return InvalidInputs(res, 'Invalid email!');

        const alreadyUser = await UserExists(parsed.data.email);
        if (alreadyUser) return CustomApiResponse(res, 409, 'User already exists!');

        // const user = await CreateUser(parsed.data.email);
        // if (!user) return ServerError(res);  

        // const token = jwtSign({ email: parsed.data.email, id: user.id }, "5m")
        const token = jwtSign({ email: parsed.data.email, id: 1}, "5m")
        // await sendEmail(parsed.data.email, token);
        console.log('token', token);

        const id = await engineReqStream.xAdd(StreamName.EVENTS, EventType.CREATE_USER, { userId: 1})
        // const id = await engineReqStream.xAdd(StreamName.EVENTS, EventType.CREATE_USER, { userId: user.id })
        if (!id) return QueueError(res);

        const response = await engineResStream.xReadId(StreamName.EVENTS, id);
        return ApiSuccessResponse(res, response);

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
        if (!alreadyUser) return CustomApiResponse(res, 404, 'User not found!');

        const token = jwtSign({ email: parsed.data.email, id: alreadyUser.id }, "5m")
        await sendEmail(parsed.data.email, token);

        const id = await engineReqStream.xAdd(StreamName.EVENTS, EventType.CREATE_USER, { userId: alreadyUser.id })
        if (!id) return QueueError(res);

        const response = await engineResStream.xReadId(StreamName.EVENTS, id);
        return ApiSuccessResponse(res, response);
    } catch (error) {
        logger.error('signInController', '', error);
        return ServerError(res);
    }
}

export const signInWithTokenController = async (req: Request, res: Response) => {
    const token = req.query.token as string
    try {
        if (!token) return CustomApiResponse(res, 403, "No token provided");

        const decodedUser = jwtVerify(token);
        const newToken = jwtSign({email: decodedUser.email, id: decodedUser.id}, '7d');

        res.cookie('token', newToken);

        return ApiSuccessResponse(res, {userId: decodedUser.id})
    } catch (error) {
        logger.error('signInWithTokenController', '', error);
        return ServerError(res);
    }
}