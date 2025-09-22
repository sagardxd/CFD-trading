import type { Asset, OrderType } from "../model/asset.types"

export type Id = string

export type User = {
    id: Id
}

export type Balance = {
    usd: number
}

export type OpenTrade = {
    id: Id
    userId: Id
    type: OrderType
    asset: Asset
    margin: number
    leverage: number
    quantity: number
    liquidation_price: number
    open_price: number
    opened_at: Date
}

export type CloseTrade = {
    id: Id
    userId: Id
    type: OrderType
    asset: Asset
    margin: number
    leverage: number
    quantity: number
    pnl: number
    open_price: number
    close_price: number
    opened_at: Date
    closed_at: Date
}

export type closeTradeDB = {
    asset: Asset;
    type: OrderType;
    margin: number;
    leverage: number;
    id: string;
    closePrice: number;
    openPrice: number;
    quantity: number;
    pnl: number;
    liquidated: boolean;
    userId: string;
    createdAt: Date;
}