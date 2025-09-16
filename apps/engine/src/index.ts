import { ConsumerName, EventType, GroupName, StreamName, type CloseTradePayload, type CreateTradePayload, type CreateUserPayload, type GetAllOpenTradesPayload, type GetUSDBalancePayload } from "@repo/types";
import { createUser, getUserUSDBalance } from "./services/user.service";
import { engineReqStream, engineResStream } from "./redis/redis";
import { closeTrade, createTrade, getAllOpenTrades } from "./services/trade.service";

const main = async () => {
    await engineReqStream.connect();
    await engineResStream.connect();

    while (true) {
        const result = await engineReqStream.readGroup(StreamName.EVENTS, GroupName.EVENTS_GROUP, ConsumerName.EVENT_CONSUMER);
        if (!result) continue; 

        console.log("result h ", result);
        if (result.type === EventType.CREATE_USER) createUser(result as CreateUserPayload);
        
        else if (result.type === EventType.BALANCE_USD) getUserUSDBalance(result as GetUSDBalancePayload);

        else if (result.type === EventType.OPEN_TRADE) createTrade(result as CreateTradePayload)

        else if (result.type === EventType.CLOSE_TRADE) closeTrade(result as CloseTradePayload)

        else if (result.type === EventType.ALL_OPEN_TRADE) getAllOpenTrades(result as GetAllOpenTradesPayload)
    }
}

main(); 