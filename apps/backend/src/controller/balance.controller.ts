import { RedisStreamKeys, type ApiResponse } from "@repo/types";
import type { Request, Response } from "express";
import { engineReqStream, engineResStream } from "..";
import { ApiResponseTimedOut, ServerError } from "../utils/api-response";
import { logger } from "@repo/config";

export const getUSDBalance = async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
        const userId = req.user!.id;

        const id = await engineReqStream.xAdd(RedisStreamKeys.ALL_OPEN_TRADE, { userId: userId });
        if (id) {
            const response = await engineResStream.xReadId(RedisStreamKeys.ALL_OPEN_TRADE, id);
            if (!response) {
                return ApiResponseTimedOut(res);
            }
            // TODO: data lelena engine response se
            return res.status(200).json({
                success: true,
                data: null
            })
        }

    } catch (error: any) {
        logger.error('getCloseTrades', 'error getting all close trades in controller', error);
        return ServerError(res);
    }
}
