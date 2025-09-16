import { logger } from "@repo/config"
import type { CreateUserPayload, GetUSDBalancePayload } from "@repo/types"
import { Balances } from "../store/engine.store"

export const createUser = (data: CreateUserPayload) => {
    try {
        Balances.set(data.payload.userId, { usd: 500000 });
        logger.info(`User balance set to ${Balances.get(data.payload.userId)?.usd}`)
    } catch (error) {
        logger.error("createUser", "error creating user in engine", error);
    }
}

export const getUserBalance = (data: GetUSDBalancePayload) => {
    try {
        const balance = Balances.get(data.payload.userId)?.usd;
        console.log(balance)
        
    } catch (error) {
        logger.error("getUserBalance", "error getting user balance in engine", error);
    }
}