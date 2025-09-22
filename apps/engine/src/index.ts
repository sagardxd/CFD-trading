import { startEventWorker } from "./worker/eventWorker";
import { RedisInit } from "./redis/redis";
import { loadSnapshot, saveSnapshot } from "./snapshots/snapshot";
import { logger } from "@repo/config";

const main = async () => {
    try {
        await loadSnapshot();
        await RedisInit();
        await startEventWorker();

    } catch (error) {
        logger.error('main', 'Error in starting engine', error)
    }
}

main();

setInterval(async () => {
    await saveSnapshot();
}, 5000);
