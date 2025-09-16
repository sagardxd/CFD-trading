import { startEventWorker } from "./worker/eventWorker";
import { startAssetWorker } from "./worker/assetWorker";
import { RedisInit } from "./redis/redis";

const main = async () => {
    await RedisInit();

    startEventWorker();
    startAssetWorker();
}

main(); 