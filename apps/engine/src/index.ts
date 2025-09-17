import { startEventWorker } from "./worker/eventWorker";
import { startAssetWorker } from "./worker/assetWorker";
import { RedisInit } from "./redis/redis";
import { Balances } from "./store/engine.store";

const main = async () => {
    await RedisInit();

    // TODO REMOVE IT
    Balances.set("1416fdda-2637-404c-be20-cdf4a99b5abc", { usd: 500000 });

    await Promise.all([
        startEventWorker(),
        startAssetWorker()
    ]);

}

main();
