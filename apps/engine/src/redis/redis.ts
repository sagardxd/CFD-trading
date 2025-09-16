import { config, createRedis } from "@repo/config";

export const engineReqStream = createRedis(config.REDIS_URL);
export const engineResStream = createRedis(config.REDIS_URL);
