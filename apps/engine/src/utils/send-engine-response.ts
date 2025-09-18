import { GroupName, StreamName } from "@repo/types";
import { engineReqStream, engineResStream } from "../redis/redis";

export const engineSuccessRes = async <T>(
    requestId: string,
    data?: T,
) => {
    await engineReqStream.acknowledge(StreamName.EVENTS, GroupName.EVENT_GROUP, requestId);
    return engineResStream.xAddWithId<T>(StreamName.ENGINE_RES, requestId, {
        success: true,
        ...(data ? { data } : {}),
    });
}
export const engineErrorRes = (
    requestId: string,
    message?: string,
) => {
    return engineResStream.xAddWithId(StreamName.ENGINE_RES, requestId, {
        success: false,
        ...(message ? { message } : {}),
    });
}
