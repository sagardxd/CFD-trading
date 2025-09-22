import type { Id, Balance, OpenTrade } from "@repo/types";

export const Balances = new Map<Id, Balance>();
export const OpenTrades = new Map<Id, OpenTrade[]>();
