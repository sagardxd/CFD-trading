import type { EventType } from "./redis.types"

export type EngineRequest<T> = {
    id: string
    type: EventType
    payload: T
}

export type EngineResponse<T> = {
    id: string
    requestId: string
    payload: Payload<T>
}

export type Payload<T> = {
    success: boolean,
    message?: string
    data?: T
}

export type StorageResponse<T> = {
    id: string,
    type: EventType
    payload: Payload<T>
}