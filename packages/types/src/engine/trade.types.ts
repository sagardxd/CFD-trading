import type { Asset, OrderType } from "../model/asset.types"
import type { EngineRequest } from "../model/engine.types"
import type { Id } from "../schema/store.schema"
import type { CreateTradeInput } from "../schema/trade.schema"
import type { EngineUser } from "./user.types"

export type CreateTradePayload = EngineRequest<CreateTradeInput & EngineUser>
export type CloseTradePayload = EngineRequest<{ orderId: string } & EngineUser>
export type GetAllOpenTradesPayload = EngineRequest<EngineUser>

export interface OpenTradeResponse {
    orderId: Id
    asset: Asset
    type: OrderType
    margin: number // decinal upto 2 number
    leverage: number
    quantity: number
    openPrice: number 
    openTime: Date
}
