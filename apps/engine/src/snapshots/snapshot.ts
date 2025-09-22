import { logger } from "@repo/config";
import { Balances, OpenTrades } from "../store/engine.store"
import type { Snapshot } from "../types/snapshot.types"
import fs from 'fs/promises'
import path from 'path'

const SNAPSHOT_FILE = path.join(__dirname, "snapshot-data.json");

export const saveSnapshot = async () => {
    try {
        const snapshot: Snapshot = {
            balance: Array.from(Balances.entries()),
            openTrades: Array.from(OpenTrades.entries())
        }
        await fs.writeFile(SNAPSHOT_FILE, JSON.stringify(snapshot, null, 2), "utf-8");
        logger.info("Saved snapshot")
    } catch (error) {
        logger.error('saveSnapshot', 'Error saving snapshot', error);
    }
}

export const loadSnapshot = async () => {
    try {
        const data = await fs.readFile(SNAPSHOT_FILE, "utf-8");
        const snapshot: Snapshot = JSON.parse(data);

        Balances.clear();
        OpenTrades.clear();

        snapshot.balance.forEach(([id, balance]) => Balances.set(id, balance));
        snapshot.openTrades.forEach(([id, openTrades]) => OpenTrades.set(id, openTrades));

        logger.info("Snapshot loaded")
    } catch (error) {
        logger.error('saveSnapshot', 'Error saving snapshot', error);
    }
}