import { ConsumerName, GroupName, StreamName } from "@repo/types";
import { engineReqStream } from "../redis/redis";
import { startLiquidationWorker } from "./liquidateWorker";

export const startAssetWorker = async () => {
    while (true) {
        const assets = await engineReqStream.readGroup(StreamName.ASSETS, GroupName.ASSET_GROUP, ConsumerName.ASSET_CONSUMER);
        if (!assets) continue;

        startLiquidationWorker(assets.payload);

    }
};
