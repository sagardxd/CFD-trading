import { GroupName, StreamName } from "@repo/types";
import { engineReqStream, engineResStream } from "../redis/redis";

export const engineSuccessRes = async <T>(
    requestId: string,
    data?: T,
) => {
    await engineReqStream.acknowledge(StreamName.EVENTS, GroupName.EVENT_GROUP, requestId);
    return await engineResStream.xAddWithId<T>(StreamName.ENGINE_RES, requestId, {
        success: true,
        ...(data ? { data } : {}),
    });
}   
export const engineErrorRes = async (
    requestId: string,
    message?: string,
) => {
    await engineReqStream.acknowledge(StreamName.EVENTS, GroupName.EVENT_GROUP, requestId);
    return await engineResStream.xAddWithId(StreamName.ENGINE_RES, requestId, {
        success: false,
        ...(message ? { message } : {}),
    });
}
