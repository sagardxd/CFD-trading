import { logger } from "@repo/config"
import { type CreateUserPayload, type GetUSDBalancePayload, type GetUSDBalanceResponse } from "@repo/types"
import { Balances } from "../store/engine.store"
import { engineErrorRes, engineSuccessRes } from "../utils/send-engine-response";

export const createUser = (data: CreateUserPayload) => {
    try {
        Balances.set(data.payload.userId, { usd: 500000 });
        logger.info(`User balance set to ${Balances.get(data.payload.userId)?.usd}`)
    } catch (error) {
        logger.error("createUser", "error creating user in engine", error);
    }
}

export const getUserUSDBalance = (input: GetUSDBalancePayload) => {
    try {
        const balance = Balances.get(input.payload.userId)?.usd;
        if (!balance) return engineErrorRes(input.id, 'User not found')

        return engineSuccessRes<GetUSDBalanceResponse>(input.id, { usd: balance })
    } catch (error) {
        logger.error("getUserBalance", "error getting user balance in engine", error);
    }
}