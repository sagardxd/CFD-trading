import type { Id, Balance, OpenTrade } from "@repo/types";

export interface Snapshot {
    balance: [Id, Balance][]
    openTrades: [Id, OpenTrade][]
}