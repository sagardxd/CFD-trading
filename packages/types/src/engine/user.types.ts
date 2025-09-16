import type { EngineRequest } from "../model/engine.types";

export type EngineUser = {
    userId: string
}

export type CreateUserPayload = EngineRequest<EngineUser>;
export type GetUSDBalancePayload = EngineRequest<EngineUser>;

export type GetUSDBalanceResponse = {
    usd: number 
}