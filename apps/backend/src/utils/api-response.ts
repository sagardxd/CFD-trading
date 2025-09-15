import type { ApiResponse } from "@repo/types";
import type { Response } from "express";

export const InvalidInputs = (res: Response<ApiResponse<any>>, message? : string) => {
    return res.status(411).json({
        success: false,
        message: message ? message : "Invalid Inputs"
    })
}

export const ApiResponseTimedOut = (res: Response<ApiResponse<any>>) => {
    return res.status(504).json({
        success: false,
        message: "Request timed out. Unable to process the request!"
    })
}

export const ServerError = (res: Response<ApiResponse<any>>) => {
    return res.status(500).json({
        success: false,
        message: "Server failed to answer!"
    })
}

export const ApiSuccessResponse = <T>(res: Response<ApiResponse<T>>, data: T, message?: string, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        data: data,
        ...(message !== undefined && {message: message})
    })
}

export const    CustomApiResponse = (res: Response<ApiResponse<null>>, statusCode: number, message: string) => {
    return res.status(statusCode).json({
        success: false,
        message
    })
}

export const QueueError = (res: Response<ApiResponse<any>>) => {
    return res.status(500).json({
        success: false,
        message: "Server failed to answer!"
    })
}