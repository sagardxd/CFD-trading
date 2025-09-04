import { config, createRedis } from "@repo/config";

const redis = createRedis(config.REDIS_URL);
await redis.connect();
