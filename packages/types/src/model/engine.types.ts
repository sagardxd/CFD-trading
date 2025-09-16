import type { EventType } from "./redis.types"

export type EngineRequest<T> =  {
    id: string
    type: EventType
    payload: T
}