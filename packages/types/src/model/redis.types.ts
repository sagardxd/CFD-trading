export enum StreamName {
    EVENTS = 'events',
    ASSETS = 'asset',
    ENGINE_RES = 'engine-res',
    DATABASE = 'database'
}

export enum GroupName {
    EVENT_GROUP = 'event:group',
    ASSET_GROUP = 'asset:group',
    ENGINE_RES_GROUP = 'engine-res:group',
    DATABASE_GROUP = 'database:group'
}

export enum ConsumerName {
    EVENT_CONSUMER = 'event:consumer',
    ASSET_CONSUMER = 'asset:consumer',
    ENGINE_RES_CONSUMER = 'engine-res:consumer',
    DATABASE_CONSUMER = 'database:consumer'
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