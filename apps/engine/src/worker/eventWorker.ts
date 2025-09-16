import { ConsumerName, EventType, GroupName, StreamName, type CloseTradePayload, type CreateTradePayload, type CreateUserPayload, type GetAllOpenTradesPayload, type GetUSDBalancePayload } from "@repo/types";
import { engineReqStream } from "../redis/redis";
import { createUser, getUserUSDBalance } from "../services/user.service";
import { closeTrade, createTrade, getAllOpenTrades } from "../services/trade.service";

export const startEventWorker = async () => {
    while (true) {
        const result = await engineReqStream.readGroup(StreamName.EVENTS, GroupName.EVENT_GROUP, ConsumerName.EVENT_CONSUMER);
        if (!result) continue;

        console.log("event result: ", result);

        switch (result.type) {
            case EventType.CREATE_USER:
                createUser(result as CreateUserPayload);
                break;
            case EventType.BALANCE_USD:
                getUserUSDBalance(result as GetUSDBalancePayload);
                break;
            case EventType.OPEN_TRADE:
                createTrade(result as CreateTradePayload);
                break;
            case EventType.CLOSE_TRADE:
                closeTrade(result as CloseTradePayload);
                break;
            case EventType.ALL_OPEN_TRADE:
                getAllOpenTrades(result as GetAllOpenTradesPayload);
                break;
            default:
                console.warn("Unknown event type:", result.type);
        }
    }
};
