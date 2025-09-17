import { logger } from "@repo/config"
import { prisma } from "../db/prisma-client"

export const getAllExistingTrades = async(userId: string) => {
    try {
        const data = await prisma.existingTrade.findMany({
            where: {
                userId: userId
            }
        })

        return data;
    } catch (error) {
        logger.error('getAllExistingTrades', 'error getting all close trades from db', error)
        return [];
    }

}