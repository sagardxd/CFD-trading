import { ConsumerName, EventType, GroupName, StreamName, type ApiResponse, type GetUSDBalanceResponse } from "@repo/types";
import type { Request, Response } from "express";
import { ApiResponseTimedOut, EngineApiResponse, ServerError } from "../utils/api-response";
import { logger } from "@repo/config";
import { engineReqStream, engineResStream } from "../redis/redis-setup";

export const getUSDBalance = async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
        const userId = req.user!.id;

        const id = await engineReqStream.xAdd(StreamName.EVENTS, EventType.BALANCE_USD, { userId: userId });
        if (!id) return ServerError(res);

        const response = await engineResStream.readGroupWithMesageId<GetUSDBalanceResponse>(StreamName.ENGINE_RES, GroupName.ENGINE_RES_GROUP, ConsumerName.ENGINE_RES_CONSUMER, id);
        if (!response) return ApiResponseTimedOut(res);

        return EngineApiResponse(res, response)
    } catch (error: any) {
        logger.error('getCloseTrades', 'error getting all close trades in controller', error);
        return ServerError(res);
    }
}
