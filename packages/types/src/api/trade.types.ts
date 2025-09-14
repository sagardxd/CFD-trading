import type { CloseTrade, OpenTrade } from "../schema/store.schema"

export interface createTradeResponse {
    orderId: string
}

export interface getAllOpenTradeResponse {
    orders: OpenTrade[]
}

export interface getAllCloseTradeResponse {
    orders: CloseTrade[]
}