import { createClient, type RedisClientType } from "redis";
import { RedisStreamKeys, type xReadIdResponse } from "@repo/types";
import { logger } from "../logger";
import { forEachTrailingCommentRange, ModuleResolutionKind } from "typescript";

class RedisClient {
  private client: RedisClientType;

  constructor(private url: string) {
    this.client = createClient({ url: url });
    this.client.on("error", (err) =>
      logger.error('Redis client constructor', 'connecting to redis client', err)

    );
  }

  async connect() {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
    } catch (error) {
      logger.error('connect', 'connecting to redis client', error)
    }
  }

  async xAdd(channel: RedisStreamKeys, msg: Record<string, any>) {
    try {
      if (this.client.isOpen) {
        const id = await this.client.xAdd(channel, "*", { message: JSON.stringify(msg) }, { TRIM: { strategy: "MAXLEN", threshold: 10 } });
        return id;
      }
    } catch (error) {
      logger.error('xAdd', 'Error adding to redis stream', error)
    }
  }

  async xReadAll(channel: RedisStreamKeys) {
    try {
      if (this.client.isOpen) {
        const result = await this.client.xRead(
          {
            key: channel,
            id: "0-0",
          }
        );
        if (result && result.length > 0) {
          const data = result.find((data) => data.name === RedisStreamKeys.ASSET)
          if (data) {
            const messages = data.messages.map((data) => JSON.parse(data.message.message as string))
            return messages;
          }
          return []
        }
      }
    } catch (error) {
      logger.error('xReadAll', 'Error in xReadll', error)

    }
  }

  async xReadId(channel: RedisStreamKeys, id: string) {
    const startTime = Date.now();
    const timeOut = 10000;
    const interval = 50;

    while (Date.now() - startTime < timeOut) {
      try {
        const result = await this.client.xRead({
          key: channel,
          id: id
        });

        return result;
      } catch (error) {
        logger.error('xResponseOfId', 'Error getting the reponse of the Id in xRead', error)
      }

      await new Promise(resolve => setTimeout(resolve, interval))
    }
    return null;
  }


  async disconnect() {
    if (this.client.isOpen) this.client.disconnect();
  }
}

export const createRedis = (url: string) => new RedisClient(url);
