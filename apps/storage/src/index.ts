import { Redis_Init } from "./redis/redis.types"
import { startDbWorker } from "./worker/dbWorker";
import { prisma } from '@repo/db'

const main = async () => {
    await Redis_Init();
    startDbWorker();

  

}

main();