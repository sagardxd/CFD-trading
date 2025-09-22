import { ApiResponse, GetUSDBalanceResponse } from "@repo/types";
import apiCaller from "./api.service"
import { ServerError } from "../utils/api-resonse";
import { logger } from "./logger.service";

export const getUserUsdBalance = async(): Promise<ApiResponse<GetUSDBalanceResponse | null>> => {
    try {
        const result = await apiCaller.get<GetUSDBalanceResponse>("/balance/usd");
        console.log('rsult', result)
        return result;

    } catch (error) {
        logger.error("getBalance", 'Error getting user balance', error)
        return ServerError();
    }
}