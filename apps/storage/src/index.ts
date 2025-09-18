import { Redis_Init } from "./redis/redis-init"
import { startDbWorker } from "./worker/dbWorker";

const main = async () => {
    await Redis_Init();
    await startDbWorker();
}

main();