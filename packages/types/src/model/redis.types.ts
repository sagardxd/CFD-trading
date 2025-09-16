export enum StreamName {
    EVENTS = 'events',
    ASSETS = 'asset',
    ENGINE_RES = 'engine-res'
}

export enum GroupName {
    EVENTS_GROUP = 'events:group',
    ENGINE_RES_GROUP = 'engine-res:group'
}

export enum ConsumerName {
    EVENT_CONSUMER = 'events:consumer',
    ENGINE_RES_CONSUMER = 'engine-res:consumer'
}

export enum EventType {
    ASSET = 'asset',
    CREATE_USER = 'user:create',
    BALANCE_USD = 'balance:usd',
    OPEN_TRADE = 'trade:open',
    CLOSE_TRADE = 'trade:close',
    ALL_OPEN_TRADE = 'trade:all_open',
    ALL_CLOSE_TRADE = 'trade:all_close',
}