import { logger } from "@repo/config"
import { redisClient } from "../redis/redis.types"
import { ConsumerName, EventType, GroupName, StreamName, type CloseTradeStorageResponse } from "@repo/types"
import { saveCloseTrade } from "../services/trade.service";

export const startDbWorker = async () => {
    try {
        while (1) {
            const data = await redisClient.readGroup(StreamName.DATABASE, GroupName.DATABASE_GROUP, ConsumerName.DATABASE_CONSUMER);
            if (!data) continue;

            switch (data.type) {
                case EventType.CLOSE_TRADE:
                    await saveCloseTrade(data as CloseTradeStorageResponse);
                    break;
                default:
                    console.warn("Unknown event type:", data.type);
            }
        }
    } catch (error) {
        logger.error("startDbWorker", 'error in db worker', error)
    }
}