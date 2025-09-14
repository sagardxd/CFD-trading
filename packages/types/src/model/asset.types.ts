export enum Asset {
    BTC = "BTC",
    ETH = "ETH",
    SOL = "SOL"
}

export interface AssetData {
    asset: Asset,
    price: number
    decimal: number
}

export interface WSData {
    price_updates: AssetData[]
}

