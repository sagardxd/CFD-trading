import { startEventWorker } from "./worker/eventWorker";
import { RedisInit } from "./redis/redis";
import { Balances } from "./store/engine.store";

const main = async () => {
    await RedisInit();

    // TODO REMOVE IT
    Balances.set("653860ff-ab36-4d1f-b008-6a790fd64810", { usd: 500000 });

    await startEventWorker();
}   

main();
