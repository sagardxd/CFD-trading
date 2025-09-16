import { createClient, type RedisClientType } from "redis";
import { logger } from "../logger";
import type { ConsumerName, EventType, GroupName, LatestAssetPayload, StreamName } from "@repo/types";

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

  async xAdd(streamName: StreamName, eventType: EventType, msg: Record<string, any>) {
    try {
      if (this.client.isOpen) {
        const id = await this.client.xAdd(streamName, "*", { type: eventType, message: JSON.stringify(msg) }, { TRIM: { strategy: "MAXLEN", threshold: 1000 } });
        return id;
      }
    } catch (error) {
      logger.error('xAdd', 'Error adding to redis stream', error)
    }
  }
  async getLatestValue(streamName: StreamName): Promise<LatestAssetPayload | null> {
    try {
      if (!this.client.isOpen) return null;

      const result = await this.client.xRevRange(streamName, '+', '-', { COUNT: 1 });

      if (!result || result.length === 0) return null;

      const latest = result[0]; // result[0] is an object
      if (!latest) return null;

      return {
        id: latest.id,
        type: latest.message.type as EventType,
        payload: JSON.parse(latest.message.message as string)
      };
    } catch (error) {
      logger.error('getLatestValue', 'Error getting latest value of redis stream', error);
      return null;
    }
  }


  async xReadId(streamName: StreamName, id: string) {
    const startTime = Date.now();
    const timeOut = 3000;
    const interval = 1000;

    while (Date.now() - startTime < timeOut) {
      try {
        const result = await this.client.xRead({
          key: streamName,
          id: id
        });

        if (result) return result;
      } catch (error) {
        logger.error('xResponseOfId', 'Error getting the reponse of the Id in xRead', error)
      }

      await new Promise(resolve => setTimeout(resolve, interval))
    }
    return null;
  }

  async createGroup(streamName: string, groupName: string) {
    try {
      if (this.client.isOpen) {
        await this.client.xGroupCreate(streamName, groupName, '$', { MKSTREAM: true })
        logger.info(`Created Group ${groupName} on stream ${streamName}`)

      }
    } catch (error) {
      logger.error('createGroup', 'error creating group', error)

    }
  }

  async readGroup(streamName: StreamName, groupName: GroupName, consumerName: ConsumerName, block = 0) {
    try {
      if (this.client.isOpen) {
        const result = await this.client.xReadGroup(
          groupName,
          consumerName,
          [{ key: streamName, id: '>' }],
          { BLOCK: block }
        )

        if (!result) return null;

        const stream = result.find((stream) => stream.name === streamName);
        const messages = stream?.messages.map((msg) => ({
          id: msg.id,
          type: msg.message.type,
          payload: JSON.parse(msg.message.message as string) // parse the JSON string
        }));

        if (messages && messages.length > 0) {
          return messages[0];
        }

      }
      return null;
    } catch (error) {
      logger.error('readGroup', 'error reading group', error)
    }
  }

  async acknowledge(streamName: StreamName, groupName: GroupName, messageId: string) {
    try {
      await this.client.xAck(streamName, groupName, messageId);
      logger.info(`Acknowledged message ${messageId}`);
    } catch (error) {
      logger.error('acknowledge', 'Error acknowledging message', error);
    }
  }


  async disconnect() {
    if (this.client.isOpen) this.client.disconnect();
  }
}

export const createRedis = (url: string) => new RedisClient(url);
