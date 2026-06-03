import { drizzle } from "drizzle-orm/node-sqlite";
import path from "node:path";
import config from "../config.ts";
import { backup, DatabaseSync } from "node:sqlite";

const dbPath = path.join(config.filesPath, "observatory.sqlite");
const sqliteConn = new DatabaseSync(dbPath);
const db = drizzle({ client: sqliteConn });

export async function createBackup() {
  const backupPath = path.join(config.filesPath, "observatory_backup.sqlite");
  await backup(sqliteConn, backupPath);
}

// TODO this is ugly, use some built-in Drizzle tool
export const setupTables = () => {
  sqliteConn.exec(`CREATE TABLE IF NOT EXISTS observations_schedule (
    id INTEGER PRIMARY KEY,
    status INTEGER NOT NULL, -- 0=scheduled, 1=running, 2=completed, 3=failed
    note TEXT,
    targetStar TEXT,
    startDate INTEGER NOT NULL, -- UNIX timestamp in ms
    endDate INTEGER, -- UNIX timestamp in ms, filled when the task is fully completed
    ra REAL NOT NULL, -- Right Ascension, decimal degrees
    dec REAL NOT NULL, -- Declination, decimal degrees
    expTimeMs INTEGER NOT NULL, -- exposure time in milliseconds
    expIso INTEGER NOT NULL, -- exposure ISO
    fileName TEXT, -- filled after file is created
    temperature REAL,
    humidity REAL
  )`);

  sqliteConn.exec(`CREATE TABLE IF NOT EXISTS os_load_log (
    id INTEGER PRIMARY KEY,
    timestamp INTEGER NOT NULL,
    uptime INTEGER NOT NULL,
    freeMemory INTEGER NOT NULL,
    load1 REAL NOT NULL,
    load5 REAL NOT NULL,
    load15 REAL NOT NULL
  )`);
};

export default db;
