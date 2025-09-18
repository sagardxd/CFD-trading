import { config, createRedis, logger } from "@repo/config";
import { GroupName, StreamName } from "@repo/types";

export const redisClient = createRedis(config.REDIS_URL);

export const Redis_Init = async () => {
    try {
        await redisClient.connect();
        await redisClient.deleteGroup(StreamName.DATABASE, GroupName.DATABASE_GROUP)
        await redisClient.createGroup(StreamName.DATABASE, GroupName.DATABASE_GROUP);
    } catch (error) {
        logger.error('Redis_Init', 'Error in storage intializing redis', error);
    }
}