export enum RedisStreamKeys {
    ASSET = "Asset",
    OPEN_TRADE = 'trade:open',
    CLOSE_TRADE = 'trade:close',
    ALL_OPEN_TRADE = 'trade:all_open',
    ALL_CLOSE_TRADE = 'trade:all_close',
}

export interface xReadIdResponse {
    data: any
}