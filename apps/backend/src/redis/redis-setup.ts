import { config, createRedis, logger } from "@repo/config";
import { GroupName, StreamName } from "@repo/types";

export const engineReqStream = createRedis(config.REDIS_URL);
export const engineResStream = createRedis(config.REDIS_URL);

export const RedisInit = async () => {
    try {
        engineReqStream.connect()
        engineResStream.connect()

        await engineResStream.createGroup(StreamName.ENGINE_RES, GroupName.ENGINE_RES_GROUP);
    } catch (error) {
        logger.error('RedisInit', 'Error in initing redis', error)
    }
}