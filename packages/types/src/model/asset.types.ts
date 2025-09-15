export enum Asset {
    BTC = "BTC",
    ETH = "ETH",
    SOL = "SOL"
}

export enum OrderType {
    BUY = "BUY",
    SELL = "SELL"
}

export interface AssetData {
    asset: Asset,
    price: number
    decimal: number
}

export interface WSData {
    price_updates: AssetData[]
}

export interface SupportedAssets {
    assets: SupportedAsset[]
}

interface SupportedAsset {
    symbol: string
    name: string
    imageUrl: string
}