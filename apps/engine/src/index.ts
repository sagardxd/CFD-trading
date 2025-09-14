import { config, createRedis } from "@repo/config"
import { RedisStreamKeys } from "@repo/types";

const main = async () => {
    const redisClient = createRedis(config.REDIS_URL);
    await redisClient.connect();

    redisClient.xReadAll(RedisStreamKeys.ASSET).then((assets) => {
        if (assets) {
            console.log(assets[0])
        }
    }
    )
}

main(); 