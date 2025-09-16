import type { Asset, OrderType } from "../model/asset.types"
import type { CloseTrade, Id, OpenTrade } from "../schema/store.schema"

export interface createTradeResponse {
    orderId: string
}

export interface getAllOpenTradeResponse {
    orders: OpenTrade[]
}

export interface getAllCloseTradeResponse {
    orders: CloseTrade[]
}

