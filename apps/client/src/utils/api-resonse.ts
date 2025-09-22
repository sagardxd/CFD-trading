import { ApiResponse } from "@repo/types"

export const ServerError = (): ApiResponse<null> =>  {
    return {
        success: false,
        message: "Server failed to answer!",
    }
}