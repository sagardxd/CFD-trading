import { config, createRedis } from "@repo/config";
import express from 'express'
import AuthRouter from '../src/routes/auth.route'

const redis = createRedis(config.REDIS_URL);
await redis.connect();

const app = express();
app.use(express.json());

app.use("api/v1", AuthRouter)

app.listen(config.PORT_BACKEND, () => {
    console.log('Poller running on port: ', config.PORT_POLLER)
})
