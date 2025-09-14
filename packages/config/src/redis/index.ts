import { createClient, type RedisClientType } from "redis";
import { type RedisStreamKeys } from "@repo/types";
import type { JsonObjectExpression } from "typescript";

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
      await this.client.xAdd(channel, "*", { message: JSON.stringify(msg) });
    }
  }

  async disconnect() {
    if (this.client.isOpen) this.client.disconnect();
  }
}

export const createRedis = (url: string) => new RedisClient(url);
