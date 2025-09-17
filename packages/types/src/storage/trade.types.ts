import type { StorageResponse } from "../model/engine.types";
import type { CloseTrade } from "../schema/store.schema";

export interface CloseTradeStorage {
    order: CloseTrade
}

export type CloseTradeStorageResponse = StorageResponse<CloseTradeStorage>