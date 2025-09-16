import type { Id, User, Balance, OpenTrade, CloseTrade } from "@repo/types";

// export const UserStore = new Map<Id, User>();
export const Balances = new Map<Id, Balance>();
export const OpenTrades = new Map<Id, OpenTrade[]>();
export const CloseTrades = new Map<Id, CloseTrade[]>();