import { logger } from "@repo/config"
import { prisma } from "@repo/db"
import type { CloseTradeStorageResponse } from "@repo/types"

export const saveCloseTrade = async(input: CloseTradeStorageResponse) => {
    const order = input.payload.data?.order;
    if (!order) return;

    try {
        await prisma.existingTrade.create({
            data: {
                id: order.id,
                asset: order.asset,
                margin: order.margin,
                leverage: order.leverage,
                openPrice: order.open_price,
                closePrice: order.close_price,
                pnl: order.pnl,
                quantity: order.quantity,
                type: order.type,
                createdAt: order.closed_at,
                userId: order.userId,
            }
        })
    } catch (error) {
        logger.error('saveCloseTrade', 'error saving close trade in db  ')
    }
}