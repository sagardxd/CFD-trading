import { logger } from "@repo/config"
import { redisClient } from "../redis/redis.types"
import { ConsumerName, EventType, GroupName, StreamName } from "@repo/types"

export const startDbWorker = async () => {
    try {
        while (1) {
            const data = await redisClient.readGroup(StreamName.DATABASE, GroupName.DATABASE_GROUP, ConsumerName.DATABASE_CONSUMER);
            if (!data) continue;

            switch (data.type) {
                case EventType.CLOSE_TRADE:
                    await closeTrade();
                    break;
                default:
                    console.warn("Unknown event type:", data.type);
            }
        }
    } catch (error) {
        logger.error("startDbWorker", 'error in db worker', error)
    }
}