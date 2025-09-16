import { logger, Response } from "@repo/config"
import { OrderType, StreamName, type CreateTradePayload, type OpenTrade } from "@repo/types"
import { engineReqStream } from "../redis/redis"
import { generateId } from "../utils/generate-id"
import { MARGIN_DECIMAL } from "../constants/decimal.constants"
import { Balances, OpenTrades } from "../store/engine.store"

export const createTrade = async (input: CreateTradePayload) => {
    try {
        const userBalance = Balances.get(input.payload.userId)?.usd;
        if (!userBalance) return logger.info("user balance nhi h boss")


        if ((userBalance - input.payload.margin) < 0) return Response.error("Not enough Balance!");

        // remove the margin from balance
        Balances.set(input.payload.userId, { usd: userBalance - input.payload.margin });
        logger.info(`User curr balance: ${Balances.get(input.payload.userId)?.usd}`)

        const assetPrices = await engineReqStream.getLatestValue(StreamName.ASSETS);
        const asset = assetPrices?.payload.price_updates.find((asset) => asset.asset === input.payload.asset);
        if (!asset) return Response.error("asset not found!");

        const orderId = generateId();
        console.log(asset);

        const buyPrice = asset.price / Math.pow(10, asset.decimal);
        const sellPrice = buyPrice - 10;

        const margin = input.payload.margin / Math.pow(10, MARGIN_DECIMAL);

        let order: OpenTrade = {
            id: orderId,
            userId: input.payload.userId,
            type: input.payload.type,
            asset: input.payload.asset,
            margin: input.payload.margin,
            leverage: input.payload.leverage,
            quantity: input.payload.type === OrderType.BUY ? ((margin * input.payload.leverage) / buyPrice) : ((margin * input.payload.leverage) / sellPrice),
            open_price: input.payload.type === OrderType.BUY ? (buyPrice * Math.pow(10, asset.decimal)) : (sellPrice * Math.pow(10, asset.decimal)),
            liquidation_price: input.payload.type === OrderType.BUY ? (buyPrice * (1 - 1 / input.payload.leverage) * Math.pow(10, asset.decimal)) : (sellPrice * (1 + 1 / input.payload.leverage) * Math.pow(10, asset.decimal)),
            opened_at: new Date(),
            ...(input.payload.stop_loss !== undefined && { stop_loss: input.payload.stop_loss }),
            ...(input.payload.take_profit !== undefined && { take_profit: input.payload.take_profit })
        }

        const userOpenTrades = OpenTrades.get(input.payload.userId) ?? [];
        userOpenTrades.push(order);
        OpenTrades.set(input.payload.userId, userOpenTrades);

        console.log("userOpenTrades", userOpenTrades);

        return Response.success({
            orderId
        })

    } catch (error) {
        logger.error("createTrade", "error creating trade in engine")
    }

}