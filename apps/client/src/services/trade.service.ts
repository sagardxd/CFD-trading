import { ApiResponse, CreateTradeInput, CreateTradeResponse } from "@repo/types";
import apiCaller from "./api.service";
import { ServerError } from "../utils/api-resonse";

export const createTrade = async(input: CreateTradeInput): Promise<ApiResponse<CreateTradeResponse | null>> => {
    try {
        const response = await apiCaller.post<CreateTradeResponse>('/')
        return response;
    } catch (error) {
        return ServerError();
    }
}