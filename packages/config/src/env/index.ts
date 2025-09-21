import { z } from 'zod'
import dotenv from 'dotenv'
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const envSchema = z.object({
    REDIS_URL: z.string(),
    PORT_BACKEND: z.string().transform(Number),
    PORT_POLLER: z.string().transform(Number),
    PORT_WS_SERVER: z.string().transform(Number),
    JWT_TOKEN_PASS: z.string(),
    FRONTEND_URL: z.string(),
    RESEND_KEY: z.string(),
    HASH_SALT: z.string(),
})

const env = envSchema.parse(process.env);

export const config = {
    REDIS_URL: env.REDIS_URL,
    PORT_BACKEND: env.PORT_BACKEND,
    PORT_POLLER: env.PORT_POLLER,
    PORT_WS_SERVER: env.PORT_WS_SERVER,
    JWT_TOKEN_PASS: env.JWT_TOKEN_PASS,
    FRONTEND_URL: env.FRONTEND_URL,
    RESEND_KEY: env.RESEND_KEY,
    HASH_SALT: env.HASH_SALT

}


export default config