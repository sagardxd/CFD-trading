import { config, logger } from "@repo/config";
import express from 'express'
import AuthRouter from '../src/routes/auth.route'
import tradesRouter from '../src/routes/trades.route'
import balanceRouter from '../src/routes/balance.route'
import supportedAssetRouter from '../src/routes/supported-asset.route'
import { AuthMiddleware } from "./middleware/auth.middleware";
import { ApiSuccessResponse } from "./utils/api-response";
import { RedisInit } from "./redis/redis-setup";
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    return ApiSuccessResponse(res, "Backend is up");
})

app.use("/api/v1/auth", AuthRouter)
app.use("/api/v1/trade", AuthMiddleware, tradesRouter)
app.use("/api/v1/balance", AuthMiddleware, balanceRouter)
app.use("/api/v1/supportedAssets", supportedAssetRouter)

RedisInit().then(() => {
    app.listen(config.PORT_BACKEND, () => {
        logger.info(`Backend running on port: ${config.PORT_BACKEND}`)
    })
}).catch((error) => {
    logger.error('Stream connecting error', '', error)
}) 