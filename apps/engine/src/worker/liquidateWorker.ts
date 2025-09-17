import { OrderType, type CloseTrade, type WSData } from "@repo/types";
import { CloseTrades, OpenTrades } from "../store/engine.store"

export const startLiquidationWorker = async (assets: WSData) => {
    try {
        for (const [userId, trades] of OpenTrades.entries()) {

            if (!trades || trades.length === 0) continue;

            console.log(`\nChecking trades for user ${userId}, ${trades.length} open trades`);

            for (let i = trades.length - 1; i >= 0; i--) {
                const trade = trades[i]!;
                const asset = assets.price_updates.find((a) => a.asset === trade.asset);

                if (!asset) {
                    console.log(`No price update for asset ${trade.asset}, skipping trade ${trade.id}`);
                    continue;
                }

                // Calculate buy and sell prices
                const assetPrice = asset.price ;
                const buyPrice = assetPrice;               // Price if buying
                const sellPrice = buyPrice - (10 * Math.pow(10, asset.decimal));          // Example: adjust your logic if needed
                const currentPrice = trade.type === OrderType.BUY ? sellPrice : buyPrice;

                const liquidationThreshold = trade.liquidation_price * Math.pow(10, asset.decimal);

                // Log all relevant info
                console.log(`--- Trade Debug ---`);
                console.log(`Trade ID: ${trade.id}`);
                console.log(`Asset: ${trade.asset}`);
                console.log(`Trade Type: ${trade.type}`);
                console.log(`Trade Quantity: ${trade.quantity}`);
                console.log(`Trade Open Price: ${trade.open_price}`);
                console.log(`Trade Liquidation Price: ${trade.liquidation_price}`);
                console.log(`Asset Price: ${asset.price} (decimal: ${asset.decimal})`);
                console.log(`Calculated Buy Price: ${buyPrice}`);
                console.log(`Calculated Sell Price: ${sellPrice}`);
                console.log(`Current Price Used for Check: ${currentPrice}`);
                console.log(`Liquidation Threshold: ${liquidationThreshold}`);

                const shouldLiquidate = trade.type === OrderType.BUY
                    ? currentPrice <= liquidationThreshold
                    : currentPrice >= liquidationThreshold;

                console.log(`Should Liquidate: ${shouldLiquidate}`);

                if (shouldLiquidate) {
                    console.log(`LIQUIDATED: ${trade.id} on ${asset.asset}`);

                    const openPrice = trade.open_price;
                    const closePrice = currentPrice

                    const pnl = trade.type === OrderType.BUY
                        ? (closePrice - openPrice) * trade.quantity
                        : (openPrice - closePrice) * trade.quantity;

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
                    console.log('Closed trade object:', closedTrade);
                } 
            }
        }
    } catch (error) {
        console.error("Error in liquidation worker:", error);
    }
}
