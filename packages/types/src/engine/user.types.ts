import type { EngineRequest } from "../model/engine.types";
import type { CreateTradeInput } from "../schema/trade.schema";

type User = {
    userId: string
}

export type CreateUserPayload = EngineRequest<User>;
export type GetUSDBalancePayload = EngineRequest<User>;
export type CreateTradePayload = EngineRequest<CreateTradeInput & User>

