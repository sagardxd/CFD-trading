import { config, createRedis } from "@repo/config"
import { ConsumerName, GroupName, StreamName } from "@repo/types";

const main = async () => {
    const redisClient = createRedis(config.REDIS_URL);
    await redisClient.connect();
    const assetPrice = await redisClient.getLatestValue(StreamName.ASSETS);

    while (true) {
        const result = await redisClient.readGroup(StreamName.EVENTS, GroupName.EVENTS_GROUP, ConsumerName.EVENT_CONSUMER);
        console.log(result);
    }
}

main(); 