import { config, createRedis, logger } from "@repo/config";
import { GroupName, StreamName } from "@repo/types";

export const engineReqStream = createRedis(config.REDIS_URL);
export const engineResStream = createRedis(config.REDIS_URL);

export const RedisInit = async () => {
    try {
        engineReqStream.connect()
        engineResStream.connect()

        await engineResStream.deleteGroup(StreamName.EVENTS, GroupName.EVENT_GROUP);
        await engineResStream.deleteGroup(StreamName.ASSETS, GroupName.ASSET_GROUP);
        await engineResStream.createGroup(StreamName.EVENTS, GroupName.EVENT_GROUP);
        await engineResStream.createGroup(StreamName.ASSETS, GroupName.ASSET_GROUP);
    } catch (error) {
        logger.error('RedisInit', 'Error in initing redis', error)
    }
}   