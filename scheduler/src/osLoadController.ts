import os from "node:os";
import db from "./db/index.ts";
import { osLoadLog } from "./db/schema.ts";

const STATUS_UPDATE_INTERVAL_MS = 10 * 60 * 1000; // 30 minutes

class OSLoadControler {
  interval: NodeJS.Timeout | null = null;
  run() {
    this.interval = setInterval(this.saveOSLoad, STATUS_UPDATE_INTERVAL_MS);
  }
  getOSLoad() {
    const uptime = os.uptime();
    const freeMemory = os.freemem();
    const load = os.loadavg();
    return {
      uptime,
      freeMemory,
      load1: load[0],
      load5: load[1],
      load15: load[2],
    };
  }
  saveOSLoad() {
    const osLoad = this.getOSLoad();
    const now = Date.now();
    db.insert(osLoadLog).values({
      timestamp: now,
      ...osLoad,
    });
  }
}

export default OSLoadControler;
