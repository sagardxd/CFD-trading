import { logger } from "@repo/config"
import { EventType, OrderType, StreamName, type CloseTrade, type CloseTradePayload, type CloseTradeResponse, type CreateTradePayload, type CreateTradeResponse, type GetAllOpenTradesPayload, type GetAllOpenTradesResponse, type OpenTrade, type OpenTradeResponse, type WSData } from "@repo/types"
import { engineResStream } from "../redis/redis"
import { generateId } from "../utils/generate-id"
import { Balances, OpenTrades } from "../store/engine.store"
import { engineErrorRes, engineSuccessRes } from "../utils/send-engine-response"
import { MARGIN_DECIMAL } from "../constants/decimal.constants"

export const createTrade = async (input: CreateTradePayload, assetData: WSData) => {
    try {
        const userBalance = Balances.get(input.payload.userId)?.usd;
        if (!userBalance) return engineErrorRes(input.id, 'User not found')

        if ((userBalance - input.payload.margin) < 0) return engineErrorRes(input.id, 'Not enough balance!')

        // remove the margin from balance
        Balances.set(input.payload.userId, { usd: userBalance - input.payload.margin });
        logger.info(`User curr balance: ${Balances.get(input.payload.userId)?.usd}`)

        const asset = assetData.price_updates.find((asset) => asset.asset === input.payload.asset);
        if (!asset) return engineErrorRes(input.id, 'Asset not found')

        const orderId = generateId();

        const buyPrice = asset.askPrice;
        const sellPrice = asset.bidPrice;

        const margin = input.payload.margin;

        let order: OpenTrade = {
            id: orderId,
            userId: input.payload.userId,
            type: input.payload.type,
            asset: input.payload.asset,
            margin: input.payload.margin,
            leverage: input.payload.leverage,
            quantity: input.payload.type === OrderType.BUY ? parseFloat(((margin * input.payload.leverage) / buyPrice).toFixed(5)) : parseFloat(((margin * input.payload.leverage) / sellPrice).toFixed(5)),
            open_price: input.payload.type === OrderType.BUY ? buyPrice : sellPrice,
            liquidation_price: input.payload.type === OrderType.BUY ? (buyPrice * (1 - 1 / input.payload.leverage)) : (sellPrice * (1 + 1 / input.payload.leverage)),
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

export const closeTrade = async (input: CloseTradePayload, assetData: WSData) => {

    try {
        const userOpenTrades = OpenTrades.get(input.payload.userId) || [];

        const userBalance = Balances.get(input.payload.userId)?.usd;
        if (!userBalance) return engineErrorRes(input.id, 'Order not found!')

        const orderIndex = userOpenTrades.findIndex(order => order.id === input.payload.tradeId);

        if (orderIndex === -1) return engineErrorRes(input.id, 'Order not found!')

        const order = userOpenTrades[orderIndex]!;

        // current price of asset
        const asset = assetData.price_updates.find((asset) => asset.asset === order.asset);
        if (!asset) return engineErrorRes(input.id, 'Asset not found!')

        const buyPrice = asset.askPrice;
        const sellPrice = asset.bidPrice;

        const closePrice = order.type === OrderType.BUY ? sellPrice : buyPrice

        const priceDiff = order.type === OrderType.BUY ? (closePrice - order.open_price) : (order.open_price - closePrice) 
        const pnlRaw = priceDiff * order.quantity;

        console.log("priceDiff", priceDiff)
        console.log("pnlRaw", pnlRaw)

        const pnl = Number(pnlRaw.toFixed(0));

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

        const newBalance = userBalance + order.margin + pnl;
        console.log('balace: ', userBalance, ' new balance: ', newBalance)

        // updating user balance 
        Balances.set(input.payload.userId, { usd: newBalance })

        // Remove from open orders
        userOpenTrades.splice(orderIndex, 1);
        OpenTrades.set(input.payload.userId, userOpenTrades);

        // entry in db
        await engineResStream.xAdd(StreamName.DATABASE, EventType.CLOSE_TRADE, { order: closedTrade });

        return engineSuccessRes<CloseTradeResponse>(input.id, { orderId: order.id })
    } catch (error) {
        logger.error("closeTrade", "error closing trade in engine", error)
        return engineErrorRes(input.id, 'Server error')
    }
}

export const getAllOpenTrades = async (input: GetAllOpenTradesPayload) => {
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