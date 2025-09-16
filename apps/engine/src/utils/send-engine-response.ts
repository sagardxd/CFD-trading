import { StreamName } from "@repo/types";
import { engineResStream } from "../redis/redis";

export const engineSuccessRes = <T>(
    requestId: string,
    data?: T,
) => {
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
