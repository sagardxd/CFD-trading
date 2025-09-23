import { createTradeSchema, EventType, StreamName, type ApiResponse, type CloseTradeResponse, type CreateTradeResponse, type createTradeResponse, type getAllCloseTradeResponse, type getAllOpenTradeResponse, type GetAllOpenTradesResponse } from '@repo/types';
import type { Request, Response } from 'express';
import { ApiResponseTimedOut, ApiSuccessResponse, EngineApiResponse, InvalidInputs, ServerError } from '../utils/api-response';
import { logger } from '@repo/config';
import { enginerRequest, engineResponse } from '../utils/engine-helper';
import { getAllExistingTrades } from '../services/trade.service';

export const createTrade = async (req: Request, res: Response<ApiResponse<createTradeResponse>>) => {
    try {
        const userId = req.user!.id
        const parsedData = createTradeSchema.safeParse(req.body)

        if (!parsedData.success) {
            return InvalidInputs(res);
        }

        const id = await enginerRequest(EventType.OPEN_TRADE, { userId: userId, ...parsedData.data });
        if (!id) return ServerError(res);


        const response = await engineResponse<CreateTradeResponse>(id);
        if (!response) return ApiResponseTimedOut(res);

        return EngineApiResponse(res, response);

    } catch (error: any) {
        logger.error('createTrade', 'error creating a new trade in controller', error);
        return ServerError(res);
    }
}

export const closeTrade = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;    
        const { tradeId } = req.params;

        if (!tradeId) return InvalidInputs(res, "Trade Id is required");

        const id = await enginerRequest(EventType.CLOSE_TRADE, { userId: userId, tradeId });
        if (!id) return ServerError(res);

        const response = await engineResponse<CloseTradeResponse>(id);
        if (!response) return ApiResponseTimedOut(res);

        return EngineApiResponse(res, response);

    } catch (error: any) {
        logger.error('closeTrade', 'error closing a trade in controller', error);
        return ServerError(res);
    }
}

export const getAllOpenTrades = async (req: Request, res: Response<ApiResponse<getAllOpenTradeResponse>>) => {
    try {
        const userId = req.user!.id;
        const id = await enginerRequest(EventType.ALL_OPEN_TRADE, { userId: userId });
        if (!id) return ServerError(res);

        const response = await engineResponse<GetAllOpenTradesResponse>(id);
        if (!response) return ApiResponseTimedOut(res);

        return EngineApiResponse(res, response);

    } catch (error: any) {
        logger.error('getAllOpenTrades', 'error getting all open trades in controller', error);
        return ServerError(res);
    }
}

export const getAllCloseTrades = async (req: Request, res: Response<ApiResponse<getAllCloseTradeResponse>>) => {
    try {
        const userId = req.user!.id;
        const data = await getAllExistingTrades(userId);
        return ApiSuccessResponse(res, {trades: data as any})

    } catch (error: any) {
        logger.error('getAllCloseTrades', 'error getting all close trades in controller', error);
        return ServerError(res);
    }
}
