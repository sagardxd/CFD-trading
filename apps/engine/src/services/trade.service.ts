import { logger, Response } from "@repo/config"
import { OrderType, StreamName, type CloseTrade, type CloseTradePayload, type CloseTradeResponse, type CreateTradePayload, type CreateTradeResponse, type GetAllOpenTradesPayload, type GetAllOpenTradesResponse, type OpenTrade, type OpenTradeResponse } from "@repo/types"
import { engineReqStream } from "../redis/redis"
import { generateId } from "../utils/generate-id"
import { MARGIN_DECIMAL } from "../constants/decimal.constants"
import { Balances, CloseTrades, OpenTrades } from "../store/engine.store"
import { engineErrorRes, engineSuccessRes } from "../utils/send-engine-response"

export const createTrade = async (input: CreateTradePayload) => {
    try {
        const userBalance = Balances.get(input.payload.userId)?.usd;
        if (!userBalance) return engineErrorRes(input.id, 'User not found')


        if ((userBalance - input.payload.margin) < 0) return engineErrorRes(input.id, 'Not enough balance!')

        // remove the margin from balance
        Balances.set(input.payload.userId, { usd: userBalance - input.payload.margin });
        logger.info(`User curr balance: ${Balances.get(input.payload.userId)?.usd}`)

        const assetPrices = await engineReqStream.getLatestValue(StreamName.ASSETS);
        const asset = assetPrices?.payload.price_updates.find((asset) => asset.asset === input.payload.asset);
        if (!asset) return engineErrorRes(input.id, 'Asset not found')

        const orderId = generateId();

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

        console.log('trade created', order.id);

        return engineSuccessRes<CreateTradeResponse>(input.id, { orderId: order.id })

    } catch (error) {
        logger.error("createTrade", "error creating trade in engine")
        return engineErrorRes(input.id, 'Server error')
    }

}

export const closeTrade = async (input: CloseTradePayload) => {

    try {
        const userOpenTrades = OpenTrades.get(input.payload.userId) || [];
        const orderIndex = userOpenTrades.findIndex(order => order.id === input.payload.orderId);

        if (orderIndex === -1) return engineErrorRes(input.id, 'Order not found!')

        const order = userOpenTrades[orderIndex]!;

        // current price of asset
        const assetPrices = await engineReqStream.getLatestValue(StreamName.ASSETS);
        const asset = assetPrices?.payload.price_updates.find((asset) => asset.asset === order.asset);
        if (!asset) return engineErrorRes(input.id, 'Asset not found!')

        const buyPrice = asset.price / Math.pow(10, asset.decimal);
        const sellPrice = buyPrice - 10;

        const closePrice = order.type === OrderType.BUY ? buyPrice : sellPrice;

        const normalizedOpenPrice = order.open_price / Math.pow(10, asset.decimal);

        const pnl = order.type === OrderType.BUY
            ? (closePrice - normalizedOpenPrice) * order.quantity
            : (normalizedOpenPrice - closePrice) * order.quantity;

        console.log(`Calculated PnL: $${pnl}`);

        const closedTrade: CloseTrade = {
            id: order.id,
            userId: order.userId,
            type: order.type,
            asset: order.asset,
            margin: order.margin,
            leverage: order.leverage,
            quantity: order.quantity,
            pnl: pnl,
            open_price: order.open_price,
            close_price: closePrice,
            opened_at: order.opened_at,
            closed_at: new Date()
        };

        console.log('closed order', closedTrade)

        // Remove from open orders
        userOpenTrades.splice(orderIndex, 1);
        OpenTrades.set(input.payload.userId, userOpenTrades);

        // Add to closed orders
        const userClosedTrades = CloseTrades.get(input.payload.userId) || [];
        userClosedTrades.push(closedTrade);
        CloseTrades.set(input.payload.userId, userClosedTrades);

        return engineSuccessRes<CloseTradeResponse>(input.id, { orderId: order.id })
    } catch (error) {
        logger.error("closeTrade", "error closing trade in engine", error)
        return engineErrorRes(input.id, 'Server error')
    }
}

export const getAllOpenTrades = (input: GetAllOpenTradesPayload) => {
    try {
        const userOpenTrades = OpenTrades.get(input.payload.userId) || [];
        let cleanedData: OpenTradeResponse[] = [];

        if (userOpenTrades.length > 0) {
            cleanedData = userOpenTrades.map((order: OpenTrade) => ({
                orderId: order.id,
                type: order.type,
                asset: order.asset,
                margin: order.margin,
                leverage: order.leverage,
                quantity: order.quantity,
                openPrice: order.open_price,
                openTime: order.opened_at
            }))
        }

        return engineSuccessRes<GetAllOpenTradesResponse>(input.id, { trades: cleanedData })
    } catch (error) {
        logger.error("getAllOpenTrades", "error getting all open trades in engine", error)

    }

}