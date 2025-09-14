import { createTradeSchema, RedisStreamKeys, type ApiResponse, type createTradeResponse, type getAllCloseTradeResponse, type getAllOpenTradeResponse } from '@repo/types';
import type { Request, Response } from 'express';
import { ApiResponseTimedOut, InvalidInputs, ServerError } from '../utils/api-response';
import { logger } from '@repo/config';
import { engineReqStream, engineResStream } from '..';

export const createTrade = async (req: Request, res: Response<ApiResponse<createTradeResponse>>) => {
    try {
        const userId = req.user!.id
        const parsedData = createTradeSchema.safeParse(req.body)

        if (!parsedData.success) {
            return InvalidInputs(res);
        }

        const id = await engineReqStream.xAdd(RedisStreamKeys.OPEN_TRADE, { userId: userId, ...parsedData.data });
        if (id) {
            const response = await engineResStream.xReadId(RedisStreamKeys.OPEN_TRADE, id);
            if (!response) {
                return ApiResponseTimedOut(res);
            }

            return res.status(200).json({
                success: true,
                data: {
                    // TODO: id dedena agter getting it 
                    orderId: 'reponse se id leke dena h '
                }
            })
        }

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

        const id = await engineReqStream.xAdd(RedisStreamKeys.CLOSE_TRADE, { userId: userId, tradeId });
        if (id) {
            const response = await engineResStream.xReadId(RedisStreamKeys.CLOSE_TRADE, id);
            if (!response) {
                return ApiResponseTimedOut(res);
            }

            return res.status(200).json({
                success: true,
                data: {
                    // TODO: id dedena agter getting it 
                    orderId: 'reponse se id leke dena h '
                }
            })
        }

    } catch (error: any) {
        logger.error('closeTrade', 'error closing a trade in controller', error);
        return ServerError(res);
    }
}


export const getOpenTrades = async (req: Request, res: Response<ApiResponse<getAllOpenTradeResponse>>) => {
    try {
        const userId = req.user!.id;

        const id = await engineReqStream.xAdd(RedisStreamKeys.ALL_OPEN_TRADE, { userId: userId });
        if (id) {
            const response = await engineResStream.xReadId(RedisStreamKeys.ALL_OPEN_TRADE, id);
            if (!response) {
                return ApiResponseTimedOut(res);
            }

            return res.status(200).json({
                success: true,
                data: {
                    // TODO: yaha data lauta do sare open orders 
                    orders: []
                }
            })
        }

    } catch (error: any) {
        logger.error('getOpenTrades', 'error getting all open trades in controller', error);
        return ServerError(res);
    }
}

export const getCloseTrades = async (req: Request, res: Response<ApiResponse<getAllCloseTradeResponse>>) => {
    try {
        const userId = req.user!.id;

        const id = await engineReqStream.xAdd(RedisStreamKeys.ALL_OPEN_TRADE, { userId: userId });
        if (id) {
            const response = await engineResStream.xReadId(RedisStreamKeys.ALL_OPEN_TRADE, id);
            if (!response) {
                return ApiResponseTimedOut(res);
            }

            return res.status(200).json({
                success: true,
                data: {
                    // TODO: yaha data lauta do sare open orders 
                    orders: []
                }
            })
        }

    } catch (error: any) {
        logger.error('getCloseTrades', 'error getting all close trades in controller', error);
        return ServerError(res);
    }
}
