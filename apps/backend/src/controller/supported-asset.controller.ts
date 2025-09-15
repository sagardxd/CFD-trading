import type { ApiResponse, SupportedAssets } from "@repo/types";
import type { Request, Response } from "express";
import { ApiSuccessResponse, ServerError } from "../utils/api-response";
import { logger } from "@repo/config";
import { SUPPORTED_ASSETS } from "../constants/supported-asset";

export const getSupportedAsset = async (req: Request, res: Response<ApiResponse<SupportedAssets>>) => {
    try {
        return ApiSuccessResponse(res, SUPPORTED_ASSETS);
    } catch (error) {
        logger.error('getSupportedAsset', 'error in sending supported assets', error);
        return ServerError(res);
    }
}