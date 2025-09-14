import type { Id, User, Balance, OpenOrder, CloseOrder } from "@repo/types";

export const UserStore = new Map<Id, User>();
export const Balances = new Map<Id, Balance>();
export const OpenOrders = new Map<Id, OpenOrder[]>
export const CloseOrders = new Map<Id, CloseOrder[]>
