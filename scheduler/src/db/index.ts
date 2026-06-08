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

export default db;
