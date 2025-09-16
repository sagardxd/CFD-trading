import { ConsumerName, EventType, GroupName, StreamName, type ApiResponse, type GetUSDBalanceResponse } from "@repo/types";
import type { Request, Response } from "express";
import { ApiResponseTimedOut, EngineApiResponse, ServerError } from "../utils/api-response";
import { logger } from "@repo/config";
import { enginerRequest, enginerResponse } from "../utils/engine-helper";

export const getUSDBalance = async (req: Request, res: Response<ApiResponse<any>>) => {
    try {
        const userId = req.user!.id;

        const id = await enginerRequest(EventType.BALANCE_USD, { userId: userId });
        if (!id) return ServerError(res);

        const response = await enginerResponse<GetUSDBalanceResponse>(id);
        if (!response) return ApiResponseTimedOut(res);

        console.log('response', response);

        return EngineApiResponse(res, response);
    } catch (error: any) {
        logger.error('getCloseTrades', 'error getting all close trades in controller', error);
        return ServerError(res);
    }
}
