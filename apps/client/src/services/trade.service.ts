import { ApiResponse, CloseTradeResponse, CreateTradeInput, CreateTradeResponse, getAllCloseTradeResponse, GetAllOpenTradesResponse } from "@repo/types";
import apiCaller from "./api.service";
import { ServerError } from "../utils/api-resonse";
import { logger } from "./logger.service";

export const createTradeService = async(input: CreateTradeInput): Promise<ApiResponse<CreateTradeResponse | null>> => {
    try {
        const response = await apiCaller.post<CreateTradeResponse>('/trade/create', input);
        return response;
    } catch (error) {
        logger.error('createTradeService', 'error creating trade', error)
        return ServerError();
    }
}

export const closeTradeService = async(tradeId: string): Promise<ApiResponse<CloseTradeResponse | null>> => {
    try {
        const response = await apiCaller.post<CloseTradeResponse>(`/trade/close/${tradeId}`);
        return response;
    } catch (error) {
        logger.error('closeTradeService', 'error closing trade', error)
        return ServerError();
    }
}


export const getAllOpenTradeService = async(): Promise<ApiResponse<GetAllOpenTradesResponse | null>> => {
    try {
        const response = await apiCaller.get<GetAllOpenTradesResponse>('/trade/open');
        return response;
    } catch (error) {
        logger.error('getAllOpenTradeService', 'error getting all opened trade', error)
        return ServerError();
    }
}

export const getAllCloseTradeService = async(): Promise<ApiResponse<getAllCloseTradeResponse | null>> => {
    try {
        const response = await apiCaller.get<getAllCloseTradeResponse>('/trade/close');
        console.log('res', response)
        return response;
    } catch (error) {
        logger.error('getAllCloseTradeService', 'error getting all closed trade', error)
        return ServerError();
    }
}