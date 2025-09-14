import type { Id, User, Balance, OpenTrade, CloseTrade } from "@repo/types";

export const UserStore = new Map<Id, User>();
export const Balances = new Map<Id, Balance>();
export const OpenOrders = new Map<Id, OpenTrade[]>();
export const CloseOrders = new Map<Id, CloseTrade[]>();