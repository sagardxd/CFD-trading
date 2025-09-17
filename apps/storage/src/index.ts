import { Redis_Init } from "./redis/redis.types"
import { startDbWorker } from "./worker/dbWorker";

const main = async () => {
    await Redis_Init();

    startDbWorker();
}

main();