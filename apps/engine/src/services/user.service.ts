import { logger } from "@repo/config"
import { type CreateUserPayload, type GetUSDBalancePayload, type GetUSDBalanceResponse } from "@repo/types"
import { Balances } from "../store/engine.store"
import { engineErrorRes, engineSuccessRes } from "../utils/send-engine-response";

export const createUser = (input: CreateUserPayload) => {
    try {
        Balances.set(input.payload.userId, { usd: 500000 });
        logger.info(`User balance set to ${Balances.get(input.payload.userId)?.usd}`)

        return engineSuccessRes(input.id)
    } catch (error) {
        logger.error("createUser", "error creating user in engine", error);
    }
}

export const getUserUSDBalance = async(input: GetUSDBalancePayload) => {
    try {
        const balance = Balances.get(input.payload.userId)?.usd;
        if (!balance) return engineErrorRes(input.id, 'User not found')

        return engineSuccessRes<GetUSDBalanceResponse>(input.id, { usd: balance })
    } catch (error) {   
        logger.error("getUserBalance", "error getting user balance in engine", error);
    }
}