import { GroupName, StreamName } from "@repo/types";
import { engineReqStream, engineResStream } from "../redis/redis";

export const engineSuccessRes = async <T>(
    requestId: string,
    data?: T,
) => {
    await engineReqStream.acknowledge(StreamName.EVENTS, GroupName.EVENTS_GROUP, requestId);
    return engineResStream.xAddWithId<T>(StreamName.ENGINE_RES, requestId, {
        success: true,
        ...(data ? { data } : {}),
    });
}
export const engineErrorRes = <T>(
    requestId: string,
    data?: T,
) => {
    return engineResStream.xAddWithId<T>(StreamName.ENGINE_RES, requestId, {
        success: false,
        ...(data ? { data } : {}),
    });
}
