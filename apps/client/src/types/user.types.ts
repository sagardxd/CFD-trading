export interface Balance {
    usd_balance: number // with 2 decimals
}

export interface getBalanceResponse{
    usd_balance?: number
    message?: string
}