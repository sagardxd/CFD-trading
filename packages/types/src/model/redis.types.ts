export enum StreamName {
    EVENTS = 'events',
    ASSETS = 'asset',
}

export enum GroupName {
    EVENTS_GROUP = 'events:group',
}

export enum ConsumerName {
    EVENT_CONSUMER = 'events:consumer'
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