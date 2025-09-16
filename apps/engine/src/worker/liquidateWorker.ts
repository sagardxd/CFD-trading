import { OrderType, type CloseTrade, type WSData } from "@repo/types";
import { CloseTrades, OpenTrades } from "../store/engine.store"

export const startLiquidationWorker = async (assets: WSData) => {
    try {
        for (const [userId, trades] of OpenTrades.entries()) {

            if (!trades || trades.length === 0) continue;

            // Check each order for this asset
            for (let i = trades.length - 1; i >= 0; i--) {

                const trade = trades[i]!;
                const asset = assets.price_updates.find((asset) => asset.asset === trade.asset);

                if (!asset) continue;

                const buyPrice = asset.price / Math.pow(10, asset.decimal);
                const sellPrice = buyPrice - 10;

                const currentPrice = trade?.type === OrderType.BUY ? sellPrice : buyPrice;

                const shouldLiquidate = trade.type === OrderType.BUY
                    ? currentPrice <= (trade.liquidation_price * Math.pow(10, asset.decimal))
                    : currentPrice >= (trade.liquidation_price * Math.pow(10, asset.decimal));


                if (shouldLiquidate) {
                    console.log(`LIQUIDATED: ${trade.id} on ${asset.asset}`);

                    const openPrice = trade.open_price / Math.pow(10, asset.decimal);
                    const closePrice = currentPrice / Math.pow(10, asset.decimal);

                    const pnl = trade.type === OrderType.BUY
                        ? (closePrice - openPrice) * trade.quantity
                        : (openPrice - closePrice) * trade.quantity;

                    // Move to closed orders
                    const closedTrade: CloseTrade = {
                        id: trade.id,
                        userId: trade.userId,
                        type: trade.type,
                        asset: trade.asset,
                        margin: trade.margin,
                        leverage: trade.leverage,
                        quantity: trade.quantity,
                        open_price: trade.open_price,
                        close_price: currentPrice,
                        pnl: pnl,
                        opened_at: trade.opened_at,
                        closed_at: new Date()
                    };

                    // Remove from open, add to closed
                    trades.splice(i, 1);
                    const userClosed = CloseTrades.get(userId) || [];
                    userClosed.push(closedTrade);
                    CloseTrades.set(userId, userClosed);

                    console.log(`PnL: $${pnl.toFixed(2)}`);
                }

            }
        }
    } catch (error) {

    }
}