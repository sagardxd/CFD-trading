import { logger } from "@repo/config"
import type { CloseTrade } from "@repo/types"

export const saveCloseTrade = async (trade: CloseTrade) => {
    try {

    } catch (error) {
        logger.error('saveCloseTrade', 'error saving close trade in db  ')
    }
}