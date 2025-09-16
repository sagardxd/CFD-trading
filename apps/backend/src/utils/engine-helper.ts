import { ConsumerName, GroupName, StreamName, type EventType } from "@repo/types"
import { engineReqStream, engineResStream } from "../redis/redis-setup";
import { logger } from "@repo/config";

export const enginerRequest = async (type: EventType, data: any) => {
    try {
        const id = await engineReqStream.xAdd(StreamName.EVENTS, type, data);
        return id;
    } catch (error) {
        logger.error("enginerRequest", "error while requesting to the engine", error)
        return null;
    }
}

export const enginerResponse = async <T>(id: string) => {
    try {
        const result = await engineResStream.readGroupWithMesageId<T>(StreamName.ENGINE_RES, GroupName.ENGINE_RES_GROUP, ConsumerName.ENGINE_RES_CONSUMER, id);
        return result;
    } catch (error) {
        logger.error("enginerResponse", "error while getting response from the engine", error)
        return null;
    }
}