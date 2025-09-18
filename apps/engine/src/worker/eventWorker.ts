import { ConsumerName, EventType, GroupName, StreamName, type CloseTradePayload, type CreateTradePayload, type CreateUserPayload, type GetAllOpenTradesPayload, type GetUSDBalancePayload, type WSData } from "@repo/types";
import { engineReqStream } from "../redis/redis";
import { createUser, getUserUSDBalance } from "../services/user.service";
import { closeTrade, createTrade, getAllOpenTrades } from "../services/trade.service";
import { startLiquidationWorker } from "./liquidateWorker";

export const startEventWorker = async () => {

    let assetData: WSData = { price_updates: [] };

    while (true) {
        const result = await engineReqStream.readGroup(StreamName.EVENTS, GroupName.EVENT_GROUP, ConsumerName.EVENT_CONSUMER);
        if (!result) continue;


        switch (result.type) {
            case EventType.CREATE_USER:
                createUser(result as CreateUserPayload);
                break;
            case EventType.BALANCE_USD:
                getUserUSDBalance(result as GetUSDBalancePayload);
                break;
            case EventType.OPEN_TRADE:
                createTrade(result as CreateTradePayload, assetData);
                break;
            case EventType.CLOSE_TRADE:
                await closeTrade(result as CloseTradePayload, assetData);
                break;
            case EventType.ALL_OPEN_TRADE:
                getAllOpenTrades(result as GetAllOpenTradesPayload);
                break;
            case EventType.ASSET:
                assetData = result.payload;
                startLiquidationWorker(result.payload);
                break;
            default:
                console.warn("Unknown event type:", result.type);
        }
    }
};
