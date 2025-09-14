import { createClient, type RedisClientType } from "redis";
import { RedisStreamKeys } from "@repo/types";

class RedisClient {
  private client: RedisClientType;

  constructor(private url: string) {
    this.client = createClient({ url: url });
    this.client.on("error", (err) =>
      console.error(`Error creating client: ${err}`)
    );
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
      console.log("Redis connected at: ", this.url);
    }
  }

  async xAdd(channel: RedisStreamKeys, msg: Record<string, any>) {
    if (this.client.isOpen) {
      const res2 = await this.client.xAdd(channel, "*", { message: JSON.stringify(msg) }, { TRIM: { strategy: "MAXLEN", threshold: 10 } });
      console.log(res2);
    }
  }

  async xReadAll(channel: RedisStreamKeys) {
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
  }

  async disconnect() {
    if (this.client.isOpen) this.client.disconnect();
  }
}

export const createRedis = (url: string) => new RedisClient(url);
