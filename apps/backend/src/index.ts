import { config, createRedis, logger } from "@repo/config";
import express from 'express'
import AuthRouter from '../src/routes/auth.route'
import tradesRouter from '../src/routes/trades.route'
import { AuthMiddleware } from "./middleware/auth.middleware";

export const engineReqStream = createRedis(config.REDIS_URL);
export const engineResStream = createRedis(config.REDIS_URL);

const app = express();
app.use(express.json());

app.use("api/v1", AuthRouter)
app.use("/api/v1/trade", AuthMiddleware, tradesRouter)

Promise.all([
    engineReqStream.connect(),
    engineResStream.connect(),
]).then(() => {
    app.listen(config.PORT_BACKEND, () => {
        console.log('Poller running on port: ', config.PORT_POLLER)
    })
}).catch((error) => {
    logger.error('Stream connecting error', '')
}) 