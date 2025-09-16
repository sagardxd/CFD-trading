import { ConsumerName, EventType, GroupName, StreamName, type CreateTradePayload, type CreateUserPayload, type GetUSDBalancePayload } from "@repo/types";
import { createUser, getUserBalance } from "./services/user.service";
import { engineReqStream, engineResStream } from "./redis/redis";
import { createTrade } from "./services/trade.service";

const main = async () => {
    await engineReqStream.connect();
    await engineResStream.connect();

    while (true) {
        const result = await engineReqStream.readGroup(StreamName.EVENTS, GroupName.EVENTS_GROUP, ConsumerName.EVENT_CONSUMER);
        if (!result) continue; 

        console.log("result h ", result);
        if (result.type === EventType.CREATE_USER) createUser(result as CreateUserPayload);
        
        else if (result.type === EventType.BALANCE_USD) getUserBalance(result as GetUSDBalancePayload);

        else if (result.type === EventType.OPEN_TRADE) createTrade(result as CreateTradePayload)

        else if (result.type === EventType.CLOSE_TRADE) {}

        else if (result.type === EventType.ALL_OPEN_TRADE) {}

        else if (result.type === EventType.ALL_CLOSE_TRADE) {}
    }
}

main(); 