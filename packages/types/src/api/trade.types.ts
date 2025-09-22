import type { closeTradeDB, OpenTrade } from "../schema/store.schema"

export interface createTradeResponse {
    orderId: string
}

export interface getAllOpenTradeResponse {
    orders: OpenTrade[]
}

export interface getAllCloseTradeResponse {
    trades: closeTradeDB[]
}

