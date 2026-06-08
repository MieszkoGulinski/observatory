import { createBackup } from "./db/index.ts";
import { isDayNight } from "./calculateDayNight.ts";
import logger from "./logger.ts";

const BACKUP_POLL_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

class BackupSaver {
  prevIsDay: boolean;
  constructor() {
    this.prevIsDay = false; // this will trigger backup on startup too
  }

  run() {
    this.createBackupIfNeeded();
  }

  private async createBackupIfNeeded() {
    const { isDay } = isDayNight();
    if (isDay && !this.prevIsDay) {
      try {
        logger.info("Creating backup");
        await createBackup();
        logger.info("Backup completed");
      } catch (error) {
        logger.error(error, "Backup failed");
      }
    }
    this.prevIsDay = isDay;

    setTimeout(() => this.createBackupIfNeeded(), BACKUP_POLL_INTERVAL_MS);
  }
}

export default BackupSaver;
