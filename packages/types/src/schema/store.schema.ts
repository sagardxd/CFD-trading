export type Id = string

export type User = {
    id: string
    email: string
}

export type Balance = {
    usd_balance: number
}

export type OpenOrder = {
    id: Id
    userId: Id
    margin: number
    leverage: number
    quantity: number
    liquidation_price: number
    open_price: number
    opened_at: Date
}

export type CloseOrder = {
    id: Id
    userId: Id
    margin: number
    leverage: number
    quantity: number
    open_price: number
    close_price: number
    opened_at: Date
    closed_at: Date
}