import { ConsumerName, GroupName, StreamName, type EventType } from "@repo/types"
import { engineReqStream, engineResStream } from "../redis/redis-setup";

export const enginerRequest = async (type: EventType, data: any) => {
    const id = await engineReqStream.xAdd(StreamName.EVENTS, type, data);
    return id;
}

export const enginerResponse = async <T>(id: string) => {
    const result = await engineResStream.readGroupWithMesageId<T>(StreamName.ENGINE_RES, GroupName.ENGINE_RES_GROUP, ConsumerName.ENGINE_RES_CONSUMER, id);
    return result;
}