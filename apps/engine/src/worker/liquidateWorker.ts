import { OrderType, type CloseTrade, type WSData } from "@repo/types";
import { CloseTrades, OpenTrades } from "../store/engine.store"

export const startLiquidationWorker = async (assets: WSData) => {
    try {
        for (const [userId, trades] of OpenTrades.entries()) {

            if (!trades || trades.length === 0) continue;

            for (let i = trades.length - 1; i >= 0; i--) {
                const trade = trades[i]!;
                const asset = assets.price_updates.find((a) => a.asset === trade.asset);

                if (!asset) {
                    console.log(`No price update for asset ${trade.asset}, skipping trade ${trade.id}`);
                    continue;
                }

                const buyPrice = asset.askPrice;
                const sellPrice = asset.bidPrice;
                const currentPrice = trade.type === OrderType.BUY ? sellPrice : buyPrice;

                const liquidationThreshold = trade.liquidation_price;

                const shouldLiquidate = trade.type === OrderType.BUY
                    ? currentPrice <= liquidationThreshold
                    : currentPrice >= liquidationThreshold;


                if (shouldLiquidate) {
                    console.log(`LIQUIDATED: ${trade.id} on ${asset.asset}`);

                    const openPrice = trade.open_price;
                    const closePrice = currentPrice

                    console.log('closeprice: ', closePrice, ' openprice: ', openPrice);

                    const pnlRaw = trade.type === OrderType.BUY
                        ? (closePrice - openPrice) * trade.quantity
                        : (openPrice - closePrice) * trade.quantity;

                    const pnl = Number(pnlRaw.toFixed(5));


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

                    // Remove from open trades, add to closed trades
                    trades.splice(i, 1);
                    const userClosed = CloseTrades.get(userId) || [];
                    userClosed.push(closedTrade);
                    CloseTrades.set(userId, userClosed);

                    console.log(`PnL: $${pnl.toFixed(2)}`);
                }
            }
        }
    } catch (error) {
        console.error("Error in liquidation worker:", error);
    }
}
