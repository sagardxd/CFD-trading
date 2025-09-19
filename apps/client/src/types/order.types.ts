export type Id = string

export enum Asset {
    BTC = "BTC",
    ETH = "ETH",
    SOL = "SOL"
}

export enum OrderType {
    BUY = "BUY",
    SELL = "SELL"
}

export interface OrderRequest {
    asset: Asset
    type: OrderType
    margin: number
    leverage: number
    stop_loss?: number;
    take_profit?: number;
}

export interface OpenOrder {
    orderId: Id
    asset: Asset
    type: OrderType
    margin: number // decinal upto 2 number
    leverage: number
    quantity: number
    openPrice: number // upto 4 decimal
    openTime: Date
}

export interface CloseOrder {
    orderId: Id,
    type: OrderType
    asset: Asset
    quantity: number,
    openPrice: number, // decimal is 4		
    closePrice: number,
    pnl: number
    openTime: Date
    closeTime: Date
}